import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
