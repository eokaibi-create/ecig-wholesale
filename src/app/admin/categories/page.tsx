'use client'

import { useCallback, useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', slug: '', sortOrder: '0', image: '' })
  const [newForm, setNewForm] = useState({ name: '', slug: '', sortOrder: '0', image: '' })
  const [showNew, setShowNew] = useState(false)
  const [message, setMessage] = useState('')

  const loadCategories = useCallback(async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => { loadCategories() }, [loadCategories])

  const startEdit = (cat: any) => {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, slug: cat.slug, sortOrder: String(cat.sortOrder), image: cat.image || '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', slug: '', sortOrder: '0', image: '' })
  }

  const saveEdit = async (id: number) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        slug: editForm.slug,
        sortOrder: Number(editForm.sortOrder),
        image: editForm.image || null,
      }),
    })
    if (res.ok) {
      setMessage('✅ 分类已更新')
      cancelEdit()
      loadCategories()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
  }

  const deleteCategory = async (id: number, name: string) => {
    if (!confirm(`确定要删除分类「${name}」吗？该分类下的产品也会被删除。`)) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage('✅ 分类已删除')
      loadCategories()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newForm.name,
        slug: newForm.slug,
        sortOrder: Number(newForm.sortOrder),
        image: newForm.image || null,
      }),
    })
    if (res.ok) {
      setMessage('✅ 分类已创建')
      setNewForm({ name: '', slug: '', sortOrder: '0', image: '' })
      setShowNew(false)
      loadCategories()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
  }

  if (loading) {
    return (
      <AdminLayout active="分类管理">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">加载中...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout active="分类管理">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <button onClick={() => setShowNew(!showNew)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">
            {showNew ? '取消' : '+ 新增分类'}
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {showNew && (
          <form onSubmit={createCategory} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新增分类</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
                <input type="text" value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" value={newForm.slug} onChange={e => setNewForm({ ...newForm, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input type="number" value={newForm.sortOrder} onChange={e => setNewForm({ ...newForm, sortOrder: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片URL（可选）</label>
                <input type="text" value={newForm.image} onChange={e => setNewForm({ ...newForm, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">
              创建分类
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">排序</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">分类名称</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">标识(slug)</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">产品数</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  {editingId === cat.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input type="number" value={editForm.sortOrder}
                          onChange={e => setEditForm({ ...editForm, sortOrder: e.target.value })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm" required />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={editForm.slug}
                          onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm" required />
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{cat._count.products}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button onClick={() => saveEdit(cat.id)}
                          className="text-sm text-green-600 hover:text-green-700 font-medium">保存</button>
                        <button onClick={cancelEdit}
                          className="text-sm text-gray-500 hover:text-gray-700">取消</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-600">{cat.sortOrder}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{cat.slug}</td>
                      <td className="px-4 py-3 text-center text-sm">{cat._count.products}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => startEdit(cat)}
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium">编辑</button>
                        <button onClick={() => deleteCategory(cat.id, cat.name)}
                          className="text-sm text-red-500 hover:text-red-700 font-medium">删除</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
