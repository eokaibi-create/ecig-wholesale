import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, featured: true, published: true }
  })
  console.log("所有产品:", JSON.stringify(products, null, 2))
  
  const featured = await prisma.product.findMany({
    where: { featured: true, published: true },
    select: { id: true, name: true }
  })
  console.log("\n首页热销:", JSON.stringify(featured))
  
  const allPublished = await prisma.product.findMany({
    where: { published: true },
    select: { id: true, name: true }
  })
  console.log("\n所有已发布产品:", JSON.stringify(allPublished))
}
main().catch(console.error).finally(() => prisma.$disconnect())
