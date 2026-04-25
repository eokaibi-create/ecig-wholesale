'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageProvider'

export default function Footer() {
  const { t, lang } = useLanguage()
  const [contact, setContact] = useState({
    whatsapp: '+13239260829',
    email: 'EOKAIBI@GMAIL.COM',
    phone: '+1 (323) 926-0829',
    address: 'Los Angeles, CA',
    siteName: 'VAPOR-X USA',
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
          })
        }
      })
      .catch(() => {})
  }, [])

  const whatsappNum = contact.whatsapp.replace(/[^0-9]/g, '')

  const siteDesc = t('footer.siteDesc')

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <p className="text-white text-3xl font-black tracking-tight">
              <span className="text-amber-400">VAPOR</span>
              <span className="text-white">-X</span>
            </p>
            <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">
              {contact.siteName} — {siteDesc}
            </p>
            <p className="mt-3 text-xs text-gray-600">{t('footer.powered')}</p>
            <p className="text-xs text-gray-600 mt-1">{t('footer.age')}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">{t('footer.quickLinks')}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/products" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.products')}</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.contact')}</Link>

              <Link href="/login" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.login')}</Link>
              <Link href="/register" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.register')}</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">{t('contact.title')}</h4>
            <div className="space-y-2 text-sm">
              <p>📧 {contact.email}</p>
              <p>📞 {contact.phone}</p>
              <p>📍 {contact.address}</p>
              <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition">
                💬 {t('contact.whatsapp')}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {contact.siteName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
