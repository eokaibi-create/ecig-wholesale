import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

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

    if (!customer.approved) {
      return NextResponse.json({ error: 'Account pending approval, please try again later' }, { status: 403 })
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
    return NextResponse.json({ error: 'Server error, please try again' }, { status: 500 })
  }
}
