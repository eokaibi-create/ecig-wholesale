'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/i18n/LanguageProvider'

const COUNTRY_CODES = [
  { code: '+1', country: 'US', name: '美国 +1' },
  { code: '+86', country: 'CN', name: '中国 +86' },
  { code: '+852', country: 'HK', name: '香港 +852' },
  { code: '+886', country: 'TW', name: '台湾 +886' },
  { code: '+44', country: 'GB', name: '英国 +44' },
  { code: '+81', country: 'JP', name: '日本 +81' },
  { code: '+82', country: 'KR', name: '韩国 +82' },
  { code: '+84', country: 'VN', name: '越南 +84' },
  { code: '+66', country: 'TH', name: '泰国 +66' },
  { code: '+60', country: 'MY', name: '马来西亚 +60' },
  { code: '+65', country: 'SG', name: '新加坡 +65' },
  { code: '+62', country: 'ID', name: '印尼 +62' },
  { code: '+63', country: 'PH', name: '菲律宾 +63' },
  { code: '+61', country: 'AU', name: '澳大利亚 +61' },
  { code: '+64', country: 'NZ', name: '新西兰 +64' },
  { code: '+91', country: 'IN', name: '印度 +91' },
  { code: '+971', country: 'AE', name: '阿联酋 +971' },
  { code: '+966', country: 'SA', name: '沙特 +966' },
  { code: '+974', country: 'QA', name: '卡塔尔 +974' },
  { code: '+973', country: 'BH', name: '巴林 +973' },
  { code: '+968', country: 'OM', name: '阿曼 +968' },
  { code: '+965', country: 'KW', name: '科威特 +965' },
  { code: '+49', country: 'DE', name: '德国 +49' },
  { code: '+33', country: 'FR', name: '法国 +33' },
  { code: '+39', country: 'IT', name: '意大利 +39' },
  { code: '+34', country: 'ES', name: '西班牙 +34' },
  { code: '+31', country: 'NL', name: '荷兰 +31' },
  { code: '+32', country: 'BE', name: '比利时 +32' },
  { code: '+41', country: 'CH', name: '瑞士 +41' },
  { code: '+46', country: 'SE', name: '瑞典 +46' },
  { code: '+47', country: 'NO', name: '挪威 +47' },
  { code: '+45', country: 'DK', name: '丹麦 +45' },
  { code: '+358', country: 'FI', name: '芬兰 +358' },
  { code: '+7', country: 'RU', name: '俄罗斯 +7' },
  { code: '+380', country: 'UA', name: '乌克兰 +380' },
  { code: '+48', country: 'PL', name: '波兰 +48' },
  { code: '+30', country: 'GR', name: '希腊 +30' },
  { code: '+351', country: 'PT', name: '葡萄牙 +351' },
  { code: '+353', country: 'IE', name: '爱尔兰 +353' },
  { code: '+55', country: 'BR', name: '巴西 +55' },
  { code: '+52', country: 'MX', name: '墨西哥 +52' },
  { code: '+54', country: 'AR', name: '阿根廷 +54' },
  { code: '+56', country: 'CL', name: '智利 +56' },
  { code: '+57', country: 'CO', name: '哥伦比亚 +57' },
  { code: '+1-', country: 'CA', name: '加拿大 +1' },
  { code: '+27', country: 'ZA', name: '南非 +27' },
  { code: '+20', country: 'EG', name: '埃及 +20' },
  { code: '+212', country: 'MA', name: '摩洛哥 +212' },
  { code: '+234', country: 'NG', name: '尼日利亚 +234' },
  { code: '+254', country: 'KE', name: '肯尼亚 +254' },
  { code: '+233', country: 'GH', name: '加纳 +233' },
  { code: '+98', country: 'IR', name: '伊朗 +98' },
  { code: '+90', country: 'TR', name: '土耳其 +90' },
  { code: '+972', country: 'IL', name: '以色列 +972' },
]

