import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    // 仅 superadmin 可重置密码
    const auth = requireAdmin(request, ['superadmin'])
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
    }

    const { id, password } = await request.json()
    if (!id || !password) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: '密码至少 8 位' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: '密码已重置' })
  } catch (error) {
    console.error('[Admin Manage Reset Password] Error:', error)
    return NextResponse.json({ error: '重置失败' }, { status: 500 })
  }
}
