import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
 const auth = await requireAdmin(request)
 if (!auth.authorized) {
 return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
 }

 const orders = await prisma.order.findMany({
 include: { customer: true },
 orderBy: { createdAt: 'desc' },
 })
 return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
 const auth = await requireAdmin(request)
 if (!auth.authorized) {
 return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
 }

 try {
 const data = await request.json()
 const order = await prisma.order.create({ data })
 return NextResponse.json(order)
 } catch (error: any) {
 return NextResponse.json({ error: error.message }, { status: 400 })
 }
}
