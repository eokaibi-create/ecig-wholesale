'use client'

import { useState } from 'react'

export default function AdminForgotPasswordPage() {
 const [email, setEmail] = useState('')
 const [loading, setLoading] = useState(false)
 const [sent, setSent] = useState(false)
 const [error, setError] = useState('')

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault()
 setError('')
 setLoading(true)

 try {
 const res = await fetch('/api/auth/admin/forgot-password', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email }),
 })

 const data = await res.json()
 if (res.ok) {
 setSent(true)
 } else {
 setError(data.error || '发送失败')
 }
 } catch {
 setError('网络错误，请稍后重试')
 }
 setLoading(false)
 }

 if (sent) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
 <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 text-center">
 <h1 className="text-xl font-bold text-white mb-3">检查您的邮箱</h1>
 <p className="text-gray-300 mb-4">
 如果该邮箱已注册，您将很快收到密码重置邮件。
 </p>
 <p className="text-sm text-gray-400 mb-6">
 没有收到邮件？请检查垃圾邮件文件夹。
 </p>
 <a href="/admin/login"
 className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
 返回登录
 </a>
 </div>
 </div>
 )
 }

 return (
 <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
 <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
 <div className="text-center mb-8">
 <h1 className="text-2xl font-bold text-white">忘记密码</h1>
 <p className="text-gray-400 mt-2 text-sm">
 输入您的邮箱，我们将发送重置链接
 </p>
 </div>

 {error && (
 <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">{error}</div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-1">邮箱地址</label>
 <input type="email" value={email} onChange={e => setEmail(e.target.value)}
 className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-gray-400"
 placeholder="your@email.com" required />
 </div>
 <button type="submit" disabled={loading}
 className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-black font-bold rounded-lg transition">
 {loading ? '发送中...' : '发送重置链接'}
 </button>
 </form>

 <div className="mt-6 text-center">
 <a href="/admin/login" className="text-sm text-gray-400 hover:text-amber-400 transition">
 ← 返回登录
 </a>
 </div>
 </div>
 </div>
 )
}
