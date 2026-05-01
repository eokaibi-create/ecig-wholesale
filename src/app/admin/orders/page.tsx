'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

// ====== 类型定义 ======
interface Order {
 id: number
 customer: { name: string; email: string } | null
 total: number
 status: string
 note: string | null
 items: any
 createdAt: string
}

interface Inquiry {
 id: number
 customerId: number
 customer: { id: number; name: string; email: string; phone: string | null; company: string | null; createdAt: string }
 subject: string | null
 message: string
 status: string
 adminReply: string | null
 adminNote: string | null
 createdAt: string
 updatedAt: string
}

const orderStatusMap: Record<string, string> = {
 pending: '待处理', processing: '处理中', shipped: '已发货', completed: '已完成', cancelled: '已取消',
}
const orderStatusColor: Record<string, string> = {
 pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700',
 shipped: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
}
const inquiryStatusMap: Record<string, { label: string; color: string }> = {
 new: { label: '新询价', color: 'bg-blue-100 text-blue-700' },
 contacted: { label: '已联系', color: 'bg-yellow-100 text-yellow-700' },
 replied: { label: '已回复', color: 'bg-purple-100 text-purple-700' },
 completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
 closed: { label: '已关闭', color: 'bg-gray-100 text-gray-600' },
}

export default function AdminOrdersPage() {
 const [activeTab, setActiveTab] = useState<'orders' | 'inquiries'>('orders')

 return (
 <AdminLayout active="订单管理">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <h1 className="text-2xl font-bold text-gray-900 mb-6">订单管理</h1>

 <div className="flex border-b border-gray-200 mb-6">
 {[
 { key: 'orders' as const, label: '订单列表', icon: '' },
 { key: 'inquiries' as const, label: '询价管理', icon: '' },
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

 {activeTab === 'orders' && <OrdersTab />}
 {activeTab === 'inquiries' && <InquiriesTab />}
 </div>
 </AdminLayout>
 )
}

// ====== Tab 1: 订单列表 ======
function OrdersTab() {
 const [orders, setOrders] = useState<Order[]>([])
 const [loading, setLoading] = useState(true)

 const fetchOrders = async () => {
 setLoading(true)
 const res = await fetch('/api/orders')
 setOrders(await res.json())
 setLoading(false)
 }

 useEffect(() => { fetchOrders() }, [])

 const updateStatus = async (id: number, status: string) => {
 await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
 fetchOrders()
 }

 const handleDelete = async (id: number) => {
 if (!confirm('确定删除此订单？')) return
 await fetch(`/api/orders/${id}`, { method: 'DELETE' })
 fetchOrders()
 }

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
 <table className="w-full min-w-[800px]">
 <thead className="bg-gray-50 border-b">
 <tr>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">订单号</th>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">客户</th>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">商品</th>
 <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">总金额</th>
 <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
 <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">日期</th>
 <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
 </tr>
 </thead>
 <tbody className="divide-y">
 {loading ? (
 <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
 ) : orders.length === 0 ? (
 <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">暂无订单</td></tr>
 ) : orders.map((o) => {
 const items = Array.isArray(o.items) ? o.items : []
 return (
 <tr key={o.id} className="hover:bg-gray-50">
 <td className="px-4 py-3 font-medium text-gray-900">#{o.id}</td>
 <td className="px-4 py-3">
 {o.customer ? (
 <div>
 <p className="text-sm font-medium text-gray-900">{o.customer.name}</p>
 <p className="text-xs text-gray-400">{o.customer.email}</p>
 </div>
 ) : <span className="text-sm text-gray-400">匿名客户</span>}
 </td>
 <td className="px-4 py-3 text-sm text-gray-600">
 {items.map((it: any, i: number) => <div key={i}>{it.name} x{it.qty}</div>)}
 </td>
 <td className="px-4 py-3 text-right font-bold text-amber-600">${o.total.toFixed(2)}</td>
 <td className="px-4 py-3 text-center">
 <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
 className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${orderStatusColor[o.status] || 'bg-gray-100 text-gray-700'}`}>
 {Object.entries(orderStatusMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
 </select>
 </td>
 <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
 <td className="px-4 py-3 text-right">
 <button onClick={() => handleDelete(o.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">删除</button>
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 )
}

// ====== Tab 2: 询价管理 ======
function InquiriesTab() {
 const [inquiries, setInquiries] = useState<Inquiry[]>([])
 const [loading, setLoading] = useState(true)
 const [selected, setSelected] = useState<Inquiry | null>(null)
 const [editReply, setEditReply] = useState('')
 const [editNote, setEditNote] = useState('')
 const [editStatus, setEditStatus] = useState('')
 const [sendEmail, setSendEmail] = useState(false)
 const [saving, setSaving] = useState(false)
 const [filter, setFilter] = useState('all')
 const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

 useEffect(() => { fetchInquiries() }, [])

 async function fetchInquiries() {
 setLoading(true)
 const res = await fetch('/api/inquiries')
 setInquiries(await res.json())
 setLoading(false)
 }

 function openDetail(inq: Inquiry) {
 setSelected(inq)
 setEditReply(inq.adminReply || '')
 setEditNote(inq.adminNote || '')
 setEditStatus(inq.status)
 setSendEmail(false)
 }

 async function saveDetail() {
 if (!selected) return
 setSaving(true)
 const res = await fetch('/api/inquiries', {
 method: 'PUT',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id: selected.id, status: editStatus, adminReply: editReply, adminNote: editNote, sendEmailToCustomer: sendEmail }),
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
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex gap-2 flex-wrap">
 {[
 { key: 'all', label: '全部' },
 { key: 'new', label: '新询价' },
 { key: 'contacted', label: '已联系' },
 { key: 'replied', label: '已回复' },
 { key: 'completed', label: '已完成' },
 { key: 'closed', label: '已关闭' },
 ].map(s => (
 <button key={s.key} onClick={() => setFilter(s.key)}
 className={`px-3 py-1.5 text-sm rounded-lg transition ${filter === s.key ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
 {s.label}
 </button>
 ))}
 </div>
 <span className="text-sm text-gray-500">共 {inquiries.length} 条</span>
 </div>

 <div className="flex gap-6 flex-col lg:flex-row">
 {/* 列表 */}
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
 <tr key={inq.id} onClick={() => openDetail(inq)}
 className={`hover:bg-gray-50 cursor-pointer transition ${selected?.id === inq.id ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''}`}>
 <td className="px-4 py-3">
 <p className="font-medium text-gray-900">{inq.customer.name}</p>
 <p className="text-xs text-gray-400">{inq.customer.email}</p>
 {inq.customer.phone && <p className="text-xs text-gray-400">{inq.customer.phone}</p>}
 </td>
 <td className="px-4 py-3 text-sm text-gray-600">{inq.customer.company || '-'}</td>
 <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{inq.message}</td>
 <td className="px-4 py-3">
 <span className={`text-xs px-2 py-1 rounded-full ${inquiryStatusMap[inq.status]?.color || 'bg-gray-100 text-gray-600'}`}>
 {inquiryStatusMap[inq.status]?.label || inq.status}
 </span>
 </td>
 <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{new Date(inq.createdAt).toLocaleDateString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {/* 详情面板 */}
 {selected && (
 <div className="w-full lg:w-[420px] bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
 <div className="flex items-center justify-between">
 <h2 className="text-lg font-bold text-gray-900">询价详情</h2>
 <button onClick={() => setConfirmDelete(selected.id)} className="text-xs text-red-500 hover:text-red-700"> 删除</button>
 </div>

 <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
 <p><span className="text-gray-400">客户：</span><span className="font-medium">{selected.customer.name}</span></p>
 <p><span className="text-gray-400">邮箱：</span>{selected.customer.email}</p>
 {selected.customer.phone && <p><span className="text-gray-400">电话：</span>{selected.customer.phone}</p>}
 {selected.customer.company && <p><span className="text-gray-400">公司：</span>{selected.customer.company}</p>}
 <p><span className="text-gray-400">提交时间：</span>{new Date(selected.createdAt).toLocaleString()}</p>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">询价内容</label>
 <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">{selected.message}</div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
 <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500">
 <option value="new">新询价</option>
 <option value="contacted">已联系</option>
 <option value="replied">已回复</option>
 <option value="completed">已完成</option>
 <option value="closed">已关闭</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">回复客户</label>
 <textarea value={editReply} onChange={e => setEditReply(e.target.value)} rows={3}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
 placeholder="输入回复内容..." />
 </div>

 {editReply && (
 <div>
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)}
 className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500" />
 <span className="text-sm font-medium text-gray-700"> 发送邮件给客户</span>
 </label>
 {sendEmail && <p className="text-xs text-green-600 mt-1 ml-6">保存后将自动发送回复到 {selected?.customer.email}</p>}
 </div>
 )}

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">内部备注</label>
 <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={2}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
 placeholder="只有管理员可见..." />
 </div>

 <div className="flex gap-2">
 <button onClick={saveDetail} disabled={saving}
 className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50">
 {saving ? '保存中...' : ' 保存'}
 </button>
 <button onClick={() => setSelected(null)}
 className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">关闭</button>
 </div>
 </div>
 )}
 </div>

 {confirmDelete && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
 <p className="text-gray-900 font-medium mb-4">确定删除这条询价？</p>
 <p className="text-sm text-gray-500 mb-6">删除后不可恢复。</p>
 <div className="flex gap-3 justify-end">
 <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
 <button onClick={() => deleteInquiry(confirmDelete)} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确认删除</button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
