'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [filterStatus, setFilterStatus] = useState<string>('all')

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
      countryCode: c.countryCode || '',
      company: c.company || '',
      companyAddress: c.companyAddress || '',
      state: c.state || '',
      country: c.country || '',
      type: c.type || 'wholesaler',
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
    const action = approved ? '通过审核' : '拒绝'
    if (!confirm(`确定要${action}该客户吗？`)) return
    const res = await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    })
    if (res.ok) {
      setMessage(`✅ 已${action}`)
      fetchCustomers()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      wholesaler: 'bg-blue-100 text-blue-700',
      store: 'bg-purple-100 text-purple-700',
      individual: 'bg-green-100 text-green-700',
    }
    const labels: Record<string, string> = {
      wholesaler: '批发商',
      store: '店铺',
      individual: '个人买家',
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[type] || 'bg-gray-100 text-gray-600'}`}>
        {labels[type] || type}
      </span>
    )
  }

  const filteredCustomers = filterStatus === 'all'
    ? customers
    : customers.filter(c => filterStatus === 'approved' ? c.approved : !c.approved)

  const countryName = (code: string) => {
    const map: Record<string, string> = {
      US: '美国', CN: '中国', HK: '香港', TW: '台湾', GB: '英国',
      JP: '日本', KR: '韩国', VN: '越南', TH: '泰国', MY: '马来西亚',
      SG: '新加坡', ID: '印尼', PH: '菲律宾', AU: '澳大利亚', NZ: '新西兰',
      IN: '印度', AE: '阿联酋', SA: '沙特', DE: '德国', FR: '法国',
      IT: '意大利', ES: '西班牙', NL: '荷兰', CA: '加拿大',
    }
    return map[code] || code
  }

  const pendingCount = customers.filter(c => !c.approved).length

  return (
    <AdminLayout active="客户管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👥 客户管理</h1>
            <p className="text-sm text-gray-500 mt-1">
              管理客户信息、审核状态
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  {pendingCount} 个待审核
                </span>
              )}
            </p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: `全部 (${customers.length})` },
            { key: 'pending', label: `⏳ 待审核 (${pendingCount})` },
            { key: 'approved', label: `✅ 已通过 (${customers.filter(c => c.approved).length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === tab.key
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">客户</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">公司信息</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">联系方式</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">类型</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">备注</th>
                  <th className="text-center px-3 py-3 text-sm font-semibold text-gray-600">审核状态</th>
                  <th className="text-right px-3 py-3 text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">加载中...</td></tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">暂无客户</td></tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className={`hover:bg-gray-50 ${!c.approved ? 'bg-amber-50/50' : ''}`}>
                      {editingId === c.id ? (
                        <>
                          <td className="px-3 py-2">
                            <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="姓名" />
                            <input value={c.email} disabled
                              className="w-full px-2 py-1 border rounded text-sm mt-1 bg-gray-50 text-gray-500" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="公司" />
                            <input value={editForm.companyAddress} onChange={e => setEditForm({...editForm, companyAddress: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm mt-1" placeholder="地址" />
                            <div className="flex gap-1 mt-1">
                              <input value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})}
                                className="w-1/2 px-2 py-1 border rounded text-sm" placeholder="州/省" />
                              <input value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})}
                                className="w-1/2 px-2 py-1 border rounded text-sm" placeholder="国家代码" />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <input value={editForm.countryCode} onChange={e => setEditForm({...editForm, countryCode: e.target.value})}
                                className="w-20 px-2 py-1 border rounded text-sm" placeholder="+86" />
                              <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                className="flex-1 px-2 py-1 border rounded text-sm" placeholder="电话" />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm">
                              <option value="wholesaler">批发商</option>
                              <option value="store">店铺</option>
                              <option value="individual">个人买家</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="备注" />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${editForm.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {editForm.approved ? '已通过' : '待审核'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap">
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
                            {c.company && <p className="font-medium">{c.company}</p>}
                            {c.companyAddress && <p className="text-xs text-gray-400">{c.companyAddress}</p>}
                            {(c.state || c.country) && (
                              <p className="text-xs text-gray-400">
                                {[c.state, c.country ? countryName(c.country) : ''].filter(Boolean).join(', ')}
                              </p>
                            )}
                            {!c.company && !c.companyAddress && !c.country && <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {c.phone && (
                              <p>{(c.countryCode || '') + ' ' + c.phone}</p>
                            )}
                            {!c.phone && <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-3 py-3">{typeBadge(c.type || 'wholesaler')}</td>
                          <td className="px-3 py-3 text-sm text-gray-500 max-w-[120px] truncate">{c.notes || '-'}</td>
                          <td className="px-3 py-3 text-center">
                            {c.approved ? (
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">✅ 已通过</span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-700">⏳ 待审核</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              {!c.approved && (
                                <>
                                  <button onClick={() => toggleApproved(c.id, true)}
                                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-medium">通过</button>
                                  <button onClick={() => toggleApproved(c.id, false)}
                                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-medium">拒绝</button>
                                </>
                              )}
                              <button onClick={() => startEdit(c)}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 font-medium">编辑</button>
                            </div>
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
