'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageProvider'

interface CartItem {
  id: number
  productId: number
  flavor?: string
  quantity: number
  product: {
    id: number
    name: string
    slug: string
    image: string | null
    price: number
    wholesalePrice: number | null
    stock: number
  }
}

export default function CartPage() {
  const { t, lang } = useLanguage()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [customer, setCustomer] = useState<any>(null)
  const [editingQty, setEditingQty] = useState<{[key: number]: number}>({})

  const fetchCart = async () => {
    const token = localStorage.getItem('customer_token')
    if (!token) { setLoading(false); return }

    try {
      const payload = JSON.parse(atob(token.split('.')[0]))
      const res = await fetch('/api/cart', {
        headers: { 'x-customer-id': String(payload.id || payload.customerId) }
      })
      if (res.ok) setItems(await res.json())
    } catch (e) {}
    setLoading(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('customer_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[0]))
        setCustomer(payload)
      } catch {}
    }
    fetchCart()
  }, [])

  const updateQty = async (itemId: number, qty: number) => {
    if (qty < 1) return
    setEditingQty(prev => ({ ...prev, [itemId]: qty }))
    const token = localStorage.getItem('customer_token')
    if (!token) return
    const payload = JSON.parse(atob(token.split('.')[0]))
    await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-customer-id': String(payload.id || payload.customerId) },
      body: JSON.stringify({ quantity: qty }),
    })
    fetchCart()
  }

  const removeItem = async (itemId: number) => {
    const token = localStorage.getItem('customer_token')
    if (!token) return
    const payload = JSON.parse(atob(token.split('.')[0]))
    await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: { 'x-customer-id': String(payload.id || payload.customerId) },
    })
    fetchCart()
  }

  const clearCart = async () => {
    const token = localStorage.getItem('customer_token')
    if (!token) return
    const payload = JSON.parse(atob(token.split('.')[0]))
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'x-customer-id': String(payload.id || payload.customerId) },
    })
    fetchCart()
  }

  const total = items.reduce((sum, item) => sum + (item.quantity * (item.product.wholesalePrice || item.product.price)), 0)

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.loginRequired')}</h1>
          <p className="text-gray-500 mb-6">{t('cart.loginRequiredDesc')}</p>
          <Link href="/login" className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl">{t('cart.goToLogin')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-500">VAPOR-X</Link>
          <div className="flex items-center gap-4">
            <Link href="/account/pi" className="text-sm text-gray-600 hover:text-amber-500">{t('nav.myPi')}</Link>
            <span className="text-sm text-gray-500">👤 {customer.email || customer.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🛒 {t('cart.title')}</h1>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600">{t('cart.clear')}</button>
          )}
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{message}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">{t('cart.loading')}</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">{t('cart.empty')}</h2>
            <p className="text-gray-400 mb-6">{t('cart.emptyDesc')}</p>
            <Link href="/products" className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl">{t('cart.browseProducts')}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">💨</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold text-gray-900 hover:text-amber-600">{item.product.name}</Link>
                  {item.flavor && <p className="text-xs text-gray-500">🎨 {t('cart.flavor')}: {item.flavor}</p>}
                  <p className="text-sm text-amber-600 font-bold">${(item.product.wholesalePrice || item.product.price).toFixed(2)}/{lang === 'en' ? 'pc' : '件'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, (editingQty[item.id] || item.quantity) - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">-</button>
                  <input type="number" value={editingQty[item.id] ?? item.quantity}
                    onChange={e => setEditingQty(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
                    onBlur={() => updateQty(item.id, editingQty[item.id] ?? item.quantity)}
                    className="w-16 text-center border rounded-lg py-1 text-sm" min="1" />
                  <button onClick={() => updateQty(item.id, (editingQty[item.id] || item.quantity) + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">+</button>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-gray-900">${((editingQty[item.id] ?? item.quantity) * (item.product.wholesalePrice || item.product.price)).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:text-red-600 mt-1">{t('cart.remove')}</button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{items.reduce((s, i) => s + i.quantity, 0)} {t('cart.itemsCount')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{t('cart.total')}</p>
                <p className="text-2xl font-bold text-amber-600">${total.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/products" className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold">{t('cart.continue')}</Link>
              <Link href={`/account/pi`} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl">{t('cart.submitInquiry')}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
