import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: [
          'section_product_title', 'section_product_desc',
          'section_brand_title', 'section_brand_desc',
          'section_platform_title', 'section_platform_desc',
          'section_contact_title', 'section_contact_desc',
          'hero_title', 'hero_desc',
        ]}
      }
    })
    const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
    return NextResponse.json(map)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const auth = await requireAdmin(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
    }

    const data = await request.json()
    const results = []
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && key.startsWith('section_') || key.startsWith('hero_')) {
        const result = await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
        results.push(result)
      }
    }
    return NextResponse.json({ success: true, count: results.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
