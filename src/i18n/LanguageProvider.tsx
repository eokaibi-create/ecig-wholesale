'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

export function LanguageProvider({
  children,
  defaultLang = 'zh',
}: {
  children: ReactNode
  defaultLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(defaultLang)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 浏览器端从 localStorage/cookie 同步
    const saved = localStorage.getItem('vaporx-lang') as Lang | null
    if (saved === 'en' || saved === 'zh') {
      if (saved !== lang) {
        setLangState(saved)
        document.cookie = `vaporx-lang=${saved};path=/;max-age=31536000`
      }
    }
  }, []) // eslint-disable-line

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vaporx-lang', newLang)
      document.cookie = `vaporx-lang=${newLang};path=/;max-age=31536000`
    }
    window.location.reload()
  }

  const t = (key: TranslationKey): string => getTranslation(key, lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
