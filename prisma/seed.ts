import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 获取现有管理员列表
  const existingAdmins = await prisma.admin.findMany()
  console.log(`📋 Found ${existingAdmins.length} existing admins:`)
  for (const a of existingAdmins) {
    console.log(`   - ${a.username} / ${a.email} / role: ${a.role}`)
  }

  // 先删除已有的 admin/product 账户（email 和 username 都有唯一约束，避免冲突）
  for (const a of existingAdmins) {
    if (['admin', 'YONGADMIN', 'product'].includes(a.username)) {
      await prisma.admin.delete({ where: { id: a.id } })
      console.log(`   🗑️ Deleted: ${a.username}`)
    }
  }

  // 重新创建
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
  await prisma.admin.create({
    data: {
      username: 'admin',
      email: 'admin@vaporx.com',
      password: adminHash,
      role: 'admin',
    },
  })
  console.log('✅ Admin: admin / ' + (process.env.ADMIN_PASSWORD || 'admin123'))

  const yongHash = await bcrypt.hash(process.env.YONGADMIN_PASSWORD || 'yong123', 12)
  await prisma.admin.create({
    data: {
      username: 'YONGADMIN',
      email: 'EOKAIBI@GMAIL.COM',
      password: yongHash,
      role: 'superadmin',
    },
  })
  console.log('✅ YONGADMIN: YONGADMIN / ' + (process.env.YONGADMIN_PASSWORD || 'yong123'))

  const prodHash = await bcrypt.hash(process.env.PRODUCT_PASSWORD || 'product123', 12)
  await prisma.admin.create({
    data: {
      username: 'product',
      email: 'product@vaporx.com',
      password: prodHash,
      role: 'brand',
    },
  })
  console.log('✅ Brand: product / ' + (process.env.PRODUCT_PASSWORD || 'product123'))

  // 清理旧 User 表残留
  const oldUsers = await prisma.user.findMany()
  if (oldUsers.length > 0) {
    await prisma.user.deleteMany()
    console.log(`✅ Cleaned ${oldUsers.length} old User table records`)
  }

  // 创建设置
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
  console.log('✅ Settings created')

  // 创建示例客户
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
  console.log('✅ Customers created')

  console.log('\n🎉 Seed completed!')
  console.log('   Admin:     admin / ' + (process.env.ADMIN_PASSWORD || 'admin123'))
  console.log('   YONGADMIN: YONGADMIN / ' + (process.env.YONGADMIN_PASSWORD || 'yong123'))
  console.log('   Brand:     product / ' + (process.env.PRODUCT_PASSWORD || 'product123'))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
