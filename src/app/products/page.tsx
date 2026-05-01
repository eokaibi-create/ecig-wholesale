import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getServerLang, serverT, type Lang } from '@/i18n/server'
import { cookies } from 'next/headers'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; brand?: string }>
}): Promise<Metadata> {
  const lang = await getServerLang()
  const params = await searchParams
  const t = (key: any) => serverT(key, lang)

  if (params.brand) {
    const brand = await prisma.brand.findFirst({ where: { slug: params.brand } })
    if (brand) {
      return {
        title: lang === 'zh'
          ? `${brand.name} - VAPOR-X 电子烟批发`
          : `${brand.name} - VAPOR-X Vape Wholesale`,
        description: lang === 'zh'
          ? `VAPOR-X ${brand.name} 系列产品批发 — 正品保障，全美48州配送`
          : `VAPOR-X ${brand.name} wholesale — authentic products, nationwide shipping`,
      }
    }
  }

  return {
    title: lang === 'zh' ? '产品中心 - VAPOR-X 电子烟批发' : 'Products - VAPOR-X Vape Wholesale',
    description: lang === 'zh'
      ? 'VAPOR-X 全系列电子烟产品批发 — 一次性电子烟、换弹式电子烟、烟油。全美48州配送。'
      : 'VAPOR-X full range vape products wholesale — disposable vapes, pod systems, e-liquid. Nationwide shipping.',
  }
}

async function getCustomerTypeFromCookie(): Promise<string | null> {
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

function getDisplayPrice(product: any, customerType: string | null): { price: number; label: string; showMsrp: boolean } {
  const hasStorePrice = product.wholesalePrice != null && product.wholesalePrice > 0
  const hasWholesalerPrice = product.wholesalerPrice != null && product.wholesalerPrice > 0
  
  if (customerType === 'wholesaler' && hasStorePrice) {
    return { price: product.wholesalePrice, label: 'wholesaler', showMsrp: true }
  }
  if (customerType === 'store' && hasWholesalerPrice) {
    return { price: product.wholesalerPrice, label: 'store', showMsrp: true }
  }
  return { price: product.price, label: 'retail', showMsrp: !!product.msrp }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; brand?: string }>
}) {
  const lang = await getServerLang()
  const t = (key: any) => serverT(key, lang)

  const params = await searchParams
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  const brands = await prisma.brand.findMany({ orderBy: { sortOrder: 'asc' } })

  const where: any = { published: true }
  if (params.category) {
    where.category = { slug: params.category }
  }
  if (params.brand) {
    const brand = brands.find(b => b.slug === params.brand)
    if (brand) {
      where.brand = brand.name
    }
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { brand: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const currentBrand = params.brand ? brands.find(b => b.slug === params.brand) : null
  const customerType = await getCustomerTypeFromCookie()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">
            {currentBrand ? `${currentBrand.name} ${t('products.withBrand')}` : t('product.title')}
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            {currentBrand
              ? `${currentBrand.name} ${t('products.brandSeries')}`
              : t('product.desc')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Link href={`/products${params.brand ? `?brand=${params.brand}` : ''}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !params.category ? 'bg-amber-500 text-black' : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}>{t('product.all')}</Link>
          {categories.map((cat) => (
            <Link key={cat.id}
              href={`/products?category=${cat.slug}${params.brand ? `&brand=${cat.slug}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                params.category === cat.slug ? 'bg-amber-500 text-black' : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}>{cat.name}</Link>
          ))}
        </div>

        {!params.brand && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-xs text-gray-400 self-center mr-1">{t('product.filterByBrand')}</span>
            {brands.map((b) => (
              <Link key={b.id} href={`/products?brand=${b.slug}`}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white border text-gray-500 hover:border-amber-300 hover:text-amber-600 transition">
                {b.name}
              </Link>
            ))}
          </div>
        )}

        {!params.category && brands.length > 0 && (
          <div className="mb-8 bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">{t('brand.partner')}</h3>
              <Link href="/brands" className="text-xs text-amber-600 hover:text-amber-700">{t('product.viewAll')}</Link>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              {brands.map((b) => (
                <Link key={b.id} href={`/products?brand=${b.slug}`}
                  className={`h-10 px-3 flex items-center border rounded-lg transition ${params.brand === b.slug ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:border-amber-200'}`}>
                  {b.logo && <img src={b.logo} alt={b.name} className="h-6 w-auto" />}
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="text-6xl mb-4 text-gray-300"></div>
            <h3 className="text-xl font-semibold text-gray-600">{t('product.none')}</h3>
            <p className="text-gray-400 mt-2">{t('products.emptyDesc')}</p>
            <p className="text-gray-400 text-sm mt-1">
              数据库暂无数据。请前往 后台管理 → 系统设置 → 导入示例数据
            </p>
            <Link href="/admin/settings" className="inline-block mt-4 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition text-sm">
              前往后台导入数据
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-6xl"></div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">{product.category?.name}</span>
                  <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-amber-600 transition">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">{(() => {
                    if (lang !== 'en' || !product.shortDesc) return product.shortDesc
                    const shortMap: Record<string, string> = {
                      'elfbar-bc5000': t('product.shortBc5000'),
                      'geek-bar-pulse': t('product.shortPulse'),
                      'lost-mary-mo20000-pro': t('product.shortLostMary'),
                      'raz-tn9000': t('product.shortRaz'),
                      'geek-bar-meloso-mini': t('product.shortMeloso'),
                      'elfbar-600': t('product.shortElf600'),
                    }
                    return shortMap[product.slug] || product.shortDesc
                  })()}</p>
                  <div className="mt-3 flex items-center justify-between">
                    {(() => {
                      const display = getDisplayPrice(product, customerType)
                      return <>
                        <span className={"text-xl font-bold " + (display.label === 'retail' ? 'text-amber-600' : display.label === 'store' ? 'text-amber-600' : 'text-purple-600')}>
                          ${display.price.toFixed(2)}
                        </span>
                        {display.showMsrp && product.msrp && <span className="text-sm text-gray-400 line-through">${product.msrp.toFixed(2)}</span>}
                      </>
                    })()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
