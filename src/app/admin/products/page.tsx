'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'
import DeleteProductButton from '@/components/DeleteProductButton'
import Link from 'next/link'

// ====== 类型定义 ======
interface Product {
  id: number
  name: string
  slug: string
  image: string | null
  images: string[]
  videoUrl: string | null
  price: number
  wholesalePrice: number | null
  wholesalerPrice: number | null
  stock: number
  published: boolean
  hot: boolean
  brand: string | null
  category: { id: number; name: string }
  createdAt: string
}

interface Category {
  id: number
  name: string
  slug: string
  sortOrder: number
  image: string | null
  _count: { products: number }
}

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')

  return (
    <AdminLayout active="产品管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">产品管理</h1>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'products' as const, label: '产品列表', icon: '' },
            { key: 'categories' as const, label: '分类管理', icon: '' },
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

        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
      </div>
    </AdminLayout>
  )
}

// ====== Tab 1: 产品列表 ======
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?all=1')
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/products/new"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
          + 新增产品
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-400">加载中...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="text-4xl mb-2"></div>
          <p className="text-gray-500">暂无产品</p>
          <Link href="/admin/products/new" className="text-amber-600 hover:text-amber-700 text-sm mt-2 inline-block">+ 新增第一个产品</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">图片</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">产品</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">分类</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">品牌</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">批发价</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">零售价</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">库存</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {p.image ? (
                      <div className="relative">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                        {p.images && p.images.length > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{p.images.length}</span>
                        )}
                        {p.videoUrl && (
                          <span className="absolute -bottom-1.5 -right-1.5 bg-blue-500 text-white text-[10px] px-1 rounded-full"></span>
                        )}
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg"></div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.brand || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-amber-600">${p.wholesalePrice?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.published ? '已上架' : '草稿'}
                    </span>
                    {p.hot && <span className="ml-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">热卖</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} className="text-sm text-amber-600 hover:text-amber-700">编辑</Link>
                      <DeleteProductButton productId={p.id} productName={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ====== Tab 2: 分类管理 ======
function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', slug: '', sortOrder: '0', image: '' })
  const [newForm, setNewForm] = useState({ name: '', slug: '', sortOrder: '0', image: '' })
  const [showNew, setShowNew] = useState(false)
  const [message, setMessage] = useState('')

  const loadCategories = useCallback(async () => {
    const res = await fetch('/api/categories')
    setCategories(await res.json())
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
      body: JSON.stringify({ name: editForm.name, slug: editForm.slug, sortOrder: Number(editForm.sortOrder), image: editForm.image || null }),
    })
    if (res.ok) { setMessage(' 分类已更新'); cancelEdit(); loadCategories() }
    else { setMessage(` ${(await res.json()).error}`) }
  }

  const deleteCategory = async (id: number, name: string) => {
    if (!confirm(`确定要删除分类「${name}」吗？`)) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) { setMessage(' 分类已删除'); loadCategories() }
    else { setMessage(` ${(await res.json()).error}`) }
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newForm.name, slug: newForm.slug, sortOrder: Number(newForm.sortOrder), image: newForm.image || null }),
    })
    if (res.ok) {
      setMessage(' 分类已创建')
      setNewForm({ name: '', slug: '', sortOrder: '0', image: '' })
      setShowNew(false)
      loadCategories()
    } else { setMessage(` ${(await res.json()).error}`) }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-4 rounded-lg ${message.startsWith('') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
          {showNew ? '取消' : '+ 新增分类'}
        </button>
      </div>

      {showNew && (
        <form onSubmit={createCategory} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
          <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">创建分类</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">排序</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">分类名称</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Slug</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">产品数</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无分类</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                {editingId === cat.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input type="number" value={editForm.sortOrder} onChange={e => setEditForm({ ...editForm, sortOrder: e.target.value })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm" required />
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" value={editForm.slug} onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm" required />
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{cat._count.products}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button onClick={() => saveEdit(cat.id)} className="text-sm text-green-600 hover:text-green-700 font-medium">保存</button>
                      <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-700">取消</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-sm text-gray-600">{cat.sortOrder}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-center text-sm">{cat._count.products}</td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button onClick={() => startEdit(cat)} className="text-sm text-amber-600 hover:text-amber-700 font-medium">编辑</button>
                      <button onClick={() => deleteCategory(cat.id, cat.name)} className="text-sm text-red-500 hover:text-red-700 font-medium">删除</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
