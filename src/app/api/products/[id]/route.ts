import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const { images, price, wholesalePrice, msrp, stock, ...rest } = data

    const updateData: any = {
      ...rest,
      price: price !== undefined ? Number(price) : undefined,
      wholesalePrice: wholesalePrice !== undefined ? Number(wholesalePrice) : null,
      msrp: msrp !== undefined ? Number(msrp) : null,
      stock: stock !== undefined ? Number(stock) : undefined,
      categoryId: rest.categoryId ? Number(rest.categoryId) : undefined,
    }
    if (images !== undefined) {
      updateData.images = Array.isArray(images) ? images : []
    }

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key]
    })

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
    })
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('PUT /api/products/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
