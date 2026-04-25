import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("=== 🔍 数据一致性修复 ===\n")

  // 1. 修复所有产品的 published 字段
  const updatePublished = await prisma.product.updateMany({
    where: { published: false },
    data: { published: true }
  })
  console.log(`✅ 已发布所有产品: ${updatePublished.count} 个`)

  // 2. 验证修复后的数据
  const products = await prisma.product.findMany({
    select: { id: true, name: true, featured: true, published: true }
  })
  console.log("\n📋 修复后产品状态:")
  for (const p of products) {
    console.log(`  ID[${p.id}] ${p.name} | featured: ${p.featured} | published: ${p.published}`)
  }

  // 3. 验证首页热销产品
  const featured = await prisma.product.findMany({
    where: { featured: true, published: true },
    include: { category: true }
  })
  console.log(`\n🔥 首页热销产品: ${featured.length} 个`)
  for (const p of featured) {
    console.log(`  ${p.name} | $${p.price} | ${p.category.name}`)
  }

  // 4. 验证产品列表
  const allPublished = await prisma.product.findMany({
    where: { published: true },
    include: { category: true }
  })
  console.log(`\n🛒 产品列表: ${allPublished.length} 个`)
  for (const p of allPublished) {
    console.log(`  ${p.name} | $${p.price} | ${p.category.name}`)
  }

  // 5. 验证分类
  const categories = await prisma.category.findMany()
  console.log(`\n📂 分类: ${categories.length} 个`)
  for (const c of categories) {
    const count = await prisma.product.count({ where: { categoryId: c.id, published: true } })
    console.log(`  ${c.name} (${c.slug}) -> ${count} 个产品`)
  }

  // 6. 检查设置
  const settings = await prisma.setting.findMany()
  console.log(`\n⚙️ 设置: ${settings.length} 项`)
  for (const s of settings) {
    console.log(`  ${s.key}=${s.value}`)
  }

  console.log("\n=== ✅ 数据一致性检查完成 ===")
}

main().catch(console.error).finally(() => prisma.$disconnect())
