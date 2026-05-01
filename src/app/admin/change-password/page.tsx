'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function ChangePasswordPage() {
 const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
 const [message, setMessage] = useState({ text: '', type: '' })
 const [loading, setLoading] = useState(false)

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setMessage({ text: '', type: '' })

 if (form.newPassword !== form.confirmPassword) {
 setMessage({ text: '两次输入的新密码不一致', type: 'error' })
 return
 }
 if (form.newPassword.length < 6) {
 setMessage({ text: '新密码至少6个字符', type: 'error' })
 return
 }

 setLoading(true)
 try {
 const res = await fetch('/api/admin/change-password', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ oldPassword: form.oldPassword, newPassword: form.newPassword }),
 })
 const data = await res.json()
 if (res.ok) {
 setMessage({ text: ' 密码修改成功！下次登录请使用新密码', type: 'success' })
 setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
 } else {
 setMessage({ text: ' ' + (data.error || '修改失败'), type: 'error' })
 }
 } catch {
 setMessage({ text: ' 网络错误，请重试', type: 'error' })
 }
 setLoading(false)
 }

 return (
 <AdminLayout active="修改密码">
 <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <h1 className="text-2xl font-bold text-gray-900 mb-2"> 修改密码</h1>
 <p className="text-sm text-gray-500 mb-6">修改当前管理员的登录密码</p>

 {message.text && (
 <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
 message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
 }`}>
 {message.text}
 </div>
 )}

 <div className="bg-white rounded-xl shadow-sm border p-6">
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
 <input
 type="password"
 value={form.oldPassword}
 onChange={e => setForm({...form, oldPassword: e.target.value})}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="输入当前密码"
 required
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
 <input
 type="password"
 value={form.newPassword}
 onChange={e => setForm({...form, newPassword: e.target.value})}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="至少6个字符"
 required
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
 <input
 type="password"
 value={form.confirmPassword}
 onChange={e => setForm({...form, confirmPassword: e.target.value})}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
 placeholder="再次输入新密码"
 required
 />
 </div>
 <button
 type="submit"
 disabled={loading}
 className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-black font-bold rounded-lg transition"
 >
 {loading ? '修改中...' : ' 修改密码'}
 </button>
 </form>
 </div>

 <div className="mt-6 bg-amber-50 rounded-xl border border-amber-200 p-4">
 <p className="text-sm text-amber-800">
 <strong>提示：</strong>密码修改成功后立即生效，下次登录时请使用新密码。
 </p>
 </div>
 </div>
 </AdminLayout>
 )
}
