import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

  try {
    const { id } = await params
    const data = await request.json()
    const platform = await prisma.platform.update({ where: { id: Number(id) }, data })
    return NextResponse.json(platform)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

  try {
    const { id } = await params
    await prisma.platform.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
