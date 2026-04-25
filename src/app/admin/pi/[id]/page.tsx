'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PIDetailPage() {
  const params = useParams()
  const [pi, setPi] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/pi/${params.id}`).then(r => r.json()).then(setPi).catch(() => {}).finally(() => setLoading(false))
    }
  }, [params?.id])

  return (
    <AdminLayout active="PI管理">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/pi" className="text-sm text-gray-500 hover:text-amber-600">← 返回PI列表</Link>
        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : !pi ? (
          <div className="text-center py-12 text-gray-400">PI不存在</div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📄 {pi.piNumber}</h1>
                <p className="text-sm text-gray-500">客户: {pi.customer?.name} ({pi.customer?.email})</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                pi.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                pi.status === 'approved' ? 'bg-green-100 text-green-700' :
                pi.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                pi.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
              }`}>{pi.status}</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b"><tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">产品</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">数量</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">单价</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">小计</th>
                </tr></thead>
                <tbody className="divide-y">
                  {pi.items?.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.productName}{item.flavor ? <span className="text-xs text-gray-400 ml-2">🎨 {item.flavor}</span> : ''}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">${(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium">${(item.total || item.quantity * item.unitPrice || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t px-4 py-4 text-right space-y-1">
                {pi.discount > 0 && <p className="text-sm text-gray-500">折扣: {pi.discount}%</p>}
                <p className="text-lg font-bold text-amber-600">总计: ${(pi.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>
            {pi.notes && <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600"><p className="font-medium text-gray-700 mb-1">备注:</p>{pi.notes}</div>}
            <div className="mt-4 text-sm text-gray-400">创建于: {new Date(pi.createdAt).toLocaleString()}</div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
