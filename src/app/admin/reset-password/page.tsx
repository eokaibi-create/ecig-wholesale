'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('无效的链接')
    }
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('密码至少 8 位')
      return
    }
    if (password !== confirm) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || '重置失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    }
    setLoading(false)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-white mb-3">无效的链接</h1>
          <p className="text-gray-300 mb-6">该链接无效或已过期，请重新申请密码重置。</p>
          <a href="/admin/forgot-password"
            className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
            重新申请
          </a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-white mb-3">密码重置成功</h1>
          <p className="text-gray-300 mb-6">您的密码已重置，现在可以使用新密码登录了。</p>
          <a href="/admin/login"
            className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
            前往登录
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white">设置新密码</h1>
          <p className="text-gray-400 mt-2 text-sm">请输入您的新密码</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">新密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-gray-400"
              placeholder="至少 8 位" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">确认新密码</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-gray-400"
              placeholder="再次输入新密码" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-black font-bold rounded-lg transition">
            {loading ? '重置中...' : '重置密码'}
          </button>
        </form>
      </div>
    </div>
  )
}
