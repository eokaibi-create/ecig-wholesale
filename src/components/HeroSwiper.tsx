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
  const swiperRef = useRef<SwiperType | null>(null)
  const { t } = useLanguage()

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
    <section className="relative bg-gray-900 text-white overflow-hidden min-h-[700px] md:min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* 标题 */}
        <div className="text-center mb-6">
          <p className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
            <span className="text-amber-400">VAPOR</span>
            <span className="text-white">-X</span>
          </p>
          <p className="mt-1 text-sm md:text-base text-gray-500 font-light tracking-widest uppercase">
            {t('hero.vaporDesc')}
          </p>
        </div>

        {/* 上方：视频区域（固定，自动播放循环） */}
        <div className="relative rounded-2xl overflow-hidden bg-black border border-gray-700 shadow-2xl mb-4" style={{ aspectRatio: '21 / 9' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* 动态光效背景 */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
              </div>
              {/* 中间内容 */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center animate-pulse shadow-lg shadow-amber-500/20">
                  <svg className="w-7 h-7 md:w-9 md:h-9 text-amber-400 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-amber-400 text-sm md:text-base font-bold tracking-widest uppercase animate-pulse">
                  Product Video
                </p>
                <p className="text-gray-600 text-xs">
                  {t('hero.productVideo')}
                </p>
              </div>
              {/* 装饰品牌文字 */}
              <div className="absolute bottom-4 right-6 opacity-20">
                <p className="text-4xl md:text-6xl font-black text-white tracking-tight">VAPOR-X</p>
              </div>
              {/* 顶部DEMO标签 */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded border border-amber-500/30">DEMO</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下方：产品轮播（图片 + 名称） */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🆕</span>
            <h2 className="text-lg md:text-xl font-bold text-amber-400">{heroTitle}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => swiperRef.current?.slidePrev()}
              className="w-9 h-9 rounded-full bg-gray-800/80 hover:bg-amber-500 border border-gray-700 hover:border-amber-400 flex items-center justify-center transition group"
              aria-label={t('hero.previous')}>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => swiperRef.current?.slideNext()}
              className="w-9 h-9 rounded-full bg-gray-800/80 hover:bg-amber-500 border border-gray-700 hover:border-amber-400 flex items-center justify-center transition group"
              aria-label={t('hero.next')}>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 产品轮播 */}
        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            breakpoints={{
              480: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4.2 },
              1280: { slidesPerView: 5 }
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            onSwiper={(s) => { swiperRef.current = s }}
          >
            {slides.map((item, idx) => {
              const imgSrc = item.image || item.product?.image || ''
              const prod = item.product
              const name = item.title || prod?.name || t('hero.newProduct')

              return (
                <SwiperSlide key={item.id || idx}>
                  <Link href={prod ? `/products/${prod.slug}` : '#'}
                    className="block group">
                    <div className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
                      {/* 产品图片 */}
                      <div className="aspect-square bg-gray-800 flex items-center justify-center p-4 overflow-hidden">
                        {imgSrc ? (
                          <img src={imgSrc} alt={name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="text-5xl text-gray-600">🆕</div>
                        )}
                      </div>
                      {/* 产品名称 */}
                      <div className="p-3 text-center">
                        <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-amber-400 transition line-clamp-2">
                          {name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        {/* 底部按钮 */}
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
