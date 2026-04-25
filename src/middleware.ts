import { NextRequest, NextResponse } from 'next/server'

// 产品管理员允许的路由前缀
const productAdminAllowed = [
  '/admin/login',
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/brands',
]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const { pathname } = request.nextUrl

  // 登录页公开
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length < 5) {
      throw new Error('Invalid token')
    }

    const role = parts[3] // type:id:username:role:timestamp

    // 超级管理员 - 全部放行
    if (role === 'admin' || role === 'superadmin') {
      return NextResponse.next()
    }

    // 产品管理员 - 只能访问产品和仪表盘
    if (role === 'product') {
      const allowed = productAdminAllowed.some(prefix => 
        pathname === prefix || pathname.startsWith(prefix + '/')
      )
      if (allowed) {
        return NextResponse.next()
      }
      // 重定向到产品管理
      return NextResponse.redirect(new URL('/admin/products', request.url))
    }

    // 未知角色
    return NextResponse.redirect(new URL('/admin/login', request.url))
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: '/admin/:path*',
}
