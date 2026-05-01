'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageProvider'

const COUNTRY_CODES = [
 { code: '+1', country: 'US', name: ' US +1' },
 { code: '+86', country: 'CN', name: ' CN +86' },
 { code: '+852', country: 'HK', name: ' HK +852' },
 { code: '+886', country: 'TW', name: ' TW +886' },
 { code: '+44', country: 'GB', name: ' UK +44' },
 { code: '+81', country: 'JP', name: ' JP +81' },
 { code: '+82', country: 'KR', name: ' KR +82' },
 { code: '+84', country: 'VN', name: ' VN +84' },
 { code: '+66', country: 'TH', name: ' TH +66' },
 { code: '+60', country: 'MY', name: ' MY +60' },
 { code: '+65', country: 'SG', name: ' SG +65' },
 { code: '+62', country: 'ID', name: ' ID +62' },
 { code: '+63', country: 'PH', name: ' PH +63' },
 { code: '+61', country: 'AU', name: ' AU +61' },
 { code: '+64', country: 'NZ', name: ' NZ +64' },
 { code: '+91', country: 'IN', name: ' IN +91' },
 { code: '+971', country: 'AE', name: ' UAE +971' },
 { code: '+966', country: 'SA', name: ' SA +966' },
 { code: '+974', country: 'QA', name: ' QA +974' },
 { code: '+973', country: 'BH', name: ' BH +973' },
 { code: '+968', country: 'OM', name: ' OM +968' },
 { code: '+965', country: 'KW', name: ' KW +965' },
 { code: '+49', country: 'DE', name: ' DE +49' },
 { code: '+33', country: 'FR', name: ' FR +33' },
 { code: '+39', country: 'IT', name: ' IT +39' },
 { code: '+34', country: 'ES', name: ' ES +34' },
 { code: '+31', country: 'NL', name: ' NL +31' },
 { code: '+32', country: 'BE', name: ' BE +32' },
 { code: '+41', country: 'CH', name: ' CH +41' },
 { code: '+46', country: 'SE', name: ' SE +46' },
 { code: '+47', country: 'NO', name: ' NO +47' },
 { code: '+45', country: 'DK', name: ' DK +45' },
 { code: '+358', country: 'FI', name: ' FI +358' },
 { code: '+7', country: 'RU', name: ' RU +7' },
 { code: '+380', country: 'UA', name: ' UA +380' },
 { code: '+48', country: 'PL', name: ' PL +48' },
 { code: '+30', country: 'GR', name: ' GR +30' },
 { code: '+351', country: 'PT', name: ' PT +351' },
 { code: '+353', country: 'IE', name: ' IE +353' },
 { code: '+55', country: 'BR', name: ' BR +55' },
 { code: '+52', country: 'MX', name: ' MX +52' },
 { code: '+54', country: 'AR', name: ' AR +54' },
 { code: '+56', country: 'CL', name: ' CL +56' },
 { code: '+57', country: 'CO', name: ' CO +57' },
 { code: '+1', country: 'CA', name: ' CA +1' },
 { code: '+27', country: 'ZA', name: ' ZA +27' },
 { code: '+20', country: 'EG', name: ' EG +20' },
 { code: '+212', country: 'MA', name: ' MA +212' },
 { code: '+234', country: 'NG', name: ' NG +234' },
 { code: '+254', country: 'KE', name: ' KE +254' },
 { code: '+233', country: 'GH', name: ' GH +233' },
 { code: '+98', country: 'IR', name: ' IR +98' },
 { code: '+90', country: 'TR', name: ' TR +90' },
 { code: '+972', country: 'IL', name: ' IL +972' },
]

