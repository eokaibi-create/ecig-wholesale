import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, customerApprovedHtml, customerRejectedHtml } from '@/lib/email'

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
    
    // Fetch customer info (needed for email)
    const existing = await prisma.customer.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, type: true, approved: true, rejected: true },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const data: any = {}
    if (approved !== undefined) data.approved = approved
    if (rejected !== undefined) data.rejected = rejected
    if (approved === true) data.rejected = false
    if (rejected === true) data.approved = false

    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data,
    })

    // Approved -> send email to customer
    if (approved === true && !existing.approved) {
      sendEmail({
        to: existing.email,
        subject: `Your VAPOR-X Account Has Been Approved`,
        html: customerApprovedHtml({
          customerName: existing.name,
          customerEmail: existing.email,
          type: existing.type || 'wholesaler',
        }),
      }).then(result => {
        if (result.success) {
          console.log(`[Customers] Approval email sent to ${existing.email}`)
        } else {
          console.warn(`[Customers] Approval email failed to send:`, result.error)
        }
      })
    }

    // Rejected -> send email to customer
    if (rejected === true && !existing.rejected) {
      sendEmail({
        to: existing.email,
        subject: `Your VAPOR-X Account Has Not Been Approved`,
        html: customerRejectedHtml({
          customerName: existing.name,
        }),
      }).then(result => {
        if (result.success) {
          console.log(`[Customers] Rejection email sent to ${existing.email}`)
        } else {
          console.warn(`[Customers] Rejection email failed to send:`, result.error)
        }
      })
    }

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
