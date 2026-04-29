import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const boss = await prisma.admin.findFirst({ where: { username: 'BOSS' } })
    if (!boss) {
      return NextResponse.json({ error: 'BOSS not found' }, { status: 404 })
    }

    const newHash = await bcrypt.hash('yong123', 12)
    await prisma.admin.update({
      where: { id: boss.id },
      data: { password: newHash }
    })

    return NextResponse.json({
      success: true,
      message: 'BOSS password reset to yong123',
      id: boss.id,
      username: boss.username,
      email: boss.email,
      role: boss.role
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
