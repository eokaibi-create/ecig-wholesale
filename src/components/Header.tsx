'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageProvider'

interface Customer {
  id: number
  name: string
  email: string
  company: string | null
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/customer/me')
      .then(res => res.ok ? res.json() : { authenticated: false })
      .then(data => {
        if (data.authenticated) setCustomer(data.customer)
      })
      .finally(() => setLoading(false))
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/customer/logout', { method: 'POST' })
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_info')
    setCustomer(null)
    setUserMenu(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-amber-400">VAPOR-X</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-amber-400 transition">{t('nav.home')}</Link>
            <Link href="/products" className="hover:text-amber-400 transition">{t('nav.products')}</Link>
            <Link href="/brands" className="hover:text-amber-400 transition">{t('nav.pricing')}</Link>
            <Link href="/contact" className="hover:text-amber-400 transition">{t('nav.contact')}</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center space-x-1 px-2 py-1.5 rounded-lg border border-gray-700 hover:border-amber-500 text-xs transition"
              title={lang === 'zh' ? t('header.switchToEn') : t('header.switchToZh')}
            >
              {lang === 'zh' ? (
                <><span className="text-base">🇨🇳</span><span className="text-gray-300">EN</span></>
              ) : (
                <><span className="text-base">🇺🇸</span><span className="text-gray-300">中</span></>
              )}
            </button>

            {loading ? null : customer ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">{customer.name}</span>
                  <svg className={`w-4 h-4 transition ${userMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-xl shadow-xl z-20 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                        {customer.company && <p className="text-xs text-gray-400">{customer.company}</p>}
                      </div>

                      <Link href="/orders" onClick={() => setUserMenu(false)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{t('nav.myOrders')}</span>
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-300 hover:text-white transition px-3 py-2">{t('nav.login')}</Link>
                <Link href="/register" className="text-sm bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition font-medium">{t('nav.register')}</Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 space-y-2">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <span className="text-xs text-gray-400">{t('header.langLabel')}</span>
              <button
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="flex items-center space-x-1 px-2 py-1 rounded border border-gray-600 text-xs"
              >
                {lang === 'zh' ? (
                  <><span>🇨🇳</span><span className="text-gray-300">English</span></>
                ) : (
                  <><span>🇺🇸</span><span className="text-gray-300">中文</span></>
                )}
              </button>
            </div>
            <Link href="/" className="block px-4 py-2 hover:bg-gray-800 rounded" onClick={() => setOpen(false)}>{t('nav.home')}</Link>
            <Link href="/products" className="block px-4 py-2 hover:bg-gray-800 rounded" onClick={() => setOpen(false)}>{t('nav.products')}</Link>
            <Link href="/brands" className="block px-4 py-2 hover:bg-gray-800 rounded" onClick={() => setOpen(false)}>{t('nav.brands')}</Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-800 rounded" onClick={() => setOpen(false)}>{t('nav.contact')}</Link>
            <hr className="border-gray-700 my-2" />
            {customer ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-400">{customer.name} - {customer.email}</div>

                <Link href="/orders" className="block px-4 py-2 hover:bg-gray-800 rounded" onClick={() => setOpen(false)}>📋 {t('nav.myOrders')}</Link>
                <button onClick={() => { handleLogout(); setOpen(false) }}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded">{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 hover:bg-gray-800 rounded" onClick={() => setOpen(false)}>{t('nav.login')}</Link>
                <Link href="/register" className="block px-4 py-2 text-amber-400 hover:bg-gray-800 rounded" onClick={() => setOpen(false)}>{t('nav.register')}</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
