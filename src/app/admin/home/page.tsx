'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { compressVideoIfNeeded, isVideo, formatSize } from '@/lib/compressVideo'

// ====== 类型定义 ======
interface HomeSettings {
  hero_logo: string
  hero_title: string
  hero_subtitle: string
  whatsapp: string
  email: string
  phone: string
  address: string
  wechat: string
  site_name: string
  min_order: string
  [key: string]: string
}

interface HeroItem {
  id: number
  image: string | null
  videoUrl: string | null
  title: string | null
  productId: number | null
  product: { id: number; name: string; price: number } | null
  sortOrder: number
  published: boolean
}

interface HeroVideo {
  id: number
  url: string
  poster: string | null
  title: string | null
  sortOrder: number
  published: boolean
  createdAt: string
}

interface Product {
  id: number
  name: string
  image: string | null
  price: number
}

const defaultSettings: HomeSettings = {
  hero_logo: '/vaporx-logo.svg',
  hero_title: '美国电子烟批发首选',
  hero_subtitle: 'VAPOR-X — 全美发货 · 批发价直供 · 支持海外直邮',
  whatsapp: '+15559876543',
  email: 'sales@vapor-x.com',
  phone: '+1 (555) 987-6543',
  address: '',
  wechat: '',
  site_name: 'VAPOR-X USA',
  min_order: '500',
}

export default function AdminHomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'hero' | 'videos'>('home')
  const [loading, setLoading] = useState(true)

  return (
    <AdminLayout active="首页内容">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">首页管理</h1>
        <p className="text-sm text-gray-500 mb-6">管理首页内容、新品轮播和背景视频</p>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'home' as const, label: '首页内容', icon: '🏠' },
            { key: 'hero' as const, label: '新品管理', icon: '🆕' },
            { key: 'videos' as const, label: '视频背景', icon: '🎬' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'home' && <HomeContentTab />}
        {activeTab === 'hero' && <HeroSlidesTab />}
        {activeTab === 'videos' && <HeroVideosTab />}
      </div>
    </AdminLayout>
  )
}

