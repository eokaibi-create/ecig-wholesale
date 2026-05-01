import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, normalizeRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
 const token = request.cookies.get('admin_token')?.value
 
 if (!token) {
 return NextResponse.json({ role: null }, { status: 401 })
 }

 try {
 // 优先 JWT 解析
 const payload = await verifyToken(token)
 if (payload) {
 return NextResponse.json({
 role: normalizeRole(payload.role),
 userId: String(payload.id),
 username: payload.username,
 userType: payload.type,
 })
 }

 // 向后兼容：尝试 base64 解析旧 token
 const decoded = Buffer.from(token, 'base64').toString('utf-8')
 const parts = decoded.split(':')
 if (parts.length < 5) {
 throw new Error('Invalid token')
 }

 const userType = parts[0] // 'admin' or 'user'
 const userId = parts[1]
 const username = parts[2]
 const role = parts[3]

 const normalizedRole = normalizeRole(role)

 return NextResponse.json({
 role: normalizedRole,
 userId,
 username,
 userType,
 })
 } catch {
 return NextResponse.json({ role: null }, { status: 401 })
 }
}
