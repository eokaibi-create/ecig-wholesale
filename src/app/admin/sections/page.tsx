'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/sections').then(r => r.json()).then(data => {
      setSections(prev => ({...prev, ...data}))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const update = (key: string, value: string) => {
    setSections(prev => ({...prev, [key]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sections),
    })
    if (res.ok) {
      setMessage('✅ 所有区块标题已保存！')
    } else {
      setMessage('❌ 保存失败')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const fields = [
    { key: 'hero_title', label: '🆕 Hero区块标题', desc: '新品区域主标题' },
    { key: 'hero_desc', label: 'Hero区块描述', desc: '新品区域副标题（可选）' },
    { key: 'section_product_title', label: '📦 产品中心标题', desc: '产品展示区域标题' },
    { key: 'section_product_desc', label: '产品中心描述', desc: '产品展示区域副标题' },
    { key: 'section_brand_title', label: '🏷️ 合作品牌标题', desc: '品牌展示区域标题' },
    { key: 'section_brand_desc', label: '合作品牌描述', desc: '品牌展示区域副标题' },
    { key: 'section_platform_title', label: '🌐 合作平台标题', desc: '平台展示区域标题' },
    { key: 'section_platform_desc', label: '合作平台描述', desc: '平台展示区域副标题' },
    { key: 'section_contact_title', label: '📞 Contact Us Title', desc: 'Contact section heading' },
    { key: 'section_contact_desc', label: 'Contact Us Description', desc: 'Contact section subtitle' },
  ]

  return (
    <AdminLayout active="区块标题">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📑 区块标题管理</h1>
        <p className="text-sm text-gray-500 mb-6">编辑首页各区块的标题和描述文字</p>
        {message && <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
        {loading ? <div className="text-center py-12 text-gray-400">加载中...</div> : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key} className="bg-white rounded-xl shadow-sm border p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <p className="text-xs text-gray-400 mb-2">{f.desc}</p>
                <input type="text" value={sections[f.key] || ''} onChange={e => update(f.key, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            ))}
            <button type="submit" disabled={saving}
              className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl disabled:opacity-50">
              {saving ? '💾 保存中...' : '💾 保存所有区块标题'}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  )
}
