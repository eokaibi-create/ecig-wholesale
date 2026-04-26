import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST - 前台提交询价
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || null
    const company = formData.get('company') as string || null
    const message = formData.get('message') as string

    // 查找或创建客户
    let customer = await prisma.customer.findUnique({ where: { email } })
    if (customer) {
      customer = await prisma.customer.update({
        where: { email },
        data: { name, phone, company },
      })
    } else {
      customer = await prisma.customer.create({
        data: { name, email, phone, company },
      })
    }

    // 创建询价
    await prisma.inquiry.create({
      data: {
        customerId: customer.id,
        subject: `询价 - ${company || name}`,
        message,
      },
    })

    return NextResponse.redirect(new URL('/contact?success=true', request.url))
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.redirect(new URL('/contact?error=true', request.url))
  }
}

// GET - 获取询价列表（支持筛选单条）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
      include: { customer: true },
    })
    if (!inquiry) return NextResponse.json({ error: '未找到' }, { status: 404 })
    return NextResponse.json(inquiry)
  }

  const inquiries = await prisma.inquiry.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(inquiries)
}

// PUT - 更新询价（状态 / 回复 / 备注）
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, adminReply, adminNote } = body

    if (!id) return NextResponse.json({ error: '缺少ID' }, { status: 400 })

    const updateData: any = { updatedAt: new Date() }
    if (status !== undefined) updateData.status = status
    if (adminReply !== undefined) updateData.adminReply = adminReply
    if (adminNote !== undefined) updateData.adminNote = adminNote

    const updated = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { customer: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update inquiry error:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

// DELETE - 删除询价
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: '缺少ID' }, { status: 400 })

    await prisma.inquiry.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
