import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// 客户获取自己的订单
export async function GET(request: NextRequest) {
 try {
 const token = request.cookies.get('customer_token')?.value
 if (!token) {
 return NextResponse.json({ error: '未登录' }, { status: 401 })
 }

 let decoded: string
 try {
 decoded = Buffer.from(token, 'base64').toString('utf-8')
 } catch {
 return NextResponse.json({ error: '无效凭证' }, { status: 401 })
 }

 const parts = decoded.split(':')
 const id = parseInt(parts[1])
 if (!id) {
 return NextResponse.json({ error: '无效凭证' }, { status: 401 })
 }

 const orders = await prisma.order.findMany({
 where: { customerId: id },
 orderBy: { createdAt: 'desc' },
 })

 return NextResponse.json(orders)
 } catch {
 return NextResponse.json({ error: '服务器错误' }, { status: 500 })
 }
}

// 客户创建订单
export async function POST(request: NextRequest) {
 try {
 const token = request.cookies.get('customer_token')?.value
 if (!token) {
 return NextResponse.json({ error: '请先登录' }, { status: 401 })
 }

 let decoded: string
 try {
 decoded = Buffer.from(token, 'base64').toString('utf-8')
 } catch {
 return NextResponse.json({ error: '无效凭证' }, { status: 401 })
 }

 const parts = decoded.split(':')
 const customerId = parseInt(parts[1])
 if (!customerId) {
 return NextResponse.json({ error: '无效凭证' }, { status: 401 })
 }

 const customer = await prisma.customer.findUnique({
 where: { id: customerId },
 select: { approved: true },
 })
 if (!customer) return NextResponse.json({ error: '客户不存在' }, { status: 404 })
 if (!customer.approved) return NextResponse.json({ error: '账户正在审核中' }, { status: 403 })

 const { items, note } = await request.json()

 if (!items || !Array.isArray(items) || items.length === 0) {
 return NextResponse.json({ error: '请选择产品' }, { status: 400 })
 }

 let total = 0
 const orderItems: any[] = []
 for (const item of items) {
 const product = await prisma.product.findUnique({
 where: { id: item.productId },
 select: { id: true, name: true, price: true },
 })
 if (!product) return NextResponse.json({ error: `产品 ID ${item.productId} 不存在` }, { status: 400 })
 const qty = Math.max(1, parseInt(item.qty) || 1)
 const subtotal = product.price * qty
 total += subtotal
 orderItems.push({ productId: product.id, name: product.name, price: product.price, qty, subtotal })
 }

 if (total < 500) return NextResponse.json({ error: '最低起订量为 $500' }, { status: 400 })

 const order = await prisma.order.create({
 data: { customerId, items: orderItems, total, note: note || null, status: 'pending' },
 })

 return NextResponse.json({ success: true, order })
 } catch (error: any) {
 console.error('Create order error:', error)
 return NextResponse.json({ error: '订单创建失败' }, { status: 500 })
 }
}
