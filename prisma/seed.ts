import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建管理员
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin user created (admin / admin123)')

  // 创建分类
  const categories = [
    { name: '一次性电子烟', slug: 'disposable', sortOrder: 1 },
    { name: '换弹式电子烟', slug: 'pod-system', sortOrder: 2 },
    { name: '烟油', slug: 'e-liquid', sortOrder: 3 },
    { name: '配件', slug: 'accessories', sortOrder: 4 },
    { name: '尼古丁袋', slug: 'nicotine-pouches', sortOrder: 5 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created')

  // 创建品牌
  const brandData = [
    { name: 'Elf Bar', slug: 'elf-bar', sortOrder: 1, logo: '/uploads/brands/elfbar.svg' },
    { name: 'Geek Bar', slug: 'geek-bar', sortOrder: 2, logo: '/uploads/brands/geekbar.svg' },
    { name: 'SMOK', slug: 'smok', sortOrder: 3, logo: '/uploads/brands/smok.svg' },
    { name: 'JUUL', slug: 'juul', sortOrder: 4, logo: '/uploads/brands/juul.svg' },
    { name: 'Naked 100', slug: 'naked-100', sortOrder: 5, logo: '/uploads/brands/naked100.svg' },
    { name: 'ZYN', slug: 'zyn', sortOrder: 6, logo: '/uploads/brands/zyn.svg' },
    { name: 'Lost Mary', slug: 'lost-mary', sortOrder: 7, logo: '/uploads/brands/lostmary.svg' },
    { name: 'Vaporesso', slug: 'vaporesso', sortOrder: 8, logo: '/uploads/brands/vaporesso.svg' },
  ]

  for (const b of brandData) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    })
  }
  console.log('✅ Brands created')

  // 创建示例产品（含批发价）
  const products = [
    {
      name: 'Elf Bar BC5000',
      slug: 'elf-bar-bc5000',
      description: '预注油一次性电子烟，5000口超大容量。多种口味可选，包括芒果、西瓜、蓝莓冰等。内置可充电电池，USB-C充电接口。5%尼古丁盐含量，提供顺畅的击喉体验。',
      shortDesc: '5000口一次性电子烟，多口味可选',
      categorySlug: 'disposable',
      brand: 'Elf Bar',
      price: 15.99,
      wholesalePrice: 12.99,
      msrp: 19.99,
      stock: 500,
      featured: true,
      published: true,
      nicotine: '5%',
      capacity: '13ml',
      puffs: '5000',
      flavor: '多种口味',
    },
    {
      name: 'Geek Bar Pulse 7500',
      slug: 'geek-bar-pulse-7500',
      description: 'Geek Bar Pulse系列，7500口超长续航。双网芯设计，口感更细腻。LED灯光显示屏，实时显示电量与烟油余量。',
      shortDesc: '7500口双网芯一次性电子烟',
      categorySlug: 'disposable',
      brand: 'Geek Bar',
      price: 18.99,
      wholesalePrice: 14.99,
      msrp: 22.99,
      stock: 300,
      featured: true,
      published: true,
      nicotine: '5%',
      capacity: '18ml',
      puffs: '7500',
      flavor: '多种口味',
    },
    {
      name: 'SMOK Nord 5',
      slug: 'smok-nord-5',
      description: 'SMOK Nord 5 换弹式电子烟套件，内置2000mAh大容量电池。支持5-80W功率调节，兼容LP2系列雾化芯。0.96英寸TFT彩屏，气流可调。',
      shortDesc: '2000mAh可调功率换弹式电子烟',
      categorySlug: 'pod-system',
      brand: 'SMOK',
      price: 39.99,
      wholesalePrice: 29.99,
      msrp: 49.99,
      stock: 200,
      featured: true,
      published: true,
      nicotine: null,
      capacity: '5ml',
      puffs: null,
      flavor: null,
    },
    {
      name: 'JUUL 入门套件',
      slug: 'juul-starter-kit',
      description: 'JUUL 电子烟入门套件，包含主机一台、USB充电底座、两颗烟弹。经典简约设计，使用方便。5%尼古丁盐含量烟弹，真实还原香烟体验。',
      shortDesc: '经典JUUL电子烟入门套件',
      categorySlug: 'pod-system',
      brand: 'JUUL',
      price: 34.99,
      wholesalePrice: 24.99,
      msrp: 39.99,
      stock: 400,
      featured: false,
      published: true,
      nicotine: '5%',
      capacity: '0.7ml',
      puffs: null,
      flavor: '烟草/薄荷',
    },
    {
      name: 'Naked 100 芒果味烟油',
      slug: 'naked-100-mango',
      description: 'Naked 100 芒果味烟油，新鲜芒果的自然甜味。70/30 VG/PG配比，适合大烟雾设备。3mg/6mg尼古丁可选。美国原装进口。',
      shortDesc: '60ml大容量，天然芒果风味',
      categorySlug: 'e-liquid',
      brand: 'Naked 100',
      price: 19.99,
      wholesalePrice: 15.99,
      msrp: 24.99,
      stock: 350,
      featured: false,
      published: true,
      nicotine: '3mg/6mg',
      capacity: '60ml',
      puffs: null,
      flavor: '芒果',
    },
    {
      name: 'ZYN 尼古丁袋 - 薄荷味',
      slug: 'zyn-mint',
      description: 'ZYN 薄荷味尼古丁袋，每罐15袋。无烟草，白色小袋设计，使用方便。3mg/6mg两种强度可选。长效释放尼古丁，适合无烟环境使用。',
      shortDesc: '15袋/罐，清爽薄荷尼古丁袋',
      categorySlug: 'nicotine-pouches',
      brand: 'ZYN',
      price: 7.99,
      wholesalePrice: 5.99,
      msrp: 9.99,
      stock: 800,
      featured: false,
      published: true,
      nicotine: '3mg/6mg',
      capacity: null,
      puffs: null,
      flavor: '薄荷',
    },
    {
      name: 'Lost Mary BM600',
      slug: 'lost-mary-bm600',
      description: 'Lost Mary BM600 一次性电子烟，600口紧凑设计。小巧便携，即抽即用。2ml烟油容量，20mg尼古丁盐。多种热门口味。',
      shortDesc: '600口一次性电子烟，小巧便携',
      categorySlug: 'disposable',
      brand: 'Lost Mary',
      price: 8.99,
      wholesalePrice: 6.99,
      msrp: 11.99,
      stock: 600,
      featured: false,
      published: true,
      nicotine: '2%',
      capacity: '2ml',
      puffs: '600',
      flavor: '多种口味',
    },
    {
      name: 'Vaporesso XROS 4',
      slug: 'vaporesso-xros-4',
      description: 'Vaporesso XROS 4 换弹式电子烟，搭载COREX加热技术。1000mAh电池容量，支持Type-C快充。可调气流系统，兼容XROS全系列烟弹。',
      shortDesc: 'COREX加热技术，1000mAh换弹式',
      categorySlug: 'pod-system',
      brand: 'Vaporesso',
      price: 34.99,
      wholesalePrice: 26.99,
      msrp: 39.99,
      stock: 250,
      featured: false,
      published: true,
      nicotine: null,
      capacity: '2ml',
      puffs: null,
      flavor: null,
    },
  ]

  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } })
    if (category) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          shortDesc: p.shortDesc,
          categoryId: category.id,
          brand: p.brand,
          price: p.price,
          wholesalePrice: p.wholesalePrice,
          msrp: p.msrp,
          stock: p.stock,
          featured: p.featured,
          published: p.published,
          nicotine: p.nicotine,
          capacity: p.capacity,
          puffs: p.puffs,
          flavor: p.flavor,
        },
      })
    }
  }
  console.log('✅ Products created (with wholesale prices)')

  // 创建设置（与数据库一致的真实联系方式）
  const settings = [
    { key: 'site_name', value: 'VAPOR-X' },
    { key: 'site_description', value: '美国电子烟批发首选 - 全美发货 · 批发价直供 · 支持海外直邮' },
    { key: 'hero_title', value: 'VAPOR-X' },
    { key: 'hero_subtitle', value: '美国本土电子烟批发平台' },
    { key: 'whatsapp', value: '+13239260829' },
    { key: 'wechat', value: 'EA_YONG' },
    { key: 'email', value: 'EOKAIBI@GMAIL.COM' },
    { key: 'phone', value: '+1 (555) 123-4567' },
    { key: 'address', value: '美国全境配送，支持海外直邮' },
    { key: 'min_order', value: '500' },
    { key: 'shipping_info', value: '全美48州免运费，订单满$500起批。支持海外直邮。' },
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
  const customers = [
    { name: 'John Smith', email: 'john@vapeshopny.com', phone: '+12125550001', company: 'NYC Vape Shop', state: 'NY', approved: true },
    { name: 'Maria Garcia', email: 'maria@smokechicago.com', phone: '+17735550002', company: 'Chicago Smoke House', state: 'IL', approved: true },
    { name: 'David Chen', email: 'david@ecigla.com', phone: '+12135550003', company: 'LA E-Cig Supply', state: 'CA', approved: true },
    { name: 'Test User', email: 'test@test.com', phone: '+11111111111', company: 'Test Shop', state: 'CA', approved: true, password: '$2a$12$LJ3m4ys3Lk0TSwHnbfOMi.X3D1.xqb5YomKf0JxQJ3dX7cK9qT5zS' },
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

  // 创建视频
  if ((await prisma.video.count()) === 0) {
    await prisma.video.createMany({
      data: [
        { title: '2024 新品发布会', url: 'https://www.youtube.com/embed/example1', sortOrder: 1 },
        { title: '产品使用教程', url: 'https://www.youtube.com/embed/example2', sortOrder: 2 },
        { title: '客户评价', url: 'https://www.youtube.com/embed/example3', sortOrder: 3 },
      ],
    })
    console.log('✅ Videos created')
  }

  // 创建平台
  if ((await prisma.platform.count()) === 0) {
    await prisma.platform.createMany({
      data: [
        { name: 'Shopify', logo: '/uploads/platforms/shopify.svg', description: '一键对接Shopify店铺，自动同步库存和订单', sortOrder: 1 },
        { name: 'WhatsApp', logo: '/uploads/platforms/whatsapp.svg', description: '通过WhatsApp快速下单，24小时客服支持', sortOrder: 2 },
        { name: '微信', logo: '/uploads/platforms/wechat.svg', description: '中文客服，微信在线下单，便捷支付', sortOrder: 3 },
      ],
    })
    console.log('✅ Platforms created')
  }

  console.log('\n🎉 Seed completed!')
  console.log('   Admin: admin / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