const COUNTRIES = [
 { code: 'US', name: 'United States' },
 { code: 'CN', name: 'China' },
 { code: 'HK', name: 'Hong Kong' },
 { code: 'TW', name: 'Taiwan' },
 { code: 'GB', name: 'United Kingdom' },
 { code: 'JP', name: 'Japan' },
 { code: 'KR', name: 'South Korea' },
 { code: 'VN', name: 'Vietnam' },
 { code: 'TH', name: 'Thailand' },
 { code: 'MY', name: 'Malaysia' },
 { code: 'SG', name: 'Singapore' },
 { code: 'ID', name: 'Indonesia' },
 { code: 'PH', name: 'Philippines' },
 { code: 'AU', name: 'Australia' },
 { code: 'NZ', name: 'New Zealand' },
 { code: 'IN', name: 'India' },
 { code: 'AE', name: 'United Arab Emirates' },
 { code: 'SA', name: 'Saudi Arabia' },
 { code: 'QA', name: 'Qatar' },
 { code: 'BH', name: 'Bahrain' },
 { code: 'OM', name: 'Oman' },
 { code: 'KW', name: 'Kuwait' },
 { code: 'DE', name: 'Germany' },
 { code: 'FR', name: 'France' },
 { code: 'IT', name: 'Italy' },
 { code: 'ES', name: 'Spain' },
 { code: 'NL', name: 'Netherlands' },
 { code: 'BE', name: 'Belgium' },
 { code: 'CH', name: 'Switzerland' },
 { code: 'SE', name: 'Sweden' },
 { code: 'NO', name: 'Norway' },
 { code: 'DK', name: 'Denmark' },
 { code: 'FI', name: 'Finland' },
 { code: 'RU', name: 'Russia' },
 { code: 'UA', name: 'Ukraine' },
 { code: 'PL', name: 'Poland' },
 { code: 'GR', name: 'Greece' },
 { code: 'PT', name: 'Portugal' },
 { code: 'IE', name: 'Ireland' },
 { code: 'BR', name: 'Brazil' },
 { code: 'MX', name: 'Mexico' },
 { code: 'AR', name: 'Argentina' },
 { code: 'CL', name: 'Chile' },
 { code: 'CO', name: 'Colombia' },
 { code: 'CA', name: 'Canada' },
 { code: 'ZA', name: 'South Africa' },
 { code: 'EG', name: 'Egypt' },
 { code: 'MA', name: 'Morocco' },
 { code: 'NG', name: 'Nigeria' },
 { code: 'KE', name: 'Kenya' },
 { code: 'GH', name: 'Ghana' },
 { code: 'IR', name: 'Iran' },
 { code: 'TR', name: 'Turkey' },
 { code: 'IL', name: 'Israel' },
]

