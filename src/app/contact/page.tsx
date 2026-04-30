'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/i18n/LanguageProvider'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  category?: { name: string } | null
}

export default function ContactPage() {
  const { t } = useLanguage()
  const [contact, setContact] = useState<{
    whatsapp: string | null
    email: string | null
    phone: string | null
    address: string | null
    wechat: string | null
    siteName: string
    minOrder: string
    shippingInfo: string
    isLoggedIn: boolean
  }>({
    whatsapp: null,
    email: null,
    phone: null,
    address: null,
    wechat: null,
    siteName: 'VAPOR-X USA',
    minOrder: '500',
    shippingInfo: '全美48州免运费，订单满$500起批',
    isLoggedIn: false,
  })
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState<{ success?: string; error?: string }>({})
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchParams({
      success: params.get('success') || undefined,
      error: params.get('error') || undefined,
    })

    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        setContact({
          whatsapp: data.whatsapp,
          email: data.email,
          phone: data.phone,
          address: data.address,
          wechat: data.wechat,
          siteName: data.siteName || 'VAPOR-X USA',
          minOrder: data.minOrder || '500',
          shippingInfo: data.shippingInfo || '全美48州免运费，订单满$500起批',
          isLoggedIn: data.isLoggedIn || false,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Load products for the dropdown
    fetch('/api/products?all=1')
      .then(res => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {})
  }, [])

  const { success, error } = searchParams

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('contact.title')}</h1>
          <p className="mt-2 text-lg text-gray-300">{t('contact.prefix')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-800">{t('contact.success')}</p>
              <p className="text-sm text-green-600">{t('contact.successDesc')}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-semibold text-red-800">{t('contact.error')}</p>
              <p className="text-sm text-red-600">{t('contact.errorDesc')}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.inquire')}</h2>
            <form action="/api/inquiries" method="POST" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')} *</label>
                  <input type="text" name="name" required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.company')}</label>
                  <input type="text" name="company"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')} *</label>
                  <input type="email" name="email" required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.phone')}</label>
                  <input type="tel" name="phone"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
              </div>

              {/* Product selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {'\u9009\u62e9\u4ea7\u54c1'} <span className="text-gray-400 text-xs">({'\u53ef\u9009'})</span>
                </label>
                <select
                  name="productId"
                  value={selectedProduct}
                  onChange={e => {
                    setSelectedProduct(e.target.value)
                    const selected = products.find(p => p.id.toString() === e.target.value)
                    const hiddenInput = document.querySelector('input[name="productName"]') as HTMLInputElement
                    if (hiddenInput && selected) hiddenInput.value = selected.name
                    if (hiddenInput && !e.target.value) hiddenInput.value = ''
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                >
                  <option value="">-- {'\u9009\u62e9\u4ea7\u54c1'} --</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="productName" value="" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')} *</label>
                <textarea name="message" rows={5} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder={t('contact.placeholder')}></textarea>
              </div>
              <button type="submit"
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition text-lg">
                {t('contact.submitInquiry')}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.title')}</h2>
            {loading ? (
              <div className="text-gray-400 text-center py-8">{t('orders.loading')}</div>
            ) : (
              <>
                <div className="space-y-6">
                  {contact.email && (
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="text-2xl">📧</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700 font-medium">{contact.email}</a>
                        <p className="text-sm text-gray-500">{t('contact.replyHour')}</p>
                      </div>
                    </div>
                  )}

                  {contact.phone && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl">📞</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('contact.phone')}</h3>
                        <p className="text-gray-600">{contact.phone}</p>
                        <p className="text-sm text-gray-500">{t('contact.hours')}</p>
                      </div>
                    </div>
                  )}

                  {contact.whatsapp && (
                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="text-2xl">💬</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                        <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 font-medium">{contact.whatsapp}</a>
                        <p className="text-sm text-gray-500">{t('contact.replyTime')}</p>
                      </div>
                    </div>
                  )}

                  {contact.wechat && (
                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="text-2xl">💚</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">WeChat</h3>
                        <p className="text-green-600 font-medium">{contact.wechat}</p>
                        <p className="text-sm text-gray-500">{t('contact.wechatDesc')}</p>
                      </div>
                    </div>
                  )}

                  {contact.address && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl">📍</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('contact.address')}</h3>
                        <p className="text-gray-600">{contact.address}</p>
                      </div>
                    </div>
                  )}

                  {!contact.email && !contact.phone && !contact.whatsapp && !contact.wechat && !contact.address && (
                    <div className="text-center py-12 text-gray-400">
                      <div className="text-4xl mb-3">🔒</div>
                      <p className="text-sm">{'\u8054\u7cfb\u8d44\u6599\u5df2\u9690\u85cf'}</p>
                      {!contact.isLoggedIn && (
                        <Link href="/login" className="text-amber-600 hover:underline text-sm mt-2 inline-block">
                          {t('login.title')}
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                  <h3 className="font-bold text-gray-900 mb-2">{t('contact.wholesaleTip')}</h3>
                  <p className="text-sm text-gray-600">
                    {contact.shippingInfo || t('contact.shippingInfo')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
