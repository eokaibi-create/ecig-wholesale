import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      productCount, publishedCount, categoryCount, customerCount,
      inquiryCount, orderCount, brandCount, videoCount,
      platformCount, featuredCount, lowStockCount,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.customer.count(),
      prisma.inquiry.count(),
      prisma.order.count(),
      prisma.brand.count(),
      prisma.video.count(),
      prisma.platform.count(),
      prisma.product.count({ where: { featured: true } }),
      prisma.product.count({ where: { stock: { lte: 50 } } }),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, name: true, slug: true, image: true,
          price: true, stock: true, published: true, hot: true,
          createdAt: true, brand: true,
        },
      }),
    ])

    const [newInquiryCount, categoryStats, recentInquiries, recentCustomers] = await Promise.all([
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.inquiry.findMany({
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, name: true, email: true, company: true,
          approved: true, type: true, createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      productCount,
      publishedCount,
      categoryCount,
      customerCount,
      inquiryCount,
      orderCount,
      brandCount,
      videoCount,
      platformCount,
      featuredCount,
      lowStockCount,
      newInquiryCount,
      recentProducts,
      categoryStats,
      recentInquiries,
      recentCustomers,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
