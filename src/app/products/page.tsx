import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getServerLang, serverT, type Lang } from '@/i18n/server'

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
              href={`/products?category=${cat.slug}${params.brand ? `&brand=${params.brand}` : ''}`}
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
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600">{t('product.none')}</h3>
            <p className="text-gray-400 mt-2">{t('products.emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-6xl">💨</div>
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
                    <span className="text-xl font-bold text-amber-600">${product.price.toFixed(2)}</span>
                    {product.msrp && <span className="text-sm text-gray-400 line-through">${product.msrp.toFixed(2)}</span>}
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
