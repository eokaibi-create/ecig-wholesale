import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const result: Record<string, number> = {}

    // ====== 品牌（仅保留已筛选的品牌） ======
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
    result.brands = brands.length

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
    result.categories = categories.length

    // ====== 获取分类 ID ======
    const catMap = Object.fromEntries(
      (await prisma.category.findMany()).map(c => [c.slug, c.id])
    )
    const disposableVapeId = catMap['Disposable Vape']

    // ====== 产品（仅保留已筛选的产品） ======
    const products = [
      {
        name: 'KADO BAR SNAP',
        slug: 'kado-bar-snap',
        brand: 'KADO BAR',
        categoryId: disposableVapeId,
        price: 19.99,
        wholesalePrice: 4,
        wholesalerPrice: 9.5,
        msrp: 0,
        stock: 39000,
        published: true,
        featured: false,
        hot: false,
        shortDesc: 'Pod Kit(1 battery+1 pod), Battery:1250mAh Liquid:18ml Nicotine:5%',
        description: 'Pod Kit(1 battery+1 pod),\nBattery:1250mAh\nLiquid:18ml\nNicotine:5%',
        nicotine: '5%',
        capacity: '18ML',
        puffs: '25K puffs',
        flavor: 'Watermelon Ice, Sour Rainbow Candy, Juicy Mango, Sour lush gummy, Strawberry slushy, Bangin Blue Raz, Just mint.',
      },
      {
        name: 'UT BAR 50K',
        slug: 'ut-bar-50k-dual-flavor-50000-puffs-disposable-vape',
        brand: 'FLUM',
        categoryId: disposableVapeId,
        price: 20.99,
        wholesalePrice: 9,
        wholesalerPrice: 11.98,
        msrp: 24.99,
        stock: 1000,
        published: true,
        featured: true,
        hot: false,
        shortDesc: 'Dual-flavor disposable vape with adjustable flavor control, up to 50,000 puffs, and smart display system.',
        description: 'The UT BAR 50K is a next-generation high-capacity disposable vape with dual flavor system.',
        nicotine: '5%',
        capacity: '20ml',
        puffs: '50K PUFF',
        flavor: 'Banana Smoothy-Strawberry, Blue Razz Ice-Triple Berry, Cool Mint-Icy Mint, Green Apple-Fuji Apple, Mango-Strawberry, Naked-Spring Water, Sour Fab-Citrus Ice, Watermelon-B-Pop, White Peach-Lemon Head, White Peach-Raspberry, Pink Lemonade-Mix Berry, Raspberry Grape-Guava, Root Soda-Vanilla, White Gummy-Watermelon, Strawberry Ice Cream-Strawberry Banana',
      },
      {
        name: 'EONIQ iQ50K',
        slug: 'eoniq-iq50k-50000-puffs-skd-dual-mode-visible-tank-vape',
        brand: 'EONIQ',
        categoryId: disposableVapeId,
        price: 21.99,
        wholesalePrice: 8,
        wholesalerPrice: 10,
        msrp: 25.99,
        stock: 10000,
        published: true,
        featured: true,
        hot: false,
        shortDesc: 'An all-in-one premium vape device featuring up to 50,000 puffs, a visible e-liquid tank with built-in display.',
        description: 'An all-in-one premium vape device featuring up to 50,000 puffs, a visible e-liquid tank with built-in display, 21mL capacity, dual modes (ECO/BOOST), SKD support for local assembly.',
        nicotine: '0%,3%,5%,',
        capacity: '21ml',
        puffs: '50K PUFF',
        flavor: 'Double Mini, Blue Razz, Frozen Grape, Peach Ice, Strawberry Kiwi, Classico Ice, Blueberry Ice, Frozen Pineapple, R.B, Strawberry Coconut Pineapple, Mango Ice, Watermelon Ice, Lychee Ice, Black Blue Razz, Blueberry Sour Raspberry.',
      },
    ]

    let created = 0
    let updated = 0

    for (const p of products) {
      if (!p.categoryId) {
        continue
      }

      const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
      if (existing) {
        await prisma.product.update({
          where: { slug: p.slug },
          data: {
            name: p.name,
            brand: p.brand,
            categoryId: p.categoryId,
            price: p.price,
            wholesalePrice: p.wholesalePrice,
            wholesalerPrice: p.wholesalerPrice,
            msrp: p.msrp,
            stock: p.stock,
            published: p.published,
            featured: p.featured || false,
            hot: p.hot || false,
            shortDesc: p.shortDesc || '',
            description: p.description || '',
            nicotine: p.nicotine || null,
            capacity: p.capacity || null,
            puffs: p.puffs || null,
            flavor: p.flavor || null,
          },
        })
        updated++
      } else {
        await prisma.product.create({
          data: {
            name: p.name,
            slug: p.slug,
            brand: p.brand,
            categoryId: p.categoryId,
            price: p.price,
            wholesalePrice: p.wholesalePrice,
            wholesalerPrice: p.wholesalerPrice,
            msrp: p.msrp,
            stock: p.stock,
            published: p.published,
            featured: p.featured || false,
            hot: p.hot || false,
            shortDesc: p.shortDesc || '',
            description: p.description || '',
            nicotine: p.nicotine || null,
            capacity: p.capacity || null,
            puffs: p.puffs || null,
            flavor: p.flavor || null,
            image: '',
            images: [],
            size: '',
          },
        })
        created++
      }
    }

    result.productsCreated = created
    result.productsUpdated = updated

    return NextResponse.json({
      success: true,
      message: `导入完成: ${created} 个产品已创建, ${updated} 个已更新`,
      data: result,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: '导入失败，请稍后重试' }, { status: 500 })
  }
}
