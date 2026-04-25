import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function getCustomerId(request: NextRequest): number | null {
  // 1. 优先从 cookie 取
  const token = request.cookies.get('customer_token')?.value
  if (token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const parts = decoded.split(':')
      if (parts.length >= 2 && parts[0] === 'customer') return Number(parts[1])
    } catch {}
  }
  
  // 2. 从 header 取（前端 localStorage 方式）
  const headerId = request.headers.get('x-customer-id')
  if (headerId) return Number(headerId)
  
  // 3. 从 query 取（兼容）
  const queryId = request.nextUrl.searchParams.get('customerId')
  if (queryId) return Number(queryId)
  
  return null
}

export async function GET(request: NextRequest) {
  try {
    const customerId = getCustomerId(request)
    if (!customerId) return NextResponse.json({ error: '需要登录' }, { status: 401 })
    
    const items = await prisma.cartItem.findMany({
      where: { customerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerId = getCustomerId(request)
    if (!customerId) return NextResponse.json({ error: '需要登录' }, { status: 401 })
    
    const data = await request.json()
    const productId = Number(data.productId)
    const quantity = Number(data.quantity) || 1
    const flavor = data.flavor || null
    
    const existing = await prisma.cartItem.findFirst({
      where: { customerId, productId, flavor: flavor || undefined },
    })
    
    if (existing) {
      const item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      })
      return NextResponse.json(item)
    }
    
    const item = await prisma.cartItem.create({
      data: { customerId, productId, flavor, quantity },
      include: { product: true },
    })
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const customerId = getCustomerId(request)
    if (!customerId) return NextResponse.json({ error: '需要登录' }, { status: 401 })
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      await prisma.cartItem.delete({ where: { id: Number(id), customerId } })
    } else {
      await prisma.cartItem.deleteMany({ where: { customerId } })
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
