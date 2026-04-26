import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, inquiryNotificationHtml, adminReplyHtml } from '@/lib/email'

// 从数据库读取邮件设置
async function getEmailSettings() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ['admin_email', 'email_from'] } }
  })
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
  return {
    adminEmail: process.env.ADMIN_EMAIL || map.admin_email || 'EOKAIBI@GMAIL.COM',
    fromEmail: process.env.EMAIL_FROM || map.email_from || 'onboarding@resend.dev',
  }
}

// POST - 前台提交询价 → 存入数据库 + 邮件通知管理员
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || null
    const company = formData.get('company') as string || null
    const message = formData.get('message') as string

    // 查找或创建客户
    let customer = await prisma.customer.findUnique({ where: { email } })
    if (customer) {
      customer = await prisma.customer.update({
        where: { email },
        data: { name, phone, company },
      })
    } else {
      customer = await prisma.customer.create({
        data: { name, email, phone, company },
      })
    }

    // 创建询价
    const inquiry = await prisma.inquiry.create({
      data: {
        customerId: customer.id,
        subject: `询价 - ${company || name}`,
        message,
      },
    })

    // 异步发送邮件通知管理员
    const { adminEmail, fromEmail } = await getEmailSettings()
    sendEmail({
      to: adminEmail,
      from: fromEmail,
      subject: `📩 新询价 - ${name}${company ? ` (${company})` : ''}`,
      html: inquiryNotificationHtml({ name, email, phone, company, message }),
      replyTo: email,
    }).then(result => {
      if (!result.success) {
        console.warn('[Inquiry] 邮件通知发送失败，但询价已保存:', inquiry.id)
      }
    })

    return NextResponse.redirect(new URL('/contact?success=true', request.url))
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.redirect(new URL('/contact?error=true', request.url))
  }
}

// GET - 获取询价列表（支持筛选单条）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
      include: { customer: true },
    })
    if (!inquiry) return NextResponse.json({ error: '未找到' }, { status: 404 })
    return NextResponse.json(inquiry)
  }

  const inquiries = await prisma.inquiry.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(inquiries)
}

// PUT - 更新询价（状态 / 回复 / 备注），可选择发送邮件给客户
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, adminReply, adminNote, sendEmailToCustomer } = body

    if (!id) return NextResponse.json({ error: '缺少ID' }, { status: 400 })

    const updateData: any = { updatedAt: new Date() }
    if (status !== undefined) updateData.status = status
    if (adminReply !== undefined) updateData.adminReply = adminReply
    if (adminNote !== undefined) updateData.adminNote = adminNote

    const updated = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { customer: true },
    })

    // 如果勾选了"发送邮件给客户"且有回复内容
    if (sendEmailToCustomer && adminReply && updated.customer?.email) {
      const { fromEmail, adminEmail } = await getEmailSettings()
      sendEmail({
        to: updated.customer.email,
        from: fromEmail,
        subject: `回复 - VAPOR-X 关于您的询价`,
        html: adminReplyHtml({
          customerName: updated.customer.name,
          replyMessage: adminReply,
          originalMessage: updated.message,
        }),
        replyTo: adminEmail,
      }).then(result => {
        if (result.success) {
          console.log('[Inquiry] 回复邮件已发送给:', updated.customer?.email)
        } else {
          console.warn('[Inquiry] 回复邮件发送失败:', result.error)
        }
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update inquiry error:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

// DELETE - 删除询价
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: '缺少ID' }, { status: 400 })

    await prisma.inquiry.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
