import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json()
    const loginName = username || email

    if (!loginName || !password) {
      return NextResponse.json({ error: 'Please enter username/email and password' }, { status: 400 })
    }

    // 先查 User 表（旧）
    let user: any = null
    try {
      user = await prisma.user.findFirst({
        where: { OR: [{ username: loginName }, { username: loginName.toLowerCase() }] }
      })
    } catch {}

    if (user) {
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
      
      // Token 格式: user:id:username:role:timestamp
      const token = Buffer.from(`user:${user.id}:${user.username}:${user.role || 'admin'}:${Date.now()}`).toString('base64')
      
      const response = NextResponse.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role || 'admin' } })
      response.cookies.set('admin_token', token, { httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax' })
      response.cookies.set('admin_role', user.role || 'admin', { httpOnly: false, path: '/', maxAge: 86400, sameSite: 'lax' })
      return response
    }

    // 再查 Admin 表（新）
    const admin = await prisma.admin.findFirst({
      where: { OR: [{ username: loginName }, { email: loginName }] }
    })

    if (!admin) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })

    // 统一角色名（兼容旧数据）
    const normalizedRole = admin.role === 'product_admin' ? 'product' : admin.role === 'super_admin' ? 'admin' : admin.role

    // Token 格式: admin:id:username:role:timestamp
    const token = Buffer.from(`admin:${admin.id}:${admin.username}:${normalizedRole}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({ success: true, token, user: { id: admin.id, username: admin.username, role: normalizedRole, email: admin.email } })
    response.cookies.set('admin_token', token, { httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax' })
    response.cookies.set('admin_role', normalizedRole, { httpOnly: false, path: '/', maxAge: 86400, sameSite: 'lax' })
    return response
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Server error, please try again' }, { status: 500 })
  }
}
