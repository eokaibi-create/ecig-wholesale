'use client'
import { compressVideoIfNeeded, isVideo, formatSize } from '@/lib/compressVideo'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

export default function NewProductPage() {
 const router = useRouter()
 const [saving, setSaving] = useState(false)
 const [categories, setCategories] = useState<any[]>([])
 const [uploading, setUploading] = useState(false)
 const [uploadProgress, setUploadProgress] = useState('')
 const [form, setForm] = useState({
 name: '',
 slug: '',
 shortDesc: '',
 description: '',
 categoryId: '',
 brand: '',
 price: '',
 wholesalePrice: '',
 wholesalerPrice: '',
 msrp: '',
 stock: '0',
 nicotine: '',
 capacity: '',
 puffs: '',
 flavor: '',
 size: '',
 featured: false,
 published: false,
 })
 const [image, setImage] = useState<string>('')
 const [extraImages, setExtraImages] = useState<string[]>([])
 const [videoUrl, setVideoUrl] = useState<string>("")
 const [message, setMessage] = useState('')
 const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
 const fileInputRef = useRef<HTMLInputElement>(null)
 const extraFilesRef = useRef<HTMLInputElement>(null)
 const videoInputRef = useRef<HTMLInputElement>(null)

 useEffect(() => {
 fetch('/api/categories')
 .then(res => res.json())
 .then(setCategories)
 .catch(() => {})
 }, [])

 const showMsg = (text: string, type?: 'success' | 'error') => {
 setMessage(text)
 setMessageType(type || '')
 }

 const handleUpload = async (file: File): Promise<string | null> => {
 const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
 'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
 if (!allowedTypes.includes(file.type)) {
 showMsg(`不支持的文件类型: ${file.type}`, 'error')
 return null
 }
 // 如果是大视频，先压缩
 let uploadFile = file
 if (isVideo(file) && file.size > 90 * 1024 * 1024) {
 setUploadProgress(` 压缩视频中 (${formatSize(file.size)})...`)
 uploadFile = await compressVideoIfNeeded(file)
 if (uploadFile.size < file.size) {
 showMsg(` 视频已压缩: ${formatSize(file.size)} → ${formatSize(uploadFile.size)}`, "success")
 }
 }
 // 先获取上传签名
 let sigData
 try {
 const sigRes = await fetch('/api/upload-signature')
 if (!sigRes.ok) throw new Error('获取签名失败')
 sigData = await sigRes.json()
 } catch (err: any) {
 showMsg(`获取上传签名失败: ${err.message}`, 'error')
 return null
 }
 // 直接上传到 Cloudinary（经过签名的上传，不走 Vercel 中转）
 const cloudFormData = new FormData()
 cloudFormData.append('file', uploadFile)
 cloudFormData.append('upload_preset', sigData.uploadPreset)
 cloudFormData.append('folder', sigData.folder)
 cloudFormData.append('api_key', sigData.apiKey)
 cloudFormData.append('timestamp', String(sigData.timestamp))
 cloudFormData.append('signature', sigData.signature)
 try {
 const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`, {
 method: 'POST',
 body: cloudFormData,
 })
 if (res.ok) {
 const data = await res.json()
 return data.secure_url
 } else {
 const err = await res.json()
 showMsg(`上传失败: ${err.error?.message || res.statusText}`, 'error')
 return null
 }
 } catch (err: any) {
 showMsg(`上传出错: ${err.message}`, 'error')
 return null
 }
 }

 const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (!file) return
 setUploading(true)
 setUploadProgress('上传主图中...')
 const url = await handleUpload(file)
 if (url) {
 setImage(url)
 showMsg(' 主图上传成功', 'success')
 }
 setUploading(false)
 setUploadProgress('')
 if (fileInputRef.current) fileInputRef.current.value = ''
 }

 const handleExtraImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = e.target.files
 if (!files || files.length === 0) return
 const remaining = 9 - extraImages.length
 if (remaining <= 0) {
 showMsg(" 最多只能上传9张副图", "error")
 if (extraFilesRef.current) extraFilesRef.current.value = ""
 return
 }
 const selectedFiles = Array.from(files).slice(0, remaining)
 if (selectedFiles.length < files.length) {
 showMsg(` 最多还能上传 ${remaining} 张，已自动截取`, "error")
 }
 setUploading(true)
 const urls: string[] = []
 let successCount = 0
 for (let i = 0; i < selectedFiles.length; i++) {
 const file = selectedFiles[i]
 setUploadProgress(`上传中 (${i + 1}/${selectedFiles.length})...`)
 const url = await handleUpload(file)
 if (url) {
 urls.push(url)
 successCount++
 }
 }
 if (successCount > 0) {
 setExtraImages(prev => [...prev, ...urls])
 showMsg(` ${successCount} 张图片上传成功`, 'success')
 }
 setUploading(false)
 setUploadProgress('')
 if (extraFilesRef.current) extraFilesRef.current.value = ''
 }

 const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (!file) return
 setUploading(true)
 setUploadProgress(' 上传视频中...')
 const url = await handleUpload(file)
 if (url) {
 setVideoUrl(url)
 showMsg(' 视频上传成功', 'success')
 }
 setUploading(false)
 setUploadProgress('')
 if (videoInputRef.current) videoInputRef.current.value = ''
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setSaving(true)
 showMsg('')

 let slug = form.slug
 if (!slug && form.name) {
 slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
 }

 try {
 const res = await fetch('/api/products', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 ...form,
 slug,
 categoryId: Number(form.categoryId),
 price: Number(form.price),
 wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : null,
 wholesalerPrice: form.wholesalerPrice ? Number(form.wholesalerPrice) : null,
 msrp: form.msrp ? Number(form.msrp) : null,
 stock: Number(form.stock),
 image: image || null,
 images: extraImages.length > 0 ? extraImages : null,
 videoUrl: videoUrl || null,
 }),
 })

 if (res.ok) {
 const product = await res.json()
 showMsg(' 产品已创建成功！', 'success')
 setTimeout(() => router.push(`/admin/products`), 800)
 } else {
 const err = await res.json()
 showMsg(` 创建失败: ${err.error}`, 'error')
 }
 } catch (err: any) {
 showMsg(` 创建失败: ${err.message}`, 'error')
 }
 setSaving(false)
 }

 return (
 <div className="min-h-screen bg-gray-100">
 <nav className="bg-gray-900 text-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center h-14">
 <div className="flex items-center space-x-6">
 <Link href="/admin/dashboard" className="font-bold text-amber-400">VAPOR-X 后台</Link>
 <Link href="/admin/dashboard" className="text-sm text-gray-400 hover:text-white">仪表盘</Link>
 <Link href="/admin/products" className="text-sm hover:text-amber-400">产品管理</Link>
 <Link href="/admin/categories" className="text-sm text-gray-400 hover:text-white">分类管理</Link>
 <Link href="/admin/inquiries" className="text-sm text-gray-400 hover:text-white">询价管理</Link>
 <Link href="/admin/customers" className="text-sm text-gray-400 hover:text-white">客户管理</Link>
 <Link href="/admin/settings" className="text-sm text-gray-400 hover:text-white">系统设置</Link>
 </div>
 <Link href="/" className="text-sm text-gray-400 hover:text-white">返回前台 →</Link>
 </div>
 </div>
 </nav>

 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <div className="mb-6">
 <Link href="/admin/products" className="text-sm text-gray-500 hover:text-amber-600">← 返回产品列表</Link>
 <h1 className="text-2xl font-bold text-gray-900 mt-1">新增产品</h1>
 </div>

 {message && (
 <div className={`mb-4 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
 {message}
 </div>
 )}

 <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
 {/* ===== 图片上传 ===== */}
 <div className="border-b pb-6">
 <h3 className="text-lg font-semibold text-gray-900 mb-4"> 产品图片 <span className="text-sm font-normal text-gray-500">（1主图 + 最多9张副图 = 共10张）</span></h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* 主图 */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">产品主图</label>
 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer"
 onClick={() => fileInputRef.current?.click()}>
 {image ? (
 <div className="relative">
 <img src={image} alt="主图预览" className="max-h-48 mx-auto rounded-lg" />
 <button type="button" onClick={(e) => { e.stopPropagation(); setImage('') }}
 className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-sm hover:bg-red-600">×</button>
 </div>
 ) : (
 <div className="py-8">
 <p className="text-sm text-gray-500">点击上传主图</p>
 <p className="text-xs text-gray-400 mt-1">JPG/PNG/WebP/Video, 支持大文件自动压缩</p>
 </div>
 )}
 </div>
 <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMainImageChange} />
 </div>

 {/* 额外图片 */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">副图（最多9张，可多选）<span className="text-xs text-gray-400 ml-1">({extraImages.length}/9）</span></label>
 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer"
 onClick={() => extraFilesRef.current?.click()}>
 {extraImages.length > 0 ? (
 <div className="grid grid-cols-3 gap-2">
 {extraImages.map((url, i) => (
 <div key={i} className="relative">
 <img src={url} alt={`额外图${i+1}`} className="h-20 w-full object-cover rounded-lg" />
 <button type="button" onClick={(e) => { e.stopPropagation(); setExtraImages(prev => prev.filter((_, idx) => idx !== i)) }}
 className="absolute top-0.5 right-0.5 bg-red-500 text-white w-5 h-5 rounded-full text-xs hover:bg-red-600">×</button>
 </div>
 ))}
 <div className="h-20 flex items-center justify-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400"
 onClick={(e) => { e.stopPropagation(); extraFilesRef.current?.click() }}>
 <span className="text-2xl text-gray-400">+</span>
 </div>
 </div>
 ) : (
 <div className="py-8">
 <p className="text-sm text-gray-500">点击上传多张图片</p>
 <p className="text-xs text-gray-400 mt-1">可多选上传，最多9张副图，支持批量上传</p>
 </div>
 )}
 </div>
 <input ref={extraFilesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtraImagesChange} />
 </div>

 {/* 产品视频 */}
 <div className="md:col-span-2">
 <label className="block text-sm font-medium text-gray-700 mb-2"> 产品视频 <span className="text-xs text-gray-400">（可选，展示产品使用/外观，支持视频，最大 100MB）</span></label>
 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition cursor-pointer"
 onClick={() => videoInputRef.current?.click()}>
 {videoUrl ? (
 <div className="relative">
 <video src={videoUrl} controls className="max-h-48 mx-auto rounded-lg" />
 <button type="button" onClick={(e) => { e.stopPropagation(); setVideoUrl("") }}
 className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-sm hover:bg-red-600">×</button>
 </div>
 ) : (
 <div className="py-6">
 <p className="text-sm text-gray-500">点击上传产品视频</p>
 <p className="text-xs text-gray-400 mt-1">自动压缩，支持大文件</p>
 </div>
 )}
 </div>
 <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
 </div>

 </div>
 {uploading && (
 <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
 </svg>
 {uploadProgress || ' 上传中...'}
 </div>
 )}
 </div>

 {/* 基本信息 */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">产品名称 *</label>
 <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
 <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="自动生成, 可自定义" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
 <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required>
 <option value="">选择分类</option>
 {categories.map((c: any) => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
 <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="如: Elf Bar, Geek Bar" />
 </div>
 </div>

 {/* 价格和库存 */}
 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">零售价 (USD) *</label>
 <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 <span className="text-amber-600"> 批发价 (USD)</span>
 </label>
 <input type="number" step="0.01" value={form.wholesalePrice} onChange={e => setForm({ ...form, wholesalePrice: e.target.value })}
 className="w-full px-4 py-2.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="批发客户价" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 <span className="text-purple-600">🔮 批发商价 (USD)</span>
 </label>
 <input type="number" step="0.01" value={form.wholesalerPrice} onChange={e => setForm({ ...form, wholesalerPrice: e.target.value })}
 className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
 placeholder="批发商专享价" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">建议零售价 (MSRP)</label>
 <input type="number" step="0.01" value={form.msrp} onChange={e => setForm({ ...form, msrp: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">库存</label>
 <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
 </div>
 </div>

 {/* 状态 */}
 <div className="flex flex-wrap gap-6">
 <label className="flex items-center space-x-2 cursor-pointer">
 <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
 className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" />
 <span className="text-sm text-gray-700"> 热销推荐（首页展示）</span>
 </label>
 <label className="flex items-center space-x-2 cursor-pointer">
 <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })}
 className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" />
 <span className="text-sm text-gray-700"> 上架发布</span>
 </label>
 </div>

 {/* 简短描述 */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">简短描述</label>
 <input type="text" value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="一句话概括产品特点" />
 </div>

 {/* 详细描述 */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="产品详细信息、卖点、规格等" required />
 </div>

 {/* 电子烟参数 */}
 <div className="border-t pt-6">
 <h3 className="text-lg font-semibold text-gray-900 mb-4"> 电子烟参数（可选）</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">尼古丁含量</label>
 <input type="text" value={form.nicotine} onChange={e => setForm({ ...form, nicotine: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="如: 5%" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">烟油容量</label>
 <input type="text" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="如: 2ml" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">口数</label>
 <input type="text" value={form.puffs} onChange={e => setForm({ ...form, puffs: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="如: 5000口" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">口味</label>
 <input type="text" value={form.flavor} onChange={e => setForm({ ...form, flavor: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="如: 芒果, 蓝莓" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">尺寸/规格</label>
 <input type="text" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="如: 标准装, 大瓶装" />
 </div>
 </div>
 </div>
 {/* 提交按钮 */}
 <div className="border-t pt-6 flex space-x-4">
 <button type="submit" disabled={saving || uploading}
 className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black font-bold rounded-lg transition flex items-center gap-2">
 {saving ? (
 <>
 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
 </svg>
 保存中...
 </>
 ) : ' 保存产品'}
 </button>
 <Link href="/admin/products" className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
 取消
 </Link>
 </div>
 </form>
 </div>
 </div>
 )
}
