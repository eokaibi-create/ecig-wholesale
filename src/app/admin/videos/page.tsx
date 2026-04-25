'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Video {
  id: number
  title: string
  url: string
  sortOrder: number
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Video | null>(null)
  const [form, setForm] = useState({ title: '', url: '', sortOrder: 0 })

  const fetchVideos = async () => {
    const res = await fetch('/api/videos')
    const data = await res.json()
    setVideos(data)
    setLoading(false)
  }

  useEffect(() => { fetchVideos() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/videos/${editing.id}` : '/api/videos'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: '', url: '', sortOrder: 0 })
      setEditing(null)
      fetchVideos()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此视频？')) return
    await fetch(`/api/videos/${id}`, { method: 'DELETE' })
    fetchVideos()
  }

  const startEdit = (video: Video) => {
    setEditing(video)
    setForm({ title: video.title, url: video.url, sortOrder: video.sortOrder })
  }

  return (
    <AdminLayout active="视频管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">视频管理</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? '编辑视频' : '新增视频'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视频标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视频 URL（YouTube 嵌入或 MP4）</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">
                  {editing ? '更新' : '新增'}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => { setEditing(null); setForm({ title: '', url: '', sortOrder: 0 }) }}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
                  >
                    取消
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">标题</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">URL</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">排序</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
                ) : videos.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">暂无视频</td></tr>
                ) : (
                  videos.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{v.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{v.url}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{v.sortOrder}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => startEdit(v)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">编辑</button>
                        <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">删除</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
