'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  image: string | null
  price: number
}

interface HeroItem {
  id: number
  image: string | null
  videoUrl: string | null
  title: string | null
  productId: number | null
  product: Product | null
  sortOrder: number
  published: boolean
}

export default function AdminHeroPage() {
  const [items, setItems] = useState<HeroItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<HeroItem | null>(null)
  const [form, setForm] = useState({ image: '', videoUrl: '', title: '', productId: '' })
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image')
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
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const showMsg = (text: string, type?: 'success' | 'error') => {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    setUploadType(type)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        if (type === 'image') {
          setForm(prev => ({ ...prev, image: data.url }))
        } else {
          setForm(prev => ({ ...prev, videoUrl: data.url }))
        }
        showMsg(`✅ ${type === 'image' ? '图片' : '视频'}上传成功`, 'success')
      } else {
        const err = await res.json()
        showMsg(`❌ 上传失败: ${err.error}`, 'error')
      }
    } catch (err) {
      showMsg('❌ 上传出错', 'error')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
        res = await fetch('/api/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...body }),
        })
      } else {
        res = await fetch('/api/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      if (res.ok) {
        showMsg(editing ? '✅ 更新成功' : '✅ 添加成功', 'success')
        setForm({ image: '', videoUrl: '', title: '', productId: '' })
        setEditing(null)
        fetchData()
      } else {
        const err = await res.json()
        showMsg(`❌ ${err.error}`, 'error')
      }
    } catch (err) {
      showMsg('❌ 操作失败', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    const res = await fetch(`/api/hero?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      showMsg('✅ 已删除', 'success')
      fetchData()
    }
  }

  const startEdit = (item: HeroItem) => {
    setEditing(item)
    setForm({
      image: item.image || '',
      videoUrl: item.videoUrl || '',
      title: item.title || '',
      productId: item.productId ? String(item.productId) : '',
    })
  }

  const togglePublish = async (item: HeroItem) => {
    await fetch('/api/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, published: !item.published }),
    })
    fetchData()
  }

  return (
    <AdminLayout active="新品管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🆕 Hero 新品管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理首页 Hero 新品banner + 15秒短视频（最多5个新品 + 1个视频）</p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>{message}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 表单 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? '✏️ 编辑' : '➕ 新增'}
              <span className="text-sm font-normal text-gray-400 ml-2">({items.filter(i => i.image).length}/5 新品)</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 图片上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新品图片（Banner）</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.image ? (
                    <div className="relative">
                      <img src={form.image} alt="预览" className="max-h-36 mx-auto rounded-lg" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, image: ''}) }}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600">×</button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="text-3xl mb-1">📸</div>
                      <p className="text-sm text-gray-500">点击上传新品图片</p>
                      <p className="text-xs text-gray-400 mt-1">JPG/PNG/WebP, 最大10MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'image')} />
                {uploading && uploadType === 'image' && <p className="text-xs text-amber-600 mt-1">⏳ 上传中...</p>}
              </div>

              {/* 视频上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">15秒短视频（可选，仅第一个新品展示）</label>
                <div 
                  className="border-2 border-dashed border-blue-300 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer"
                  onClick={() => videoInputRef.current?.click()}
                >
                  {form.videoUrl ? (
                    <div className="relative">
                      {form.videoUrl.startsWith('data:video') || form.videoUrl.includes('.mp4') ? (
                        <video src={form.videoUrl} className="max-h-28 mx-auto rounded-lg" controls />
                      ) : (
                        <div className="py-4">
                          <div className="text-3xl mb-1">🎬</div>
                          <p className="text-sm text-blue-600 truncate">视频已上传</p>
                        </div>
                      )}
                      <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, videoUrl: ''}) }}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600">×</button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="text-3xl mb-1">🎬</div>
                      <p className="text-sm text-gray-500">点击上传15秒短视频</p>
                      <p className="text-xs text-gray-400 mt-1">MP4/WebM, 最大50MB</p>
                    </div>
                  )}
                </div>
                <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'video')} />
                {uploading && uploadType === 'video' && <p className="text-xs text-blue-600 mt-1">⏳ 视频上传中...</p>}
                <div className="mt-2">
                  <label className="block text-xs text-gray-400 mb-1">或输入视频URL</label>
                  <input type="text" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})}
                    placeholder="https://example.com/video.mp4 或 YouTube嵌入链接"
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
                <button type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
                  {editing ? '💾 更新' : '➕ 添加'}
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
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">关联产品</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">排序</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <div className="text-4xl mb-2">🆕</div>
                    <p>暂无新品，点击左侧添加</p>
                  </td></tr>
                ) : items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {item.videoUrl ? (
                        <span className="text-xl" title="视频">🎬</span>
                      ) : item.image ? (
                        <img src={item.image} alt="" className="h-12 w-16 object-cover rounded" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
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
    </AdminLayout>
  )
}
