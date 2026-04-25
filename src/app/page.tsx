import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HeroSwiper from '@/components/HeroSwiper'
import { cookies } from 'next/headers'

type Lang = 'zh' | 'en'

const t = (key: string, lang: Lang): string => {
  const en: Record<string, string> = {
    'all': 'All',
    'noProducts': 'No products yet',
    'videoTitle': 'Videos',
    'videoDesc': 'Learn more about VAPOR-X products & services',
    'inquiry': 'Wholesale Inquiry',
    'inquiryDesc': 'Leave your info and we will reply within 24 hours',
    'inquiryName': 'Your Name',
    'inquiryEmail': 'Email Address',
    'inquiryMessage': 'Inquiry details (product/qty/requirements)',
    'inquirySubmit': 'Send Inquiry →',
    'addProduct': 'Add products in admin →',
    'factory': 'Factory Direct',
    'factoryDesc': 'Direct partnerships with top brands',
    'shipping': 'Nationwide Shipping',
    'shippingDesc': 'Covers 48 states, shipped from LA',
    'price': 'Wholesale Pricing',
    'priceDesc': 'From $500 min order, tiered discounts',
    'support': '24/7 Support',
    'supportDesc': 'Online support available 7x24',
    'footerPowered': 'POWERED BY ALOKAIBI TRADING GROUP',
    'footerAge': '18+ Adult Wholesale Customers Only',
    'footerRights': 'All Rights Reserved',
  }
  const zh: Record<string, string> = {
    'all': '全部',
    'noProducts': '暂无产品',
    'videoTitle': '视频展示',
    'videoDesc': '了解 VAPOR-X 的产品与服务',
    'inquiry': '批发询价',
    'inquiryDesc': '留下您的信息，我们将在24小时内回复',
    'inquiryName': '您的姓名',
    'inquiryEmail': '邮箱地址',
    'inquiryMessage': '询价内容（产品/数量/要求等）',
    'inquirySubmit': '发送询价 →',
    'addProduct': '去后台添加产品 →',
    'factory': '厂家直供',
    'factoryDesc': '与顶级品牌直接合作，正品保障',
    'shipping': '全美配送',
    'shippingDesc': '覆盖48州，洛杉矶仓直发',
    'price': '批发价格',
    'priceDesc': '最低$500起批，阶梯折扣',
    'support': '专属客服',
    'supportDesc': '7x24小时在线支持',
    'footerPowered': 'POWERED BY ALOKAIBI TRADING GROUP',
    'footerAge': '18+ 仅限成年批发客户',
    'footerRights': 'All Rights Reserved',
  }
  return lang === 'en' ? (en[key] || key) : (zh[key] || key)
}

