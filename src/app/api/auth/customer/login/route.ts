import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Please enter email and password' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({ where: { email } })
    if (!customer) {
      return NextResponse.json({ error: 'Email not registered' }, { status: 401 })
    }

    if (!customer.password) {
      return NextResponse.json({ error: 'Account has no password set yet' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, customer.password)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    if (customer.rejected) {
      return NextResponse.json({ error: 'Account rejected, please contact administrator' }, { status: 403 })
    }

    if (!customer.approved) {
      return NextResponse.json({ error: 'Account pending approval, please try again later' }, { status: 403 })
    }

    // 使用 JWT 代替 Base64 编码
    const token = await signToken({
      type: 'customer',
      id: customer.id,
      email: customer.email,
    })

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        type: customer.type,
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
    return NextResponse.json({ error: 'Server error, please try again' }, { status: 500 })
  }
}
