'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Lang, TranslationKey, getTranslation } from './translations'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key: TranslationKey) => key,
})

/** 浏览器端自动检测语言 */
function detectBrowserLang(): Lang {
  if (typeof window === 'undefined') return 'zh'
  const navLang = (navigator.language || navigator.languages?.[0] || '').toLowerCase()
  // 只有明确偏好英文的才默认英文，其他都默认中文
  return navLang.startsWith('en') ? 'en' : 'zh'
}

export function LanguageProvider({
  children,
  defaultLang,
}: {
  children: ReactNode
  defaultLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(defaultLang || 'zh')
  const [mounted, setMounted] = useState(false)

  // 首次挂载：从 localStorage 读取，没有则自动检测浏览器语言
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('vaporx-lang') as Lang | null
    if (saved === 'en' || saved === 'zh') {
      if (saved !== lang) {
        setLangState(saved)
        document.cookie = `vaporx-lang=${saved};path=/;max-age=31536000`
      }
    } else {
      // 没有任何保存记录 → 自动检测浏览器语言
      const detected = detectBrowserLang()
      setLangState(detected)
      localStorage.setItem('vaporx-lang', detected)
      document.cookie = `vaporx-lang=${detected};path=/;max-age=31536000`
    }
  }, []) // eslint-disable-line

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vaporx-lang', newLang)
      document.cookie = `vaporx-lang=${newLang};path=/;max-age=31536000`
    }
    window.location.reload()
  }, [])

  const t = useCallback((key: TranslationKey): string => getTranslation(key, lang), [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
