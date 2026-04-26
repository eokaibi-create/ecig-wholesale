import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('customer_token')?.value
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Base64 decode token
    let decoded: string
    try {
      decoded = Buffer.from(token, 'base64').toString('utf-8')
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const parts = decoded.split(':')
    if (parts.length < 3) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const id = parseInt(parts[1])
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, company: true, phone: true, companyAddress: true, approved: true, type: true },
    })

    if (!customer) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true, customer })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
