import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, companyAddress, state, type, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: '姓名、邮箱和密码为必填项' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 })
    }

    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        companyAddress: companyAddress || null,
        state: state || null,
        type: type || 'wholesaler',
        password: hashedPassword,
        approved: true,
      },
    })

    const token = Buffer.from(`customer:${customer.id}:${customer.email}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        type: customer.type,
      }
    })

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Customer register error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
