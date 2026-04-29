import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST() {
  const hash = await bcrypt.hash('yong123', 12)
  await prisma.admin.updateMany({
    where: { username: 'BOSS' },
    data: { password: hash },
  })
  return NextResponse.json({ ok: true })
}
