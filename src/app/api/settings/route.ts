import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
  return NextResponse.json(map)
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限（仅 admin/superadmin 可修改设置）
    const auth = await requireAdmin(request, ['admin', 'superadmin'])
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
    }

    const contentType = request.headers.get('content-type') || ''
    
    let entries: [string, string][] = []
    
    if (contentType.includes('application/json')) {
      const json = await request.json()
      entries = Object.entries(json) as [string, string][]
    } else {
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        entries.push([key, value as string])
      }
    }

    // 过滤掉无效值（如 [object Object]）
    for (const [key, value] of entries) {
      if (key && value !== undefined && value !== null && value !== '[object Object]') {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      }
    }

    // 同步邮件相关设置到 Vercel 环境变量
    const emailKeys = ['admin_email', 'email_from']
    const emailEntries = entries.filter(([k]) => emailKeys.includes(k))
    if (emailEntries.length > 0 && process.env.VERCEL_TOKEN) {
      try {
        const vercelProject = process.env.VERCEL_PROJECT_ID || process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID
        if (vercelProject) {
          const vercelToken = process.env.VERCEL_TOKEN
          for (const [key, value] of emailEntries) {
            const envKey = key === 'admin_email' ? 'ADMIN_EMAIL' : 'EMAIL_FROM'
            await fetch(`https://api.vercel.com/v1/projects/${vercelProject}/env`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                key: envKey,
                value: String(value),
                type: 'encrypted',
                target: ['production', 'preview', 'development'],
              }),
            })
          }
          console.log('[Settings] Synced email settings to Vercel env')
        }
      } catch (e) {
        console.warn('[Settings] Failed to sync to Vercel:', e)
      }
    }

    if (contentType.includes('application/json')) {
      return NextResponse.json({ success: true })
    }
    
    const referer = request.headers.get('referer') || '/admin/settings'
    return NextResponse.redirect(new URL(referer.includes('?') ? referer : `${referer}?success=true`, request.url))
  } catch (error: any) {
    console.error('Settings API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限（仅 admin/superadmin 可删除设置）
    const auth = await requireAdmin(request, ['admin', 'superadmin'])
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (key) {
      await prisma.setting.delete({ where: { key } })
    } else {
      const allSettings = await prisma.setting.findMany()
      const dirtyKeys = allSettings
        .filter(s => s.value === '[object Object]' || s.key === 'test_key' || s.key === 'key' || s.key === 'value')
        .map(s => s.key)
      
      for (const k of dirtyKeys) {
        await prisma.setting.delete({ where: { key: k } })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
