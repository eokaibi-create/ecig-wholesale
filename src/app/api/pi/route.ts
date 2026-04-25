import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function getCustomerId(request: NextRequest): number | null {
  const token = request.cookies.get('customer_token')?.value
  if (!token) {
    const xcid = request.headers.get('x-customer-id')
    if (xcid) return Number(xcid)
    return null
  }
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length >= 2 && parts[0] === 'customer') return Number(parts[1])
  } catch {}
  return null
}

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (token) return true
  const auth = request.headers.get('authorization') || ''
  return auth.includes('admin') || auth.includes('Bearer')
}

export async function GET(request: NextRequest) {
  try {
    if (isAdmin(request)) {
      const pis = await prisma.proformaInvoice.findMany({
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      return NextResponse.json(pis)
    }
    
    const customerId = getCustomerId(request)
    if (customerId) {
      const pis = await prisma.proformaInvoice.findMany({
        where: { customerId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(pis)
    }
    
    return NextResponse.json([])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerEmail, items, notes, discount, validUntil } = data
    
    const customer = await prisma.customer.findUnique({ where: { email: customerEmail } })
    if (!customer) return NextResponse.json({ error: '客户不存在' }, { status: 404 })
    
    const piNumber = 'PI-' + Date.now().toString(36).toUpperCase()
    
    let subtotal = 0
    const piItems = items.map((item: any) => {
      const total = item.quantity * item.unitPrice
      subtotal += total
      return {
        productId: Number(item.productId),
        productName: item.productName || '',
        flavor: item.flavor || null,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total,
      }
    })
    
    const discPct = Number(discount) || 0
    const totalAmount = subtotal * (1 - discPct / 100)
    
    const pi = await prisma.proformaInvoice.create({
      data: {
        piNumber,
        customerId: customer.id,
        notes: notes || '',
        discount: discPct,
        subtotal,
        totalAmount,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
        items: { create: piItems },
      },
      include: { customer: true, items: { include: { product: true } } },
    })
    
    return NextResponse.json(pi)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
