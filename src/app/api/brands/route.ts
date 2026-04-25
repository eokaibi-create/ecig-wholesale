import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(brands)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const brand = await prisma.brand.create({ data })
    return NextResponse.json(brand)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