async function getData() {
  const [
    categories,
    brands,
    products,
    videos,
    platforms,
    settings,
    heroItems,
  ] = await Promise.all([
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
  const cookieStore = await cookies()
  const lang = (cookieStore.get('vaporx-lang')?.value === 'en' ? 'en' : 'zh') as Lang

  const { categories, brands, products, videos, platforms, settings, heroItems } = await getData()

  const catIcons: Record<string, string> = {
    disposable: '💨',
    'pod-system': '⚡',
    'e-liquid': '🧪',
    accessories: '🔧',
    'nicotine-pouches': '🟤',
  }

  const contact = {
    whatsapp: settings.whatsapp || '+13239260829',
    email: settings.email || 'EOKAIBI@GMAIL.COM',
    phone: settings.phone || '+1 (323) 926-0829',
    wechat: settings.wechat || 'EA_YONG',
    address: settings.address || 'Los Angeles, CA',
    siteName: settings.site_name || 'VAPOR-X USA',
    siteDesc: settings.site_description || '美国电子烟批发供应商',
    minOrder: settings.min_order || '500',
  }

  // 从数据库加载各区块标题（后台可编辑中文/英文）
  const sections = {
    heroTitle: settings.hero_title || (lang === 'en' ? 'New Arrivals' : '新品热荐'),
    productTitle: settings.section_product_title || (lang === 'en' ? 'Products' : '产品中心'),
    productDesc: settings.section_product_desc || (lang === 'en' ? 'Full range for all wholesale needs' : '全系列产品，满足各类批发需求'),
    brandTitle: settings.section_brand_title || (lang === 'en' ? 'Brand Partners' : '合作品牌'),
    brandDesc: settings.section_brand_desc || (lang === 'en' ? 'Strategic partnerships with top vape brands' : 'VAPOR-X 与全球顶级电子烟品牌战略合作'),
    platformTitle: settings.section_platform_title || (lang === 'en' ? 'Platforms' : '合作平台'),
    platformDesc: settings.section_platform_desc || (lang === 'en' ? 'Multi-platform reach for global business' : '多平台布局，助力您的电子烟业务全球拓展'),
    contactTitle: settings.section_contact_title || (lang === 'en' ? 'Contact Us' : '联系我们'),
    contactDesc: settings.section_contact_desc || (lang === 'en' ? 'Reach out for wholesale pricing and product info' : '欢迎联系我们获取最新批发报价和产品信息'),
  }

  const whatsappNum = contact.whatsapp.replace(/[^0-9]/g, '')

  return (
    <div>
      {/* Hero */}
      <HeroSwiper items={heroItems} heroTitle={sections.heroTitle} />

      {/* 产品中心 */}
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
            <Link href="/products"
              className="px-5 py-2 bg-amber-500 text-black font-semibold rounded-full text-sm hover:bg-amber-600 transition">
              {t('all', lang)}
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
              <Link key={product.id} href={`/products/${product.slug}`}
                className="group bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📦</div>
                  )}
                  {product.hot && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{lang === 'en' ? 'HOT' : '热销'}</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-amber-600 transition truncate">{product.name}</h3>
                  {product.flavor && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.flavor.split(',').slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full">{f.trim()}</span>
                      ))}
                      {product.flavor.split(',').length > 3 && (
                        <span className="text-[10px] text-gray-400">+{product.flavor.split(',').length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-amber-600">${product.price.toFixed(2)}</span>
                    {product.wholesalePrice && (
                      <span className="text-sm text-gray-400 line-through">${product.wholesalePrice.toFixed(2)}</span>
                    )}
                  </div>
                  {product.shortDesc && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.shortDesc}</p>
                  )}
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📦</div>
                <p>{t('noProducts', lang)}</p>
                <Link href="/admin/products" className="text-amber-600 hover:underline text-sm mt-2 inline-block">{t('addProduct', lang)}</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 合作品牌 */}
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
                    <img src={brand.logo} alt={brand.name}
                      className="h-14 w-auto object-contain mb-2 grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="h-14 w-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs mb-2">logo</div>
                  )}
                  <span className="text-xs text-gray-600 font-medium text-center">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 视频展示 */}
      {videos.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">🎬</span>
                <h2 className="text-3xl font-bold text-gray-900">{t('videoTitle', lang)}</h2>
              </div>
              <p className="text-gray-600">{t('videoDesc', lang)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {videos.map(video => (
                <div key={video.id} className="rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                  <div className="aspect-video">
                    {video.url.includes('youtube') || video.url.includes('youtu.be') ? (
                      <iframe src={video.url} title={video.title}
                        className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : (
                      <video src={video.url} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                  {video.title && (
                    <div className="p-4"><h3 className="text-white font-semibold">{video.title}</h3></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 合作平台 */}
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
            {platforms.length > 0 ? (
              platforms.map(platform => (
                <div key={platform.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-amber-500/30 transition-all group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden p-2 group-hover:bg-white/20 transition">
                    {platform.logo ? (
                      <img src={platform.logo} alt={platform.name} className="h-10 w-auto object-contain" />
                    ) : (
                      <span className="text-2xl">📱</span>
                    )}
                  </div>
                  <h3 className="font-bold text-white mb-2">{platform.name}</h3>
                  {platform.description && (
                    <p className="text-sm text-gray-400 leading-relaxed">{platform.description}</p>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center"><span className="text-3xl">🏭</span></div>
                  <h3 className="font-bold text-white mb-2">{t('factory', lang)}</h3>
                  <p className="text-sm text-gray-400">{t('factoryDesc', lang)}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center"><span className="text-3xl">🚚</span></div>
                  <h3 className="font-bold text-white mb-2">{t('shipping', lang)}</h3>
                  <p className="text-sm text-gray-400">{t('shippingDesc', lang)}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center"><span className="text-3xl">💰</span></div>
                  <h3 className="font-bold text-white mb-2">{t('price', lang)}</h3>
                  <p className="text-sm text-gray-400">{t('priceDesc', lang)}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center"><span className="text-3xl">💬</span></div>
                  <h3 className="font-bold text-white mb-2">{t('support', lang)}</h3>
                  <p className="text-sm text-gray-400">{t('supportDesc', lang)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
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
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xl">💬</span></div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 hover:text-green-600 transition">{contact.whatsapp}</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xl">📧</span></div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">{contact.email}</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-amber-200 transition">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xl">📞</span></div>
                  <div>
                    <p className="text-sm text-gray-500">{lang === 'en' ? 'Phone' : '电话'}</p>
                    <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition">{contact.phone}</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xl">📍</span></div>
                  <div>
                    <p className="text-sm text-gray-500">{lang === 'en' ? 'Address' : '地址'}</p>
                    <p className="text-lg font-semibold text-gray-900">{contact.address}</p>
                  </div>
                </div>
                {contact.wechat && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xl">💚</span></div>
                    <div>
                      <p className="text-sm text-gray-500">WeChat</p>
                      <p className="text-lg font-semibold text-gray-900">{contact.wechat}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">{t('inquiry', lang)}</h3>
              <p className="text-gray-400 mb-6">{t('inquiryDesc', lang)}</p>
              <form action="/api/inquiries" method="POST" className="space-y-4">
                <input type="text" name="name" placeholder={t('inquiryName', lang)} required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                <input type="email" name="email" placeholder={t('inquiryEmail', lang)} required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                <textarea name="message" rows={4} placeholder={t('inquiryMessage', lang)} required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none"></textarea>
                <button type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition">{t('inquirySubmit', lang)}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <p className="text-3xl font-black tracking-tight mb-2">
              <span className="text-amber-400">VAPOR</span><span className="text-white">-X</span>
            </p>
            <p className="text-xs text-gray-600 tracking-widest uppercase mb-2">
              {contact.siteName} — {contact.siteDesc}
            </p>
            <p className="text-xs text-gray-600">{t('footerPowered', lang)}</p>
            <p className="text-xs text-gray-600 mt-1">{t('footerAge', lang)}</p>
            <div className="mt-3 text-xs text-gray-700">
              &copy; {new Date().getFullYear()} {contact.siteName} — {t('footerRights', lang)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
