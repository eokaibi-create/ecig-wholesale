'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

// ====== 类型定义 ======
interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  companyAddress: string | null
  state: string | null
  country: string | null
  type: string | null
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

const inquiryStatusMap: Record<string, { label: string; color: string }> = {
  new: { label: '新询价', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: '已联系', color: 'bg-yellow-100 text-yellow-700' },
  replied: { label: '已回复', color: 'bg-purple-100 text-purple-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-600' },
}

const inquiryStatusOptions = [
  { key: 'new', label: '新询价' },
  { key: 'contacted', label: '已联系' },
  { key: 'replied', label: '已回复' },
  { key: 'completed', label: '已完成' },
  { key: 'closed', label: '已关闭' },
]

export default function AdminInquiriesPage() {
  return (
    <AdminLayout active="询价管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">询价管理</h1>
        <InquiriesContent />
      </div>
    </AdminLayout>
  )
}

function InquiriesContent() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [editReply, setEditReply] = useState('')
  const [editNote, setEditNote] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [sendEmail, setSendEmail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; msg: string }>({ show: false, type: 'success', msg: '' })

  useEffect(() => { fetchInquiries() }, [])

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ show: true, type, msg })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  async function fetchInquiries() {
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries')
      if (res.ok) setInquiries(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }

  function openDetail(inq: Inquiry) {
    setSelected(inq)
    setEditReply(inq.adminReply || '')
    setEditNote(inq.adminNote || '')
    setEditStatus(inq.status)
    setSendEmail(false)
    setShowSidebar(true)
  }

  async function saveDetail() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          status: editStatus,
          adminReply: editReply,
          adminNote: editNote,
          sendEmailToCustomer: sendEmail,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setSelected(updated)
        setInquiries(prev => prev.map(i => i.id === updated.id ? updated : i))
        showToast('success', sendEmail && editReply ? '已保存并发送邮件给客户' : '已保存')
        setSendEmail(false)
      } else {
        showToast('error', '保存失败')
      }
    } catch {
      showToast('error', '保存失败')
    }
    setSaving(false)
  }

  async function deleteInquiry(id: number) {
    if (!confirm('确定删除此询价记录？')) return
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id))
        if (selected?.id === id) { setSelected(null); setShowSidebar(false) }
        showToast('success', '已删除')
      } else {
        showToast('error', '删除失败')
      }
    } catch {
      showToast('error', '删除失败')
    }
  }

  function getStatusColor(status: string): string {
    return inquiryStatusMap[status]?.color || 'bg-gray-100 text-gray-600'
  }
  function getStatusLabel(status: string): string {
    return inquiryStatusMap[status]?.label || status
  }

  // 过滤 + 搜索
  const filtered = inquiries.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false
    if (search) {
      const kw = search.toLowerCase()
      const c = i.customer
      return c.name.toLowerCase().includes(kw) ||
        c.email.toLowerCase().includes(kw) ||
        (c.company?.toLowerCase().includes(kw) ?? false) ||
        i.message.toLowerCase().includes(kw) ||
        (i.subject?.toLowerCase().includes(kw) ?? false)
    }
    return true
  })

  // 统计
  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    completed: inquiries.filter(i => i.status === 'completed').length,
  }

  return (
    <div className="space-y-4">
      {/* Toast 提示 */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.type === 'success' ? '✅ ' : '❌ '}{toast.msg}
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '全部', count: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: '新询价', count: stats.new, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
          { label: '已回复', count: stats.replied, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          { label: '已完成', count: stats.completed, color: 'bg-green-50 text-green-700 border-green-200' },
        ].map(s => (
          <div key={s.label} className={'rounded-lg border px-4 py-3 ' + s.color}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.count}</p>
          </div>
        ))}
      </div>

      {/* 筛选 & 搜索 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: '全部' },
            ...inquiryStatusOptions,
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={'px-3 py-1.5 text-sm rounded-lg transition ' + (filter === s.key ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="搜索客户名/邮箱/公司/内容..."
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <span className="text-sm text-gray-400 whitespace-nowrap">共 {filtered.length} 条</span>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* 列表 */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">加载中...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {search ? '未找到匹配的询价' : '暂无询价记录'}
            </div>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">客户</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">主题</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">时间</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(inq => (
                  <tr key={inq.id}
                    onClick={() => openDetail(inq)}
                    className={'hover:bg-amber-50/50 cursor-pointer transition-colors ' + (selected?.id === inq.id ? 'bg-amber-50/50' : '') + (inq.status === 'new' ? ' ring-1 ring-inset ring-blue-200/50' : '')}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-400">#{inq.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{inq.customer.name}</div>
                      <div className="text-xs text-gray-400">
                        {inq.customer.email}
                        {inq.customer.company && <span className="ml-1">· {inq.customer.company}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                      {inq.subject || '询价咨询'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={'inline-block text-xs font-medium px-2.5 py-1 rounded-full ' + getStatusColor(inq.status)}>
                        {getStatusLabel(inq.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div>{new Date(inq.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(inq.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={(e) => { e.stopPropagation(); deleteInquiry(inq.id) }}
                        className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 详情侧边栏 */}
        {selected && (
          <div className={(showSidebar ? 'fixed inset-0 z-40 lg:static lg:z-auto' : 'hidden lg:block')}>
            <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setShowSidebar(false)} />
            <div className={'relative z-40 lg:z-auto w-full lg:w-[420px] bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-y-auto max-h-[80vh] lg:max-h-none ' + (showSidebar ? 'fixed right-0 top-0 h-full max-h-full shadow-2xl' : '')}>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-gray-900">询价详情</h3>
                <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={'text-xs font-medium px-2.5 py-1 rounded-full ' + getStatusColor(selected.status)}>
                  {getStatusLabel(selected.status)}
                </span>
                <span className="text-xs text-gray-400">#{selected.id}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">客户信息</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400">姓名：</span>{selected.customer.name}</p>
                  <p><span className="text-gray-400">邮箱：</span>{selected.customer.email}</p>
                  {selected.customer.phone && <p><span className="text-gray-400">电话：</span>{selected.customer.phone}</p>}
                  {selected.customer.company && <p><span className="text-gray-400">公司：</span>{selected.customer.company}</p>}
                  {selected.customer.type && <p><span className="text-gray-400">类型：</span>{selected.customer.type === 'wholesaler' ? '批发商' : '零售商'}</p>}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">询价内容</h4>
                <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                  {selected.message}
                </div>
                <p className="text-xs text-gray-400 mt-1">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              {selected.adminReply && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-green-600 uppercase mb-2">已回复内容</h4>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                    {selected.adminReply}
                  </div>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">处理询价</h4>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">状态</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400">
                    {inquiryStatusOptions.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">回复内容 <span className="text-gray-400 font-normal">(客户可见)</span></label>
                  <textarea value={editReply} onChange={e => setEditReply(e.target.value)}
                    rows={4} placeholder="输入回复内容..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">内部备注 <span className="text-gray-400 font-normal">(仅管理员可见)</span></label>
                  <textarea value={editNote} onChange={e => setEditNote(e.target.value)}
                    rows={2} placeholder="添加内部备注..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-400" />
                  <span>发送邮件通知客户（仅当有回复内容时）</span>
                </label>
                <div className="flex gap-2 pt-1">
                  <button onClick={saveDetail} disabled={saving}
                    className="flex-1 bg-amber-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-amber-600 transition disabled:opacity-50">
                    {saving ? '保存中...' : '保存'}
                  </button>
                  <button onClick={() => deleteInquiry(selected.id)}
                    className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
