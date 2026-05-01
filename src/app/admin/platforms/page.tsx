'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Platform {
 id: number
 name: string
 logo: string | null
 description: string | null
 sortOrder: number
}

export default function AdminPlatformsPage() {
 const [platforms, setPlatforms] = useState<Platform[]>([])
 const [loading, setLoading] = useState(true)
 const [editing, setEditing] = useState<Platform | null>(null)
 const [form, setForm] = useState({ name: '', logo: '', description: '', sortOrder: 0 })
 const [message, setMessage] = useState('')
 const [uploading, setUploading] = useState(false)
 const fileInputRef = useRef<HTMLInputElement>(null)

 const fetchPlatforms = async () => {
 const res = await fetch('/api/platforms')
 const data = await res.json()
 setPlatforms(data)
 setLoading(false)
 }

 useEffect(() => { fetchPlatforms() }, [])

 const showMsg = (text: string, type?: 'success' | 'error') => {
 setMessage(text)
 setTimeout(() => setMessage(''), 3000)
 }

 // Cloudinary 签名直传（不经过 Vercel 服务器）
 const uploadToCloudinary = async (file: File): Promise<string | null> => {
 try {
 const sigRes = await fetch('/api/upload-signature')
 if (!sigRes.ok) { showMsg(' 获取上传签名失败', 'error'); return null }
 const sigData = await sigRes.json()

 const fd = new FormData()
 fd.append('file', file)
 fd.append('api_key', sigData.apiKey)
 fd.append('timestamp', String(sigData.timestamp))
 fd.append('upload_preset', sigData.uploadPreset)
 fd.append('folder', sigData.folder)
 fd.append('signature', sigData.signature)

 const cloudRes = await fetch(
 `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
 { method: 'POST', body: fd }
 )
 if (!cloudRes.ok) { showMsg(' 上传失败', 'error'); return null }
 const cloudData = await cloudRes.json()
 return cloudData.secure_url
 } catch (err) {
 console.error(err)
 showMsg(' 上传出错', 'error')
 return null
 }
 }

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (!file) return
 setUploading(true)
 const url = await uploadToCloudinary(file)
 if (url) {
 setForm(prev => ({ ...prev, logo: url }))
 showMsg(' Logo上传成功', 'success')
 }
 setUploading(false)
 if (fileInputRef.current) fileInputRef.current.value = ''
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 const url = editing ? `/api/platforms/${editing.id}` : '/api/platforms'
 const method = editing ? 'PUT' : 'POST'
 const res = await fetch(url, {
 method,
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(form),
 })
 if (res.ok) {
 setForm({ name: '', logo: '', description: '', sortOrder: 0 })
 setEditing(null)
 fetchPlatforms()
 showMsg(editing ? ' 更新成功' : ' 已添加', 'success')
 }
 }

 const handleDelete = async (id: number) => {
 if (!confirm('确定删除？')) return
 await fetch(`/api/platforms/${id}`, { method: 'DELETE' })
 fetchPlatforms()
 }

 const startEdit = (p: Platform) => {
 setEditing(p)
 setForm({ name: p.name, logo: p.logo || '', description: p.description || '', sortOrder: p.sortOrder })
 }

 return (
 <AdminLayout active="平台管理">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <h1 className="text-2xl font-bold text-gray-900 mb-2"> 平台/优势管理</h1>
 <p className="text-sm text-gray-500 mb-6">Logo支持文件上传或URL链接</p>

 {message && (
 <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
 message.includes('') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
 }`}>{message}</div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
 <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? ' 编辑' : ' 新增'}</h2>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
 <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
 <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-amber-400 transition cursor-pointer mb-2"
 onClick={() => !uploading && fileInputRef.current?.click()}>
 {form.logo ? (
 <div className="relative inline-block">
 <img src={form.logo} alt="" className="h-12 w-auto mx-auto" />
 <button type="button" onClick={(e) => { e.stopPropagation(); setForm({...form, logo: ''}) }}
 className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs">×</button>
 </div>
 ) : (
 <div>
 <p className="text-xs text-gray-500 mt-1">{uploading ? ' 上传中...' : '点击上传Logo'}</p>
 </div>
 )}
 </div>
 <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
 {uploading && <p className="text-xs text-amber-600"> 上传中...</p>}
 <input type="text" value={form.logo} onChange={e => setForm({...form, logo: e.target.value})}
 placeholder="或输入Logo URL"
 className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none mt-1" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
 <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
 rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
 <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
 </div>
 <div className="flex gap-2">
 <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-semibold rounded-lg">
 {uploading ? ' 上传中...' : editing ? ' 更新' : ' 新增'}
 </button>
 {editing && (
 <button type="button" onClick={() => { setEditing(null); setForm({ name: '', logo: '', description: '', sortOrder: 0 }) }}
 className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg">取消</button>
 )}
 </div>
 </form>
 </div>

 <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
 <table className="w-full">
 <thead className="bg-gray-50 border-b">
 <tr>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Logo</th>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">名称</th>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">描述</th>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">排序</th>
 <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
 </tr>
 </thead>
 <tbody className="divide-y">
 {loading ? (
 <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
 ) : platforms.length === 0 ? (
 <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无平台</td></tr>
 ) : (
 platforms.map((p) => (
 <tr key={p.id} className="hover:bg-gray-50">
 <td className="px-4 py-3">
 {p.logo ? (
 <img src={p.logo} alt={p.name} className="h-10 w-auto rounded" />
 ) : (
 <span className="text-gray-300">—</span>
 )}
 </td>
 <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
 <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{p.description || '—'}</td>
 <td className="px-4 py-3 text-sm text-gray-500">{p.sortOrder}</td>
 <td className="px-4 py-3 text-right space-x-2">
 <button onClick={() => startEdit(p)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">编辑</button>
 <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">删除</button>
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
