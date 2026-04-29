import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HeroSwiper from '@/components/HeroSwiper'
import { getServerLang, serverT, type Lang } from '@/i18n/server'
import { cookies } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return {
    title: lang === 'zh' ? 'VAPOR-X - 美国电子烟批发供应商' : 'VAPOR-X - Premium Vape Wholesale Supplier USA',
    description: lang === 'zh'
      ? '美国电子烟批发供应商 — 一次性电子烟、换弹式电子烟、烟油批发。全美48州配送，支持国际发货。'
      : 'Premium vape wholesale supplier USA — disposable vapes, pod systems, e-liquid wholesale. Ship nationwide, international shipping available.',
  }
}

async function getCustomerTypeFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get('customer_token')?.value
  if (!token) return null
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length < 3) return null
    const id = parseInt(parts[1])
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { type: true },
    })
    return customer?.type || null
  } catch {
    return null
  }
}

function getDisplayPrice(product, customerType) {
  const hasStorePrice = product.wholesalePrice != null && product.wholesalePrice > 0
  const hasWholesalerPrice = product.wholesalerPrice != null && product.wholesalerPrice > 0
  if (customerType === 'wholesaler' && hasStorePrice) {
    return { price: product.wholesalePrice, label: 'wholesaler' }
  }
  if (customerType === 'store' && hasWholesalerPrice) {
    return { price: product.wholesalerPrice, label: 'store' }
  }
  return { price: product.price, label: 'retail' }
}

async function getData() {
  const [categories, brands, products, platforms, settings, heroItems, videos] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    }),
    prisma.platform.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.setting.findMany(),
    prisma.heroItem.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { product: true },
    }),
    prisma.video.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  // ... existing code ...
  // 构建 settings map
  const settingsMap: Record<string, string> = {}
  settings.forEach(s => { settingsMap[s.key] = s.value })

  const t = (key: string) => {
    // 这里只是占位，实际在组件中用 serverT
    return key
  }

  return {
    categories,
    brands,
    products,
    platforms,
    settings: settingsMap,
    heroItems,
    videos,
  }
}

export default async function HomePage() {
  const lang = await getServerLang()
  const customerType = await getCustomerTypeFromCookie()
  const { categories, brands, products, platforms, settings, heroItems, videos } = await getData()

  // 英文模式下优先使用翻译，中文模式下 settings 中的值优先
  const heroTitle = lang === 'en' ? (serverT('hero.title' as any, lang) || settings.hero_title) : (settings.hero_title || serverT('hero.title' as any, lang))
  const productTitle = lang === 'en' ? (serverT('product.title' as any, lang) || settings.section_product_title) : (settings.section_product_title || serverT('product.title' as any, lang))
  const brandTitle = lang === 'en' ? (serverT('brand.title' as any, lang) || settings.section_brand_title) : (settings.section_brand_title || serverT('brand.title' as any, lang))
  const platformTitle = lang === 'en' ? (serverT('platform.title' as any, lang) || settings.section_platform_title) : (settings.section_platform_title || serverT('platform.title' as any, lang))
  const contactTitle = lang === 'en' ? (serverT('contact.title' as any, lang) || settings.section_contact_title) : (settings.section_contact_title || serverT('contact.title' as any, lang))

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <HeroSwiper items={heroItems} lang={lang} />
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{productTitle}</h2>
          <p className="mt-4 text-gray-500">{serverT('product.desc' as any, lang)}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const displayPrice = getDisplayPrice(product, customerType)
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.featured && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {serverT('product.hot' as any, lang)}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {product.name}
                  </h3>
                  {product.shortDesc && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.shortDesc}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      ${displayPrice.price.toFixed(2)}
                    </span>
                    {displayPrice.label !== 'retail' && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {displayPrice.label === 'wholesaler' ? serverT('product.wholesalerPrice' as any, lang) : serverT('product.storePrice' as any, lang)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              {serverT('product.viewAll' as any, lang)}
            </Link>
          </div>
        )}
      </section>

      {/* Brands Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{brandTitle}</h2>
            <p className="mt-4 text-gray-500">{serverT('brand.desc' as any, lang)}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands?brand=${brand.slug}`}
                className="group flex flex-col items-center p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-16 w-auto object-contain mb-3 group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-gray-400">{brand.name.charAt(0)}</span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      {platforms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{platformTitle}</h2>
            <p className="mt-4 text-gray-500">{serverT('platform.desc' as any, lang)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform) => (
              <div key={platform.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                {platform.logo && (
                  <img src={platform.logo} alt={platform.name} className="h-12 object-contain mb-4" />
                )}
                <h3 className="font-semibold text-gray-900 mb-2">{platform.name}</h3>
                {platform.description && (
                  <p className="text-sm text-gray-500">{platform.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Section */}
      {videos.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">{serverT("video.title" as any, lang)}</h2>
              <p className="mt-4 text-gray-500">{serverT('video.desc' as any, lang)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-video bg-gray-100">
                    {video.url ? (
                      <video
                        src={video.url}
                        controls
                        className="w-full h-full object-cover"
                        poster={video.cover || undefined}
                        title={video.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-gray-500 mt-1">{video.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{contactTitle}</h2>
          <p className="mt-4 text-gray-500">{serverT('contact.desc' as any, lang)}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-gray-900">{serverT('contact.whatsapp' as any, lang)}</p>
                  <p className="text-sm text-gray-500">{serverT('contact.prefix' as any, lang)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-900">{serverT('contact.email' as any, lang)}</p>
                  <p className="text-sm text-gray-500">sales@vapor-x.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">{serverT('contact.address' as any, lang)}</p>
                  <p className="text-sm text-gray-500">Los Angeles, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
