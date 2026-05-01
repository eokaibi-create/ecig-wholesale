import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  console.log('  ⏭️  跳过管理员 seed，保持数据库现有管理员不变')

  // ====== 设置 ======
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
      update: { value: s.value },
      create: s,
    })
  }
  console.log('✅ Settings 已就绪')

  // ====== 客户 ======
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
      update: {
        name: c.name,
        phone: c.phone,
        company: c.company,
        state: c.state,
        approved: c.approved,
        password: c.password || undefined,
      },
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

  // ====== 品牌 ======
  const brands = [
    { name: 'Elf Bar', slug: 'elf-bar', sortOrder: 1 },
    { name: 'Geek Bar', slug: 'geek-bar', sortOrder: 2 },
    { name: 'Lost Mary', slug: 'lost-mary', sortOrder: 3 },
    { name: 'RAZ', slug: 'raz', sortOrder: 4 },
    { name: 'Breeze', slug: 'breeze', sortOrder: 5 },
    { name: 'Fume', slug: 'fume', sortOrder: 6 },
    { name: 'Puff Bar', slug: 'puff-bar', sortOrder: 7 },
    { name: 'Hyde', slug: 'hyde', sortOrder: 8 },
  ]

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, sortOrder: b.sortOrder },
      create: b,
    })
  }
  console.log('✅ 品牌已就绪')

  // ====== 分类 ======
  const categories = [
    { name: 'Disposable', slug: 'disposable', sortOrder: 1 },
    { name: 'Pod System', slug: 'pod-system', sortOrder: 2 },
    { name: 'Pod Refill', slug: 'pod-refill', sortOrder: 3 },
    { name: 'Device Kit', slug: 'device-kit', sortOrder: 4 },
    { name: 'E-Liquid', slug: 'e-liquid', sortOrder: 5 },
    { name: 'Accessories', slug: 'accessories', sortOrder: 6 },
  ]

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    })
  }
  console.log('✅ 分类已就绪')

  // ====== 获取分类 ID 映射 ======
  const catMap = Object.fromEntries(
    (await prisma.category.findMany()).map(c => [c.slug, c.id])
  )

  // ====== 产品 ======
  const products = [
    // --- Elf Bar ---
    { name: 'Elf Bar BC5000', slug: 'elfbar-bc5000', brand: 'Elf Bar', categorySlug: 'disposable', price: 15.99, wholesalePrice: 9.99, msrp: 19.99, stock: 500, published: true, featured: true, hot: true, shortDesc: '5000 puffs, rechargeable, 5% nicotine', nicotine: '5%', capacity: '13mL', puffs: '5000', flavor: 'Mixed Berry, Mint, Mango...' },
    { name: 'Elf Bar 600', slug: 'elfbar-600', brand: 'Elf Bar', categorySlug: 'disposable', price: 5.99, wholesalePrice: 3.49, msrp: 7.99, stock: 800, published: true, hot: true, shortDesc: '600 puffs, compact, 2% nicotine', nicotine: '2%', capacity: '2mL', puffs: '600' },
    { name: 'Elf Bar CR7000', slug: 'elfbar-cr7000', brand: 'Elf Bar', categorySlug: 'disposable', price: 18.99, wholesalePrice: 11.99, msrp: 22.99, stock: 300, published: true, shortDesc: '7000 puffs, dual mesh coil', nicotine: '5%', capacity: '16mL', puffs: '7000' },
    { name: 'Elf Bar Mate 500', slug: 'elfbar-mate-500', brand: 'Elf Bar', categorySlug: 'pod-system', price: 12.99, wholesalePrice: 7.99, msrp: 16.99, stock: 200, published: true, shortDesc: 'Refillable pod system, 500mAh battery', nicotine: 'N/A', capacity: '2mL', puffs: 'Refillable' },
    // --- Geek Bar ---
    { name: 'Geek Bar Pulse', slug: 'geek-bar-pulse', brand: 'Geek Bar', categorySlug: 'disposable', price: 16.99, wholesalePrice: 10.99, msrp: 21.99, stock: 600, published: true, featured: true, hot: true, shortDesc: '15000 puffs, dual mesh, LED display', nicotine: '5%', capacity: '16mL', puffs: '15000', flavor: 'Tropical Rainbow, Blue Razz...' },
    { name: 'Geek Bar Meloso Mini', slug: 'geek-bar-meloso-mini', brand: 'Geek Bar', categorySlug: 'disposable', price: 4.99, wholesalePrice: 2.99, msrp: 6.99, stock: 1000, published: true, hot: true, shortDesc: 'Mini disposable, 600 puffs', nicotine: '5%', capacity: '2mL', puffs: '600' },
    { name: 'Geek Bar Meloso Max', slug: 'geek-bar-meloso-max', brand: 'Geek Bar', categorySlug: 'disposable', price: 8.99, wholesalePrice: 5.49, msrp: 11.99, stock: 400, published: true, shortDesc: '3000 puffs, mesh coil', nicotine: '5%', capacity: '8mL', puffs: '3000' },
    // --- Lost Mary ---
    { name: 'Lost Mary MO20000 Pro', slug: 'lost-mary-mo20000-pro', brand: 'Lost Mary', categorySlug: 'disposable', price: 21.99, wholesalePrice: 14.99, msrp: 26.99, stock: 350, published: true, featured: true, hot: true, shortDesc: '20000 puffs, smart display, dual mesh', nicotine: '5%', capacity: '20mL', puffs: '20000', flavor: 'Strawberry Ice, Peach Mango...' },
    { name: 'Lost Mary OS5000', slug: 'lost-mary-os5000', brand: 'Lost Mary', categorySlug: 'disposable', price: 14.99, wholesalePrice: 9.49, msrp: 18.99, stock: 450, published: true, shortDesc: '5000 puffs, rechargeable', nicotine: '5%', capacity: '12mL', puffs: '5000' },
    { name: 'Lost Mary QM600', slug: 'lost-mary-qm600', brand: 'Lost Mary', categorySlug: 'disposable', price: 5.49, wholesalePrice: 2.99, msrp: 6.99, stock: 700, published: true, shortDesc: '600 puffs, compact design', nicotine: '2%', capacity: '2mL', puffs: '600' },
    // --- RAZ ---
    { name: 'RAZ TN9000', slug: 'raz-tn9000', brand: 'RAZ', categorySlug: 'disposable', price: 17.99, wholesalePrice: 11.49, msrp: 22.99, stock: 400, published: true, featured: true, hot: true, shortDesc: '9000 puffs, mesh coil, adjustable airflow', nicotine: '5%', capacity: '14mL', puffs: '9000', flavor: 'Dragonfruit Lemonade, Miami Mint...' },
    { name: 'RAZ DC25000', slug: 'raz-dc25000', brand: 'RAZ', categorySlug: 'disposable', price: 24.99, wholesalePrice: 17.99, msrp: 29.99, stock: 250, published: true, shortDesc: '25000 puffs, dual chamber, smart display', nicotine: '5%', capacity: '25mL', puffs: '25000' },
    { name: 'RAZ Vape 6000', slug: 'raz-vape-6000', brand: 'RAZ', categorySlug: 'disposable', price: 13.99, wholesalePrice: 8.99, msrp: 17.99, stock: 300, published: true, shortDesc: '6000 puffs, rechargeable', nicotine: '5%', capacity: '10mL', puffs: '6000' },
    // --- Breeze ---
    { name: 'Breeze Pro', slug: 'breeze-pro', brand: 'Breeze', categorySlug: 'disposable', price: 16.99, wholesalePrice: 10.99, msrp: 20.99, stock: 350, published: true, hot: true, shortDesc: 'Pro version, 2000 puffs, mesh coil', nicotine: '5%', capacity: '8mL', puffs: '2000' },
    { name: 'Breeze Plus', slug: 'breeze-plus', brand: 'Breeze', categorySlug: 'disposable', price: 13.99, wholesalePrice: 8.99, msrp: 16.99, stock: 400, published: true, shortDesc: '800 puffs, compact', nicotine: '5%', capacity: '4mL', puffs: '800' },
    // --- Fume ---
    { name: 'Fume Unlimited', slug: 'fume-unlimited', brand: 'Fume', categorySlug: 'disposable', price: 15.99, wholesalePrice: 10.49, msrp: 19.99, stock: 300, published: true, shortDesc: 'Unlimited puffs, rechargeable', nicotine: '5%', capacity: '12mL', puffs: 'Unlimited' },
    { name: 'Fume Extra 5000', slug: 'fume-extra-5000', brand: 'Fume', categorySlug: 'disposable', price: 14.99, wholesalePrice: 9.49, msrp: 18.99, stock: 350, published: true, shortDesc: '5000 puffs, extra flavor', nicotine: '5%', capacity: '12mL', puffs: '5000' },
    // --- Puff Bar ---
    { name: 'Puff Bar XXL', slug: 'puff-bar-xxl', brand: 'Puff Bar', categorySlug: 'disposable', price: 12.99, wholesalePrice: 7.99, msrp: 15.99, stock: 500, published: true, shortDesc: 'XXL disposable, 800 puffs', nicotine: '5%', capacity: '3.2mL', puffs: '800' },
    // --- Hyde ---
    { name: 'Hyde N-Bar', slug: 'hyde-n-bar', brand: 'Hyde', categorySlug: 'disposable', price: 10.99, wholesalePrice: 6.99, msrp: 13.99, stock: 400, published: true, shortDesc: 'N-Bar disposable, 3000 puffs', nicotine: '5%', capacity: '8mL', puffs: '3000' },
    { name: 'Hyde IQ', slug: 'hyde-iq', brand: 'Hyde', categorySlug: 'disposable', price: 14.99, wholesalePrice: 9.49, msrp: 18.99, stock: 300, published: true, shortDesc: 'Smart disposable, LED display', nicotine: '5%', capacity: '10mL', puffs: '5000' },
    // --- Pod / Accessories ---
    { name: 'Elf Bar Mate Pod (3pk)', slug: 'elfbar-mate-pod', brand: 'Elf Bar', categorySlug: 'pod-refill', price: 8.99, wholesalePrice: 5.49, msrp: 10.99, stock: 600, published: true, shortDesc: '3-pack replacement pods for Mate 500', nicotine: 'N/A', capacity: '2mL x3', puffs: 'Refillable' },
    { name: 'Geek Bar Pulse Charger', slug: 'geek-bar-pulse-charger', brand: 'Geek Bar', categorySlug: 'accessories', price: 4.99, wholesalePrice: 2.49, msrp: 6.99, stock: 800, published: true, shortDesc: 'USB-C charger for Pulse series', nicotine: 'N/A' },
    { name: 'Nicotine Salt 30mL', slug: 'nicotine-salt-30ml', brand: null, categorySlug: 'e-liquid', price: 29.99, wholesalePrice: 18.99, msrp: 34.99, stock: 200, published: true, shortDesc: 'Premium nicotine salt e-liquid, 30mL bottle', nicotine: '5%', capacity: '30mL', flavor: 'Various flavors available' },
  ]

  for (const p of products) {
    const categoryId = catMap[p.categorySlug]
    if (!categoryId) {
      console.warn(`  ⚠️  分类 ${p.categorySlug} 不存在，跳过产品 ${p.name}`)
      continue
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        brand: p.brand,
        categoryId,
        price: p.price,
        wholesalePrice: p.wholesalePrice,
        msrp: p.msrp,
        stock: p.stock,
        published: p.published,
        featured: p.featured || false,
        hot: p.hot || false,
        shortDesc: p.shortDesc,
        nicotine: p.nicotine || null,
        capacity: p.capacity || null,
        puffs: p.puffs || null,
        flavor: p.flavor || null,
      },
      create: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        categoryId,
        price: p.price,
        wholesalePrice: p.wholesalePrice,
        msrp: p.msrp,
        stock: p.stock,
        published: p.published,
        featured: p.featured || false,
        hot: p.hot || false,
        shortDesc: p.shortDesc || null,
        description: p.shortDesc || '',
        nicotine: p.nicotine || null,
        capacity: p.capacity || null,
        puffs: p.puffs || null,
        flavor: p.flavor || null,
      },
    })
  }
  console.log(`✅ ${products.length} 个产品已就绪`)

  console.log('\n🎉 Seed 完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
