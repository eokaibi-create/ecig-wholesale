'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export default function AdminContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setMessage('✅ 保存成功！')
        // Refresh settings
        const data = await fetch('/api/settings').then(r => r.json())
        setSettings(data)
      } else {
        setMessage('❌ 保存失败')
      }
    } catch (err) {
      setMessage('❌ 保存失败')
    }
    setSaving(false)
  }

  return (
    <AdminLayout active="首页内容">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📞 联系我们管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理首页"联系我们"区域的联系方式</p>
          </div>
          <Link href="/admin/home" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition">
            ← 返回首页内容
          </Link>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 核心联系方式 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📱 核心联系方式</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp 号码</label>
                <input type="text" name="whatsapp" defaultValue={settings.whatsapp || '+13239260829'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="+13239260829" />
                <p className="text-xs text-gray-400 mt-1">首页点击"联系我们"和产品详情页的 WhatsApp 链接</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email 邮箱</label>
                <input type="text" name="email" defaultValue={settings.email || 'EOKAIBI@GMAIL.COM'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input type="text" name="phone" defaultValue={settings.phone || '+1 (323) 926-0829'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">微信</label>
                <input type="text" name="wechat" defaultValue={settings.wechat || 'EA_YONG'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">公司地址</label>
                <input type="text" name="address" defaultValue={settings.address || 'Los Angeles, CA'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
          </div>

          {/* 网站信息 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🌐 网站信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
                <input type="text" name="site_name" defaultValue={settings.site_name || 'VAPOR-X USA'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
                <input type="text" name="site_description" defaultValue={settings.site_description || '美国电子烟批发供应商'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最低起订量 ($)</label>
                <input type="text" name="min_order" defaultValue={settings.min_order || '500'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input type="text" name="site_logo" defaultValue={settings.site_logo || '/vaporx-logo.svg'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-bold rounded-lg transition">
            {saving ? '⏳ 保存中...' : '💾 保存所有设置'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
