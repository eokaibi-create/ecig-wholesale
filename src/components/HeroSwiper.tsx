'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageProvider'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/effect-fade'

interface HeroProduct {
  id: number
  name: string
  slug: string
  price: number
  wholesalePrice?: number | null
  image?: string | null
}

interface HeroItemData {
  id: number
  image?: string | null
  videoUrl?: string | null
  title?: string | null
  product?: HeroProduct | null
}

interface HeroSwiperProps {
  items: HeroItemData[]
  heroTitle: string
}

export default function HeroSwiper({ items, heroTitle }: HeroSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const { t, lang } = useLanguage()

  const filteredItems = items.filter(i => i.image || i.product?.image)

  const defaultProducts: HeroItemData[] = [
    {
      id: 0,
      title: 'ELF BAR BC5000',
      image: 'https://dbh4s5ja0maaw.cloudfront.net/products/bc5000/card-1.jpg',
      product: { id: 1, name: 'ELF BAR BC5000', slug: 'elfbar-bc5000', price: 12.99, wholesalePrice: 8.50, image: 'https://dbh4s5ja0maaw.cloudfront.net/products/bc5000/card-1.jpg' }
    },
    {
      id: 1,
      title: 'Geek Bar Pulse 15000',
      image: 'https://oss.geekbar.com/products/pulse/20251105/1.png',
      product: { id: 2, name: 'Geek Bar Pulse 15000', slug: 'geek-bar-pulse-15000', price: 18.99, wholesalePrice: 13.50, image: 'https://oss.geekbar.com/products/pulse/20251105/1.png' }
    },
    {
      id: 2,
      title: 'Lost Mary MO20000 Pro',
      image: 'https://ezpuff.com/cdn/shop/files/lost-mary-mo20000-pro_500x500.png',
      product: { id: 3, name: 'Lost Mary MO20000 Pro', slug: 'lost-mary-mo20000-pro', price: 22.99, wholesalePrice: 16.80, image: 'https://ezpuff.com/cdn/shop/files/lost-mary-mo20000-pro_500x500.png' }
    },
    {
      id: 3,
      title: 'RAZ TN9000',
      image: 'https://officialrazvape.com/wp-content/uploads/2024/01/raz-tn9000-main.png',
      product: { id: 4, name: 'RAZ TN9000', slug: 'raz-tn9000', price: 15.99, wholesalePrice: 11.20, image: 'https://officialrazvape.com/wp-content/uploads/2024/01/raz-tn9000-main.png' }
    },
    {
      id: 4,
      title: 'Geek Bar Meloso Mini',
      image: 'https://oss.geekbar.com/products/meloso-ultra/1/Frozen%20Cherry%20Apple.png',
      product: { id: 5, name: 'Geek Bar Meloso Mini', slug: 'geek-bar-meloso-mini', price: 8.99, wholesalePrice: 5.80, image: 'https://oss.geekbar.com/products/meloso-ultra/1/Frozen%20Cherry%20Apple.png' }
    }
  ]

  const slides = filteredItems.length > 0 ? filteredItems : defaultProducts

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden min-h-[600px] md:min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="text-center mb-6">
          <p className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
            <span className="text-amber-400">VAPOR</span>
            <span className="text-white">-X</span>
          </p>
          <p className="mt-1 text-sm md:text-base text-gray-500 font-light tracking-widest uppercase">
            {t('hero.vaporDesc')}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🆕</span>
            <h2 className="text-lg md:text-xl font-bold text-amber-400">{heroTitle}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-amber-500 border border-gray-700 hover:border-amber-400 flex items-center justify-center transition group"
              aria-label={t('hero.previous')}>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-amber-500 border border-gray-700 hover:border-amber-400 flex items-center justify-center transition group"
              aria-label={t('hero.next')}>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 一体式轮播：每个slide包含产品（左2/3）+ 视频（右1/3） */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            onSwiper={(s) => { swiperRef.current = s }}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
          >
            {slides.map((item, idx) => {
              const imgSrc = item.image || item.product?.image || ''
              const prod = item.product
              const hasVideo = !!item.videoUrl

              return (
                <SwiperSlide key={item.id || idx}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[350px] md:min-h-[500px]">
                    {/* 左 2/3：产品图片 */}
                    <div className="lg:col-span-2 relative flex items-center justify-center bg-gray-800 min-h-[300px] md:min-h-[500px]">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.title || prod?.name || ''} className="w-full h-full object-contain p-4 md:p-8" />
                      ) : (
                        <div className="text-6xl text-gray-600">🆕</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 md:p-6">
                        <div className="flex items-end justify-between">
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                              {item.title || prod?.name || t('hero.newProduct')}
                            </h3>
                            {prod && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-amber-400">${prod.price.toFixed(2)}</span>
                                {prod.wholesalePrice && (
                                  <span className="text-sm text-gray-400 line-through">${prod.wholesalePrice.toFixed(2)}</span>
                                )}
                              </div>
                            )}
                          </div>
                          {prod && (
                            <Link href={`/products/${prod.slug}`}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition shrink-0">
                              {t('hero.viewDetails')}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 右 1/3：视频展示 */}
                    <div className="lg:col-span-1 relative bg-black min-h-[250px] md:min-h-[500px] flex items-center justify-center">
                      {hasVideo ? (
                        <video src={item.videoUrl || ''} controls className="w-full h-full object-contain" poster={imgSrc || undefined}>
                          {t('hero.noVideoSupport')}
                        </video>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
                          <div className="relative w-full max-w-[200px] aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-700/50 flex items-center justify-center bg-gray-900/80">
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition cursor-pointer group">
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-black ml-0.5 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                              <div className="text-3xl mb-1">🎬</div>
                              <p className="text-[10px] tracking-widest uppercase">{t('hero.productVideo')}</p>
                            </div>
                            <div className="absolute top-2 left-2 z-20">
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded border border-amber-500/30">DEMO</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-3">{t('hero.productVideo')}</p>
                          {prod && (
                            <p className="text-xs text-gray-700 mt-1 text-center max-w-[180px]">{item.title || prod.name}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => swiperRef.current?.slideTo(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`${t('hero.slide')} ${idx + 1}`} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products"
            className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition shadow-lg shadow-amber-500/25">
            {t('hero.browse')}
          </Link>
          <Link href="/login"
            className="inline-flex items-center px-6 py-3 border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black font-semibold rounded-xl transition">
            {t('hero.login')}
          </Link>
        </div>
      </div>
    </section>
  )
}
