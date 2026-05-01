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
    { name: 'KADO BAR', slug: 'KADO_BAR', sortOrder: 1 },
    { name: 'FLUM', slug: 'FLUM', sortOrder: 2 },
    { name: 'EONIQ', slug: 'EONIQ', sortOrder: 3 },
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
    { name: 'Disposable Vape', slug: 'Disposable Vape', sortOrder: 1 },
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
  const disposableVapeId = catMap['Disposable Vape']

  // ====== 产品 ======
  const products = [
    {
      name: 'KADO BAR SNAP',
      slug: 'kado-bar-snap',
      brand: 'KADO BAR',
      categorySlug: 'Disposable Vape',
      price: 19.99,
      wholesalePrice: 4,
      msrp: 0,
      stock: 39000,
      published: true,
      featured: false,
      hot: false,
      shortDesc: 'Pod Kit(1 battery+1 pod), Battery:1250mAh Liquid:18ml Nicotine:5%',
      nicotine: '5%',
      capacity: '18ML',
      puffs: '25K puffs',
      flavor: 'Watermelon Ice, Sour Rainbow Candy, Juicy Mango, Sour lush gummy, Strawberry slushy, Bangin Blue Raz, Just mint.',
    },
    {
      name: 'UT BAR 50K',
      slug: 'ut-bar-50k-dual-flavor-50000-puffs-disposable-vape',
      brand: 'FLUM',
      categorySlug: 'Disposable Vape',
      price: 20.99,
      wholesalePrice: 9,
      msrp: 24.99,
      stock: 1000,
      published: true,
      featured: true,
      hot: false,
      shortDesc: 'Dual-flavor disposable vape with adjustable flavor control, up to 50,000 puffs, and smart display system.',
      nicotine: '5%',
      capacity: '20ml',
      puffs: '50K PUFF',
      flavor: 'Banana Smoothy-Strawberry, Blue Razz Ice-Triple Berry, Cool Mint-Icy Mint, Green Apple-Fuji Apple, Mango-Strawberry, Naked-Spring Water, Sour Fab-Citrus Ice, Watermelon-B-Pop, White Peach-Lemon Head, White Peach-Raspberry, Pink Lemonade-Mix Berry, Raspberry Grape-Guava, Root Soda-Vanilla, White Gummy-Watermelon, Strawberry Ice Cream-Strawberry Banana',
    },
    {
      name: 'EONIQ iQ50K',
      slug: 'eoniq-iq50k-50000-puffs-skd-dual-mode-visible-tank-vape',
      brand: 'EONIQ',
      categorySlug: 'Disposable Vape',
      price: 21.99,
      wholesalePrice: 8,
      msrp: 25.99,
      stock: 10000,
      published: true,
      featured: true,
      hot: false,
      shortDesc: 'An all-in-one premium vape device featuring up to 50,000 puffs, a visible e-liquid tank with built-in display.',
      nicotine: '0%,3%,5%,',
      capacity: '21ml',
      puffs: '50K PUFF',
      flavor: 'Double Mini, Blue Razz, Frozen Grape, Peach Ice, Strawberry Kiwi, Classico Ice, Blueberry Ice, Frozen Pineapple, R.B, Strawberry Coconut Pineapple, Mango Ice, Watermelon Ice, Lychee Ice, Black Blue Razz, Blueberry Sour Raspberry.',
    },
  ]

  for (const p of products) {
    const categoryId = catMap[p.categorySlug]
    if (!categoryId) {
      console.warn(`⚠️  跳过产品 ${p.name}: 分类未找到`)
      continue
    }

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    if (existing) {
      await prisma.product.update({
        where: { slug: p.slug },
        data: {
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
          shortDesc: p.shortDesc || '',
          description: p.shortDesc || '',
          nicotine: p.nicotine || null,
          capacity: p.capacity || null,
          puffs: p.puffs || null,
          flavor: p.flavor || null,
        },
      })
    } else {
      await prisma.product.create({
        data: {
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
          shortDesc: p.shortDesc || '',
          description: p.shortDesc || '',
          nicotine: p.nicotine || null,
          capacity: p.capacity || null,
          puffs: p.puffs || null,
          flavor: p.flavor || null,
          image: '',
          images: [],
          size: '',
        },
      })
    }
  }
  console.log('✅ 产品已就绪')
  console.log('🎉 Seed 完成!')
}

main()
  .catch((e) => {
    console.error('❌ Seed 失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
