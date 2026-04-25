'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export default function CreatePIPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [form, setForm] = useState({
    customerEmail: '',
    discount: '0',
    notes: '',
    validUntil: '',
  })
  const [items, setItems] = useState<{productId: number; productName: string; quantity: number; unitPrice: number; flavor?: string}[]>([])
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(setCustomers).catch(() => {})
    fetch('/api/products?all=1').then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : d.products || [])).catch(() => {})
  }, [])

  const addItem = () => {
    setItems([...items, { productId: 0, productName: '', quantity: 1, unitPrice: 0, flavor: '' }])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    if (field === 'productId') {
      const prod = products.find(p => p.id === Number(value))
      const flavors = prod?.flavor ? prod.flavor.split(',').map((f: string) => f.trim()).filter(Boolean) : []
      newItems[index] = {
        ...newItems[index],
        productId: Number(value),
        productName: prod?.name || '',
        unitPrice: prod?.wholesalePrice || prod?.price || 0,
        flavor: flavors.length > 0 ? flavors[0] : '',
      }
    } else {
      (newItems[index] as any)[field] = value
    }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerEmail || items.length === 0) {
      setMessage('请选择客户并添加至少一个产品')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/pi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      })
      if (res.ok) {
        setMessage('✅ PI创建成功！')
        setForm({ customerEmail: '', discount: '0', notes: '', validUntil: '' })
        setItems([])
      } else {
        const err = await res.json()
        setMessage(`❌ 创建失败: ${err.error}`)
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    }
    setSaving(false)
  }

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  const discPct = Number(form.discount) || 0
  const total = subtotal * (1 - discPct / 100)

  return (
    <AdminLayout active="PI管理">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/pi" className="text-sm text-gray-500 hover:text-amber-600">← 返回PI列表</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">📄 新建PI</h1>
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-4">客户信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择客户</label>
                <select value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required>
                  <option value="">请选择客户</option>
                  {customers.map((c: any) => (
                    <option key={c.id} value={c.email}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">折扣 (%)</label>
                <input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">有效期至</label>
                <input type="date" value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">产品明细</h3>
              <button type="button" onClick={addItem} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm">+ 添加产品</button>
            </div>
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">请添加产品到PI</div>
            ) : (
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <select value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500">
                      <option value={0}>选择产品</option>
                      {products.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} (${(p.wholesalePrice || p.price).toFixed(2)})</option>
                      ))}
                    </select>
                    {item.productId > 0 && products.find((p: any) => p.id === item.productId)?.flavor && (
                      <select value={item.flavor || ''} onChange={e => updateItem(i, 'flavor', e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500">
                        {(products.find((p: any) => p.id === item.productId)?.flavor || '').split(',').map((f: string) => f.trim()).filter(Boolean).map((f: string) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    )}
                    <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                      className="w-20 text-center px-3 py-2 border rounded-lg text-sm outline-none" min="1" placeholder="数量" />
                    <input type="number" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))}
                      className="w-28 px-3 py-2 border rounded-lg text-sm outline-none" step="0.01" placeholder="单价" />
                    <span className="text-sm font-bold text-amber-600 w-20 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                    <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-600 text-xl px-2">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              rows={3} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="付款条款、交货条件等..." />
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500">小计: <span className="font-medium text-gray-700">${subtotal.toFixed(2)}</span></p>
                {discPct > 0 && <p className="text-sm text-gray-500">折扣: <span className="font-medium text-red-500">{discPct}%</span></p>}
                <p className="text-xl font-bold text-amber-600 mt-2">总计: ${total.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Link href="/admin/pi" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">取消</Link>
              <button type="submit" disabled={saving}
                className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl disabled:opacity-50">
                {saving ? '创建中...' : '📄 创建PI'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
