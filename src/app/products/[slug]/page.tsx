'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import { useLanguage } from '@/i18n/LanguageProvider'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDesc?: string
  categoryId: number
  category: { id: number; name: string; slug: string }
  brand?: string
  price: number
  wholesalePrice?: number | null
  msrp?: number | null
  image?: string | null
  images: string[]
  stock: number
  nicotine?: string | null
  capacity?: string | null
  puffs?: string | null
  flavor?: string | null
  size?: string | null
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, language } = useLanguage()

  const [product, setProduct] = useState<Product | null>(null)
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [notFoundState, setNotFoundState] = useState(false)

  // 获取产品英文描述
  const getEnglishDescription = () => {
    if (language !== 'en') return product?.description || ''
    const descMap: Record<string, string> = {
      'elfbar-bc5000': t('product.elfbarBc5000'),
      'geek-bar-pulse': t('product.geekBarPulse'),
      'lost-mary-mo20000-pro': t('product.lostMary'),
      'raz-tn9000': t('product.razTn9000'),
      'geek-bar-meloso-mini': t('product.geekBarMelosoMini'),
      'elfbar-600': t('product.elfbar600'),
    }
    return descMap[product?.slug || ''] || product?.description || ''
  }

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, setRes] = await Promise.all([
          fetch(`/api/products/slug/${slug}`),
          fetch('/api/settings'),
        ])
        if (!prodRes.ok) {
          setNotFoundState(true)
          return
        }
        const prod = await prodRes.json()
        setProduct(prod)

        const sets = await setRes.json()
        setSettings(Array.isArray(sets) ? sets : [])
      } catch (err) {
        console.error(err)
        setNotFoundState(true)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
    </div>
  )

  if (notFoundState || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('product.notFound')}</h2>
          <Link href="/products" className="text-amber-600 hover:underline">{t('product.backToProducts')}</Link>
        </div>
      </div>
    )
  }

  const settingMap = Object.fromEntries(
    Array.isArray(settings) ? settings.map((s: any) => [s.key, s.value]) : []
  )
  const whatsappNum = (settingMap.whatsapp || '+13239260829').replace(/[^0-9]/g, '')

  // 口味列表
  const flavorList: string[] = product.flavor
    ? product.flavor.split(",").map((f: string) => f.trim()).filter(Boolean)
    : []

  // 所有图片
  const allImages: string[] = []
  if (product.image) allImages.push(product.image)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img: string) => {
      if (img && !allImages.includes(img)) allImages.push(img)
    })
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600">{t('nav.home')}</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-amber-600">{t('nav.products')}</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-amber-600">{product.category.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 产品图 */}
          <div>
            {allImages.length > 0 ? (
              <>
                <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center p-8 border">
                  {allImages[activeImage]?.startsWith('data:video') ? (
                    <video src={allImages[activeImage]} controls className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <img
                      key={activeImage}
                      src={allImages[activeImage]}
                      alt={product.name}
                      className="w-full h-full object-contain transition-opacity duration-300"
                    />
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                          i === activeImage
                            ? 'border-amber-500 ring-2 ring-amber-200'
                            : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {img.startsWith('data:video') ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xl">▶</div>
                        ) : (
                          <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-8xl">💨</div>
              </div>
            )}
          </div>

          {/* 产品信息 */}
          <div>
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{product.category.name}</span>
            {product.brand && (
              <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.brand}</span>
            )}
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.shortDesc && <p className="mt-2 text-lg text-gray-500">{product.shortDesc}</p>}

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-4xl font-bold text-amber-600">${product.price.toFixed(2)}</span>
              {product.msrp && <span className="text-xl text-gray-400 line-through">${product.msrp.toFixed(2)}</span>}
            </div>
            <p className="mt-1 text-sm text-gray-400">{t('product.wholesale')}</p>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">{t('product.params')}</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.brand && <tr><td className="py-1 text-gray-500 pr-4">{t('product.brand')}</td><td className="font-medium">{product.brand}</td></tr>}
                  {product.nicotine && <tr><td className="py-1 text-gray-500 pr-4">{t('product.nicotine')}</td><td className="font-medium">{product.nicotine}</td></tr>}
                  {product.capacity && <tr><td className="py-1 text-gray-500 pr-4">{t('product.capacity')}</td><td className="font-medium">{product.capacity}</td></tr>}
                  {product.puffs && <tr><td className="py-1 text-gray-500 pr-4">{t('product.puffs')}</td><td className="font-medium">{product.puffs}</td></tr>}
                  {product.flavor && <tr><td className="py-1 text-gray-500 pr-4">{t('product.flavor')}</td><td className="font-medium">{product.flavor}</td></tr>}
                  {product.size && <tr><td className="py-1 text-gray-500 pr-4">{t('product.size')}</td><td className="font-medium">{product.size}</td></tr>}
                  <tr><td className="py-1 text-gray-500 pr-4">{t('product.stock')}</td><td className="font-medium text-green-600">{product.stock}+ {t('product.stock')}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <AddToCartButton productId={product.id} productName={product.name} flavors={flavorList} />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a href={`https://wa.me/${whatsappNum}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex-1 text-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition">
                💬 WhatsApp
              </a>
              <Link href="/contact"
                 className="flex-1 text-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition">
                {t('contact.send')}
              </Link>
            </div>

            <div className="mt-4 text-sm text-gray-400 text-center">
              {t('product.minOrder')}
            </div>
          </div>
        </div>

        {/* 产品详情 */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('product.detail')}</h2>
          <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
            {getEnglishDescription()}
          </div>
        </div>

        {/* 批发咨询CTA */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900">{t('product.inquire')}</h3>
          <p className="mt-2 text-gray-600">{t('contact.inquireDesc')}</p>
          <Link href="/contact" className="mt-4 inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition">
            {t('contact.send')}
          </Link>
        </div>
      </div>
    </div>
  )
}
