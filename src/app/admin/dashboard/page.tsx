'use client'

import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useEffect, useState } from 'react'

export default function AdminDashboardPage() {
 const [role, setRole] = useState<string | null>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 fetch('/api/admin/me')
 .then(res => res.json())
 .then(data => {
 setRole(data.role || 'admin')
 setLoading(false)
 })
 .catch(() => {
 setRole('admin')
 setLoading(false)
 })
 }, [])

 if (loading) {
 return (
 <AdminLayout active="仪表盘">
 <div className="flex items-center justify-center h-64">
 <div className="text-gray-400 animate-pulse">加载中...</div>
 </div>
 </AdminLayout>
 )
 }

 if (role === 'superadmin') return <SuperAdminDashboard />
 if (role === 'brand') return <BrandDashboard />
 return <AdminDashboard />
}

// ==================== 超级管理员工作台 ====================
function SuperAdminDashboard() {
 const [data, setData] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 Promise.all([
 fetch('/api/admin/dashboard-stats').then(r => r.json()),
 fetch('/api/admin/me').then(r => r.json()),
 ]).then(([stats, me]) => {
 setData({ ...stats, role: me.role })
 setLoading(false)
 }).catch(() => setLoading(false))
 }, [])

 if (loading) {
 return (
 <AdminLayout active="仪表盘">
 <div className="flex items-center justify-center h-64">
 <div className="text-gray-400 animate-pulse">加载中...</div>
 </div>
 </AdminLayout>
 )
 }

 const s = data || {}

 return (
 <AdminLayout active="仪表盘">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* 页头 */}
 <div className="flex items-center justify-between mb-8">
 <div>
 <div className="flex items-center gap-3">
 <h1 className="text-2xl font-bold text-gray-900"> 超级管理员工作台</h1>
 <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">superadmin</span>
 </div>
 <p className="text-sm text-gray-500 mt-1">全局数据总览 · 全平台管理权限</p>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-xs text-gray-400">管理员:</span>
 <span className="text-sm font-medium text-gray-900">{s.adminCount ?? '-'} 人</span>
 </div>
 </div>

 {/* 统计卡片 — 8项全展示 */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
 {[
 { label: '产品总数', value: s.productCount, sub: `精选 ${s.featuredCount || 0}`, color: 'from-blue-500 to-blue-600', icon: '', href: '/admin/products' },
 { label: '分类', value: s.categoryCount, color: 'from-green-500 to-green-600', icon: '', href: '/admin/categories' },
 { label: '品牌', value: s.brandCount, color: 'from-violet-500 to-violet-600', icon: '', href: '/admin/brands' },
 { label: '客户数', value: s.customerCount, color: 'from-purple-500 to-purple-600', icon: '', href: '/admin/customers' },
 { label: '询价单', value: s.inquiryCount, sub: `新询价 ${s.newInquiryCount || 0}`, color: 'from-amber-500 to-orange-600', icon: '', href: '/admin/orders' },
 { label: '订单数', value: s.orderCount, color: 'from-rose-500 to-rose-600', icon: '', href: '/admin/orders' },
 { label: '视频', value: s.videoCount, color: 'from-cyan-500 to-cyan-600', icon: '', href: '/admin/videos' },
 { label: '平台', value: s.platformCount, color: 'from-indigo-500 to-indigo-600', icon: '', href: '/admin/platforms' },
 ].map((item, i) => (
 <Link key={i} href={item.href} className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all">
 <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-lg mb-3`}>{item.icon}</div>
 <p className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition">{item.value ?? '-'}</p>
 <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
 {item.sub && <p className="text-[10px] text-amber-600 mt-0.5">{item.sub}</p>}
 </Link>
 ))}
 </div>

 {/* 双栏布局 */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
 {/* 分类统计 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-lg font-bold text-gray-900 mb-4"> 分类产品分布</h2>
 {s.categoryStats && s.categoryStats.length > 0 ? (
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 {s.categoryStats.map((cat: any, i: number) => (
 <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
 <p className="text-lg font-bold text-gray-900">{cat._count?.products ?? 0}</p>
 <p className="text-xs text-gray-500 truncate">{cat.name}</p>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-400 text-sm text-center py-6">暂无分类数据</p>
 )}
 </div>

 {/* 最新询价 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-gray-900"> 最新询价</h2>
 <Link href="/admin/orders" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
 </div>
 {s.recentInquiries && s.recentInquiries.length > 0 ? (
 <div className="space-y-2">
 {s.recentInquiries.slice(0, 5).map((inq: any, i: number) => (
 <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
 <div>
 <p className="text-sm font-medium text-gray-900">{inq.customer?.name || inq.name || '匿名'}</p>
 <p className="text-xs text-gray-400">{inq.productName || inq.message?.slice(0, 50)}</p>
 </div>
 <span className={`text-[10px] px-2 py-0.5 rounded ${
 inq.status === 'new' ? 'bg-amber-100 text-amber-700' :
 inq.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
 }`}>
 {inq.status === 'new' ? '新询价' : inq.status === 'replied' ? '已回复' : '已关闭'}
 </span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-400 text-sm text-center py-6">暂无询价</p>
 )}
 </div>
 </div>

 {/* 最新注册客户 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-gray-900"> 最新注册客户</h2>
 <Link href="/admin/customers" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
 </div>
 {s.recentCustomers && s.recentCustomers.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
 {s.recentCustomers.slice(0, 6).map((c: any, i: number) => (
 <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
 <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-sm font-bold text-amber-800">
 {(c.name || c.email || '?')[0].toUpperCase()}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-gray-900 truncate">{c.name || '未命名'}</p>
 <p className="text-xs text-gray-400 truncate">{c.email || c.company || '-'}</p>
 </div>
 <span className={`text-[10px] px-1.5 py-0.5 rounded ${
 c.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
 }`}>
 {c.approved ? '已审核' : '待审核'}
 </span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-400 text-sm text-center py-6">暂无注册客户</p>
 )}
 </div>

 {/* 快捷操作 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-lg font-bold text-gray-900 mb-4"> 快捷操作</h2>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {[
 { href: '/admin/products/new', label: '新增产品', icon: '' },
 { href: '/admin/admins', label: '管理员管理', icon: '' },
 { href: '/admin/settings', label: '系统设置', icon: '' },
 { href: '/admin/orders', label: '订单管理', icon: '' },
 ].map((item, i) => (
 <Link key={i} href={item.href}
 className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-amber-50 hover:border-amber-300 border border-gray-100 transition group">
 <span className="text-2xl mb-2">{item.icon}</span>
 <span className="text-sm font-medium text-gray-900 group-hover:text-amber-600">{item.label}</span>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </AdminLayout>
 )
}

// ==================== 管理员工作台 ====================
function AdminDashboard() {
 const [data, setData] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 fetch('/api/admin/dashboard-stats')
 .then(res => res.json())
 .then(d => { setData(d); setLoading(false) })
 .catch(() => setLoading(false))
 }, [])

 if (loading) {
 return (
 <AdminLayout active="仪表盘">
 <div className="flex items-center justify-center h-64">
 <div className="text-gray-400 animate-pulse">加载中...</div>
 </div>
 </AdminLayout>
 )
 }

 const s = data || {}

 return (
 <AdminLayout active="仪表盘">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* 页头 */}
 <div className="flex items-center justify-between mb-8">
 <div>
 <div className="flex items-center gap-3">
 <h1 className="text-2xl font-bold text-gray-900"> 管理工作台</h1>
 <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">admin</span>
 </div>
 <p className="text-sm text-gray-500 mt-1">日常运营管理 · 订单与客户服务</p>
 </div>
 {s.newInquiryCount > 0 && (
 <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-full border border-amber-200">
 {s.newInquiryCount} 条新询价
 </span>
 )}
 </div>

 {/* 统计卡片 — 核心6项 */}
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
 {[
 { label: '产品总数', value: s.productCount, sub: `已发布 ${s.publishedCount || 0}`, color: 'from-blue-500 to-blue-600', icon: '', href: '/admin/products' },
 { label: '客户数', value: s.customerCount, sub: `待审核 ${s.pendingCustomerCount || 0}`, color: 'from-purple-500 to-purple-600', icon: '', href: '/admin/customers' },
 { label: '询价单', value: s.inquiryCount, sub: `新询价 ${s.newInquiryCount || 0}`, color: 'from-amber-500 to-orange-600', icon: '', href: '/admin/orders' },
 { label: '订单数', value: s.orderCount, color: 'from-rose-500 to-rose-600', icon: '', href: '/admin/orders' },
 { label: '品牌', value: s.brandCount, color: 'from-violet-500 to-violet-600', icon: '', href: '/admin/brands' },
 { label: '分类', value: s.categoryCount, color: 'from-green-500 to-green-600', icon: '', href: '/admin/categories' },
 ].map((item, i) => (
 <Link key={i} href={item.href} className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all">
 <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-lg mb-3`}>{item.icon}</div>
 <p className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition">{item.value ?? '-'}</p>
 <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
 {item.sub && <p className="text-[10px] text-amber-600 mt-0.5">{item.sub}</p>}
 </Link>
 ))}
 </div>

 {/* 双栏：最新询价 + 最新客户 */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
 {/* 最新询价 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-gray-900"> 最新询价</h2>
 <Link href="/admin/orders" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
 </div>
 {s.recentInquiries && s.recentInquiries.length > 0 ? (
 <div className="space-y-2">
 {s.recentInquiries.slice(0, 5).map((inq: any, i: number) => (
 <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
 <div>
 <p className="text-sm font-medium text-gray-900">{inq.customer?.name || inq.name || '匿名'}</p>
 <p className="text-xs text-gray-400">{inq.productName || inq.message?.slice(0, 50)}</p>
 </div>
 <span className={`text-[10px] px-2 py-0.5 rounded ${
 inq.status === 'new' ? 'bg-amber-100 text-amber-700' :
 inq.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
 }`}>
 {inq.status === 'new' ? '新询价' : inq.status === 'replied' ? '已回复' : '已关闭'}
 </span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-400 text-sm text-center py-6">暂无询价</p>
 )}
 </div>

 {/* 最新客户 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-gray-900"> 最新客户</h2>
 <Link href="/admin/customers" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
 </div>
 {s.recentCustomers && s.recentCustomers.length > 0 ? (
 <div className="space-y-2">
 {s.recentCustomers.slice(0, 5).map((c: any, i: number) => (
 <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
 <div className="flex items-center space-x-3">
 <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-sm font-bold text-amber-800 shrink-0">
 {(c.name || c.email || '?')[0].toUpperCase()}
 </div>
 <div>
 <p className="text-sm font-medium text-gray-900">{c.name || '未命名'}</p>
 <p className="text-xs text-gray-400">{c.email || c.company || '-'}</p>
 </div>
 </div>
 <span className={`text-[10px] px-1.5 py-0.5 rounded ${
 c.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
 }`}>
 {c.approved ? '已审核' : '待审核'}
 </span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-400 text-sm text-center py-6">暂无客户</p>
 )}
 </div>
 </div>

 {/* 快捷操作 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-lg font-bold text-gray-900 mb-4"> 快捷操作</h2>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {[
 { href: '/admin/products', label: '产品管理', icon: '' },
 { href: '/admin/customers', label: '客户审核', icon: '' },
 { href: '/admin/orders', label: '处理询价', icon: '' },
 { href: '/admin/products/new', label: '新增产品', icon: '' },
 ].map((item, i) => (
 <Link key={i} href={item.href}
 className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-amber-50 hover:border-amber-300 border border-gray-100 transition group">
 <span className="text-2xl mb-2">{item.icon}</span>
 <span className="text-sm font-medium text-gray-900 group-hover:text-amber-600">{item.label}</span>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </AdminLayout>
 )
}

// ==================== 品牌方工作台 ====================
function BrandDashboard() {
 const [data, setData] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 fetch('/api/admin/dashboard-stats')
 .then(res => res.json())
 .then(d => { setData(d); setLoading(false) })
 .catch(() => setLoading(false))
 }, [])

 if (loading) {
 return (
 <AdminLayout active="仪表盘">
 <div className="flex items-center justify-center h-64">
 <div className="text-gray-400 animate-pulse">加载中...</div>
 </div>
 </AdminLayout>
 )
 }

 const stats = data || { productCount:0, publishedCount:0, categoryCount:0, brandCount:0, featuredCount:0, lowStockCount:0, recentProducts:[] }

 return (
 <AdminLayout active="仪表盘">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* 页头 */}
 <div className="flex items-center justify-between mb-8">
 <div>
 <div className="flex items-center gap-3">
 <h1 className="text-2xl font-bold text-gray-900"> 品牌方工作台</h1>
 <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">product</span>
 </div>
 <p className="text-sm text-gray-500 mt-1">产品数据管理 · 品牌与分类维护</p>
 </div>
 {stats.lowStockCount > 0 && (
 <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
 {stats.lowStockCount} 个产品库存不足
 </span>
 )}
 </div>

 {/* 统计卡片 — 产品相关4项 */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
 {[
 { label: '产品总数', value: stats.productCount, sub: `已发布 ${stats.publishedCount}`, color: 'from-blue-500 to-blue-600', icon: '', href: '/admin/products' },
 { label: '分类', value: stats.categoryCount, color: 'from-green-500 to-green-600', icon: '', href: '/admin/categories' },
 { label: '品牌', value: stats.brandCount, color: 'from-violet-500 to-violet-600', icon: '', href: '/admin/brands' },
 { label: '精选', value: stats.featuredCount, color: 'from-amber-500 to-orange-600', icon: '', href: '/admin/products' },
 ].map((item, i) => (
 <Link key={i} href={item.href} className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all">
 <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-lg mb-3`}>{item.icon}</div>
 <p className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition">{item.value ?? '-'}</p>
 <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
 {item.sub && <p className="text-[10px] text-amber-600 mt-0.5">{item.sub}</p>}
 </Link>
 ))}
 </div>

 {/* 最近产品 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-gray-900"> 最近添加的产品</h2>
 <Link href="/admin/products" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
 </div>
 {stats.recentProducts && stats.recentProducts.length > 0 ? (
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
 {stats.recentProducts.slice(0, 10).map((p: any) => (
 <Link key={p.id} href={`/admin/products/${p.id}`} className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition border border-gray-100 hover:border-amber-300">
 <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
 {p.image ? (
 <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
 ) : (
 )}
 <div className="absolute top-2 right-2 flex gap-1">
 {p.hot && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">HOT</span>}
 {!p.published && <span className="text-[10px] bg-gray-500 text-white px-1.5 py-0.5 rounded">草稿</span>}
 </div>
 </div>
 <div className="p-3">
 <p className="font-medium text-gray-900 text-sm truncate group-hover:text-amber-600 transition">{p.name}</p>
 <div className="flex items-center justify-between mt-1">
 <span className="text-sm font-bold text-amber-600">${p.price?.toFixed(2)}</span>
 <span className={`text-[10px] ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
 {p.stock > 0 ? `${p.stock} 件` : '缺货'}
 </span>
 </div>
 </div>
 </Link>
 ))}
 </div>
 ) : (
 <div className="text-center py-10">
 <p className="text-gray-400 text-sm">暂无产品，去添加第一个产品吧</p>
 <Link href="/admin/products/new" className="mt-3 inline-block px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600">添加产品</Link>
 </div>
 )}
 </div>

 {/* 分类统计 */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-lg font-bold text-gray-900 mb-4"> 分类产品分布</h2>
 {data?.categoryStats && data.categoryStats.length > 0 ? (
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 {data.categoryStats.map((cat: any, i: number) => (
 <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
 <p className="text-lg font-bold text-gray-900">{cat._count?.products ?? 0}</p>
 <p className="text-xs text-gray-500 truncate">{cat.name}</p>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-400 text-sm text-center py-6">暂无分类数据</p>
 )}
 </div>

 {/* 库存概况 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-lg font-bold text-gray-900 mb-4"> 库存概况</h2>
 <div className="space-y-3">
 <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
 <span className="text-sm text-green-800">正常库存</span>
 <span className="font-bold text-green-800">{Math.max(0, (stats.productCount || 0) - (stats.lowStockCount || 0))} 个</span>
 </div>
 <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
 <span className="text-sm text-red-800">库存不足</span>
 <span className="font-bold text-red-800">{stats.lowStockCount || 0} 个</span>
 </div>
 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
 <span className="text-sm text-gray-800">上架产品</span>
 <span className="font-bold text-gray-800">{stats.publishedCount || 0} 个</span>
 </div>
 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
 <span className="text-sm text-gray-800">草稿产品</span>
 <span className="font-bold text-gray-800">{(stats.productCount || 0) - (stats.publishedCount || 0)} 个</span>
 </div>
 </div>
 </div>
 </div>

 {/* 快捷操作 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-lg font-bold text-gray-900 mb-4"> 快捷操作</h2>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {[
 { href: '/admin/products/new', label: '新增产品', icon: '', desc: '添加新产品到商城' },
 { href: '/admin/products', label: '编辑产品', icon: '', desc: '修改现有产品' },
 { href: '/admin/brands', label: '品牌管理', icon: '', desc: '管理产品品牌' },
 { href: '/admin/products', label: '全部产品', icon: '', desc: '查看所有产品' },
 ].map((item, i) => (
 <Link key={i} href={item.href}
 className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-amber-50 hover:border-amber-300 border border-gray-100 transition group">
 <span className="text-2xl mb-2">{item.icon}</span>
 <span className="text-sm font-medium text-gray-900 group-hover:text-amber-600">{item.label}</span>
 <span className="text-xs text-gray-400 mt-0.5">{item.desc}</span>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </AdminLayout>
 )
}
