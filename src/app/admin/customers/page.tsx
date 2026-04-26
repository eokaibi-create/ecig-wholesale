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
      rejected: c.rejected,
    })
  }

  const saveEdit = async (id: number) => {
    const res = await fetch('/api/customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    })
    if (res.ok) {
      setMessage('✅ Customer updated')
      setEditingId(null)
      fetchCustomers()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const approveCustomer = async (id: number) => {
    if (!confirm('Approve this customer?')) return
    const res = await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: true, rejected: false }),
    })
    if (res.ok) {
      setMessage('✅ Approved')
      fetchCustomers()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const rejectCustomer = async (id: number) => {
    if (!confirm('Reject this customer?')) return
    const res = await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rejected: true, approved: false }),
    })
    if (res.ok) {
      setMessage('✅ Rejected')
      fetchCustomers()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteCustomer = async (id: number) => {
    if (!confirm('Delete this customer permanently?\nThis will also delete all their inquiries and orders.')) return
    const res = await fetch(`/api/customers?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage('🗑️ Customer deleted')
      fetchCustomers()
    } else {
      const err = await res.json()
      setMessage(`❌ ${err.error}`)
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const resetReview = async (id: number) => {
    if (!confirm('Reset to pending review?')) return
    const res = await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: false, rejected: false }),
    })
    if (res.ok) {
      setMessage('✅ Reset to pending')
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
      wholesaler: 'Wholesaler',
      store: 'Store',
      individual: 'Individual',
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[type] || 'bg-gray-100 text-gray-600'}`}>
        {labels[type] || type}
      </span>
    )
  }

  const pendingCount = customers.filter(c => !c.approved && !c.rejected).length
  const approvedCount = customers.filter(c => c.approved).length
  const rejectedCount = customers.filter(c => c.rejected).length

  const filteredCustomers = customers.filter(c => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return !c.approved && !c.rejected
    if (filterStatus === 'approved') return c.approved
    if (filterStatus === 'rejected') return c.rejected
    return true
  })

  return (
    <AdminLayout active="Customers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👥 Customers</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage customers, review and approve registrations
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  {pendingCount} pending
                </span>
              )}
            </p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('✅') || message.includes('🗑️')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: 'all', label: `All (${customers.length})` },
            { key: 'pending', label: `⏳ Pending (${pendingCount})` },
            { key: 'approved', label: `✅ Approved (${approvedCount})` },
            { key: 'rejected', label: `❌ Rejected (${rejectedCount})` },
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
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">Company</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left px-3 py-3 text-sm font-semibold text-gray-600">Notes</th>
                  <th className="text-center px-3 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right px-3 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Loading...</td></tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No customers found</td></tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className={`hover:bg-gray-50 ${
                      !c.approved && !c.rejected ? 'bg-amber-50/50' :
                      c.rejected ? 'bg-red-50/50' : ''
                    }`}>
                      {editingId === c.id ? (
                        <>
                          <td className="px-3 py-2">
                            <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="Name" />
                            <input value={c.email} disabled
                              className="w-full px-2 py-1 border rounded text-sm mt-1 bg-gray-50 text-gray-500" />
                          </td>
                          <td className="px-3 py-2">
                            <input value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="Company" />
                            <input value={editForm.companyAddress} onChange={e => setEditForm({...editForm, companyAddress: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm mt-1" placeholder="Address" />
                            <div className="flex gap-1 mt-1">
                              <input value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})}
                                className="w-1/2 px-2 py-1 border rounded text-sm" placeholder="State" />
                              <input value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})}
                                className="w-1/2 px-2 py-1 border rounded text-sm" placeholder="Country" />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <input value={editForm.countryCode} onChange={e => setEditForm({...editForm, countryCode: e.target.value})}
                                className="w-20 px-2 py-1 border rounded text-sm" placeholder="+86" />
                              <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                className="flex-1 px-2 py-1 border rounded text-sm" placeholder="Phone" />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm">
                              <option value="wholesaler">Wholesaler</option>
                              <option value="store">Store</option>
                              <option value="individual">Individual</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})}
                              className="w-full px-2 py-1 border rounded text-sm" placeholder="Notes" />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              editForm.approved ? 'bg-green-100 text-green-700' :
                              editForm.rejected ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {editForm.approved ? 'Approved' : editForm.rejected ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => saveEdit(c.id)} className="text-sm text-green-600 hover:text-green-700 font-medium">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-600">Cancel</button>
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
                                {[c.state, c.country].filter(Boolean).join(', ')}
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
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">✅ Approved</span>
                            ) : c.rejected ? (
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700">❌ Rejected</span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-700">⏳ Pending</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              {!c.approved && !c.rejected && (
                                <>
                                  <button onClick={() => approveCustomer(c.id)}
                                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-medium">Approve</button>
                                  <button onClick={() => rejectCustomer(c.id)}
                                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-medium">Reject</button>
                                </>
                              )}
                              {c.approved && (
                                <>
                                  <button onClick={() => rejectCustomer(c.id)}
                                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-medium">Reject</button>
                                  <button onClick={() => resetReview(c.id)}
                                    className="text-xs px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 font-medium">Reset</button>
                                </>
                              )}
                              {c.rejected && (
                                <>
                                  <button onClick={() => approveCustomer(c.id)}
                                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-medium">Approve</button>
                                  <button onClick={() => resetReview(c.id)}
                                    className="text-xs px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 font-medium">Reset</button>
                                </>
                              )}
                              <button onClick={() => startEdit(c)}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 font-medium">Edit</button>
                              <button onClick={() => deleteCustomer(c.id)}
                                className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 font-medium">Delete</button>
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
