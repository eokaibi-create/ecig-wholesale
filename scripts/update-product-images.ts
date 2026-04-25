import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productImages: Record<string, { image: string; images: string[] }> = {
  'elf-bar-bc5000': {
    image: '/uploads/products/elf-bar-bc5000.svg',
    images: ['/uploads/products/elf-bar-bc5000-2.svg','/uploads/products/elf-bar-bc5000-3.svg'],
  },
  'geek-bar-pulse-7500': {
    image: '/uploads/products/geek-bar-pulse-7500.svg',
    images: ['/uploads/products/geek-bar-pulse-7500-2.svg'],
  },
  'smok-nord-5': {
    image: '/uploads/products/smok-nord-5.svg',
    images: [],
  },
  'juul-starter-kit': {
    image: '/uploads/products/juul-starter-kit.svg',
    images: [],
  },
  'naked-100-mango': {
    image: '/uploads/products/naked-100-mango.svg',
    images: [],
  },
  'zyn-mint': {
    image: '/uploads/products/zyn-mint.svg',
    images: [],
  },
  'lost-mary-bm600': {
    image: '/uploads/products/lost-mary-bm600.svg',
    images: [],
  },
  'vaporesso-xros-4': {
    image: '/uploads/products/vaporesso-xros-4.svg',
    images: [],
  },
}

async function main() {
  for (const [slug, imgs] of Object.entries(productImages)) {
    await prisma.product.update({
      where: { slug },
      data: {
        image: imgs.image,
        images: imgs.images,
      },
    })
    console.log(`✅ Updated: ${slug}`)
  }
  console.log('\n🎉 All product images updated!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
