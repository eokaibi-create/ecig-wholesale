import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { signToken, normalizeRole } from '@/lib/auth'

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
      
      const rawRole = user.role || 'admin'
      const normalizedRole = normalizeRole(rawRole)

      const payload = { type: 'user' as const, id: user.id, username: user.username, role: normalizedRole }
      const token = await signToken(payload)
      
      const response = NextResponse.json({ success: true, token, user: { id: user.id, username: user.username, role: normalizedRole } })
      response.cookies.set('admin_token', token, { httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax' })
      response.cookies.set('admin_role', normalizedRole, { httpOnly: false, path: '/', maxAge: 86400, sameSite: 'lax' })
      return response
    }

    // 再查 Admin 表（新）
    const admin = await prisma.admin.findFirst({
      where: { OR: [{ username: loginName }, { email: loginName }] }
    })

    if (!admin) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })

    const rawRole = admin.role || 'admin'
    const normalizedRole = normalizeRole(rawRole)

    const payload = { type: 'admin' as const, id: admin.id, username: admin.username, role: normalizedRole }
    const token = await signToken(payload)

    const response = NextResponse.json({ success: true, token, user: { id: admin.id, username: admin.username, role: normalizedRole, email: admin.email } })
    response.cookies.set('admin_token', token, { httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax' })
    response.cookies.set('admin_role', normalizedRole, { httpOnly: false, path: '/', maxAge: 86400, sameSite: 'lax' })
    return response
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Server error, please try again' }, { status: 500 })
  }
}
