import { cookies } from 'next/headers'
import { translations, type Lang, type TranslationKey } from './translations'

export async function getServerLang(): Promise<Lang> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('vaporx-lang')?.value
  return (lang === 'en' || lang === 'zh') ? lang : 'zh'
}

export function serverT(key: TranslationKey, lang: Lang): string {
  return translations[lang][key] || key
}

export { type Lang, type TranslationKey }