// ====== Tab 1: 首页内容 ======
function HomeContentTab() {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          const merged: any = {}
          Object.keys(defaultSettings).forEach((key) => {
            merged[key] = data[key] !== undefined ? data[key] : defaultSettings[key]
          })
          setSettings(merged as HomeSettings)
        }
      })
      .catch(() => {})
  }, [])

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('保存失败')
      setMessage('✅ 保存成功')
    } catch {
      setMessage('❌ 保存失败')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero 区域 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🎯 Hero 区域</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input type="text" value={settings.hero_logo} onChange={(e) => updateField('hero_logo', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">主标题</label>
              <input type="text" value={settings.hero_title} onChange={(e) => updateField('hero_title', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
              <input type="text" value={settings.hero_subtitle} onChange={(e) => updateField('hero_subtitle', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📞 联系方式</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input type="text" value={settings.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="text" value={settings.email} onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                <input type="text" value={settings.phone} onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WeChat</label>
                <input type="text" value={settings.wechat} onChange={(e) => updateField('wechat', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
              <input type="text" value={settings.address} onChange={(e) => updateField('address', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
                <input type="text" value={settings.site_name} onChange={(e) => updateField('site_name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最低起订量</label>
                <input type="text" value={settings.min_order} onChange={(e) => updateField('min_order', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-semibold rounded-lg transition">
          {saving ? '⏳ 保存中...' : '💾 保存所有设置'}
        </button>
      </div>
    </div>
  )
}

// ====== Tab 2: 新品管理 ======
function HeroSlidesTab() {
  const [items, setItems] = useState<HeroItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<HeroItem | null>(null)
  const [form, setForm] = useState({ image: '', videoUrl: '', title: '', productId: '' })
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    try {
      const [heroRes, prodRes] = await Promise.all([
        fetch('/api/hero'),
        fetch('/api/products?all=1'),
      ])
      setItems(await heroRes.json())
      const prods = await prodRes.json()
      setProducts(Array.isArray(prods) ? prods : prods.products || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const showMsg = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const sigRes = await fetch('/api/upload-signature')
      if (!sigRes.ok) { showMsg('❌ 获取上传签名失败'); return null }
      const sigData = await sigRes.json()

      let uploadFile = file
      if (isVideo(file)) {
        setUploadProgress(`📊 检查视频: ${formatSize(file.size)}`)
        if (file.size > 95 * 1024 * 1024) {
          setUploadProgress('🎬 正在压缩视频...')
          uploadFile = await compressVideoIfNeeded(file)
        }
      }

      setUploadProgress('⏫ 上传至云端...')
      const fd = new FormData()
      fd.append('file', uploadFile)
      fd.append('api_key', sigData.apiKey)
      fd.append('timestamp', String(sigData.timestamp))
      fd.append('upload_preset', sigData.uploadPreset)
      fd.append('folder', sigData.folder)
      fd.append('signature', sigData.signature)

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
        { method: 'POST', body: fd }
      )
      if (!cloudRes.ok) { showMsg('❌ 上传失败'); return null }
      const cloudData = await cloudRes.json()
      return cloudData.secure_url
    } catch (err) {
      console.error(err)
      showMsg('❌ 上传出错')
      return null
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress('⏫ 图片上传中...')
    const url = await uploadToCloudinary(file)
    if (url) { setForm(prev => ({ ...prev, image: url })); showMsg('✅ 图片上传成功') }
    setUploading(false)
    setUploadProgress('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress('⏫ 准备上传视频...')
    const url = await uploadToCloudinary(file)
    if (url) { setForm(prev => ({ ...prev, videoUrl: url })); showMsg('✅ 视频上传成功') }
    setUploading(false)
    setUploadProgress('')
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body: any = {
      image: form.image || null,
      videoUrl: form.videoUrl || null,
      title: form.title,
      productId: form.productId ? Number(form.productId) : null,
    }
    try {
      let res
      if (editing) {
        res = await fetch('/api/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
      } else {
        res = await fetch('/api/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      if (res.ok) {
        showMsg(editing ? '✅ 更新成功' : '✅ 添加成功')
        setForm({ image: '', videoUrl: '', title: '', productId: '' })
        setEditing(null)
        fetchData()
      } else {
        const err = await res.json()
        showMsg(`❌ ${err.error}`)
      }
    } catch { showMsg('❌ 操作失败') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    const res = await fetch(`/api/hero?id=${id}`, { method: 'DELETE' })
    if (res.ok) { showMsg('✅ 已删除'); fetchData() }
  }

  const startEdit = (item: HeroItem) => {
    setEditing(item)
    setForm({ image: item.image || '', videoUrl: item.videoUrl || '', title: item.title || '', productId: item.productId ? String(item.productId) : '' })
  }

  const togglePublish = async (item: HeroItem) => {
    await fetch('/api/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, published: !item.published }) })
    fetchData()
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 表单 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editing ? '✏️ 编辑新品' : '➕ 新增新品'}
            <span className="text-sm font-normal text-gray-400 ml-2">({items.filter(i => i.image || i.videoUrl).length}/5 个)</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新品图片</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer"
                onClick={() => !uploading && fileInputRef.current?.click()}>
                {form.image ? (
                  <div className="relative">
                    <img src={form.image} alt="预览" className="max-h-36 mx-auto rounded-lg" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, image: ''}) }}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs">×</button>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="text-3xl mb-1">📸</div>
                    <p className="text-sm text-gray-500">{uploading ? '⏳ 上传中...' : '点击上传新品图片'}</p>
                    <p className="text-xs text-gray-400 mt-1">JPG/PNG/WebP</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </div>

            {/* 视频上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新品视频 <span className="text-xs text-gray-400">（超过95MB自动压缩）</span></label>
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer"
                onClick={() => !uploading && videoInputRef.current?.click()}>
                {form.videoUrl ? (
                  <div className="relative">
                    {form.videoUrl.includes('.mp4') || form.videoUrl.includes('cloudinary') ? (
                      <video src={form.videoUrl} className="max-h-28 mx-auto rounded-lg" controls />
                    ) : (
                      <div className="py-4"><div className="text-3xl mb-1">🎬</div><p className="text-sm text-blue-600 truncate">视频已上传</p></div>
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, videoUrl: ''}) }}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs">×</button>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="text-3xl mb-1">🎬</div>
                    <p className="text-sm text-gray-500">{uploading ? '⏳ 上传中...' : '点击上传视频'}</p>
                    <p className="text-xs text-gray-400 mt-1">MP4/WebM · 超过95MB自动压缩</p>
                  </div>
                )}
              </div>
              <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoUpload} disabled={uploading} />
              {uploadProgress && <p className="text-xs mt-1 text-blue-600">{uploadProgress}</p>}
              <div className="mt-2">
                <label className="block text-xs text-gray-400 mb-1">或输入视频 URL</label>
                <input type="text" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新品标题</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                placeholder="如: 2025 最新上市"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联产品（可选）</label>
              <select value={form.productId} onChange={e => setForm({...form, productId: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="">仅展示图片（不关联产品）</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={uploading}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-semibold rounded-lg transition">
                {uploading ? '⏳ 上传中...' : editing ? '💾 更新' : '➕ 添加'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({image: '', videoUrl: '', title: '', productId: ''}) }}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition">取消</button>
              )}
            </div>
          </form>
        </div>

        {/* 列表 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">预览</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">标题</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">类型</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">关联</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">排序</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">暂无新品，点击左侧添加</td></tr>
              ) : items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {item.videoUrl ? <span className="text-xl" title="视频">🎬</span>
                    : item.image ? <img src={item.image} alt="" className="h-12 w-16 object-cover rounded" />
                    : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title || '无标题'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.videoUrl ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {item.videoUrl ? '🎬 视频' : '🖼️ 图片'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.product?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(item)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.published ? '显示' : '隐藏'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => startEdit(item)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">编辑</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ====== Tab 3: 视频背景 ======
function HeroVideosTab() {
  const [videos, setVideos] = useState<HeroVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<HeroVideo | null>(null)
  const [form, setForm] = useState({ url: '', poster: '', title: '', sortOrder: 0, published: true })
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const videoInputRef = useRef<HTMLInputElement>(null)
  const posterInputRef = useRef<HTMLInputElement>(null)

  const fetchVideos = async () => {
    try { const res = await fetch('/api/hero-videos'); setVideos(await res.json()) }
    catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchVideos() }, [])

  const showMsg = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const sigRes = await fetch('/api/upload-signature')
      if (!sigRes.ok) { showMsg('❌ 获取签名失败'); return null }
      const sigData = await sigRes.json()
      setUploadProgress('⏫ 上传至云端...')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('api_key', sigData.apiKey)
      fd.append('timestamp', String(sigData.timestamp))
      fd.append('upload_preset', sigData.uploadPreset)
      fd.append('folder', sigData.folder)
      fd.append('signature', sigData.signature)
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`, { method: 'POST', body: fd })
      if (!cloudRes.ok) { showMsg('❌ 上传失败'); return null }
      return (await cloudRes.json()).secure_url
    } catch { showMsg('❌ 上传出错'); return null }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress('⏫ 准备上传...')
    const url = await uploadToCloudinary(file)
    if (url) { setForm(prev => ({ ...prev, url })); showMsg('✅ 视频上传成功') }
    setUploading(false)
    setUploadProgress('')
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress('⏫ 上传封面...')
    const url = await uploadToCloudinary(file)
    if (url) { setForm(prev => ({ ...prev, poster: url })); showMsg('✅ 封面上传成功') }
    setUploading(false)
    setUploadProgress('')
    if (posterInputRef.current) posterInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = { url: form.url, poster: form.poster || null, title: form.title || null, sortOrder: Number(form.sortOrder), published: form.published }
    try {
      let res
      if (editing) {
        res = await fetch('/api/hero-videos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
      } else {
        res = await fetch('/api/hero-videos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      if (res.ok) {
        showMsg(editing ? '✅ 更新成功' : '✅ 新增成功')
        setForm({ url: '', poster: '', title: '', sortOrder: 0, published: true })
        setEditing(null)
        fetchVideos()
      } else { showMsg(`❌ 操作失败`) }
    } catch { showMsg('❌ 操作失败') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    const res = await fetch(`/api/hero-videos?id=${id}`, { method: 'DELETE' })
    if (res.ok) { showMsg('✅ 已删除'); fetchVideos() }
  }

  const togglePublish = async (video: HeroVideo) => {
    await fetch('/api/hero-videos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: video.id, published: !video.published }) })
    fetchVideos()
  }

  const startEdit = (video: HeroVideo) => {
    setEditing(video)
    setForm({ url: video.url, poster: video.poster || '', title: video.title || '', sortOrder: video.sortOrder, published: video.published })
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>{message}</div>
      )}
      {uploadProgress && <div className="p-3 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">{uploadProgress}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 表单 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editing ? '✏️ 编辑视频' : '➕ 新增视频'}
            <span className="text-sm font-normal text-gray-400 ml-2">({videos.filter(v => v.published).length} 个已发布)</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">视频文件</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer"
                onClick={() => !uploading && videoInputRef.current?.click()}>
                {form.url ? (
                  <div className="relative">
                    <video src={form.url} className="max-h-32 mx-auto rounded-lg" controls />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, url: ''}) }}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs">×</button>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="text-3xl mb-1">🎬</div>
                    <p className="text-sm text-gray-500">{uploading ? '⏳ 上传中...' : '点击上传视频'}</p>
                    <p className="text-xs text-gray-400 mt-1">MP4/MOV/WebM</p>
                  </div>
                )}
              </div>
              <input ref={videoInputRef} type="file" accept="video/*,.mov" className="hidden" onChange={handleVideoUpload} disabled={uploading} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">封面图片（可选）</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-amber-400 transition cursor-pointer"
                onClick={() => !uploading && posterInputRef.current?.click()}>
                {form.poster ? (
                  <div className="relative">
                    <img src={form.poster} alt="封面" className="max-h-20 mx-auto rounded-lg" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, poster: ''}) }}
                      className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs">×</button>
                  </div>
                ) : (
                  <div className="py-2"><p className="text-sm text-gray-400">🖼️ 点击上传封面</p></div>
                )}
              </div>
              <input ref={posterInputRef} type="file" accept="image/*" className="hidden" onChange={handlePosterUpload} disabled={uploading} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题（可选）</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                placeholder="VAPOR-X 2025"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: Number(e.target.value)})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={form.published}
                onChange={e => setForm({...form, published: e.target.checked})}
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">已发布</label>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={!form.url || uploading}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-semibold rounded-lg transition">
                {editing ? '💾 更新' : '➕ 新增'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ url: '', poster: '', title: '', sortOrder: 0, published: true }) }}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg">取消</button>
              )}
            </div>
          </form>
        </div>

        {/* 视频列表 */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">加载中...</div>
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-gray-500">还没有背景视频，在左侧新增一个</p>
            </div>
          ) : videos.map((v) => (
            <div key={v.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition ${
              v.published ? 'border-gray-100' : 'border-yellow-200 bg-yellow-50/30'
            }`}>
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-28 bg-black flex-shrink-0">
                  <video src={v.url} className="w-full h-full object-cover" muted loop
                    onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={e => (e.target as HTMLVideoElement).pause()} />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{v.title || '(无标题)'}</h3>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{v.url}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>排序: {v.sortOrder}</span>
                        <span className={`px-2 py-0.5 rounded-full ${v.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {v.published ? '已发布' : '未发布'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => togglePublish(v)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                          v.published ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}>{v.published ? '下架' : '发布'}</button>
                      <button onClick={() => startEdit(v)}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">编辑</button>
                      <button onClick={() => handleDelete(v.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">删除</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
