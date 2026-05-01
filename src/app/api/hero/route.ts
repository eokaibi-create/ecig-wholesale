import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
 try {
 const items = await prisma.heroItem.findMany({
 include: { product: true },
 orderBy: { sortOrder: 'asc' },
 })
 return NextResponse.json(items)
 } catch (error: any) {
 return NextResponse.json({ error: error.message }, { status: 500 })
 }
}

export async function POST(request: NextRequest) {
 try {
 const auth = await requireAdmin(request)
 if (!auth.authorized) {
 return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
 }

 const data = await request.json()
 
 const last = await prisma.heroItem.findFirst({
 orderBy: { sortOrder: 'desc' },
 select: { sortOrder: true }
 })
 
 const item = await prisma.heroItem.create({
 data: {
 image: data.image || null,
 videoUrl: data.videoUrl || null,
 title: data.title || '',
 productId: data.productId ? Number(data.productId) : null,
 sortOrder: (last?.sortOrder ?? -1) + 1,
 published: data.published !== false,
 },
 include: { product: true },
 })
 
 return NextResponse.json(item)
 } catch (error: any) {
 return NextResponse.json({ error: error.message }, { status: 400 })
 }
}

export async function PUT(request: NextRequest) {
 try {
 const auth = await requireAdmin(request)
 if (!auth.authorized) {
 return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
 }

 const data = await request.json()
 const { id, ...updateData } = data
 
 const updateFields: any = {}
 if (updateData.image !== undefined) updateFields.image = updateData.image
 if (updateData.videoUrl !== undefined) updateFields.videoUrl = updateData.videoUrl
 if (updateData.title !== undefined) updateFields.title = updateData.title
 if (updateData.productId !== undefined) updateFields.productId = updateData.productId ? Number(updateData.productId) : null
 if (updateData.sortOrder !== undefined) updateFields.sortOrder = Number(updateData.sortOrder)
 if (updateData.published !== undefined) updateFields.published = updateData.published

 const item = await prisma.heroItem.update({
 where: { id: Number(id) },
 data: updateFields,
 include: { product: true },
 })
 
 return NextResponse.json(item)
 } catch (error: any) {
 return NextResponse.json({ error: error.message }, { status: 400 })
 }
}

export async function DELETE(request: NextRequest) {
 try {
 const auth = await requireAdmin(request)
 if (!auth.authorized) {
 return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
 }

 const { searchParams } = new URL(request.url)
 const id = searchParams.get('id')
 
 if (!id) {
 return NextResponse.json({ error: '缺少 ID' }, { status: 400 })
 }
 
 await prisma.heroItem.delete({ where: { id: Number(id) } })
 return NextResponse.json({ success: true })
 } catch (error: any) {
 return NextResponse.json({ error: error.message }, { status: 400 })
 }
}
