import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // 初始化区块标题
    const sections = {
      'hero_title': '新品推荐',
      'hero_desc': '最新到货，抢先体验',
      'section_product_title': '产品中心',
      'section_product_desc': '全系列产品，满足各类批发需求',
      'section_brand_title': '合作品牌',
      'section_brand_desc': 'VAPOR-X 与全球顶级电子烟品牌战略合作',
      'section_platform_title': '合作平台',
      'section_platform_desc': '多平台布局，助力您的电子烟业务全球拓展',
      'section_contact_title': '联系我们',
      'section_contact_desc': '欢迎联系我们获取最新批发报价和产品信息',
      'whatsapp': '+13239260829',
      'email': 'EOKAIBI@GMAIL.COM',
      'phone': '+1 (323) 926-0829',
      'site_name': 'VAPOR-X USA',
      'site_description': '美国电子烟批发供应商',
      'min_order': '500',
    }
    
    let count = 0
    for (const [key, value] of Object.entries(sections)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
      count++
    }
    
    // 创建admin管理员（如果不存在）
    const existing = await prisma.admin.findFirst({ where: { username: 'admin' } })
    if (!existing) {
      const hash = await bcrypt.hash('admin123', 12)
      await prisma.admin.create({
        data: { username: 'admin', email: 'admin@vaporx.com', password: hash, role: 'superadmin' }
      })
    }
    
    // 更新User表密码（如果不存在）
    const oldUser = await prisma.user.findFirst({ where: { username: 'admin' } })
    if (!oldUser) {
      const hash = await bcrypt.hash('admin123', 12)
      await prisma.user.create({
        data: { username: 'admin', password: hash, role: 'admin' }
      })
    }

    return NextResponse.json({ success: true, message: `已初始化 ${count} 个设置项` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
