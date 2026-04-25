import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(admins)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const existing = await prisma.admin.findFirst({
      where: { OR: [{ username: data.username }, { email: data.email }] }
    })
    if (existing) return NextResponse.json({ error: '用户名或邮箱已存在' }, { status: 400 })
    
    const hash = await bcrypt.hash(data.password, 12)
    const admin = await prisma.admin.create({
      data: {
        username: data.username,
        email: data.email,
        password: hash,
        role: data.role || 'admin',
      },
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json(admin)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    await prisma.admin.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
