'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
// import { compressVideoIfNeeded, isVideo, formatSize } from '@/lib/compressVideo'

interface HeroVideo {
  id: number
  url: string
  poster: string | null
  title: string | null
  sortOrder: number
  published: boolean
  createdAt: string
}

export default function AdminHeroVideosPage() {
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
    try {
      const res = await fetch('/api/hero-videos')
      setVideos(await res.json())
    } catch (e) { console.error(e) }
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
      if (!sigRes.ok) { showMsg('❌ 获取上传签名失败'); return null }
      const sigData = await sigRes.json()

      let uploadFile = file

      setUploadProgress('⏫ 上传至云端 (Cloudinary 自动转码)...')
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress('⏫ 准备上传...')
    const url = await uploadToCloudinary(file)
    if (url) {
      setForm(prev => ({ ...prev, url }))
      showMsg('✅ 视频上传成功')
    }
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
    if (url) {
      setForm(prev => ({ ...prev, poster: url }))
      showMsg('✅ 封面上传成功')
    }
    setUploading(false)
    setUploadProgress('')
    if (posterInputRef.current) posterInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      url: form.url,
      poster: form.poster || null,
      title: form.title || null,
      sortOrder: Number(form.sortOrder),
      published: form.published,
    }

    try {
      let res
      if (editing) {
        res = await fetch('/api/hero-videos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...body }),
        })
      } else {
        res = await fetch('/api/hero-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      if (res.ok) {
        showMsg(editing ? '✅ 更新成功' : '✅ 新增成功')
        setForm({ url: '', poster: '', title: '', sortOrder: 0, published: true })
        setEditing(null)
        fetchVideos()
      } else {
        const err = await res.json()
        showMsg(`❌ ${err.error || '操作失败'}`)
      }
    } catch (err) {
      showMsg('❌ 操作失败')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此视频？')) return
    const res = await fetch(`/api/hero-videos?id=${id}`, { method: 'DELETE' })
    if (res.ok) { showMsg('✅ 已删除'); fetchVideos() }
  }

  const togglePublish = async (video: HeroVideo) => {
    await fetch('/api/hero-videos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: video.id, published: !video.published }),
    })
    fetchVideos()
  }

  const startEdit = (video: HeroVideo) => {
    setEditing(video)
    setForm({
      url: video.url,
      poster: video.poster || '',
      title: video.title || '',
      sortOrder: video.sortOrder,
      published: video.published,
    })
  }

  return (
    <AdminLayout active="Hero 视频背景">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎬 Hero 视频背景</h1>
            <p className="text-sm text-gray-500 mt-1">管理首页全屏背景视频，自动轮播播放（支持 MP4/MOV/WebM，Cloudinary 自动转码）</p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>{message}</div>
        )}

        {uploadProgress && (
          <div className="mb-4 p-3 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">{uploadProgress}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 表单 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? '✏️ 编辑背景视频' : '➕ 新增背景视频'}
              <span className="text-sm font-normal text-gray-400 ml-2">({videos.filter(v => v.published).length} 个已发布)</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 视频文件上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视频文件（MP4/WebM）</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer"
                  onClick={() => !uploading && videoInputRef.current?.click()}
                >
                  {form.url ? (
                    <div className="relative">
                      <video src={form.url} className="max-h-32 mx-auto rounded-lg" controls />
                      <button type="button" disabled={uploading} onClick={(e) => { e.stopPropagation(); setForm({...form, url: ''}) }}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600">×</button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-3xl mb-1">🎬</div>
                      <p className="text-sm text-gray-500">{uploading ? '⏳ 上传中...' : '点击上传视频'}</p>
                      <p className="text-xs text-gray-400 mt-1">MP4/MOV/WebM 等常见格式，Cloudinary 自动转码</p>
                    </div>
                  )}
                </div>
                <input ref={videoInputRef} type="file" accept="video/*,.mov" className="hidden"
                  onChange={handleVideoUpload} disabled={uploading} />
              </div>

              {/* 封面图片上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视频封面（可选）</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-amber-400 transition cursor-pointer"
                  onClick={() => !uploading && posterInputRef.current?.click()}
                >
                  {form.poster ? (
                    <div className="relative">
                      <img src={form.poster} alt="封面预览" className="max-h-20 mx-auto rounded-lg" />
                      <button type="button" disabled={uploading} onClick={(e) => { e.stopPropagation(); setForm({...form, poster: ''}) }}
                        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs hover:bg-red-600">×</button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <p className="text-sm text-gray-400">🖼️ 点击上传封面图片</p>
                    </div>
                  )}
                </div>
                <input ref={posterInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handlePosterUpload} disabled={uploading} />
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题（可选）</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="VAPOR-X 2025 Collection"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>

              {/* 排序 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>

              {/* 发布开关 */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={e => setForm({...form, published: e.target.checked})}
                  className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500" />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">已发布</label>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={!form.url || uploading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-semibold rounded-lg transition">
                  {editing ? '更新' : '新增'}
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
            ) : (
              videos.map((v) => (
                <div key={v.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition ${
                  v.published ? 'border-gray-100' : 'border-yellow-200 bg-yellow-50/30'
                }`}>
                  <div className="flex flex-col sm:flex-row">
                    {/* 视频预览 */}
                    <div className="sm:w-48 h-28 bg-black flex-shrink-0">
                      <video src={v.url} className="w-full h-full object-cover" muted loop
                        onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={e => (e.target as HTMLVideoElement).pause()} />
                    </div>
                    {/* 信息 */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{v.title || '(无标题)'}</h3>
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{v.url}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>排序: {v.sortOrder}</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              v.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{v.published ? '已发布' : '未发布'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => togglePublish(v)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                              v.published
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}>
                            {v.published ? '下架' : '发布'}
                          </button>
                          <button onClick={() => startEdit(v)}
                            className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                            编辑
                          </button>
                          <button onClick={() => handleDelete(v.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
