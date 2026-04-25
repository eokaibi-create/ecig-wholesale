import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { getServerLang, serverT, type Lang } from '@/i18n/server'

export default async function AboutPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('vaporx-lang')?.value === 'en' ? 'en' : 'zh') as Lang
  const t = (key: any) => serverT(key, lang)

  const settings = await prisma.setting.findMany()
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-5xl font-bold text-amber-400">V</span>
            <h1 className="text-4xl font-bold">{t('about.title')}</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            {t('about.desc')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.story')}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p><strong className="text-gray-900">VAPOR-X</strong> {t('about.story1')}</p>
                <p>{t('about.story2')}</p>
                <p>{t('about.story3')}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition">
                  {t('about.browseProducts')}
                </Link>
                <Link href="/contact" className="inline-flex items-center px-6 py-3 border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-black font-bold rounded-lg transition">
                  {t('about.contactCooperate')}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">🏭</div>
                  <p className="text-2xl font-bold text-amber-600">VAPOR-X</p>
                  <p className="text-gray-500">{t('about.subtitle')}</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amber-500 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                {t('about.since')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t('about.stats')}</h2>
            <p className="text-gray-400 mt-2">{t('about.statsDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: t('about.statsYear'), label: t('about.statsYearLabel'), icon: '📅' },
              { number: t('about.statsCustomers'), label: t('about.statsCustomersLabel'), icon: '🤝' },
              { number: t('about.statsBrands'), label: t('about.statsBrandsLabel'), icon: '🏷️' },
              { number: t('about.statsStates'), label: t('about.statsStatesLabel'), icon: '🇺🇸' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-amber-400">{stat.number}</div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('about.whyUs')}</h2>
            <p className="text-gray-600 mt-2">{t('about.whyUsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: t('about.benefit1'), desc: t('about.benefit1Desc') },
              { icon: '💰', title: t('about.benefit2'), desc: t('about.benefit2Desc') },
              { icon: '🚚', title: t('about.benefit3'), desc: t('about.benefit3Desc') },
              { icon: '📦', title: t('about.benefit4'), desc: t('about.benefit4Desc') },
              { icon: '🌐', title: t('about.benefit5'), desc: t('about.benefit5Desc') },
              { icon: '💬', title: t('about.benefit6'), desc: t('about.benefit6Desc') },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-amber-300 transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('about.cooperation')}</h2>
            <p className="text-gray-600 mt-2">{t('about.cooperationDesc')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: 'Elf Bar', color: 'bg-blue-50 border-blue-200 text-blue-600' },
              { name: 'Geek Bar', color: 'bg-green-50 border-green-200 text-green-600' },
              { name: 'SMOK', color: 'bg-red-50 border-red-200 text-red-600' },
              { name: 'JUUL', color: 'bg-purple-50 border-purple-200 text-purple-600' },
              { name: 'Vaporesso', color: 'bg-cyan-50 border-cyan-200 text-cyan-600' },
              { name: 'Lost Mary', color: 'bg-pink-50 border-pink-200 text-pink-600' },
              { name: 'Naked 100', color: 'bg-orange-50 border-orange-200 text-orange-600' },
              { name: 'ZYN', color: 'bg-gray-50 border-gray-200 text-gray-600' },
            ].map((brand) => (
              <span key={brand.name}
                className={`px-5 py-3 rounded-xl border font-bold text-base ${brand.color} hover:shadow-sm transition`}>
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t('about.promise')}</h2>
            <p className="text-gray-400 mt-2">{t('about.promiseDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t('about.promise1'), desc: t('about.promise1Desc') },
              { title: t('about.promise2'), desc: t('about.promise2Desc') },
              { title: t('about.promise3'), desc: t('about.promise3Desc') },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-xl bg-white/5 border border-white/10">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">{t('about.cta')}</h2>
          <p className="text-lg text-black/80 mb-8">{t('about.ctaDesc')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {settingMap.whatsapp && (
              <a href={`https://wa.me/${settingMap.whatsapp.replace(/[^0-9]/g, '')}`}
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition text-lg shadow-lg">
                {t('about.whatsappConsult')}
              </a>
            )}
            <Link href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition text-lg shadow-lg">
              {t('about.onlineInquiry')}
            </Link>
          </div>
          <div className="mt-6 text-sm text-black/60">
            {t('about.wechatAdd')}: <strong>{settingMap.wechat || 'vaporx_us'}</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
