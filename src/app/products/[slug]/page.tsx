'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
  wholesalerPrice?: number | null
  msrp?: number | null
  image?: string | null
  images: string[]
  stock: number
  nicotine?: string | null
  capacity?: string | null
  puffs?: string | null
  flavor?: string | null
  size?: string | null
  videoUrl?: string | null
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, lang } = useLanguage()

  const [product, setProduct] = useState<Product | null>(null)
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [notFoundState, setNotFoundState] = useState(false)
  const [customerType, setCustomerType] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const getDisplayPrice = () => {
    if (!product) return { price: 0, showMsrp: false, label: 'retail', className: 'text-amber-600' }
    const hasStorePrice = product.wholesalePrice != null && product.wholesalePrice > 0
    const hasWholesalerPrice = (product as any).wholesalerPrice != null && (product as any).wholesalerPrice > 0
    if (customerType === 'wholesaler' && hasStorePrice) {
      return { price: product.wholesalePrice, label: 'wholesaler', showMsrp: !!product.msrp, className: 'text-purple-600' }
    }
    if (customerType === 'store' && hasWholesalerPrice) {
      return { price: (product as any).wholesalerPrice, label: 'store', showMsrp: !!product.msrp, className: 'text-amber-600' }
    }
    return { price: product.price, label: 'retail', showMsrp: !!product.msrp, className: 'text-amber-600' }
  }

  useEffect(() => {
    try {
      const infoStr = localStorage.getItem('customer_info')
      if (infoStr) {
        try {
          const info = JSON.parse(infoStr)
          if (info.type) setCustomerType(info.type)
        } catch {}
      }
    } catch {}

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

  // 动态更新页面标题和meta
  useEffect(() => {
    if (!product) return
    const title = `${product.name} - VAPOR-X Wholesale`
    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', product.shortDesc || product.description || `${product.name} wholesale pricing at VAPOR-X`)
  }, [product])

  // 构建 JSON-LD 结构化数据
  const getJsonLd = () => {
    if (!product) return null
    const baseUrl = 'https://ecig-wholesale.vercel.app'
    const display = getDisplayPrice()
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.shortDesc || product.description,
      sku: `VAPORX-${product.id}`,
      mpn: `VAPORX-${product.id}`,
      brand: product.brand ? {
        '@type': 'Brand',
        name: product.brand,
      } : undefined,
      image: product.images?.[0] || product.image || undefined,
      offers: {
        '@type': 'Offer',
        price: display.price,
        priceCurrency: 'USD',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        url: `${baseUrl}/products/${product.slug}`,
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'US',
          returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
        },
      },
      category: product.category?.name,
    }
  }

  // 分享功能
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://ecig-wholesale.vercel.app/products/${slug}`
  const shareText = product ? `${product.name} - VAPOR-X Wholesale` : 'VAPOR-X Wholesale'

  const shareOn = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
    </div>
  )

  if (notFoundState || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl mb-4 text-gray-300">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('product.notFound') || 'Product Not Found'}</h2>
          <p className="text-gray-500 mb-6">
            {t('products.emptyDesc') || 'The product you are looking for does not exist or may have been removed.'}
          </p>
          <Link href="/products" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition inline-block">
            {t('product.backToProducts') || 'View All Products'}
          </Link>
        </div>
      </div>
    )
  }

  const settingMap = Object.fromEntries(
    Array.isArray(settings) ? settings.map((s: any) => [s.key, s.value]) : []
  )
  const whatsappNum = (settingMap.whatsapp || '+13239260829').replace(/[^0-9]/g, '')

  const allImages: string[] = []
  if (product.image) allImages.push(product.image)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img: string) => {
      if (img && !allImages.includes(img)) allImages.push(img)
    })
  }
  if (product.videoUrl) allImages.push(product.videoUrl)

  const jsonLd = getJsonLd()

  return (
    <div className="bg-white min-h-screen">
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ecig-wholesale.vercel.app/' },
              { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://ecig-wholesale.vercel.app/products' },
              { '@type': 'ListItem', position: 3, name: product.category.name, item: `https://ecig-wholesale.vercel.app/products?category=${product.category.slug}` },
              { '@type': 'ListItem', position: 4, name: product.name },
            ],
          })
        }}
      />

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
                  {allImages[activeImage]?.match(/\.(mp4|webm|ogg|mov)$/i) || allImages[activeImage]?.includes('video') ? (
                    <video src={allImages[activeImage]} controls className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <img key={activeImage} src={allImages[activeImage]} alt={product.name} width="600" height="600"
                      className="w-full h-full object-contain transition-opacity duration-300" />
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {allImages.map((img, i) => (
                      <button key={i} onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                          i === activeImage ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                        }`}>
                        {img.match(/\.(mp4|webm|ogg|mov)$/i) || img.includes('video') ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xl">▶</div>
                        ) : (
                          <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" width="80" height="80" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-8xl">📦</div>
              </div>
            )}

            {/* 社交分享按钮 */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-1">{t('product.share') || 'Share'}:</span>
              <button onClick={() => shareOn('facebook')}
                className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition text-sm"
                title="Facebook" aria-label="Share on Facebook">
                f
              </button>
              <button onClick={() => shareOn('twitter')}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition text-sm"
                title="Twitter/X" aria-label="Share on Twitter/X">
                𝕏
              </button>
              <button onClick={() => shareOn('whatsapp')}
                className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition"
                title="WhatsApp" aria-label="Share on WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
              <button onClick={() => shareOn('copy')}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
                title={copied ? 'Copied!' : 'Copy link'} aria-label="Copy link">
                {copied ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
              </button>
            </div>
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
              {(() => {
                const display = getDisplayPrice()
                return <>
                  <span className={"text-4xl font-bold " + display.className}>${Number(display.price).toFixed(2)}</span>
                  {display.showMsrp && <span className="text-xl text-gray-400 line-through ml-2">${Number(product.msrp).toFixed(2)}</span>}
                </>
              })()}
            </div>
            {customerType === 'wholesaler' && product.wholesalePrice && (
              <p className="mt-1 text-sm text-purple-500 font-medium">{t('product.wholesalerPrice')}</p>
            )}
            {customerType === 'store' && product.wholesalerPrice && (
              <p className="mt-1 text-sm text-amber-500 font-medium">{t('product.storePrice')}</p>
            )}
            {!customerType && (
              <p className="mt-1 text-sm text-gray-400">{t('product.pricing')}</p>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">{t('product.params')}</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.brand && <tr><td className="py-1 text-gray-500 pr-4">{t('product.brand')}</td><td className="font-medium">{product.brand}</td></tr>}
                  {product.nicotine && <tr><td className="py-1 text-gray-500 pr-4">{t('product.nicotine')}</td><td className="font-medium">{product.nicotine}</td></tr>}
                  {product.capacity && <tr><td className="py-1 text-gray-500 pr-4">{t('product.capacity')}</td><td className="font-medium">{product.capacity}</td></tr>}
                  {product.puffs && <tr><td className="py-1 text-gray-500 pr-4">{t('product.puffs')}</td><td className="font-medium">{product.puffs}</td></tr>}
                  {product.flavor && <tr><td className="py-1 text-gray-500 pr-4">{t('product.flavor')}</td><td className="font-medium">{product.flavor}</td></tr>}
                  {product.stock > 0 && <tr><td className="py-1 text-gray-500 pr-4">{t('product.stock')}</td><td className="font-medium text-green-600">{product.stock} {t('product.units')}</td></tr>}
                </tbody>
              </table>
            </div>

            {/* 产品描述 */}
            {product.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">{t('product.description')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* 批发询价按钮 */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${product.slug}) — SKU: ${product.id}. Please send me wholesale pricing.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-center">
                {t('product.inquire') || 'Inquire via WhatsApp'}
              </a>
              <Link href="/products"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition text-center">
                {t('product.backToProducts') || 'Back to Products'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
