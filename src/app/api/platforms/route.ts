import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const platforms = await prisma.platform.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(platforms)
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

  try {
    const data = await request.json()
    const platform = await prisma.platform.create({ data })
    return NextResponse.json(platform)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
