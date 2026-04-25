import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
  return NextResponse.json(map)
}

export async function POST(request: NextRequest) {
  try {
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

    // 检查是 JSON 请求还是表单提交
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
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (key) {
      // 删除单个设置项
      await prisma.setting.delete({ where: { key } })
    } else {
      // 删除所有脏数据（[object Object]）
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
