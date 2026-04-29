import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

// 一次性 API：将 BOSS 密码重置为 yong123
export async function GET() {
  try {
    const boss = await prisma.admin.findFirst({
      where: { OR: [{ username: 'BOSS' }, { email: 'EOKAIBI@GMAIL.COM' }] }
    })

    if (!boss) {
      return NextResponse.json({ error: 'BOSS not found' }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash('yong123', 12)
    await prisma.admin.update({
      where: { id: boss.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: 'BOSS password reset to yong123',
      admin: { id: boss.id, username: boss.username, email: boss.email, role: boss.role }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
