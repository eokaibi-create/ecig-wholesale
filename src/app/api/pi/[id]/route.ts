import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const pi = await prisma.proformaInvoice.findUnique({
      where: { id: Number(id) },
      include: { customer: true, items: { include: { product: true } } },
    })
    if (!pi) return NextResponse.json({ error: 'PI不存在' }, { status: 404 })
    return NextResponse.json(pi)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const data = await request.json()
    const updateData: any = {}
    if (data.status) updateData.status = data.status
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.discount !== undefined) {
      updateData.discount = Number(data.discount)
      if (data.subtotal) {
        updateData.totalAmount = Number(data.subtotal) * (1 - Number(data.discount) / 100)
      }
    }
    
    const pi = await prisma.proformaInvoice.update({
      where: { id: Number(id) },
      data: updateData,
      include: { customer: true, items: { include: { product: true } } },
    })
    return NextResponse.json(pi)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await prisma.proformaInvoiceItem.deleteMany({ where: { proformaInvoiceId: Number(id) } })
    await prisma.proformaInvoice.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
