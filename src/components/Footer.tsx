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
 const [emailSub, setEmailSub] = useState('')
 const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

 useEffect(() => {
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

 const handleSubscribe = async (e: React.FormEvent) => {
   e.preventDefault()
   if (!emailSub) return
   setSubStatus('loading')
   try {
     const res = await fetch('/api/subscribe', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: emailSub, lang }),
     })
     if (res.ok) {
       setSubStatus('success')
       setEmailSub('')
       setTimeout(() => setSubStatus('idle'), 3000)
     } else {
       setSubStatus('error')
     }
   } catch {
     setSubStatus('error')
   }
 }

 // 国际化文案
 const isZh = lang === 'zh'

 return (
   <footer className="bg-gray-900 text-gray-400">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">

         {/* Column 1: Brand */}
         <div>
           <p className="text-white text-3xl font-black tracking-tight">
             <span className="text-amber-400">VAPOR</span>
             <span className="text-white">-X</span>
           </p>
           <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">
             {contact.siteName} &mdash; {t('footer.siteDesc')}
           </p>
           <p className="mt-3 text-xs text-gray-600">{t('footer.powered')}</p>
           <p className="text-xs text-gray-600 mt-1">{t('footer.age')}</p>
           {showAdminLink && (
             <Link href="/admin/login" className="mt-2 inline-block text-xs text-amber-500/60 hover:text-amber-400 transition">
               Admin Panel
             </Link>
           )}
         </div>

         {/* Column 2: Quick Links */}
         <div>
           <h4 className="text-white font-semibold mb-3">{t('footer.quickLinks')}</h4>
           <div className="space-y-2 text-sm">
             <Link href="/products" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.products')}</Link>
             <Link href="/brands" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.brands')}</Link>
             <Link href="/about" className="block text-gray-400 hover:text-amber-400 transition">{isZh ? '关于我们' : 'About Us'}</Link>
             <Link href="/contact" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.contact')}</Link>
             <Link href="/login" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.login')}</Link>
             <Link href="/register" className="block text-gray-400 hover:text-amber-400 transition">{t('nav.register')}</Link>
           </div>
         </div>

         {/* Column 3: Social Media & Contact */}
         <div>
           <h4 className="text-white font-semibold mb-3">{isZh ? '关注我们' : 'Follow Us'}</h4>
           <div className="space-y-2 text-sm mb-4">
             <a href="https://wa.me/13239260829" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-green-400 transition">
               <span>💬</span> WhatsApp
             </a>
             <a href="https://www.instagram.com/vaporx_usa/" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-pink-400 transition">
               <span>📸</span> Instagram
             </a>
             <a href="https://www.facebook.com/vaporxusa" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-blue-400 transition">
               <span>👍</span> Facebook
             </a>
             <a href="https://www.tiktok.com/@vaporx_usa" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-white transition">
               <span>🎵</span> TikTok
             </a>
             <a href="https://www.youtube.com/@vaporxusa" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-red-400 transition">
               <span>▶️</span> YouTube
             </a>
             <a href="https://www.linkedin.com/company/vaporx-usa" target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-blue-300 transition">
               <span>💼</span> LinkedIn
             </a>
           </div>

           <h4 className="text-white font-semibold mb-3">{t('contact.title')}</h4>
           <div className="space-y-2 text-sm">
             {contact.email && <p className="text-gray-400">{contact.email}</p>}
             {contact.phone && <p className="text-gray-400">{contact.phone}</p>}
             {contact.whatsapp && (
               <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center mt-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition font-medium">
                 {t('contact.whatsapp')}
               </a>
             )}
           </div>
         </div>

         {/* Column 4: Newsletter */}
         <div>
           <h4 className="text-white font-semibold mb-3">{isZh ? '邮件订阅' : 'Newsletter'}</h4>
           <p className="text-sm text-gray-500 mb-3">
             {isZh ? '获取最新产品和批发报价' : 'Get latest products & wholesale pricing'}
           </p>
           <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
             <input
               type="email"
               value={emailSub}
               onChange={e => setEmailSub(e.target.value)}
               placeholder={isZh ? '输入您的邮箱' : 'Your email address'}
               required
               className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
             />
             <button
               type="submit"
               disabled={subStatus === 'loading'}
               className="w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition disabled:opacity-50"
             >
               {subStatus === 'loading' ? (isZh ? '提交中...' : 'Subscribing...')
                : subStatus === 'success' ? (isZh ? '✅ 已订阅' : '✅ Subscribed')
                : subStatus === 'error' ? (isZh ? '❌ 请重试' : '❌ Try Again')
                : (isZh ? '订阅' : 'Subscribe')}
             </button>
           </form>
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
