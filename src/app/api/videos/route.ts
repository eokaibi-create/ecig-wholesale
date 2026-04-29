import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(videos)
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

  try {
    const data = await request.json()
    const video = await prisma.video.create({ data })
    return NextResponse.json(video)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
