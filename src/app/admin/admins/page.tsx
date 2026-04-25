'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'admin' })
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ username: '', email: '', password: '', role: '' })

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/manage')
      if (res.ok) setAdmins(await res.json())
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => { fetchAdmins() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setMessage('✅ 管理员添加成功')
      setForm({ username: '', email: '', password: '', role: 'admin' })
      setShowForm(false)
      fetchAdmins()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const startEdit = (a: any) => {
    setEditingId(a.id)
    setEditForm({ username: a.username, email: a.email, password: '', role: a.role })
  }

  const saveEdit = async (id: number) => {
    const res = await fetch('/api/admin/manage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    })
    if (res.ok) {
      setMessage('✅ 管理员信息已更新')
      setEditingId(null)
      fetchAdmins()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此管理员？')) return
    await fetch(`/api/admin/manage?id=${id}`, { method: 'DELETE' })
    fetchAdmins()
  }

  return (
    <AdminLayout active="管理员管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👑 管理员管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理平台管理员账户，支持编辑账号、密码和角色</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">
            {showForm ? '取消' : '+ 新增管理员'}
          </button>
        </div>
        {message && <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
        
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">新增管理员</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                placeholder="用户名" className="px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500" required />
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="邮箱" className="px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500" required />
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="密码" className="px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500" required />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500">
                <option value="admin">管理员</option>
                <option value="superadmin">超级管理员</option>
                <option value="product">产品管理员</option>
                <option value="editor">编辑</option>
                <option value="viewer">仅查看</option>
              </select>
              <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg col-span-full md:col-span-1">添加</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">用户名</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">邮箱</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">角色</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">创建时间</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">暂无管理员</td></tr>
              ) : (
                admins.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    {editingId === a.id ? (
                      <>
                        <td className="px-4 py-2 text-sm text-gray-500">{a.id}</td>
                        <td className="px-4 py-2">
                          <input value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm" placeholder="用户名" />
                        </td>
                        <td className="px-4 py-2">
                          <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm" placeholder="邮箱" />
                        </td>
                        <td className="px-4 py-2">
                          <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm">
                            <option value="admin">管理员</option>
                            <option value="superadmin">超级管理员</option>
                            <option value="product">产品管理员</option>
                            <option value="editor">编辑</option>
                            <option value="viewer">仅查看</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <button onClick={() => saveEdit(a.id)} className="text-sm text-green-600 hover:text-green-700 font-medium">保存</button>
                          <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-600">取消</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-500">{a.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{a.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{a.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            a.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                            a.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            a.role === 'product' ? 'bg-blue-100 text-blue-700' :
                            a.role === 'editor' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {a.role === 'superadmin' ? '超级管理员' :
                             a.role === 'admin' ? '管理员' :
                             a.role === 'product' ? '产品管理员' :
                             a.role === 'editor' ? '编辑' : '仅查看'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right space-x-3">
                          <button onClick={() => startEdit(a)} className="text-sm text-amber-600 hover:text-amber-700 font-medium">编辑</button>
                          <button onClick={() => handleDelete(a.id)} className="text-sm text-red-500 hover:text-red-600">删除</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-800 mb-2">🔑 修改密码</p>
            <div className="flex gap-3">
              <input type="password" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})}
                placeholder="输入新密码（留空不修改）" className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" />
              <button onClick={() => {
                const id = editingId
                if (!editForm.password) { setMessage('⚠️ 请输入新密码'); setTimeout(() => setMessage(''), 3000); return }
                saveEdit(id)
              }} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded-lg">更新密码</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
