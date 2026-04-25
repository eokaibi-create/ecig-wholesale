import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [productCount, lowStockCount, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 50 } } }),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, name: true, slug: true, image: true,
          price: true, stock: true, published: true, hot: true,
          createdAt: true, brand: true,
        }
      }),
    ])

    return NextResponse.json({
      productCount,
      lowStockCount,
      recentProducts,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
