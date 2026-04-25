import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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

export async function GET() {
  const inquiries = await prisma.inquiry.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(inquiries)
}
