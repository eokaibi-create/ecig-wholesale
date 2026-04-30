import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const RESET_SECRET = process.env.RESET_SECRET || process.env.RESET_TOKEN_SECRET || 'vapor-x-reset-secret-key-2024'
const TOKEN_VALIDITY_MS = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Invalid reset link or missing password' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // 解码 token
    let decoded: string
    try {
      decoded = Buffer.from(token, 'base64url').toString('utf-8')
    } catch {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    // 解析 token: customerId:email:timestamp:hmac
    const parts = decoded.split(':')
    if (parts.length !== 4) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    const [customerIdStr, email, timestamp, hmac] = parts
    const customerId = parseInt(customerIdStr, 10)

    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    // 验证时间戳（1小时有效）
    const now = Date.now()
    const ts = parseInt(timestamp, 10)
    if (isNaN(ts) || now - ts > TOKEN_VALIDITY_MS) {
      return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
    }

    // 验证 HMAC 签名
    const rawToken = `${customerId}:${email}:${timestamp}`
    const expectedHmac = crypto
      .createHmac('sha256', RESET_SECRET)
      .update(rawToken)
      .digest('hex')

    // 恒定时间比较，防止时序攻击
    if (hmac.length !== expectedHmac.length) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    let hmacValid = true
    for (let i = 0; i < hmac.length; i++) {
      if (hmac[i] !== expectedHmac[i]) {
        hmacValid = false
      }
    }

    if (!hmacValid) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    // 查找客户
    const customer = await prisma.customer.findUnique({ where: { id: customerId } })

    if (!customer) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    if (customer.email !== email) {
      return NextResponse.json({ error: 'Invalid reset link' }, { status: 400 })
    }

    if (customer.rejected) {
      return NextResponse.json({ error: 'Account has been rejected. Please contact administrator.' }, { status: 403 })
    }

    // 加密新密码并更新
    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.customer.update({
      where: { id: customerId },
      data: { password: hashedPassword },
    })

    console.log(`[ResetPassword] Password reset successful for customer ${customerId} (${email})`)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    })
  } catch (error) {
    console.error('[ResetPassword] Error:', error)
    return NextResponse.json({ error: 'Server error, please try again' }, { status: 500 })
  }
}
