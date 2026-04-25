import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getServerLang, serverT, type Lang } from '@/i18n/server'

export default async function BrandsPage() {
  const lang = await getServerLang()
  const t = (key: any) => serverT(key, lang)

  const brands = await prisma.brand.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  const brandProducts = await prisma.product.groupBy({
    by: ['brand'],
    _count: { id: true },
    where: { brand: { not: null }, published: true },
  })
  const brandCountMap = new Map(brandProducts.map(b => [b.brand, b._count.id]))

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{t('brand.title')}</h1>
          <p className="mt-2 text-lg text-gray-300">{t('brands.desc')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4">🏷️</div>
              <p className="text-gray-400">{t('brand.noBrands')}</p>
            </div>
          ) : (
            brands.map((brand) => {
              const count = brandCountMap.get(brand.name) || 0
              return (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-8 text-center hover:border-amber-300 hover:shadow-lg transition-all"
                >
                  <div className="h-16 flex items-center justify-center mb-4">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="h-full w-auto" />
                    ) : (
                      <span className="text-4xl">🏷️</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {count > 0 ? `${count} ${t('product.productsCount')}` : t('product.comingSoon')}
                  </p>
                </Link>
              )
            })
          )}
        </div>

        <div className="mt-16 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('brand.becomePartner')}</h2>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">{t('brand.becomeDesc')}</p>
          <Link
            href="/contact"
            className="mt-6 inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition"
          >
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </div>
  )
}
