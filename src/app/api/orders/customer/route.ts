import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { parseCustomerToken } from '@/lib/auth'

function getCustomerId(request: NextRequest): number | null {
  const token = request.cookies.get('customer_token')?.value
  if (!token) return null

  // 优先 JWT 解析
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
    if (payload?.type === 'customer' && payload?.id) {
      return payload.id
    }
  } catch {
    // fallback to old base64 format
  }

  // 向后兼容：尝试旧 Base64 格式
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    const id = parseInt(parts[1])
    if (id) return id
  } catch {
    // 都不是，返回 null
  }

  return null
}

// 客户获取自己的订单
export async function GET(request: NextRequest) {
  try {
    const id = getCustomerId(request)
    if (!id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
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
    const customerId = getCustomerId(request)
    if (!customerId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
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
        select: { id: true, name: true, price: true, stock: true },
      })
      if (!product) return NextResponse.json({ error: `产品 ID ${item.productId} 不存在` }, { status: 400 })
      const qty = Math.max(1, parseInt(item.qty) || 1)

      // 🔒 库存检查
      if (product.stock < qty) {
        return NextResponse.json({ error: `产品 "${product.name}" 库存不足（剩余 ${product.stock}，需要 ${qty}）` }, { status: 400 })
      }

      const subtotal = product.price * qty
      total += subtotal
      orderItems.push({ productId: product.id, name: product.name, price: product.price, qty, subtotal })
    }

    if (total < 500) return NextResponse.json({ error: '最低起订量为 $500' }, { status: 400 })

    const order = await prisma.$transaction(async (tx) => {
      // 扣减库存
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: Math.max(1, parseInt(item.qty) || 1) } },
        })
      }

      return await tx.order.create({
        data: { customerId, items: orderItems, total, note: note || null, status: 'pending' },
      })
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: '订单创建失败' }, { status: 500 })
  }
}
