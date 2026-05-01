import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { parseCustomerToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const payload = await parseCustomerToken(request)
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const customer = await prisma.customer.findUnique({
      where: { id: payload.id },
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
