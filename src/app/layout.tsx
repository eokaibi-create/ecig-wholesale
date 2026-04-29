import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { cookies, headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

/** 服务端：从 Accept-Language 自动检测浏览器语言 */
function detectServerLang(acceptLanguage: string | null): 'zh' | 'en' {
  if (!acceptLanguage) return 'zh'
  // 取第一个语言标签
  const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || ''
  return primary.startsWith('en') ? 'en' : 'zh'
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headerList = await headers();

  const cookieLang = cookieStore.get("vaporx-lang")?.value;
  let lang: 'zh' | 'en' = 'zh';

  if (cookieLang === 'en' || cookieLang === 'zh') {
    lang = cookieLang;
  } else {
    const acceptLanguage = headerList.get('accept-language');
    lang = detectServerLang(acceptLanguage);
  }

  return {
    title: lang === 'zh'
      ? 'VAPOR-X - 美国电子烟批发供应商'
      : 'VAPOR-X - Premium Vape Wholesale Supplier USA',
    description: lang === 'zh'
      ? '美国电子烟批发供应商 — 一次性电子烟、换弹式电子烟、烟油批发。全美48州配送，支持国际发货。'
      : "Premium vape wholesale supplier USA — disposable vapes, pod systems, e-liquid wholesale. Ship nationwide, international shipping available.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const headerList = await headers();

  // 优先级：cookie > 浏览器语言 > 默认中文
  const cookieLang = cookieStore.get("vaporx-lang")?.value;
  let lang: 'zh' | 'en' = 'zh';

  if (cookieLang === 'en' || cookieLang === 'zh') {
    lang = cookieLang
  } else {
    const acceptLanguage = headerList.get('accept-language')
    lang = detectServerLang(acceptLanguage)
  }

  return (
    <html lang={lang === "en" ? "en-US" : "zh-CN"}>
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen flex flex-col`}>
        <LanguageProvider defaultLang={lang}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
