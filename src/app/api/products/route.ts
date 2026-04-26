import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')
  const published = searchParams.get('published')
  const featured = searchParams.get('featured')
  const hot = searchParams.get('hot')
  const all = searchParams.get('all')

  const where: any = {}
  if (categoryId) where.categoryId = Number(categoryId)
  if (published !== null) where.published = published === 'true'
  if (featured !== null) where.featured = featured === 'true'
  if (hot !== null) where.hot = hot === 'true'

  const products = await prisma.product.findMany({
    where: all === '1' ? undefined : where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { images, price, wholesalePrice, msrp, wholesalerPrice, stock, ...rest } = data

    const createData: any = {
      ...rest,
      price: price ? Number(price) : 0,
      wholesalePrice: wholesalePrice ? Number(wholesalePrice) : null,
      wholesalerPrice: wholesalerPrice ? Number(wholesalerPrice) : null,
      msrp: msrp ? Number(msrp) : null,
      stock: stock ? Number(stock) : 0,
      categoryId: rest.categoryId ? Number(rest.categoryId) : undefined,
    }
    if (images !== undefined) {
      createData.images = Array.isArray(images) ? images : []
    }

    const product = await prisma.product.create({ data: createData })
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
