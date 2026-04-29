import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { cookies, headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VAPOR-X - Premium Vape Wholesale Supplier USA",
  description: "Premium vape wholesale supplier USA — disposable vapes, pod systems, e-liquid wholesale. Ship nationwide, international shipping available.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
};

/** 服务端：从 Accept-Language 自动检测浏览器语言 */
function detectServerLang(acceptLanguage: string | null): 'zh' | 'en' {
  if (!acceptLanguage) return 'zh'
  // 取第一个语言标签
  const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || ''
  return primary.startsWith('en') ? 'en' : 'zh'
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
        <SpeedInsights />
      </body>
    </html>
  );
}
