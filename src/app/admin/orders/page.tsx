'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface Order {
  id: number
  customer: { name: string; email: string } | null
  total: number
  status: string
  note: string | null
  items: any
  createdAt: string
}

const statusMap: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    const res = await fetch('/api/orders')
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) fetchOrders()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此订单？')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    fetchOrders()
  }

  return (
    <AdminLayout active="订单管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">订单管理</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
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
              ) : (
                orders.map((o) => {
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
                        ) : (
                          <span className="text-sm text-gray-400">匿名客户</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {items.map((it: any, i: number) => (
                          <div key={i}>{it.name} x{it.qty}</div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amber-600">${o.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor[o.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {Object.entries(statusMap).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(o.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">删除</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
