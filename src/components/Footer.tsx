'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageProvider'

export default function Footer() {
  const { t } = useLanguage()
  const [contact, setContact] = useState({
    whatsapp: '+13239260829',
    email: 'EOKAIBI@GMAIL.COM',
    phone: '+1 (323) 926-0829',
    address: 'Los Angeles, CA',
    siteName: 'VAPOR-X USA',
    siteDesc: '美国电子烟批发供应商',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const map = Object.fromEntries(data.map((s: any) => [s.key, s.value]))
          setContact({
            whatsapp: map.whatsapp || '+13239260829',
            email: map.email || 'EOKAIBI@GMAIL.COM',
            phone: map.phone || '+1 (323) 926-0829',
            address: map.address || 'Los Angeles, CA',
            siteName: map.site_name || 'VAPOR-X USA',
            siteDesc: map.site_description || '美国电子烟批发供应商',
          })
        }
      })
      .catch(() => {})
  }, [])

  const whatsappNum = contact.whatsapp.replace(/[^0-9]/g, '')

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* 品牌 */}
          <div>
            <h3 className="text-white text-2xl font-bold">
              <span className="text-amber-400">VAPOR</span>
              <span className="text-white">-X</span>
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {contact.siteName} — {contact.siteDesc}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              POWERED BY <span className="text-amber-400 font-semibold">ALOKAIBI TRADING GROUP</span>
            </p>
            <p className="mt-1 text-xs text-gray-600">{t('footer.age')}</p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-white font-semibold mb-3">{t('nav.products')}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/products" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.products')}</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.contact')}</Link>
              <Link href="/login" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.login')}</Link>
              <Link href="/register" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.register')}</Link>
              <Link href="/cart" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.cart')}</Link>
            </div>
          </div>

          {/* 联系 */}
          <div>
            <h4 className="text-white font-semibold mb-3">{t('contact.title')}</h4>
            <div className="space-y-2 text-sm">
              <p>📧 {contact.email}</p>
              <p>📞 {contact.phone}</p>
              <p>📍 {contact.address}</p>
              <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">{t('footer.powered')}</p>
          <p className="text-xs text-gray-600 mt-1">
            &copy; {new Date().getFullYear()} {contact.siteName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
