import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VAPOR-X - Premium Vape Wholesale Supplier USA",
  description: "Premium vape wholesale supplier USA — disposable vapes, pod systems, e-liquid wholesale. Ship nationwide, international shipping available.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("vaporx-lang")?.value === "en" ? "en" : "zh";

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
