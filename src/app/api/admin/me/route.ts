import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  
  if (!token) {
    return NextResponse.json({ role: null }, { status: 401 })
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length < 5) {
      throw new Error('Invalid token')
    }

    const userType = parts[0] // 'admin' or 'user'
    const userId = parts[1]
    const username = parts[2]
    const role = parts[3]

    // 统一角色名
    const normalizedRole = role === 'product_admin' ? 'product' 
      : role === 'super_admin' ? 'admin' 
      : role

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