const COUNTRIES = [
  { code: 'US', name: '美国 / United States' },
  { code: 'CN', name: '中国 / China' },
  { code: 'HK', name: '香港 / Hong Kong' },
  { code: 'TW', name: '台湾 / Taiwan' },
  { code: 'GB', name: '英国 / United Kingdom' },
  { code: 'JP', name: '日本 / Japan' },
  { code: 'KR', name: '韩国 / South Korea' },
  { code: 'VN', name: '越南 / Vietnam' },
  { code: 'TH', name: '泰国 / Thailand' },
  { code: 'MY', name: '马来西亚 / Malaysia' },
  { code: 'SG', name: '新加坡 / Singapore' },
  { code: 'ID', name: '印尼 / Indonesia' },
  { code: 'PH', name: '菲律宾 / Philippines' },
  { code: 'AU', name: '澳大利亚 / Australia' },
  { code: 'NZ', name: '新西兰 / New Zealand' },
  { code: 'IN', name: '印度 / India' },
  { code: 'AE', name: '阿联酋 / UAE' },
  { code: 'SA', name: '沙特 / Saudi Arabia' },
  { code: 'QA', name: '卡塔尔 / Qatar' },
  { code: 'BH', name: '巴林 / Bahrain' },
  { code: 'OM', name: '阿曼 / Oman' },
  { code: 'KW', name: '科威特 / Kuwait' },
  { code: 'DE', name: '德国 / Germany' },
  { code: 'FR', name: '法国 / France' },
  { code: 'IT', name: '意大利 / Italy' },
  { code: 'ES', name: '西班牙 / Spain' },
  { code: 'NL', name: '荷兰 / Netherlands' },
  { code: 'BE', name: '比利时 / Belgium' },
  { code: 'CH', name: '瑞士 / Switzerland' },
  { code: 'SE', name: '瑞典 / Sweden' },
  { code: 'NO', name: '挪威 / Norway' },
  { code: 'DK', name: '丹麦 / Denmark' },
  { code: 'FI', name: '芬兰 / Finland' },
  { code: 'RU', name: '俄罗斯 / Russia' },
  { code: 'UA', name: '乌克兰 / Ukraine' },
  { code: 'PL', name: '波兰 / Poland' },
  { code: 'GR', name: '希腊 / Greece' },
  { code: 'PT', name: '葡萄牙 / Portugal' },
  { code: 'IE', name: '爱尔兰 / Ireland' },
  { code: 'BR', name: '巴西 / Brazil' },
  { code: 'MX', name: '墨西哥 / Mexico' },
  { code: 'AR', name: '阿根廷 / Argentina' },
  { code: 'CL', name: '智利 / Chile' },
  { code: 'CO', name: '哥伦比亚 / Colombia' },
  { code: 'CA', name: '加拿大 / Canada' },
  { code: 'ZA', name: '南非 / South Africa' },
  { code: 'EG', name: '埃及 / Egypt' },
  { code: 'MA', name: '摩洛哥 / Morocco' },
  { code: 'NG', name: '尼日利亚 / Nigeria' },
  { code: 'KE', name: '肯尼亚 / Kenya' },
  { code: 'GH', name: '加纳 / Ghana' },
  { code: 'IR', name: '伊朗 / Iran' },
  { code: 'TR', name: '土耳其 / Turkey' },
  { code: 'IL', name: '以色列 / Israel' },
]

export default function RegisterPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+86',
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

      // 个人买家直接登录跳转
      if (form.type === 'individual') {
        const payload = { id: data.customer.id, customerId: data.customer.id, email: data.customer.email, name: data.customer.name }
        localStorage.setItem('customer_token', btoa(JSON.stringify(payload)))
        localStorage.setItem('customer_info', JSON.stringify(data.customer))
        router.push('/')
        router.refresh()
      } else {
        // 店铺/批发商显示等待审核提示
        setSuccessMsg('注册成功！您的账号正在审核中，请等待管理员审核通过后即可登录。')
        setForm({
          name: '', email: '', phone: '', countryCode: '+86',
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
    { value: 'wholesaler', label: { zh: '批发商', en: 'Wholesaler' } },
    { value: 'store', label: { zh: '店铺', en: 'Store' } },
    { value: 'individual', label: { zh: '个人买家', en: 'Individual' } },
  ]

  const isBusiness = form.type !== 'individual'

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('register.title')}</h1>
          <p className="text-gray-500 mt-2">{t('register.desc')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        {successMsg && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            <p className="font-medium mb-1">✅ 注册成功</p>
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">账户类型 *</label>
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
                  {ct.value === 'wholesaler' ? '🏬 ' : ct.value === 'store' ? '🏪 ' : '👤 '}
                  {ct.label.zh}
                </button>
              ))}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
              <input type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="您的姓名" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="your@email.com" />
            </div>
          </div>

          {/* 商业用户：公司信息 */}
          {isBusiness && (
            <>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">🏢 公司信息（必填）</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 *</label>
                <input type="text" required value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="您的公司名称" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司地址 *</label>
                <input type="text" required value={form.companyAddress}
                  onChange={e => setForm({ ...form, companyAddress: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="街道、城市、邮编" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">国家 *</label>
                  <select required value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white">
                    <option value="">请选择国家</option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">州/省</label>
                  <input type="text" value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    placeholder="州/省（选填）" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机号 *</label>
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
                    placeholder="手机号码" />
                </div>
              </div>
            </>
          )}

          {/* 个人用户：电话选填 */}
          {!isBusiness && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话（选填）</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="可选" />
            </div>
          )}

          {/* 密码 */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">🔐 登录信息</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码 *</label>
              <input type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="至少6位" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">确认密码 *</label>
              <input type="password" required value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="再次输入密码" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-50 mt-2">
            {loading ? '注册中...' : form.type === 'individual' ? '注册并登录' : '提交注册申请'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          已有账号？{' '}
          <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">立即登录</Link>
        </p>
      </div>
    </div>
  )
}
