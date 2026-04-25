import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const brands = [
    { name: 'ELF BAR', slug: 'elf-bar', logo: '/uploads/brands/elf-bar.svg', sortOrder: 1 },
    { name: 'Geek Bar', slug: 'geek-bar', logo: '/uploads/brands/geek-bar.svg', sortOrder: 2 },
    { name: 'SMOK', slug: 'smok', logo: '/uploads/brands/smok.svg', sortOrder: 3 },
    { name: 'JUUL', slug: 'juul', logo: '/uploads/brands/juul.svg', sortOrder: 4 },
    { name: 'Naked 100', slug: 'naked-100', logo: '/uploads/brands/naked-100.svg', sortOrder: 5 },
    { name: 'ZYN', slug: 'zyn', logo: '/uploads/brands/zyn.svg', sortOrder: 6 },
    { name: 'Lost Mary', slug: 'lost-mary', logo: '/uploads/brands/lost-mary.svg', sortOrder: 7 },
    { name: 'Vaporesso', slug: 'vaporesso', logo: '/uploads/brands/vaporesso.svg', sortOrder: 8 },
  ]

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    })
  }
  console.log(`✅ ${brands.length} brands seeded`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
