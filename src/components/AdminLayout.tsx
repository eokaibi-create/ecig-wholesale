'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const adminNavItems = [
  { href: '/admin/dashboard', label: '仪表盘', icon: '📊', roles: ['admin', 'superadmin', 'product'] },
  { href: '/admin/home', label: '首页内容', icon: '🏠', roles: ['admin', 'superadmin'] },
  { href: '/admin/hero', label: '新品管理', icon: '🆕', roles: ['admin', 'superadmin'] },
  { href: '/admin/products', label: '产品管理', icon: '📦', roles: ['admin', 'superadmin', 'product'] },
  { href: '/admin/categories', label: '分类管理', icon: '📁', roles: ['admin', 'superadmin', 'product'] },
  { href: '/admin/brands', label: '品牌管理', icon: '🏷️', roles: ['admin', 'superadmin', 'product'] },
  { href: '/admin/platforms', label: '平台管理', icon: '🤝', roles: ['admin', 'superadmin'] },
  { href: '/admin/videos', label: '视频管理', icon: '🎬', roles: ['admin', 'superadmin'] },
  { href: '/admin/sections', label: '区块标题', icon: '📑', roles: ['admin', 'superadmin'] },
  { href: '/admin/inquiries', label: '询价管理', icon: '📋', roles: ['admin', 'superadmin'] },
  { href: '/admin/orders', label: '订单管理', icon: '📑', roles: ['admin', 'superadmin'] },
  { href: '/admin/customers', label: '客户管理', icon: '👥', roles: ['admin', 'superadmin'] },
  { href: '/admin/admins', label: '管理员', icon: '👑', roles: ['admin', 'superadmin'] },
  { href: '/admin/settings', label: '系统设置', icon: '⚙️', roles: ['admin', 'superadmin'] },
]

function getRoleFromCookie() {
  if (typeof document === 'undefined') return 'admin'
  const match = document.cookie.match(/(?:^|;\s*)admin_role\s*=\s*([^;]*)/)
  return match ? match[1] : 'admin'
}

export default function AdminLayout({ children, active }: { children: React.ReactNode; active?: string }) {
  const [role, setRole] = useState('admin')

  useEffect(() => {
    setRole(getRoleFromCookie())
  }, [])

  const allowedNavItems = adminNavItems.filter(item => item.roles.includes(role))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左侧边栏 */}
      <aside className="w-60 bg-gray-900 text-white flex-shrink-0 overflow-y-auto hidden lg:block">
        <div className="p-4 border-b border-gray-700">
          <Link href={role === 'product' ? '/admin/products' : '/admin/dashboard'} className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-amber-400 text-lg">VAPOR-X</span>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">
            {role === 'product' ? '产品管理平台' : '批发管理平台'}
          </p>
        </div>
        <nav className="p-2 space-y-0.5">
          {allowedNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active === item.label 
                  ? 'bg-amber-500/20 text-amber-400 font-semibold' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700 mt-2">
          <Link href="/" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-white transition">
            <span>←</span>
            <span>返回前台</span>
          </Link>
        </div>
      </aside>

      {/* 移动端导航 */}
      <nav className="lg:hidden bg-gray-900 text-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 h-12">
          <Link href={role === 'product' ? '/admin/products' : '/admin/dashboard'} className="font-bold text-amber-400">VAPOR-X 后台</Link>
          <div className="flex space-x-3 overflow-x-auto no-scrollbar">
            {allowedNavItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs whitespace-nowrap px-2 py-1 rounded ${
                  active === item.label ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-12">
        {children}
      </main>
    </div>
  )
}
