'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageProvider'

export default function Footer() {
 const { t, lang } = useLanguage()
 const [contact, setContact] = useState<{
 whatsapp: string | null
 email: string | null
 phone: string | null
 siteName: string
 }>({
 whatsapp: '+1 (323) 926-0829',
 email: 'EOKAIBI@GMAIL.COM',
 phone: '+1 (323) 926-0829',
 siteName: 'VAPOR-X USA',
 })
 const [loaded, setLoaded] = useState(false)
 const [showAdminLink, setShowAdminLink] = useState(false)

 useEffect(() => {
 // 检查是否通过 ?admin=1 秘密参数访问
 if (typeof window !== 'undefined') {
 const params = new URLSearchParams(window.location.search)
 if (params.get('admin') === '1') {
 setShowAdminLink(true)
 }
 }

 fetch('/api/contact')
 .then(res => res.json())
 .then(data => {
 setContact({
 whatsapp: data.whatsapp || '+1 (323) 926-0829',
 email: data.email || 'EOKAIBI@GMAIL.COM',
 phone: data.phone || '+1 (323) 926-0829',
 siteName: data.siteName || 'VAPOR-X USA',
 })
 setLoaded(true)
 })
 .catch(() => setLoaded(true))
 }, [])

 const whatsappNum = (contact.whatsapp || "").replace(/[^0-9]/g, '')

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
 {contact.siteName} &mdash; {siteDesc}
 </p>
 <p className="mt-3 text-xs text-gray-600">{t('footer.powered')}</p>
 <p className="text-xs text-gray-600 mt-1">{t('footer.age')}</p>
 {showAdminLink && (
 <Link href="/admin/login" className="mt-2 inline-block text-xs text-amber-500/60 hover:text-amber-400 transition">
 Admin Panel
 </Link>
 )}
 </div>

 <div>
 <h4 className="text-white font-semibold mb-3">{t('footer.quickLinks')}</h4>
 <div className="space-y-2 text-sm">
 <Link href="/products" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.products')}</Link>
 <Link href="/brands" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.brands')}</Link>
 <Link href="/contact" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.contact')}</Link>
 <Link href="/login" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.login')}</Link>
 <Link href="/register" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.register')}</Link>
 </div>
 </div>

 <div>
 <h4 className="text-white font-semibold mb-3">{t('contact.title')}</h4>
 <div className="space-y-2 text-sm">
 {contact.email && <p> {contact.email}</p>}
 {contact.phone && <p> {contact.phone}</p>}
 {contact.whatsapp && (
 <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
 className="inline-flex items-center mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition">
 {t('contact.whatsapp')}
 </a>
 )}
 {!loaded && (
 <div className="text-center py-4">
 <p className="text-sm text-gray-600">{t('orders.loading') || 'Loading...'}</p>
 </div>
 )}
 {loaded && !contact.email && !contact.phone && !contact.whatsapp && (
 <div className="text-center py-4">
 <p className="text-sm text-gray-500"> {t('contact.contactHidden')}</p>
 <Link href="/login" className="text-amber-400 hover:text-amber-300 text-xs mt-1 inline-block transition">
 {t('login.title')}
 </Link>
 </div>
 )}
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
