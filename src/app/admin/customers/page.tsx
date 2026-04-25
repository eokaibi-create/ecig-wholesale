'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers')
      if (res.ok) setCustomers(await res.json())
    } catch (e) {}
    setLoading(false)
  }

  useEffect(() => { fetchCustomers() }, [])

  const startEdit = (c: any) => {
    setEditingId(c.id)
    setEditForm({
      name: c.name,
      phone: c.phone || '',
      company: c.company || '',
      companyAddress: c.companyAddress || '',
      state: c.state || '',
      notes: c.notes || '',
      approved: c.approved,
    })
  }

  const saveEdit = async (id: number) => {
    const res = await fetch('/api/customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    })
    if (res.ok) {
      setMessage('✅ 客户信息已更新')
      setEditingId(null)
      fetchCustomers()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const toggleApproved = async (id: number, approved: boolean) => {
    await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    })
    fetchCustomers()
  }

  return (
    <AdminLayout active="客户管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👥 客户管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理客户信息，支持编辑</p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">客户</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">公司/地址</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">电话</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">备注</th>
                  <th className="text-center px-3 py-3 text-sm font-semibold text-gray-600">状态</th>
                  <th className="text-right px-3 py-3 text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">加载中...</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">暂无客户</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      {editingId === c.id ? (
                        <>
                          <td className="px-3 py-2">
                            <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="姓名" />
                            <input value={c.email} disabled
                              className="w-full px-2 py-1 border rounded text-sm mt-1 bg-gray-50" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="公司" />
                            <input value={editForm.companyAddress} onChange={e => setEditForm({...editForm, companyAddress: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm mt-1" placeholder="地址" />
                            <input value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm mt-1" placeholder="州/省" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="电话" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="备注" />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => toggleApproved(c.id, !editForm.approved)}
                              className={`text-xs px-2 py-1 rounded-full font-medium ${editForm.approved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {editForm.approved ? '已审核' : '待审核'}
                            </button>
                          </td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <button onClick={() => saveEdit(c.id)} className="text-sm text-green-600 hover:text-green-700 font-medium">保存</button>
                            <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-600">取消</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-3">
                            <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {c.company && <p>{c.company}</p>}
                            {c.companyAddress && <p className="text-xs text-gray-400">{c.companyAddress}</p>}
                            {!c.company && !c.companyAddress && <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">{c.phone || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-500 max-w-[150px] truncate">{c.notes || '-'}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.approved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {c.approved ? '已审核' : '待审核'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button onClick={() => startEdit(c)} className="text-sm text-amber-600 hover:text-amber-700 font-medium">编辑</button>
                          </td>
                        </>
                      )}
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
