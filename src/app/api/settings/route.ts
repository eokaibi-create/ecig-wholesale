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

    for (const [key, value] of entries) {
      if (key && value !== undefined) {
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
