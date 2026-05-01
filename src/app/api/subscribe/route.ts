import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, lang } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } })

    if (existing) {
      // 如果已存在但被取消订阅，重新激活
      if (!existing.active) {
        await prisma.subscriber.update({
          where: { email },
          data: { active: true, lang: lang || 'zh' },
        })
      }
      return NextResponse.json({ message: 'Already subscribed' })
    }

    await prisma.subscriber.create({
      data: {
        email,
        lang: lang || 'zh',
      },
    })

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
