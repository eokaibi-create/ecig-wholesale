import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const platforms = await prisma.platform.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(platforms)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const platform = await prisma.platform.create({ data })
    return NextResponse.json(platform)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
