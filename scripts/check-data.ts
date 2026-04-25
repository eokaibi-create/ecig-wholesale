import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("=== 数据库数据总览 ===\n")

  console.log("【产品列表】")
  const products = await prisma.product.findMany({ include: { category: true } })
  for (const p of products) {
    console.log(`  ID[${p.id}] ${p.name} | $${p.price} | 分类: ${p.category?.name || 'N/A'} | 品牌: ${p.brand} | 库存: ${p.stock}`)
  }
  console.log(`  共 ${products.length} 个产品\n`)

  console.log("【分类列表】")
  const categories = await prisma.category.findMany()
  for (const c of categories) {
    console.log(`  ID[${c.id}] ${c.name} (${c.slug})`)
  }
  console.log(`  共 ${categories.length} 个分类\n`)

  console.log("【品牌列表】")
  const brands = await prisma.brand.findMany()
  for (const b of brands) {
    console.log(`  ID[${b.id}] ${b.name} (${b.slug})`)
  }
  console.log(`  共 ${brands.length} 个品牌\n`)

  console.log("【客户列表】")
  const customers = await prisma.customer.findMany()
  for (const c of customers) {
    console.log(`  ID[${c.id}] ${c.name} | ${c.email} | ${c.phone} | ${c.company || '无公司'}`)
  }
  console.log(`  共 ${customers.length} 个客户\n`)

  console.log("【管理员】")
  const admin = await prisma.user.findFirst()
  if (admin) console.log(`  用户名: ${admin.username}`)

  console.log("\n【系统设置】")
  const settings = await prisma.setting.findMany()
  for (const s of settings) console.log(`  ${s.key}: ${s.value}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
