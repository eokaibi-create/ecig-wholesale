import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - start

    const productCount = await prisma.product.count()
    const brandCount = await prisma.brand.count()
    const categoryCount = await prisma.category.count()
    const customerCount = await prisma.customer.count()
    const orderCount = await prisma.order.count()

    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: true,
        latency: `${latency}ms`,
        tables: {
          products: productCount,
          brands: brandCount,
          categories: categoryCount,
          customers: customerCount,
          orders: orderCount,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      database: { connected: false },
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }
}
