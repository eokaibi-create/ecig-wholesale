import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
const bcrypt = require('bcryptjs')

const RESET_SECRET = process.env.RESET_SECRET || process.env.JWT_SECRET || 'admin-reset-secret-key'

function verifyResetToken(token: string): { adminId: number; email: string } | null {
  try {
    const parts = token.split(':')
    if (parts.length !== 2) return null

    const [encodedPayload, hmac] = parts
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf-8')
    const payloadParts = payload.split(':')
    if (payloadParts.length !== 3) return null

    const [adminIdStr, email, timestampBase36] = payloadParts
    const adminId = parseInt(adminIdStr, 10)
    if (isNaN(adminId)) return null

    // 检查是否过期（1小时）
    const timestamp = parseInt(timestampBase36, 36)
    if (Date.now() - timestamp > 3600000) return null

    // 验证 HMAC
    const crypto = require('crypto')
    const expectedHmac = crypto.createHmac('sha256', RESET_SECRET).update(payload).digest('hex').slice(0, 16)
    if (hmac !== expectedHmac) return null

    return { adminId, email }
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 })
    }

    const decoded = verifyResetToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '链接无效或已过期' }, { status: 400 })
    }

    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId, email: decoded.email }
    })
    if (!admin) {
      return NextResponse.json({ error: '账户不存在' }, { status: 404 })
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: '密码已重置' })
  } catch (error) {
    console.error('[Admin Reset Password] Error:', error)
    return NextResponse.json({ error: '重置失败，请稍后重试' }, { status: 500 })
  }
}
