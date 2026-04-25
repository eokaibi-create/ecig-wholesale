import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({ where: { email } })
    if (!customer) {
      return NextResponse.json({ error: '邮箱未注册' }, { status: 401 })
    }

    if (!customer.password) {
      return NextResponse.json({ error: '该账户尚未设置密码，请使用注册功能' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, customer.password)
    if (!valid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    if (!customer.approved) {
      return NextResponse.json({ error: '账户正在审核中，请稍后再试' }, { status: 403 })
    }

    const token = Buffer.from(`customer:${customer.id}:${customer.email}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
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
    console.error('Customer login error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
