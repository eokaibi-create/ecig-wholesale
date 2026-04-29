'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// 角色层级：superadmin > admin > brand
// superadmin: 完全访问 + 管理员管理
// admin: 所有页面可访问（除管理员管理）
// brand: 仅产品管理 + 品牌管理

interface NavItem {
  href: string
  label: string
  icon: string
  roles: string[]
}

const adminNavItems: NavItem[] = [
  { href: '/admin/dashboard', label: '仪表盘', icon: '📊', roles: ['superadmin', 'admin', 'brand'] },
  { href: '/admin/home', label: '首页内容', icon: '🏠', roles: ['superadmin', 'admin'] },
  { href: '/admin/products', label: '产品管理', icon: '📦', roles: ['superadmin', 'admin', 'brand'] },
  { href: '/admin/brands', label: '品牌管理', icon: '🏷️', roles: ['superadmin', 'admin', 'brand'] },
  { href: '/admin/platforms', label: '平台管理', icon: '🤝', roles: ['superadmin', 'admin'] },
  { href: '/admin/videos', label: 'Youtube 视频', icon: '📺', roles: ['superadmin', 'admin'] },
  { href: '/admin/orders', label: '订单管理', icon: '📑', roles: ['superadmin', 'admin'] },
  { href: '/admin/customers', label: '客户管理', icon: '👥', roles: ['superadmin', 'admin'] },
  { href: '/admin/admins', label: '管理员', icon: '👑', roles: ['superadmin'] },
  { href: '/admin/settings', label: '系统设置', icon: '⚙️', roles: ['superadmin', 'admin'] },
]

function getRoleFromCookie() {
  if (typeof document === 'undefined') return 'admin'
  const match = document.cookie.match(/(?:^|;\s*)admin_role\s*=\s*([^;]*)/)
  const role = match ? match[1] : 'admin'
  if (role === 'product_admin' || role === 'product') return 'brand'
  if (role === 'super_admin') return 'superadmin'
  return role
}

const roleLabels: Record<string, string> = {
  superadmin: '超级管理员',
  admin: '管理员',
  brand: '品牌方',
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
          <Link href={role === 'brand' ? '/admin/products' : '/admin/dashboard'} className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-amber-400 text-lg">VAPOR-X</span>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">
            {role === 'brand' ? '品牌方工作台' : '批发管理平台'}
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
        <div className="p-3 border-t border-gray-700 mt-2 space-y-1">
          <div className="px-3 py-1.5 text-xs text-gray-600">
            当前角色：{roleLabels[role] || role}
          </div>
          <Link href="/admin/change-password" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition">
            <span>🔑</span>
            <span>修改密码</span>
          </Link>
          <Link href="/" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition">
            <span>←</span>
            <span>返回前台</span>
          </Link>
          <button onClick={() => { document.cookie = 'admin_token=;path=/;max-age=0'; document.cookie = 'admin_role=;path=/;max-age=0'; window.location.href = '/admin/login'; }} className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition w-full text-left">
            <span>🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 移动端导航 */}
      <nav className="lg:hidden bg-gray-900 text-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 h-12">
          <Link href={role === 'brand' ? '/admin/products' : '/admin/dashboard'} className="font-bold text-amber-400">VAPOR-X 后台</Link>
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
