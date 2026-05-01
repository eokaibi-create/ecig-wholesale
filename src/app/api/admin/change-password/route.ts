import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error?.message || '未授权' }, { status: auth.error?.status || 401 })
    }

    const payload = auth.payload!
    // 只允许 admin 类型修改密码
    if (payload.type !== 'admin') {
      return NextResponse.json({ error: '仅管理员可修改密码' }, { status: 403 })
    }

    const { oldPassword, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: '请填写旧密码和新密码' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: '新密码至少8个字符' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({ where: { id: payload.id } })
    if (!admin) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 404 })
    }

    const valid = await bcrypt.compare(oldPassword, admin.password)
    if (!valid) {
      return NextResponse.json({ error: '旧密码不正确' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.admin.update({
      where: { id: payload.id },
      data: { password: hashed },
    })

    return NextResponse.json({ success: true, message: '密码修改成功' })
  } catch {
    console.error('Change password error')
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
