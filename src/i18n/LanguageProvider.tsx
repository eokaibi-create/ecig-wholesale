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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('vaporx-lang') as Lang | null
    if (saved === 'en' || saved === 'zh') {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vaporx-lang', newLang)
      // 设置 cookie 用于服务端渲染
      document.cookie = `vaporx-lang=${newLang};path=/;max-age=31536000`
      // 刷新页面以触发服务端重新渲染
      window.location.reload()
    }
  }

  const t = (key: TranslationKey): string => {
    return getTranslation(key, lang)
  }

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: 'zh', setLang, t: (key) => getTranslation(key, 'zh') }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
