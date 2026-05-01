import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendEmail, adminPasswordResetHtml } from '@/lib/email'

const RESET_SECRET = process.env.RESET_SECRET || process.env.JWT_SECRET || 'admin-reset-secret-key'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://okaibiglobal.com'

function generateResetToken(adminId: number, email: string): string {
 const timestamp = Date.now().toString(36)
 const payload = `${adminId}:${email}:${timestamp}`
 // crypto already imported at top
 const hmac = crypto.createHmac('sha256', RESET_SECRET).update(payload).digest('hex').slice(0, 16)
 const data = Buffer.from(payload).toString('base64url')
 return `${data}:${hmac}`
}

export async function POST(request: Request) {
 try {
 const { email } = await request.json()
 if (!email) {
 return NextResponse.json({ error: '请输入邮箱' }, { status: 400 })
 }

 // 查找管理员（所有角色）
 const admin = await prisma.admin.findUnique({ where: { email } })

 // 不论邮箱是否存在，都返回成功（防枚举）
 if (!admin) {
 return NextResponse.json({ success: true, message: '如果该邮箱已注册，将收到重置邮件' })
 }

 const token = generateResetToken(admin.id, admin.email)
 const resetLink = `${BASE_URL}/admin/reset-password?token=${token}`

 await sendEmail({
 to: admin.email,
 subject: '重置您的 OKAIBIGLOBAL 管理后台密码',
 html: adminPasswordResetHtml({
 name: admin.username,
 resetLink,
 }),
 })

 return NextResponse.json({ success: true, message: '重置邮件已发送' })
 } catch (error) {
 console.error('[Admin Forgot Password] Error:', error)
 return NextResponse.json({ error: '发送失败，请稍后重试' }, { status: 500 })
 }
}
