import { NextRequest, NextResponse } from 'next/server'

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://okaibiglobal.com'

// Public routes that don't require authentication
const publicRoutes = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
]

// 品牌方允许的路由前缀
const brandAllowedRoutes = [
  '/admin/login',
  '/admin/dashboard',
  '/admin/home',
  '/admin/products',
  '/admin/brands',
  '/admin/change-password',
]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const { pathname } = request.nextUrl

  // 公开页面放行
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
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

    const role = parts[3]

    // 统一角色名（兼容数据库旧数据）
    const normalizedRole = role === 'product_admin' ? 'brand'
      : role === 'product' ? 'brand'
      : role === 'super_admin' ? 'superadmin'
      : role

    // superadmin 和 admin 可访问所有后台页面
    const fullAccessRoles = ['superadmin', 'admin']

    if (fullAccessRoles.includes(normalizedRole)) {
      return NextResponse.next()
    }

    // 品牌方 - 只能访问产品和仪表盘等有限页面
    if (normalizedRole === 'brand') {
      if (pathname === '/admin') {
        return NextResponse.next()
      }
      const allowed = brandAllowedRoutes.some(prefix => 
        pathname === prefix || pathname.startsWith(prefix + '/')
      )
      if (allowed) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/admin/products', request.url))
    }

    // 未知角色 - 重定向到登录
    return NextResponse.redirect(new URL('/admin/login', request.url))
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: '/admin/:path*',
}
