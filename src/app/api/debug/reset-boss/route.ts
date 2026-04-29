import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

// 一次性 API：仅超级管理员可重置 BOSS 密码
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request, ['superadmin'])
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

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
