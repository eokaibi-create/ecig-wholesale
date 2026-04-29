'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageProvider'

export default function AdminLoginPage() {
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || t('admin.loginError'))
      }
    } catch (err) {
      setError(t('admin.networkError'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/vaporx-logo.svg" alt="VAPOR-X" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold text-white">{t('admin.loginTitle')}</h1>
          </div>
          <p className="text-amber-400/80">{t('admin.loginDesc')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.username')}</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-gray-400" 
              placeholder={t('admin.username')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-gray-400" 
              placeholder={t('admin.password')} required />
          </div>
          <div className="text-right">
            <a href="/admin/forgot-password" className="text-sm text-gray-400 hover:text-amber-400 transition">
              忘记密码？
            </a>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-black font-bold rounded-lg transition">
            {loading ? t('admin.loggingIn') : t('admin.loginBtn')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-gray-400 hover:text-amber-400 transition">
            🔑 {t('admin.customerLogin')}
          </a>
        </div>
      </div>
    </div>
  )
}
