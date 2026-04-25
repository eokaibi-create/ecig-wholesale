import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function getCustomerId(request: NextRequest): number | null {
  const token = request.cookies.get('customer_token')?.value
  if (token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const parts = decoded.split(':')
      if (parts.length >= 2 && parts[0] === 'customer') return Number(parts[1])
    } catch {}
  }
  const headerId = request.headers.get('x-customer-id')
  if (headerId) return Number(headerId)
  return null
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const customerId = getCustomerId(request)
    if (!customerId) return NextResponse.json({ error: '需要登录' }, { status: 401 })
    
    const data = await request.json()
    const item = await prisma.cartItem.updateMany({
      where: { id: Number(id), customerId },
      data: { quantity: Number(data.quantity) },
    })
    return NextResponse.json({ success: true, updated: item.count })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const customerId = getCustomerId(request)
    if (!customerId) return NextResponse.json({ error: '需要登录' }, { status: 401 })
    
    await prisma.cartItem.deleteMany({ where: { id: Number(id), customerId } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
