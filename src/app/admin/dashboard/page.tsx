import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'
import { cookies } from 'next/headers'

function getRole(): string {
  try {
    const cookieStore = cookies()
    const roleCookie = cookieStore.get('admin_role')
    return roleCookie?.value || 'admin'
  } catch {
    return 'admin'
  }
}

export default async function AdminDashboard() {
  const role = getRole()

  // 产品管理员 - 专属精简仪表盘
  if (role === 'product') {
    const [productCount, lowStockCount, categoryCount, brandCount, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 50 } } }),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, name: true, slug: true, image: true,
          price: true, stock: true, published: true, hot: true,
          createdAt: true, brand: true,
        }
      }),
    ])

    const publishedCount = await prisma.product.count({ where: { published: true } })
    const featuredCount = await prisma.product.count({ where: { featured: true } })

    return (
      <AdminLayout active="仪表盘">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 产品仪表盘</h1>
              <p className="text-sm text-gray-500 mt-1">产品管理数据概览</p>
            </div>
            <div className="flex items-center gap-2">
              {lowStockCount > 0 && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
                  <span>⚠️</span> {lowStockCount} 个产品库存不足
                </span>
              )}
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: '产品总数', value: productCount, sub: `已发布 ${publishedCount}`, color: 'from-blue-500 to-blue-600', icon: '📦', href: '/admin/products' },
              { label: '分类', value: categoryCount, color: 'from-green-500 to-green-600', icon: '📁', href: '/admin/categories' },
              { label: '品牌', value: brandCount, color: 'from-violet-500 to-violet-600', icon: '🏷️', href: '/admin/brands' },
              { label: '精选', value: featuredCount, color: 'from-amber-500 to-orange-600', icon: '⭐', href: '/admin/products?featured=true' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all">
                <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-lg mb-3`}>{item.icon}</div>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition">{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                {item.sub && <p className="text-[10px] text-amber-600 mt-0.5">{item.sub}</p>}
              </Link>
            ))}
          </div>

          {/* 最近产品 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">最近添加的产品</h2>
              <Link href="/admin/products" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
            </div>
            {recentProducts.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-gray-400 text-sm">暂无产品，去添加第一个产品吧</p>
                <Link href="/admin/products/new" className="mt-3 inline-block px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600">添加产品</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {recentProducts.map((p) => (
                  <Link key={p.id} href={`/admin/products/edit/${p.id}`} className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition border border-gray-100 hover:border-amber-300">
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {p.hot && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">HOT</span>}
                        {!p.published && <span className="text-[10px] bg-gray-500 text-white px-1.5 py-0.5 rounded">草稿</span>}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-gray-900 text-sm truncate group-hover:text-amber-600 transition">{p.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-amber-600">${p.price.toFixed(2)}</span>
                        <span className={`text-[10px] ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {p.stock > 0 ? `${p.stock} 件` : '缺货'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 快捷操作 */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: '/admin/products/new', label: '新增产品', icon: '➕', desc: '添加新产品到商城' },
                { href: '/admin/categories', label: '分类管理', icon: '📁', desc: '管理产品分类' },
                { href: '/admin/brands', label: '品牌管理', icon: '🏷️', desc: '管理产品品牌' },
                { href: '/admin/products', label: '全部产品', icon: '📦', desc: '查看和编辑产品' },
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

  // ========== 超级管理员完整仪表盘 ==========
  const [
    productCount, categoryCount, customerCount, inquiryCount,
    orderCount, brandCount, videoCount, platformCount,
    featuredCount, lowStockCount, newInquiryCount,
    recentInquiries, categoryStats, recentCustomers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.customer.count(),
    prisma.inquiry.count(),
    prisma.order.count(),
    prisma.brand.count(),
    prisma.video.count(),
    prisma.platform.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.count({ where: { stock: { lte: 50 } } }),
    prisma.inquiry.count({ where: { status: 'new' } }),
    prisma.inquiry.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const statCards = [
    { label: '产品总数', value: productCount, sub: `精选 ${featuredCount}`, color: 'from-blue-500 to-blue-600', icon: '📦', href: '/admin/products' },
    { label: '分类', value: categoryCount, color: 'from-green-500 to-green-600', icon: '📁', href: '/admin/categories' },
    { label: '品牌', value: brandCount, color: 'from-violet-500 to-violet-600', icon: '🏷️', href: '/admin/brands' },
    { label: '客户数', value: customerCount, color: 'from-purple-500 to-purple-600', icon: '👥', href: '/admin/users' },
    { label: '询价单', value: inquiryCount, sub: `新询价 ${newInquiryCount}`, color: 'from-amber-500 to-orange-600', icon: '📋', href: '/admin/inquiries' },
    { label: '订单数', value: orderCount, color: 'from-rose-500 to-rose-600', icon: '📑', href: '/admin/orders' },
    { label: '视频', value: videoCount, color: 'from-cyan-500 to-cyan-600', icon: '🎬', href: '/admin/videos' },
    { label: '平台', value: platformCount, color: 'from-indigo-500 to-indigo-600', icon: '🔗', href: '/admin/platforms' },
  ]

  return (
    <AdminLayout active="仪表盘">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
            <p className="text-sm text-gray-500 mt-1">VAPOR-X 批发管理平台概览</p>
          </div>
          <div className="flex items-center gap-2">
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
                <span>⚠️</span> {lowStockCount} 个产品库存不足
              </span>
            )}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {statCards.map((item, i) => (
            <Link key={i} href={item.href} className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all">
              <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-lg mb-3`}>{item.icon}</div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition">{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              {item.sub && <p className="text-[10px] text-amber-600 mt-0.5">{item.sub}</p>}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 产品分类分布 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">产品分类分布</h2>
            {categoryStats.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📁</div>
                <p className="text-gray-400 text-sm">暂无分类</p>
              </div>
            ) : categoryStats.map((cat) => {
              const max = Math.max(...categoryStats.map(c => c._count.products), 1)
              const pct = (cat._count.products / max) * 100
              return (
                <div key={cat.id} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-gray-500 font-medium">{cat._count.products}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 最新询价 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">最新询价</h2>
              <Link href="/admin/inquiries" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
            </div>
            {recentInquiries.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-400 text-sm">暂无询价</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{inq.customer?.name || '未知'}</p>
                      <p className="text-xs text-gray-500 truncate">{inq.subject || '一般询价'}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {inq.status === 'new' ? '新' : inq.status === 'contacted' ? '已联系' : '已完成'}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(inq.createdAt).toLocaleDateString('zh-CN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 最新客户 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">最新客户</h2>
              <Link href="/admin/users" className="text-xs text-amber-600 hover:text-amber-700">查看全部 →</Link>
            </div>
            {recentCustomers.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-gray-400 text-sm">暂无客户</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCustomers.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{c.name}</p>
                        <p className="text-xs text-gray-500 truncate">{c.company || c.email}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      {c.approved
                        ? <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">已批准</span>
                        : <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">待审批</span>
                      }
                      <p className="text-[10px] text-gray-400 mt-0.5">{c.state || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { href: '/admin/home', label: '首页内容', icon: '🏠' },
              { href: '/admin/products/new', label: '新增产品', icon: '➕' },
              { href: '/admin/brands', label: '品牌管理', icon: '🏷️' },
              { href: '/admin/videos', label: '视频管理', icon: '🎬' },
              { href: '/admin/platforms', label: '平台管理', icon: '🔗' },
              { href: '/admin/inquiries', label: '询价管理', icon: '📋' },
              { href: '/admin/orders', label: '订单管理', icon: '📑' },
              { href: '/admin/admins', label: '管理员', icon: '👑' },
            ].map((item, i) => (
              <Link key={i} href={item.href}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-amber-50 hover:border-amber-300 border border-gray-100 transition-all group">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-amber-600">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
