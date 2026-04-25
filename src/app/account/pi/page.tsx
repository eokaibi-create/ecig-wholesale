'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CustomerPIPage() {
  const [pis, setPis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('customer_token')
    if (!token) { setLoading(false); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[0]))
      setCustomer(payload)
      fetch('/api/pi').then(r => r.json()).then(setPis).catch(() => {})
    } catch(e) {}
    setLoading(false)
  }, [])

  if (!customer) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8"><div className="text-6xl mb-4">📄</div><h1 className="text-2xl font-bold mb-2">请先登录</h1>
        <Link href="/login" className="px-8 py-3 bg-amber-500 text-black font-bold rounded-xl inline-block mt-4">去登录</Link></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-500">VAPOR-X</Link>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-sm text-gray-600 hover:text-amber-500">🛒 购物车</Link>
            <span className="text-sm text-gray-500">👤 {customer.email || customer.name}</span>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📄 我的PI (形式发票)</h1>
        {loading ? <div className="text-center py-12 text-gray-400">加载中...</div> : pis.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">暂无PI</h2>
            <p className="text-gray-400">管理员尚未为您创建形式发票</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pis.map(pi => (
              <div key={pi.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-bold text-lg text-gray-900">{pi.piNumber}</p>
                    <p className="text-sm text-gray-500">{new Date(pi.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-600">${(pi.totalAmount || 0).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pi.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      pi.status === 'approved' ? 'bg-green-100 text-green-700' :
                      pi.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>{pi.status}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500">{pi.items?.length || 0} 件产品</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
