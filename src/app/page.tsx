import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HeroSwiper from '@/components/HeroSwiper'
import { getServerLang, serverT, type Lang } from '@/i18n/server'

async function getData() {
  const [categories, brands, products, videos, platforms, settings, heroItems] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    }),
    prisma.video.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.platform.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.setting.findMany(),
    prisma.heroItem.findMany({
      where: { published: true },
      include: { product: true },
      orderBy: { sortOrder: 'asc' },
      take: 5,
    }),
  ])
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))
  return { categories, brands, products, videos, platforms, settings: settingMap, heroItems }
}

export default async function HomePage() {
  const lang = await getServerLang()
  const t = (key: any) => serverT(key, lang)

  const data = await getData()
  const { categories, brands, products, videos, platforms, settings, heroItems } = data

  const catIcons: Record<string, string> = {
    disposable: '💨', 'pod-system': '⚡', 'e-liquid': '🧪', accessories: '🔧', 'nicotine-pouches': '🟤',
  }

  // 联系资料可见性（默认全可见）
  const contactVisibility = {
    showWhatsapp: settings.show_whatsapp !== 'false',
    showEmail: settings.show_email !== 'false',
    showPhone: settings.show_phone !== 'false',
    showAddress: settings.show_address !== 'false',
    showWechat: settings.show_wechat !== 'false',
  }

  const contact = {
    whatsapp: contactVisibility.showWhatsapp ? (settings.whatsapp || '+13239260829') : '',
    email: contactVisibility.showEmail ? (settings.email || 'EOKAIBI@GMAIL.COM') : '',
    phone: contactVisibility.showPhone ? (settings.phone || '+1 (323) 926-0829') : '',
    wechat: contactVisibility.showWechat ? (settings.wechat || 'EA_YONG') : '',
    address: contactVisibility.showAddress ? (settings.address || 'Los Angeles, CA') : '',
    siteName: settings.site_name || 'VAPOR-X USA',
    minOrder: settings.min_order || '500',
  }
  // 英文模式：强制使用英文翻译
  // 中文模式：优先数据库自定义内容，其次默认翻译
  const sections = {
    heroTitle: lang === 'en' ? t('hero.title') : (settings.hero_title || t('hero.title')),
    productTitle: lang === 'en' ? t('product.title') : (settings.section_product_title || t('product.title')),
    productDesc: lang === 'en' ? t('product.desc') : (settings.section_product_desc || t('product.desc')),
    brandTitle: lang === 'en' ? t('brand.title') : (settings.section_brand_title || t('brand.title')),
    brandDesc: lang === 'en' ? t('brand.desc') : (settings.section_brand_desc || t('brand.desc')),
    platformTitle: lang === 'en' ? t('platform.title') : (settings.section_platform_title || t('platform.title')),
    platformDesc: lang === 'en' ? t('platform.desc') : (settings.section_platform_desc || t('platform.desc')),
    contactTitle: lang === 'en' ? t('contact.title') : (settings.section_contact_title || t('contact.title')),
    contactDesc: lang === 'en' ? t('contact.desc') : (settings.section_contact_desc || t('contact.desc')),
  }

  const whatsappNum = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, '') : ''

  return (
    <div>
      <HeroSwiper items={heroItems} heroTitle={sections.heroTitle} />

      {/* Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">🛒</span>
              <h2 className="text-3xl font-bold text-gray-900">{sections.productTitle}</h2>
            </div>
            <p className="mt-2 text-gray-600 text-lg">{sections.productDesc}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link href="/products" className="px-5 py-2 bg-amber-500 text-black font-semibold rounded-full text-sm hover:bg-amber-600 transition">
              {t('product.all')}
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition">
                {catIcons[cat.slug] || '📦'} {cat.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? products.map(product => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📦</div>
                  )}
                  {product.hot && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{t('product.hot')}</span>}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-amber-600 transition truncate">{product.name}</h3>
                  {product.flavor && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.flavor.split(',').slice(0, 3).map(f => (
                        <span key={f} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full">{f.trim()}</span>
                      ))}
                      {product.flavor.split(',').length > 3 && <span className="text-[10px] text-gray-400">+{product.flavor.split(',').length - 3}</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-amber-600">${product.price.toFixed(2)}</span>
                    {product.wholesalePrice && <span className="text-sm text-gray-400 line-through">${product.wholesalePrice.toFixed(2)}</span>}
                  </div>
                  {(() => {
                    if (lang !== 'en' || !product.shortDesc) return <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.shortDesc}</p>
                    const shortMap: Record<string, string> = {
                      'elfbar-bc5000': '5000 puffs | 50mg | 15ml | 17 flavors',
                      'geek-bar-pulse': '15000 puffs | 5% nicotine | LED display | 12 flavors',
                      'lost-mary-mo20000-pro': '20000 puffs | Mesh coil | Adjustable airflow | 10 flavors',
                      'raz-tn9000': '9000 puffs | Digital battery display | Icy experience',
                      'geek-bar-meloso-mini': '600 puffs | 20mg nicotine salt | 1.2ml | Mini portable',
                      'elfbar-600': '600 puffs | 20mg nicotine salt | 2ml | Classic entry',
                    }
                    return <p className="text-xs text-gray-500 mt-1 line-clamp-2">{shortMap[product.slug] || product.shortDesc}</p>
                  })()}
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📦</div>
                <p>{t('product.none')}</p>
                <Link href="/admin/products" className="text-amber-600 hover:underline text-sm mt-2 inline-block">{t('product.addInAdmin')}</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">🤝</span>
                <h2 className="text-3xl font-bold text-gray-900">{sections.brandTitle}</h2>
              </div>
              <p className="text-gray-600">{sections.brandDesc}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {brands.map(brand => (
                <div key={brand.id} className="flex flex-col items-center w-28">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-14 w-auto object-contain mb-2 grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="h-14 w-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs mb-2">{t('brand.logo')}</div>
                  )}
                  <span className="text-xs text-gray-600 font-medium text-center">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">🎬</span>
                <h2 className="text-3xl font-bold text-gray-900">{t('video.title')}</h2>
              </div>
              <p className="text-gray-600">{t('video.desc')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {videos.map(video => (
                <div key={video.id} className="rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                  <div className="aspect-video">
                    {video.url.includes('youtube') || video.url.includes('youtu.be') ? (
                      <iframe src={video.url} title={video.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : (
                      <video src={video.url} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                  {video.title && <div className="p-4"><h3 className="text-white font-semibold">{video.title}</h3></div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Platforms */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">🌐</span>
              <h2 className="text-3xl font-bold">{sections.platformTitle}</h2>
            </div>
            <p className="text-gray-400 text-lg">{sections.platformDesc}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platforms.length > 0 ? platforms.map(platform => (
              <div key={platform.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-amber-500/30 transition-all group">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden p-2 group-hover:bg-white/20 transition">
                  {platform.logo ? <img src={platform.logo} alt={platform.name} className="h-10 w-auto object-contain" /> : <span className="text-2xl">📱</span>}
                </div>
                <h3 className="font-bold text-white mb-2">{platform.name}</h3>
                {platform.description && <p className="text-sm text-gray-400 leading-relaxed">{platform.description}</p>}
              </div>
            )) : (
              <>
                {[
                  { icon: '🏭', title: t('platform.fallback1Title'), desc: t('platform.fallback1Desc') },
                  { icon: '🚚', title: t('platform.fallback2Title'), desc: t('platform.fallback2Desc') },
                  { icon: '💰', title: t('platform.fallback3Title'), desc: t('platform.fallback3Desc') },
                  { icon: '💬', title: t('platform.fallback4Title'), desc: t('platform.fallback4Desc') },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center"><span className="text-3xl">{item.icon}</span></div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">📞</span>
                <h2 className="text-3xl font-bold text-gray-900">{sections.contactTitle}</h2>
              </div>
              <p className="text-gray-600 text-lg mb-8">{sections.contactDesc}</p>
              <div className="space-y-5">
                {(() => {
                  const items = []
                  if (contact.whatsapp) items.push({ icon: '💬', bg: 'bg-green-100', label: 'WhatsApp', val: contact.whatsapp, href: `https://wa.me/${whatsappNum}` })
                  if (contact.email) items.push({ icon: '📧', bg: 'bg-blue-100', label: 'Email', val: contact.email, href: `mailto:${contact.email}` })
                  if (contact.phone) items.push({ icon: '📞', bg: 'bg-amber-100', label: t('contact.phone'), val: contact.phone, href: `tel:${contact.phone.replace(/[^0-9+]/g, '')}` })
                  if (contact.address) items.push({ icon: '📍', bg: 'bg-red-100', label: t('contact.address'), val: contact.address })
                  if (contact.wechat) items.push({ icon: '💚', bg: 'bg-green-100', label: 'WeChat', val: contact.wechat })
                  return items
                })().map((item, i) => (
                  <div key={i} className={`flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition`}>
                    <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}><span className="text-xl">{item.icon}</span></div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      {'href' in item ? (
                        <a href={(item as any).href} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-gray-900 hover:text-green-600 transition">{item.val}</a>
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">{item.val}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">{t('contact.inquire')}</h3>
              <p className="text-gray-400 mb-6">{t('contact.inquireDesc')}</p>
              <form action="/api/inquiries" method="POST" className="space-y-4">
                <input type="text" name="name" placeholder={t('contact.name')} required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                <textarea name="message" rows={4} placeholder={t('contact.message')} required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none"></textarea>
                <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition">{t('contact.send')}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Note: Footer is rendered by layout.tsx */}
    </div>
  )
}
