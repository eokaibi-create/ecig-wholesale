'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageProvider'

export default function RegisterPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    companyAddress: '',
    state: '',
    type: 'wholesaler',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError(t('register.passwordMismatch'))
      return
    }

    if (form.password.length < 6) {
      setError(t('register.passwordTooShort'))
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.type === 'wholesaler' ? (form.company || undefined) : undefined,
          companyAddress: form.companyAddress || undefined,
          state: form.state || undefined,
          type: form.type,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('register.error'))
        return
      }

      const payload = { id: data.customer.id, customerId: data.customer.id, email: data.customer.email, name: data.customer.name }
      localStorage.setItem('customer_token', btoa(JSON.stringify(payload)))
      localStorage.setItem('customer_info', JSON.stringify(data.customer))

      router.push('/')
      router.refresh()
    } catch {
      setError(t('register.networkError'))
    } finally {
      setLoading(false)
    }
  }

  const customerTypes = [
    { value: 'wholesaler', label: { zh: t('register.wholesaler'), en: t('register.wholesaler') } },
    { value: 'individual', label: { zh: t('register.individual'), en: t('register.individual') } },
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('register.title')}</h1>
          <p className="text-gray-500 mt-2">{t('register.desc')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('register.customerType')} *</label>
            <div className="grid grid-cols-2 gap-3">
              {customerTypes.map(ct => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: ct.value })}
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.type === ct.value
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {ct.value === 'wholesaler' ? '🏬 ' : '👤 '}
                  {ct.label.zh}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.name')} *</label>
            <input type="text" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder={t('register.name')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.email')} *</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder={t('register.emailPlaceholder')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.phone')}</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder={t('register.phonePlaceholder')} />
            </div>
            {form.type === 'wholesaler' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.company')}</label>
                <input type="text" value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder={`${t('register.company')} (${t('register.optional')})`} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.companyAddress')} *</label>
            <input type="text" value={form.companyAddress}
              onChange={e => setForm({ ...form, companyAddress: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder={t('register.addressPlaceholder')} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.state')}</label>
            <input type="text" value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder={t('register.statePlaceholder')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.password')} *</label>
              <input type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder={t('register.passwordHint')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.confirm')} *</label>
              <input type="password" required value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder={t('register.confirm')} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-50 mt-2">
            {loading ? t('register.loading') : t('register.submit')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('register.haveAccount')}{' '}
          <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">{t('register.loginNow')}</Link>
        </p>
      </div>
    </div>
  )
}
