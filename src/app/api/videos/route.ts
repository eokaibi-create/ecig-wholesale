import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(videos)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const video = await prisma.video.create({ data })
    return NextResponse.json(video)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
