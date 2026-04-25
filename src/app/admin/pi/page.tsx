'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'

export default function AdminPIPage() {
  const [pis, setPis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPIs = async () => {
    try {
      const res = await fetch('/api/pi')
      if (res.ok) setPis(await res.json())
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => { fetchPIs() }, [])

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/pi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchPIs()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <AdminLayout active="PI管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📄 PI管理 (Proforma Invoice)</h1>
            <p className="text-sm text-gray-500 mt-1">管理客户形式发票</p>
          </div>
          <Link href="/admin/pi/create" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">
            + 新建PI
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">PI编号</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">客户</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">产品数</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">金额</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">创建时间</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
              ) : pis.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">暂无PI</td></tr>
              ) : (
                pis.map(pi => (
                  <tr key={pi.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{pi.piNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{pi.customer?.name || '-'}</p>
                      <p className="text-xs text-gray-400">{pi.customer?.email || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pi.items?.length || 0}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-amber-600">${(pi.totalAmount || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <select value={pi.status} onChange={e => updateStatus(pi.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColors[pi.status] || 'bg-gray-100 text-gray-600'}`}>
                        <option value="pending">待处理</option>
                        <option value="approved">已批准</option>
                        <option value="sent">已发送</option>
                        <option value="paid">已付款</option>
                        <option value="rejected">已拒绝</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(pi.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link href={`/admin/pi/${pi.id}`} className="text-sm text-amber-600 hover:text-amber-700 font-medium">查看</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
