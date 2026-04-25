import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length < 5) {
      return NextResponse.json({ error: 'Token 无效' }, { status: 401 })
    }

    const loginType = parts[0] // user 或 admin
    const userId = parseInt(parts[1])
    const { oldPassword, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: '请填写旧密码和新密码' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少6个字符' }, { status: 400 })
    }

    // 先尝试 Admin 表
    if (loginType === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { id: userId } })
      if (!admin) {
        return NextResponse.json({ error: '管理员不存在' }, { status: 404 })
      }

      const valid = await bcrypt.compare(oldPassword, admin.password)
      if (!valid) {
        return NextResponse.json({ error: '旧密码不正确' }, { status: 400 })
      }

      const hashed = await bcrypt.hash(newPassword, 12)
      await prisma.admin.update({
        where: { id: userId },
        data: { password: hashed },
      })

      return NextResponse.json({ success: true, message: '密码修改成功' })
    }

    // 如果是 User 表
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 404 })
    }

    const valid = await bcrypt.compare(oldPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: '旧密码不正确' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    })

    return NextResponse.json({ success: true, message: '密码修改成功' })
  } catch (error: any) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
