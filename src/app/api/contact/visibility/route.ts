import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// 保存联系资料可见性设置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const visibilityKeys = [
      'show_whatsapp', 'show_email', 'show_phone', 
      'show_address', 'show_wechat'
    ]

    for (const key of visibilityKeys) {
      if (body[key] !== undefined) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: body[key] ? 'true' : 'false' },
          create: { key, value: body[key] ? 'true' : 'false' },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
