import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = 'https://ecig-wholesale.vercel.app'

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/brands</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/register</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`

  // 添加分类页面
  for (const cat of categories) {
    xml += `
  <url>
    <loc>${baseUrl}/products?category=${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`
  }

  // 添加品牌页面
  for (const brand of brands) {
    xml += `
  <url>
    <loc>${baseUrl}/products?brand=${brand.slug}</loc>
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
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }

  xml += `
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
