import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { parseToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
 try {
 const payload = await parseToken(request)
 if (!payload) {
 return NextResponse.json({ error: '未登录或登录已过期' }, { status: 401 })
 }

 const { oldPassword, newPassword } = await request.json()

 if (!oldPassword || !newPassword) {
 return NextResponse.json({ error: '请填写旧密码和新密码' }, { status: 400 })
 }

 if (newPassword.length < 8) {
 return NextResponse.json({ error: '新密码至少8个字符' }, { status: 400 })
 }

 // Admin 表
 if (payload.type === 'admin') {
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
 }

 // User 表
 const user = await prisma.user.findUnique({ where: { id: payload.id } })
 if (!user) {
 return NextResponse.json({ error: '管理员不存在' }, { status: 404 })
 }

 const valid = await bcrypt.compare(oldPassword, user.password)
 if (!valid) {
 return NextResponse.json({ error: '旧密码不正确' }, { status: 400 })
 }

 const hashed = await bcrypt.hash(newPassword, 12)
 await prisma.user.update({
 where: { id: payload.id },
 data: { password: hashed },
 })

 return NextResponse.json({ success: true, message: '密码修改成功' })
 } catch (error: any) {
 console.error('Change password error:', error)
 return NextResponse.json({ error: error.message }, { status: 500 })
 }
}
