'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageProvider'

interface Order {
 id: number
 items: any[]
 total: number
 status: string
 note: string | null
 createdAt: string
}

export default function OrdersPage() {
 const router = useRouter()
 const { t } = useLanguage()
 const [orders, setOrders] = useState<Order[]>([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState('')

 useEffect(() => {
 fetch('/api/auth/customer/me')
 .then(res => res.json())
 .then(data => {
 if (!data.authenticated) {
 router.push('/login')
 return
 }
 fetch('/api/orders/customer')
 .then(res => res.json())
 .then(setOrders)
 .finally(() => setLoading(false))
 })
 }, [router])

 const statusMap: Record<string, { label: string; color: string }> = {
 pending: { label: t('orders.pending'), color: 'bg-yellow-100 text-yellow-700' },
 processing: { label: t('orders.processing'), color: 'bg-blue-100 text-blue-700' },
 shipped: { label: t('orders.shipped'), color: 'bg-purple-100 text-purple-700' },
 completed: { label: t('orders.completed'), color: 'bg-green-100 text-green-700' },
 cancelled: { label: t('orders.cancelled'), color: 'bg-red-100 text-red-700' },
 }

 if (loading) {
 return (
 <div className="min-h-[60vh] flex items-center justify-center">
 <div className="text-center">
 <p className="text-gray-500">{t('orders.loading')}</p>
 </div>
 </div>
 )
 }

 return (
 <div className="bg-gray-50 min-h-screen">
 <div className="bg-gray-900 text-white py-12">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <h1 className="text-3xl font-bold">{t('orders.title')}</h1>
 <p className="mt-2 text-gray-400">{t('orders.desc')}</p>
 </div>
 </div>

 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {orders.length === 0 ? (
 <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
 <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('orders.empty')}</h3>
 <p className="text-gray-400 mb-6">{t('orders.emptyDesc')}</p>
 <Link href="/products" className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition">
 {t('orders.browse')}
 </Link>
 </div>
 ) : (
 <div className="space-y-4">
 {orders.map((order) => (
 <div key={order.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
 <div className="flex items-center justify-between mb-4">
 <div>
 <span className="text-sm text-gray-500">{t('orders.number')}</span>
 <span className="font-bold text-gray-900">{String(order.id).padStart(6, '0')}</span>
 </div>
 <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusMap[order.status]?.color || 'bg-gray-100 text-gray-600'}`}>
 {statusMap[order.status]?.label || order.status}
 </span>
 </div>

 <div className="border-t pt-4">
 {order.items.map((item: any, i: number) => (
 <div key={i} className="flex items-center justify-between py-2 text-sm">
 <span className="text-gray-700">{item.name} × {item.qty}</span>
 <span className="text-gray-600">${(item.price * item.qty).toFixed(2)}</span>
 </div>
 ))}
 </div>

 <div className="border-t pt-4 flex items-center justify-between">
 <div className="text-sm text-gray-500">
 {new Date(order.createdAt).toLocaleDateString('en-US', {
 year: 'numeric', month: 'long', day: 'numeric',
 })}
 {order.note && <p className="mt-1 text-xs text-gray-400">{t('orders.note')}: {order.note}</p>}
 </div>
 <div className="text-right">
 <p className="text-sm text-gray-500">{t('orders.total')}</p>
 <p className="text-xl font-bold text-amber-600">${Number(order.total).toFixed(2)}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )
}
