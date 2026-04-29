import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 管理员：用户名或邮箱已存在则保留，不存在则创建
  const admins = [
    { username: 'admin', email: 'admin@vaporx.com', defaultPassword: 'admin123', role: 'admin' },
    { username: 'YONGADMIN', email: 'EOKAIBI@GMAIL.COM', defaultPassword: 'yong123', role: 'superadmin' },
    { username: 'product', email: 'product@vaporx.com', defaultPassword: 'product123', role: 'brand' },
  ]

  for (const admin of admins) {
    const existing = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: admin.username },
          { email: admin.email },
        ],
      },
    })
    if (existing) {
      console.log(`  ⏭️  ${admin.username} (${admin.role}) 已存在（用户名或邮箱），保留原密码`)
    } else {
      const hash = await bcrypt.hash(
        process.env[`${admin.username}_PASSWORD`] || admin.defaultPassword,
        12
      )
      await prisma.admin.create({
        data: {
          username: admin.username,
          email: admin.email,
          password: hash,
          role: admin.role as any,
        },
      })
      console.log(`  ✅ ${admin.username} (${admin.role}) 已创建`)
    }
  }

  // 设置
  const settings = [
    { key: 'site_name', value: 'VAPOR-X' },
    { key: 'site_description', value: '美国电子烟批发首选 - 全美发货 · 批发价直供 · 支持海外直邮' },
    { key: 'hero_title', value: 'VAPOR-X' },
    { key: 'hero_subtitle', value: '美国本土电子烟批发平台' },
    { key: 'whatsapp', value: '+1 (323) 926-0829' },
    { key: 'wechat', value: 'EA_YONG' },
    { key: 'email', value: 'EOKAIBI@GMAIL.COM' },
    { key: 'phone', value: '+1 (323) 926-0829' },
    { key: 'address', value: 'Los Angeles, CA' },
    { key: 'min_order', value: '500' },
    { key: 'shipping_info', value: '全美48州免运费，订单满$500起批。支持海外直邮。' },
    { key: 'show_whatsapp', value: 'true' },
    { key: 'show_email', value: 'true' },
    { key: 'show_phone', value: 'true' },
    { key: 'show_address', value: 'true' },
    { key: 'show_wechat', value: 'true' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log('✅ Settings 已就绪')

  // 客户
  const customerPassword = await bcrypt.hash('password123', 12)
  const customers = [
    { name: 'John Smith', email: 'john@vapeshopny.com', phone: '+12125550001', company: 'NYC Vape Shop', state: 'NY', approved: true },
    { name: 'Maria Garcia', email: 'maria@smokechicago.com', phone: '+17735550002', company: 'Chicago Smoke House', state: 'IL', approved: true },
    { name: 'David Chen', email: 'david@ecigla.com', phone: '+12135550003', company: 'LA E-Cig Supply', state: 'CA', approved: true },
    { name: 'Alice', email: 'alice@test.com', phone: '+12125551001', company: 'Alice Vape NYC', state: 'NY', approved: true, password: customerPassword },
    { name: 'Bob', email: 'bob@test.com', phone: '+13105552002', company: 'Bob Smoke LA', state: 'CA', approved: true, password: customerPassword },
    { name: 'Test User', email: 'test@test.com', phone: '+11111111111', company: 'Test Shop', state: 'CA', approved: true, password: customerPassword },
  ]

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        state: c.state,
        approved: c.approved,
        password: c.password || null,
      },
    })
  }
  console.log('✅ 示例客户已就绪')

  console.log('\n🎉 Seed 完成！（已有管理员密码保持不变）')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
