import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = 'https://okaibiglobal.com'

  // 获取所有已发布的产品
  const products = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  // 获取所有分类
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  // 获取所有品牌
  const brands = await prisma.brand.findMany({
    select: { slug: true },
  })

  const today = new Date().toISOString().split('T')[0]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>${baseUrl}</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}" />
<xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}" />
<lastmod>${today}</lastmod>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
<url>
<loc>${baseUrl}/products</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/products" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/products" />
<lastmod>${today}</lastmod>
<changefreq>daily</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>${baseUrl}/brands</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/brands" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/brands" />
<lastmod>${today}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/categories</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/categories" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/categories" />
<lastmod>${today}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${baseUrl}/contact</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/contact" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/contact" />
<lastmod>${today}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${baseUrl}/about</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/about" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/about" />
<lastmod>${today}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${baseUrl}/login</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/login" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/login" />
<lastmod>${today}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.4</priority>
</url>
<url>
<loc>${baseUrl}/register</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/register" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/register" />
<lastmod>${today}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.5</priority>
</url>
<url>
<loc>${baseUrl}/cart</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/cart" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/cart" />
<lastmod>${today}</lastmod>
<changefreq>monthly</changefreq>
<priority>0.3</priority>
</url>`

  // 添加分类页面
  for (const cat of categories) {
    xml += `
<url>
<loc>${baseUrl}/products?category=${cat.slug}</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/products?category=${cat.slug}" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/products?category=${cat.slug}" />
<lastmod>${today}</lastmod>
<changefreq>daily</changefreq>
<priority>0.6</priority>
</url>`
  }

  // 添加品牌页面
  for (const brand of brands) {
    xml += `
<url>
<loc>${baseUrl}/products?brand=${brand.slug}</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/products?brand=${brand.slug}" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/products?brand=${brand.slug}" />
<lastmod>${today}</lastmod>
<changefreq>daily</changefreq>
<priority>0.6</priority>
</url>`
  }

  // 添加产品详情页面
  for (const product of products) {
    const lastmod = product.updatedAt.toISOString().split('T')[0]
    xml += `
<url>
<loc>${baseUrl}/products/${product.slug}</loc>
<xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/products/${product.slug}" />
<xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/products/${product.slug}" />
<lastmod>${lastmod}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>`
  }

  xml += `
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
