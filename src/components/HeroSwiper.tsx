'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageProvider'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
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

interface HeroVideoData {
  id: number
  url: string
  poster: string | null
  title: string | null
  sortOrder: number
  published: boolean
}

interface HeroSwiperProps {
  items: HeroItemData[]
  heroTitle: string
}

export default function HeroSwiper({ items, heroTitle }: HeroSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const isMutedRef = useRef(true)
  const [bgVideos, setBgVideos] = useState<HeroVideoData[]>([])
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const { t } = useLanguage()

  // 获取背景视频
  useEffect(() => {
    fetch('/api/hero-videos')
      .then(r => r.json())
      .then((data: HeroVideoData[]) => {
        const published = data.filter(v => v.published)
        setBgVideos(published)
        if (published.length > 0) {
          videoRefs.current = new Array(published.length).fill(null)
        }
      })
      .catch(() => {})
  }, [])

  // 自动切换背景视频
  useEffect(() => {
    if (bgVideos.length < 2) return
    const timer = setInterval(() => {
      setCurrentVideoIdx(prev => (prev + 1) % bgVideos.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [bgVideos.length])

  // 视频切换时播放新视频
  useEffect(() => {
    if (bgVideos.length === 0) return
    const video = videoRefs.current[currentVideoIdx]
    if (video) {
      video.muted = isMutedRef.current
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }, [currentVideoIdx, bgVideos.length])

  // 声音开关
  const toggleSound = () => {
    const newMuted = !isMutedRef.current
    isMutedRef.current = newMuted
    videoRefs.current.forEach(v => {
      if (v) v.muted = newMuted
    })
    setIsMuted(newMuted)
  }

  const filteredItems = items.filter(i => i.image || i.videoUrl || i.product?.image)

  // 如果数据库没有产品，显示空状态
  if (filteredItems.length === 0) {
    return (
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-[480px] md:min-h-[560px] flex items-center">
        {/* 背景视频 */}
        {bgVideos.length > 0 && (
          <div className="absolute inset-0">
            {bgVideos.map((v, idx) => (
              <video
                key={v.id}
                ref={el => { videoRefs.current[idx] = el }}
                src={v.url}
                poster={v.poster || undefined}
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  idx === currentVideoIdx ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            {/* 视频遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80" />
          </div>
        )}

        {/* 无视频时的装饰 */}
        {bgVideos.length === 0 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
            <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-3xl" />
          </>
        )}

        {/* 🔊 声音开关 */}
        {bgVideos.length > 0 && (
          <button
            onClick={toggleSound}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/60 transition shadow-lg"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="text-center mb-4">
            <p className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="text-amber-400">VAPOR</span>
              <span className="text-white">-X</span>
            </p>
            <p className="mt-1 text-sm md:text-base text-gray-400 font-light tracking-widest uppercase">
              {t('hero.vaporDesc')}
            </p>
          </div>

          <div className="text-center py-10">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-white mb-2">{heroTitle}</h2>
            <p className="text-gray-500">{t('hero.noProducts')}</p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
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

  const slides = filteredItems

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden min-h-[480px] md:min-h-[560px] flex items-center">
      {/* 🎬 全屏自动播放背景视频 */}
      {bgVideos.length > 0 && (
        <div className="absolute inset-0">
          {bgVideos.map((v, idx) => (
            <video
              key={v.id}
              ref={el => { videoRefs.current[idx] = el }}
              src={v.url}
              poster={v.poster || undefined}
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                idx === currentVideoIdx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* 视频遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-900/50 to-gray-900/70" />
        </div>
      )}

      {/* 🔊 声音开关 */}
      {bgVideos.length > 0 && (
        <button
          onClick={toggleSound}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/60 transition shadow-lg"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}

      {/* 没有背景视频时的装饰 */}
      {bgVideos.length === 0 && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* 标题 */}
        <div className="text-center mb-4">
          <p className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
            <span className="text-amber-400">VAPOR</span>
            <span className="text-white">-X</span>
          </p>
          <p className="mt-1 text-sm md:text-base text-gray-400 font-light tracking-widest uppercase">
            {t('hero.vaporDesc')}
          </p>
        </div>

        {/* 背景视频标题浮层 */}
        {bgVideos[currentVideoIdx]?.title && (
          <div className="text-center mb-2">
            <span className="inline-block px-4 py-1 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full text-xs text-amber-300 tracking-wider uppercase">
              {bgVideos[currentVideoIdx].title}
            </span>
          </div>
        )}

        {/* 新品轮播 */}
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
              const name = prod?.name || item.title || `Product ${idx + 1}`
              const href = prod ? `/products/${prod.slug}` : '#'

              return (
                <SwiperSlide key={item.id}>
                  <Link href={href} className="block group">
                    <div className="relative rounded-xl overflow-hidden bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group">
                      <div className="relative w-full" style={{ aspectRatio: '3 / 2' }}>
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <span className="text-4xl opacity-30">{item.videoUrl ? '🎬' : '📷'}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition">
                          {name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        {/* 底部按钮 */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
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
