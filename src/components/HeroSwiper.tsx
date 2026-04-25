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
  const heroVideo = items.find(i => i.videoUrl)?.videoUrl || null

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
              aria-label={lang === 'en' ? 'Previous' : '上一张'}>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-amber-500 border border-gray-700 hover:border-amber-400 flex items-center justify-center transition group"
              aria-label={lang === 'en' ? 'Next' : '下一张'}>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl">
              {filteredItems.length > 0 ? (
                <>
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    onSwiper={(s) => { swiperRef.current = s }}
                    onSlideChange={(s) => setActiveIndex(s.realIndex)}
                    style={{ aspectRatio: '16/9' }}
                  >
                    {filteredItems.map((item, idx) => {
                      const imgSrc = item.image || item.product?.image || ''
                      return (
                        <SwiperSlide key={item.id || idx}>
                          <div className="relative w-full h-full min-h-[300px] md:min-h-[450px] flex items-center justify-center bg-gray-800">
                            {imgSrc ? (
                              <img src={imgSrc} alt={item.title || item.product?.name || 'New'} className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-6xl text-gray-600">🆕</div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 md:p-6">
                              <div className="flex items-end justify-between">
                                <div>
                                  <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                                    {item.title || item.product?.name || t('hero.newProduct')}
                                  </h3>
                                  {item.product && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-lg font-bold text-amber-400">${item.product.price.toFixed(2)}</span>
                                      {item.product.wholesalePrice && (
                                        <span className="text-sm text-gray-400 line-through">${item.product.wholesalePrice.toFixed(2)}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {item.product && (
                                  <Link href={`/products/${item.product.slug}`}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition shrink-0">
                                    {lang === 'en' ? 'View Details →' : '查看详情 →'}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                    {filteredItems.map((_, idx) => (
                      <button key={idx} onClick={() => swiperRef.current?.slideTo(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`${lang === 'en' ? 'Slide' : '第'} ${idx + 1}`} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-gray-500">
                  <div className="text-6xl mb-3">🛒</div>
                  <h2 className="text-xl font-bold text-amber-400 mb-2">{heroTitle}</h2>
                  <p className="text-gray-400">{lang === 'en' ? 'New arrivals coming soon' : '新品即将上线，敬请期待'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎬</span>
              <h2 className="text-base font-bold text-amber-400">{t('hero.video')}</h2>
            </div>
            <div className="aspect-[9/16] max-h-[450px] rounded-xl overflow-hidden bg-black border border-gray-700 shadow-xl">
              {heroVideo ? (
                <video src={heroVideo} controls className="w-full h-full object-contain"
                  poster={filteredItems[activeIndex]?.image || filteredItems[0]?.image || undefined}>
                  {lang === 'en' ? 'Your browser does not support video' : '您的浏览器不支持视频播放'}
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="text-sm">{t('hero.video')}</p>
                  <p className="text-xs text-gray-600 mt-1">{t('hero.videoDesc')}</p>
                </div>
              )}
            </div>
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
