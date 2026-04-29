import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
const bcrypt = require('bcryptjs')

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length < 5) {
      return NextResponse.json({ error: '无效的 token' }, { status: 401 })
    }

    const role = parts[3]
    const normalizedRole = role === 'super_admin' ? 'superadmin' : role

    if (normalizedRole !== 'superadmin') {
      return NextResponse.json({ error: '仅超级管理员可重置密码' }, { status: 403 })
    }

    const { id, password } = await request.json()
    if (!id || !password) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 })
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
