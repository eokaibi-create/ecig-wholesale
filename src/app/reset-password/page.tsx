'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageProvider'

export default function ResetPasswordPage() {
 const router = useRouter()
 const searchParams = useSearchParams()
 const token = searchParams.get('token')
 const { t } = useLanguage()

 const [password, setPassword] = useState('')
 const [confirm, setConfirm] = useState('')
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')
 const [success, setSuccess] = useState(false)

 useEffect(() => {
 if (!token) {
 setError('Invalid reset link. Please request a new one.')
 }
 }, [token])

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError('')

 if (password.length < 6) {
 setError(t('register.passwordTooShort') || 'Password must be at least 6 characters')
 return
 }

 if (password !== confirm) {
 setError(t('register.passwordMismatch') || 'Passwords do not match')
 return
 }

 setLoading(true)

 try {
 const res = await fetch('/api/auth/customer/reset-password', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ token, password }),
 })

 const data = await res.json()

 if (!res.ok) {
 setError(data.error || 'Reset failed, please try again')
 return
 }

 setSuccess(true)
 } catch {
 setError('Network error, please try again')
 } finally {
 setLoading(false)
 }
 }

 if (!token && !error) {
 return null
 }

 return (
 <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
 <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
 <div className="text-center mb-8">
 <h1 className="text-3xl font-bold text-gray-900">
 {t('reset.title') || 'Set New Password'}
 </h1>
 <p className="text-gray-500 mt-2">
 {t('reset.desc') || 'Enter your new password below'}
 </p>
 </div>

 {error && (
 <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
 {error}
 </div>
 )}

 {success ? (
 <div className="text-center py-6">
 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <h2 className="text-xl font-semibold text-gray-900 mb-2">
 {t('reset.successTitle') || 'Password Reset Successful'}
 </h2>
 <p className="text-gray-500 mb-6">
 {t('reset.successDesc') || 'Your password has been reset. You can now log in with your new password.'}
 </p>
 <Link
 href="/login"
 className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
 >
 {t('reset.goToLogin') || 'Go to Login'}
 </Link>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('reset.newPassword') || 'New Password'}
 </label>
 <input
 type="password"
 required
 value={password}
 onChange={e => setPassword(e.target.value)}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('register.passwordHint') || 'min 6 characters'}
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {t('reset.confirmPassword') || 'Confirm New Password'}
 </label>
 <input
 type="password"
 required
 value={confirm}
 onChange={e => setConfirm(e.target.value)}
 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
 placeholder={t('reset.confirmPlaceholder') || 'Re-enter new password'}
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
 >
 {loading
 ? (t('reset.loading') || 'Resetting...')
 : (t('reset.submit') || 'Reset Password')}
 </button>
 </form>
 )}

 {!success && (
 <p className="text-center text-sm text-gray-500 mt-6">
 <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
 <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
 </svg>
 {t('forgot.backToLogin') || 'Back to Login'}
 </Link>
 </p>
 )}
 </div>
 </div>
 )
}
