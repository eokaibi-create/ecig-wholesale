import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { cookies, headers } from "next/headers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

/** 服务端：从 Accept-Language 自动检测浏览器语言 */
function detectServerLang(acceptLanguage: string | null): 'zh' | 'en' {
  if (!acceptLanguage) return 'zh'
  const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim().toLowerCase() || ''
  return primary.startsWith('en') ? 'en' : 'zh'
}

const SITE_NAME = 'VAPOR-X'
const SITE_URL = 'https://ecig-wholesale.vercel.app'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

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

  const title = lang === 'zh'
    ? 'VAPOR-X - 美国电子烟批发供应商 | 一次性电子烟 烟油 批发'
    : 'VAPOR-X - Premium Vape Wholesale Supplier USA | Disposable Vapes & E-Liquid';
  const description = lang === 'zh'
    ? '美国电子烟批发供应商 — 一次性电子烟、换弹式电子烟、烟油批发。全美48州配送，支持国际发货。工厂直供，最低起订量500台。'
    : "Premium vape wholesale supplier USA — disposable vapes, pod systems, e-liquid wholesale. Ship nationwide 48 states, international shipping available. Factory direct, min order 500 units.";

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
    metadataBase: new URL(SITE_URL),
    alternates: {
      languages: {
        'zh-CN': '/',
        'en-US': '/',
        'x-default': '/',
      },
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    verification: {
      google: 'UJbpC_2y6q0h6OGZlObTZ2shiTlPJii3tMdQCUxQ0dE',
    },
    keywords: lang === 'zh'
      ? ['电子烟批发', '一次性电子烟', '美国电子烟', 'VAPE批发', '烟油批发', '电子烟供应商', 'ELF BAR批发', 'Geek Bar批发']
      : ['vape wholesale', 'disposable vape', 'wholesale vape USA', 'e-liquid wholesale', 'vape supplier', 'ELF BAR wholesale', 'Geek Bar wholesale'],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const headerList = await headers();

  const cookieLang = cookieStore.get("vaporx-lang")?.value;
  let lang: 'zh' | 'en' = 'zh';

  if (cookieLang === 'en' || cookieLang === 'zh') {
    lang = cookieLang
  } else {
    const acceptLanguage = headerList.get('accept-language')
    lang = detectServerLang(acceptLanguage)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: lang === 'zh'
      ? '美国电子烟批发供应商 — 一次性电子烟、换弹式电子烟、烟油批发'
      : 'Premium vape wholesale supplier USA — disposable vapes, pod systems, e-liquid wholesale',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-323-926-0829',
      contactType: 'sales',
      email: 'sales@okaibiglobal.com',
      availableLanguage: ['English', 'Chinese'],
    },
    sameAs: [
      'https://wa.me/13239260829',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={lang === "en" ? "en-US" : "zh-CN"}>
      <head>
        {/* Google Search Console 验证 */}
        <meta name="google-site-verification" content="UJbpC_2y6q0h6OGZlObTZ2shiTlPJii3tMdQCUxQ0dE" />
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen flex flex-col`}>
        <LanguageProvider defaultLang={lang}>
          <AgeGate />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
