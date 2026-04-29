'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export default function AdminContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const getVis = (key: string) => settings[key] !== 'false'

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
        const data = await fetch('/api/settings').then(r => r.json())
        setSettings(data)
      } else {
        setMessage('❌ 保存失败')
      }
    } catch {
      setMessage('❌ 保存失败')
    }
    setSaving(false)
  }

  const toggleVisibility = async (key: string) => {
    const keyName = key.startsWith('show_') ? key : 'show_' + key
    const newVal = settings[keyName] === 'false'
    
    try {
      const res = await fetch('/api/contact/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [keyName]: newVal }),
      })
      if (res.ok) {
        setSettings(prev => ({ ...prev, [keyName]: newVal ? 'true' : 'false' }))
        setMessage('✅ ' + (newVal ? '已公开' : '已隐藏（登录后可见）'))
      }
    } catch {
      setMessage('❌ 设置失败')
    }
  }

  const toggleItems = [
    { key: 'show_whatsapp', label: '💬 WhatsApp' },
    { key: 'show_email', label: '📧 Email' },
    { key: 'show_phone', label: '📞 电话' },
    { key: 'show_address', label: '📍 地址' },
    { key: 'show_wechat', label: '💚 微信' },
  ]

  if (loading) {
    return (
      <AdminLayout active="contact">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">加载中...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout active="首页内容">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📞 Contact Us Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage contact info and visibility settings</p>
          </div>
          <Link href="/admin/home" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition">
            ← 返回首页内容
          </Link>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 可见性设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">👁️ 联系方式可见性</h2>
            <p className="text-sm text-gray-500 mb-4">
              开启 = 前台所有人可见 | 关闭 = 前台隐藏，<strong>仅登录用户可见</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {toggleItems.map(item => {
                const visible = getVis(item.key)
                return (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(item.key)}
                      style={{
                        width: '3rem',
                        height: '1.5rem',
                        borderRadius: '9999px',
                        backgroundColor: visible ? '#22c55e' : '#d1d5db',
                        position: 'relative',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '0.125rem',
                          left: visible ? '1.375rem' : '0.125rem',
                          width: '1.25rem',
                          height: '1.25rem',
                          borderRadius: '9999px',
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          transition: 'left 0.2s',
                        }}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 核心联系方式 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📱 核心联系方式</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp 号码</label>
                <input type="text" name="whatsapp" defaultValue={settings.whatsapp || '+13239260829'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="+13239260829" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email 邮箱</label>
                <input type="text" name="email" defaultValue={settings.email || 'sales@vapor-x.com'}
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

          <button type="submit" disabled={saving}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-bold rounded-lg transition">
            {saving ? '⏳ 保存中...' : '💾 保存所有设置'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
