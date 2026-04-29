import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export default async function AdminHomePage() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <AdminLayout active="首页内容">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">首页内容管理</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hero 管理 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🎯 Hero 区域</h2>
            <form action="/api/settings" method="POST" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  name="hero_logo"
                  defaultValue={map.hero_logo || '/vaporx-logo.svg'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">主标题</label>
                <input
                  type="text"
                  name="hero_title"
                  defaultValue={map.hero_title || '美国电子烟批发首选'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                <input
                  type="text"
                  name="hero_subtitle"
                  defaultValue={map.hero_subtitle || 'VAPOR-X — 全美发货 · 批发价直供 · 支持海外直邮'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg"
              >
                保存 Hero
              </button>
            </form>
          </div>

          {/* 联系方式管理 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📞 联系方式</h2>
            <form action="/api/settings" method="POST" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  defaultValue={map.whatsapp || '+15559876543'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  name="email"
                  defaultValue={map.email || 'eokaibi@gmail.com'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={map.phone || '+1 (555) 987-6543'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={map.address || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WeChat</label>
                <input
                  type="text"
                  name="wechat"
                  defaultValue={map.wechat || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">网站名称 (site_name)</label>
                <input
                  type="text"
                  name="site_name"
                  defaultValue={map.site_name || 'VAPOR-X USA'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最低起订量 (min_order)</label>
                <input
                  type="text"
                  name="min_order"
                  defaultValue={map.min_order || '500'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg"
              >
                保存联系方式
              </button>
            </form>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/brands"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-amber-300 transition"
          >
            <div className="text-3xl mb-2">🏷️</div>
            <h3 className="font-bold text-gray-900">品牌管理</h3>
            <p className="text-sm text-gray-500 mt-1">管理合作品牌 Logo 和名称</p>
          </Link>
          <Link
            href="/admin/videos"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-amber-300 transition"
          >
            <div className="text-3xl mb-2">🎬</div>
            <h3 className="font-bold text-gray-900">视频管理</h3>
            <p className="text-sm text-gray-500 mt-1">管理首页展示的视频</p>
          </Link>
          <Link
            href="/admin/platforms"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-amber-300 transition"
          >
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-bold text-gray-900">平台/优势管理</h3>
            <p className="text-sm text-gray-500 mt-1">管理合作平台和优势展示</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
