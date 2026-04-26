import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const videos = await prisma.heroVideo.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(videos)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const last = await prisma.heroVideo.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })
    const video = await prisma.heroVideo.create({
      data: {
        url: data.url,
        poster: data.poster || null,
        title: data.title || null,
        sortOrder: data.sortOrder ?? (last?.sortOrder ?? -1) + 1,
        published: data.published !== false,
      },
    })
    return NextResponse.json(video)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    const updateFields: any = {}
    if (updateData.url !== undefined) updateFields.url = updateData.url
    if (updateData.poster !== undefined) updateFields.poster = updateData.poster
    if (updateData.title !== undefined) updateFields.title = updateData.title
    if (updateData.sortOrder !== undefined) updateFields.sortOrder = Number(updateData.sortOrder)
    if (updateData.published !== undefined) updateFields.published = updateData.published

    const video = await prisma.heroVideo.update({
      where: { id: Number(id) },
      data: updateFields,
    })
    return NextResponse.json(video)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: '缺少 ID' }, { status: 400 })
    await prisma.heroVideo.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
