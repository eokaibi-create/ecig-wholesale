'use client'

import { useState, useEffect } from 'react'

interface Visibility {
  showWhatsapp: boolean
  showEmail: boolean
  showPhone: boolean
  showAddress: boolean
  showWechat: boolean
}

export default function ContactVisibility() {
  const [vis, setVis] = useState<Visibility>({
    showWhatsapp: true,
    showEmail: true,
    showPhone: true,
    showAddress: true,
    showWechat: true,
  })
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        if (data.visibility) {
          setVis(data.visibility)
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const toggle = (key: keyof Visibility) => {
    const newVis = { ...vis, [key]: !vis[key] }
    setVis(newVis)
    setSaving(true)

    fetch('/api/contact/visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        show_whatsapp: newVis.showWhatsapp,
        show_email: newVis.showEmail,
        show_phone: newVis.showPhone,
        show_address: newVis.showAddress,
        show_wechat: newVis.showWechat,
      }),
    })
      .then(res => res.json())
      .then(() => setSaving(false))
      .catch(() => setSaving(false))
  }

  const items: { key: keyof Visibility; label: string; icon: string; desc: string }[] = [
    { key: 'showWhatsapp', label: 'WhatsApp', icon: '💬', desc: '显示 WhatsApp 按钮和号码' },
    { key: 'showEmail', label: 'Email', icon: '📧', desc: '显示 Email 地址' },
    { key: 'showPhone', label: '电话', icon: '📞', desc: '显示电话号码' },
    { key: 'showAddress', label: '地址', icon: '📍', desc: '显示公司地址' },
    { key: 'showWechat', label: '微信', icon: '💚', desc: '显示微信号' },
  ]

  if (!loaded) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">👁️ 联系方式可见性</h2>
        {saving && <span className="text-xs text-amber-500">保存中...</span>}
      </div>
      <p className="text-sm text-gray-500 mb-4">
        关闭后，未登录访客将看不到对应的联系方式。登录后始终可见。
      </p>

      <div className="space-y-3">
        {items.map(({ key, label, icon, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                vis[key] ? 'bg-amber-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  vis[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        💡 提示：登录后的客户始终可以看到所有联系方式。此设置仅影响未登录访客。
      </p>
    </div>
  )
}
