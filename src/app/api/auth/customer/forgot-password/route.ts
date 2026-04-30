import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, passwordResetHtml } from '@/lib/email'
import crypto from 'crypto'

const RESET_SECRET = process.env.RESET_SECRET || process.env.RESET_TOKEN_SECRET || 'okaibiglobal-reset-secret-key-2024'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Please enter your email' }, { status: 400 })
    }

    // 查找客户
    const customer = await prisma.customer.findUnique({ where: { email } })

    // 不管邮箱是否存在，都返回成功（防止枚举）
    if (!customer) {
      return NextResponse.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link shortly.',
      })
    }

    // 生成 HMAC token：customerId:email:timestamp:hmac
    const timestamp = Date.now().toString()
    const rawToken = `${customer.id}:${customer.email}:${timestamp}`
    const hmac = crypto
      .createHmac('sha256', RESET_SECRET)
      .update(rawToken)
      .digest('hex')
    const token = Buffer.from(`${customer.id}:${customer.email}:${timestamp}:${hmac}`).toString('base64url')

    // 构建重置链接
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://okaibiglobal.com'
    const resetLink = `${baseUrl}/reset-password?token=${token}`

    console.log(`[ForgotPassword] Sending reset email to ${customer.email}`)
    console.log(`[ForgotPassword] Reset link: ${resetLink}`)

    // 发送邮件
    const emailResult = await sendEmail({
      to: customer.email,
      subject: 'Reset Your VAPOR-X Password',
      html: passwordResetHtml({
        customerName: customer.name,
        resetLink,
      }),
    })

    if (!emailResult.success) {
      console.warn('[ForgotPassword] Email sending failed:', emailResult.error)
      // 不暴露失败信息给用户
    }

    return NextResponse.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link shortly.',
    })
  } catch (error) {
    console.error('[ForgotPassword] Error:', error)
    return NextResponse.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link shortly.',
    })
  }
}
