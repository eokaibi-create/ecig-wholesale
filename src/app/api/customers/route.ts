import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { inquiries: true, orders: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(customers)
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, phone, countryCode, company, companyAddress, state, country, type, notes, approved } = await request.json()
    const data: any = {}
    if (name !== undefined) data.name = name
    if (phone !== undefined) data.phone = phone
    if (countryCode !== undefined) data.countryCode = countryCode
    if (company !== undefined) data.company = company
    if (companyAddress !== undefined) data.companyAddress = companyAddress
    if (state !== undefined) data.state = state
    if (country !== undefined) data.country = country
    if (type !== undefined) data.type = type
    if (notes !== undefined) data.notes = notes
    if (approved !== undefined) {
      data.approved = approved
      data.rejected = !approved
    }

    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data,
    })
    return NextResponse.json(customer)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, approved, rejected } = await request.json()
    const data: any = {}
    if (approved !== undefined) data.approved = approved
    if (rejected !== undefined) data.rejected = rejected
    if (approved === true) data.rejected = false
    if (rejected === true) data.approved = false
    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data,
    })
    return NextResponse.json(customer)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await prisma.customer.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
