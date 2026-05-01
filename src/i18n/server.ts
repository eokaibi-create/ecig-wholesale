import { cookies, headers } from 'next/headers'
import { translations, type Lang, type TranslationKey } from './translations'

export async function getServerLang(): Promise<Lang> {
 const cookieStore = await cookies()
 const lang = cookieStore.get('vaporx-lang')?.value
 if (lang === 'en' || lang === 'zh') return lang

 // 没有 cookie → 从 Accept-Language 检测浏览器语言
 try {
 const headerList = await headers()
 const acceptLanguage = headerList.get('accept-language')
 if (acceptLanguage) {
 const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || ''
 return primary.startsWith('en') ? 'en' : 'zh'
 }
 } catch {}

 return 'zh'
}

export function serverT(key: TranslationKey, lang: Lang): string {
 return translations[lang][key] || key
}

export { type Lang, type TranslationKey }