export default function RegisterPage() {
 const router = useRouter()
 const { t } = useLanguage()
 const [form, setForm] = useState({
 name: '',
 email: '',
 phone: '',
 countryCode: '+1',
 company: '',
 companyAddress: '',
 state: '',
 country: '',
 type: 'wholesaler',
 password: '',
 confirm: '',
 })
 const [error, setError] = useState('')
 const [successMsg, setSuccessMsg] = useState('')
 const [loading, setLoading] = useState(false)

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError('')
 setSuccessMsg('')

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
 phone: form.type === 'individual' ? (form.phone || undefined) : form.phone,
 company: form.type === 'individual' ? undefined : form.company,
 companyAddress: form.type === 'individual' ? undefined : form.companyAddress,
 state: form.state || undefined,
 country: form.type === 'individual' ? undefined : form.country,
 countryCode: form.type === 'individual' ? undefined : form.countryCode,
 type: form.type,
 password: form.password,
 }),
 })

 const data = await res.json()

 if (!res.ok) {
 setError(data.error || t('register.error'))
 return
 }

 if (form.type === 'individual') {
 const payload = { id: data.customer.id, customerId: data.customer.id, email: data.customer.email, name: data.customer.name }
 localStorage.setItem('customer_token', btoa(JSON.stringify(payload)))
 localStorage.setItem('customer_info', JSON.stringify(data.customer))
 router.push('/')
 router.refresh()
 } else {
 setSuccessMsg(t('register.success'))
 setForm({
 name: '', email: '', phone: '', countryCode: '+1',
 company: '', companyAddress: '', state: '', country: '',
 type: 'wholesaler', password: '', confirm: '',
 })
 }
 } catch {
 setError(t('register.networkError'))
 } finally {
 setLoading(false)
 }
 }

 const customerTypes = [
 { value: 'wholesaler', label: ' ' + t('register.wholesaler'), desc: t('register.wholesalerDesc') },
 { value: 'store', label: ' ' + t('register.store'), desc: t('register.storeDesc') },
 { value: 'individual', label: ' ' + t('register.individual'), desc: t('register.individualDesc') },
 ]

 const isBusiness = form.type !== 'individual'

 return (
 <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
 <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
 <div className="text-center mb-8">
 <h1 className="text-3xl font-bold text-gray-900">{t('register.title')}</h1>
 <p className="text-gray-500 mt-2">
 {t('register.desc')}
 </p>
 </div>

 {error && (
 <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
 )}

 {successMsg && (
 <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
 <p className="font-medium mb-1">{t('register.successTitle')}</p>
 <p>{successMsg}</p>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 {/* Account Type */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 {t('register.customerType')} *
 </label>
 <div className="grid grid-cols-3 gap-3">
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
 <div>{ct.label}</div>
 <div className="text-[10px] text-gray-400 mt-1">{ct.desc}</div>
 </button>
 ))}
 </div>
 </div>

 {/* Basic Info */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.name')} *
 </label>
 <input type="text" required value={form.name}
 onChange={e => setForm({ ...form, name: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.namePlaceholder')} />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.email')} *
 </label>
 <input type="email" required value={form.email}
 onChange={e => setForm({ ...form, email: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.emailPlaceholder')} />
 </div>
 </div>

 {/* Business users: Company info */}
 {isBusiness && (
 <>
 <div className="border-t border-gray-200 pt-4">
 <p className="text-sm font-semibold text-gray-700 mb-3">
 {t('register.companySection')}
 </p>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.company')} *
 </label>
 <input type="text" required value={form.company}
 onChange={e => setForm({ ...form, company: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.companyPlaceholder')} />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.companyAddress')} *
 </label>
 <input type="text" required value={form.companyAddress}
 onChange={e => setForm({ ...form, companyAddress: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.addressPlaceholder')} />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.country')} *
 </label>
 <select required value={form.country}
 onChange={e => setForm({ ...form, country: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white">
 <option value="">{t('register.selectCountry')}</option>
 {COUNTRIES.map(c => (
 <option key={c.code} value={c.code}>{c.name}</option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.state')}
 </label>
 <input type="text" value={form.state}
 onChange={e => setForm({ ...form, state: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.statePlaceholder')} />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.phone')} *
 </label>
 <div className="flex gap-2">
 <select value={form.countryCode}
 onChange={e => setForm({ ...form, countryCode: e.target.value })}
 className="w-32 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-sm">
 {COUNTRY_CODES.map(cc => (
 <option key={cc.code} value={cc.code}>{cc.name}</option>
 ))}
 </select>
 <input type="tel" required value={form.phone}
 onChange={e => setForm({ ...form, phone: e.target.value })}
 className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.phonePlaceholder')} />
 </div>
 </div>
 </>
 )}

 {/* Individual: Phone optional */}
 {!isBusiness && (
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.phone')} ({t('register.optional')})
 </label>
 <input type="tel" value={form.phone}
 onChange={e => setForm({ ...form, phone: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.placeholderOptional')} />
 </div>
 )}

 {/* Password */}
 <div className="border-t border-gray-200 pt-4">
 <p className="text-sm font-semibold text-gray-700 mb-3">
 {t('register.loginInfo')}
 </p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.password')} *
 </label>
 <input type="password" required value={form.password}
 onChange={e => setForm({ ...form, password: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.passwordHint')} />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('register.confirm')} *
 </label>
 <input type="password" required value={form.confirm}
 onChange={e => setForm({ ...form, confirm: e.target.value })}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.confirmPlaceholder')} />
 </div>
 </div>

 <button type="submit" disabled={loading}
 className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-50 mt-2">
 {loading
 ? t('register.loading')
 : form.type === 'individual'
 ? t('register.submit')
 : t('register.submit')}
 </button>
 </form>

 <p className="text-center text-sm text-gray-500 mt-6">
 {t('register.haveAccount')}{' '}
 <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
 {t('register.loginNow')}
 </Link>
 </p>
 </div>
 </div>
 )
}
