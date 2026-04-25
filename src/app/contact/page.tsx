import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { getServerLang, serverT, type Lang } from '@/i18n/server'

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('vaporx-lang')?.value === 'en' ? 'en' : 'zh') as Lang
  const t = (key: any) => serverT(key, lang)

  const [settings, params] = await Promise.all([
    prisma.setting.findMany(),
    searchParams,
  ])
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))
  const success = params.success === 'true'
  const error = params.error === 'true'

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('contact.title')}</h1>
          <p className="mt-2 text-lg text-gray-300">{lang === 'en' ? 'We will reply within 24 hours' : '24小时内回复，期待与您合作'}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-800">{t('contact.success')}</p>
              <p className="text-sm text-green-600">{t('contact.successDesc')}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-semibold text-red-800">{t('contact.error')}</p>
              <p className="text-sm text-red-600">{t('contact.errorDesc')}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.inquire')}</h2>
            <form action="/api/inquiries" method="POST" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')} *</label>
                  <input type="text" name="name" required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.company')}</label>
                  <input type="text" name="company"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')} *</label>
                  <input type="email" name="email" required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.phone')}</label>
                  <input type="tel" name="phone"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')} *</label>
                <textarea name="message" rows={5} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder={lang === 'en' ? 'Please describe products, quantities and your requirements...' : '请描述您需要采购的产品、数量和您的需求...'}></textarea>
              </div>
              <button type="submit"
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition text-lg">
                {t('contact.submitInquiry')}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.title')}</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">📍</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('contact.address')}</h3>
                  <p className="text-gray-600">{settingMap.address || '1234 Commerce Blvd, Los Angeles, CA 90001'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <a href={`https://wa.me/${(settingMap.whatsapp || '+13239260829').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium">{settingMap.whatsapp || '+13239260829'}</a>
                  <p className="text-sm text-gray-500">{t('contact.replyTime')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-2xl">💚</div>
                <div>
                  <h3 className="font-semibold text-gray-900">WeChat</h3>
                  <p className="text-green-600 font-medium">{settingMap.wechat || 'EA_YONG'}</p>
                  <p className="text-sm text-gray-500">{lang === 'en' ? 'Scan to add, get catalog and price list' : '扫码添加，获取产品目录和报价单'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-2xl">📧</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href={`mailto:${settingMap.email || 'EOKAIBI@GMAIL.COM'}`} className="text-blue-600 hover:text-blue-700 font-medium">{settingMap.email || 'EOKAIBI@GMAIL.COM'}</a>
                  <p className="text-sm text-gray-500">{lang === 'en' ? 'Reply within 24 hours' : '24小时内回复'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">📞</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('contact.phone')}</h3>
                  <p className="text-gray-600">{settingMap.phone || '+1 (555) 123-4567'}</p>
                  <p className="text-sm text-gray-500">{t('contact.hours')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-2">{t('contact.wholesaleTip')}</h3>
              <p className="text-sm text-gray-600">
                {t('contact.minOrder')}: <strong>${settingMap.min_order || '500'}</strong><br/>
                {settingMap.shipping_info || (lang === 'en' ? 'Free shipping to 48 states, min order $1000' : '全美48州免运费，订单满$1000起批')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
