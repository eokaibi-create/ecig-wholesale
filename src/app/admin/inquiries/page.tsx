'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  createdAt: string
}

interface Inquiry {
  id: number
  customerId: number
  customer: Customer
  subject: string | null
  message: string
  status: string
  adminReply: string | null
  adminNote: string | null
  createdAt: string
  updatedAt: string
}

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: '新询价', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: '已联系', color: 'bg-yellow-100 text-yellow-700' },
  replied: { label: '已回复', color: 'bg-purple-100 text-purple-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-600' },
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [editReply, setEditReply] = useState('')
  const [editNote, setEditNote] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    setLoading(true)
    const res = await fetch('/api/inquiries')
    const data = await res.json()
    setInquiries(data)
    setLoading(false)
  }

  function openDetail(inq: Inquiry) {
    setSelected(inq)
    setEditReply(inq.adminReply || '')
    setEditNote(inq.adminNote || '')
    setEditStatus(inq.status)
  }

  async function saveDetail() {
    if (!selected) return
    setSaving(true)
    const res = await fetch('/api/inquiries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, status: editStatus, adminReply: editReply, adminNote: editNote }),
    })
    if (res.ok) {
      const updated = await res.json()
      setSelected(updated)
      setInquiries(prev => prev.map(i => i.id === updated.id ? updated : i))
    }
    setSaving(false)
  }

  async function deleteInquiry(id: number) {
    const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setInquiries(prev => prev.filter(i => i.id !== id))
      if (selected?.id === id) setSelected(null)
    }
    setConfirmDelete(null)
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)

  return (
    <AdminLayout active="询价管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">询价管理</h1>
          <span className="text-sm text-gray-500">共 {inquiries.length} 条</span>
        </div>

        {/* 状态筛选 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'all', label: '全部' },
            { key: 'new', label: '新询价' },
            { key: 'contacted', label: '已联系' },
            { key: 'replied', label: '已回复' },
            { key: 'completed', label: '已完成' },
            { key: 'closed', label: '已关闭' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                filter === s.key ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{s.label}</button>
          ))}
        </div>

        {/* 主区域：列表 + 详情 */}
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* 左侧列表 */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">加载中...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400">暂无询价</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">客户</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">公司</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">需求</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => openDetail(inq)}
                      className={`hover:bg-gray-50 cursor-pointer transition ${
                        selected?.id === inq.id ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{inq.customer.name}</p>
                        <p className="text-xs text-gray-400">{inq.customer.email}</p>
                        {inq.customer.phone && <p className="text-xs text-gray-400">{inq.customer.phone}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{inq.customer.company || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{inq.message}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusMap[inq.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {statusMap[inq.status]?.label || inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 右侧详情面板 */}
          {selected && (
            <div className="w-full lg:w-[420px] bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">询价详情</h2>
                <button
                  onClick={() => setConfirmDelete(selected.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >🗑️ 删除</button>
              </div>

              {/* 客户信息 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
                <p><span className="text-gray-400">客户：</span><span className="font-medium">{selected.customer.name}</span></p>
                <p><span className="text-gray-400">邮箱：</span>{selected.customer.email}</p>
                {selected.customer.phone && <p><span className="text-gray-400">电话：</span>{selected.customer.phone}</p>}
                {selected.customer.company && <p><span className="text-gray-400">公司：</span>{selected.customer.company}</p>}
                <p><span className="text-gray-400">提交时间：</span>{new Date(selected.createdAt).toLocaleString('zh-CN')}</p>
              </div>

              {/* 询价内容 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">询价内容</label>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">{selected.message}</div>
              </div>

              {/* 状态 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="new">新询价</option>
                  <option value="contacted">已联系</option>
                  <option value="replied">已回复</option>
                  <option value="completed">已完成</option>
                  <option value="closed">已关闭</option>
                </select>
              </div>

              {/* 管理员回复 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">回复客户</label>
                <textarea
                  value={editReply}
                  onChange={e => setEditReply(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="输入回复内容..."
                />
              </div>

              {/* 内部备注 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内部备注</label>
                <textarea
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="只有管理员可见..."
                />
              </div>

              {/* 保存按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={saveDetail}
                  disabled={saving}
                  className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50"
                >{saving ? '保存中...' : '💾 保存'}</button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >关闭</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <p className="text-gray-900 font-medium mb-4">确定删除这条询价？</p>
            <p className="text-sm text-gray-500 mb-6">删除后不可恢复。</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >取消</button>
              <button
                onClick={() => deleteInquiry(confirmDelete)}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
              >确认删除</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
