import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { sendEmail, inquiryNotificationHtml, adminReplyHtml } from '@/lib/email'

// Read email settings from database
async function getEmailSettings() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ['admin_email', 'email_from'] } }
  })
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
  return {
    adminEmail: process.env.ADMIN_EMAIL || map.admin_email || 'sales@vapor-x.com',
    fromEmail: process.env.EMAIL_FROM || map.email_from || 'onboarding@resend.dev',
  }
}

// POST - Submit inquiry from frontend => save to DB + email admin (公开接口)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || null
    const company = formData.get('company') as string || null
    const message = formData.get('message') as string

    // Find or create customer
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

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        customerId: customer.id,
        subject: `Inquiry - ${company || name}`,
        message,
      },
    })

    // Send email to admin (async)
    const { adminEmail, fromEmail } = await getEmailSettings()
    sendEmail({
      to: adminEmail,
      from: fromEmail,
      subject: `New Inquiry - ${name}${company ? ` (${company})` : ''}`,
      html: inquiryNotificationHtml({ name, email, phone, company, message }),
      replyTo: email,
    }).then(result => {
      if (!result.success) {
        console.warn('[Inquiry] Email notification failed, but inquiry saved:', inquiry.id)
      }
    })

    return NextResponse.redirect(new URL('/contact?success=true', request.url))
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.redirect(new URL('/contact?error=true', request.url))
  }
}

// GET - List inquiries (需管理员权限)
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
      include: { customer: true },
    })
    if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(inquiry)
  }

  const inquiries = await prisma.inquiry.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(inquiries)
}

// PUT - Update inquiry (需管理员权限)
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

  try {
    const body = await request.json()
    const { id, status, adminReply, adminNote, sendEmailToCustomer } = body

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    const updateData: any = { updatedAt: new Date() }
    if (status !== undefined) updateData.status = status
    if (adminReply !== undefined) updateData.adminReply = adminReply
    if (adminNote !== undefined) updateData.adminNote = adminNote

    const updated = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { customer: true },
    })

    // If "send email to customer" is checked and reply content exists
    if (sendEmailToCustomer && adminReply && updated.customer?.email) {
      const { fromEmail, adminEmail } = await getEmailSettings()
      sendEmail({
        to: updated.customer.email,
        from: fromEmail,
        subject: `Reply - VAPOR-X Regarding Your Inquiry`,
        html: adminReplyHtml({
          customerName: updated.customer.name,
          replyMessage: adminReply,
          originalMessage: updated.message,
        }),
        replyTo: adminEmail,
      }).then(result => {
        if (result.success) {
          console.log('[Inquiry] Reply email sent to:', updated.customer?.email)
        } else {
          console.warn('[Inquiry] Reply email failed:', result.error)
        }
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update inquiry error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE - Delete inquiry (需管理员权限)
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error?.message }, { status: auth.error?.status || 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    await prisma.inquiry.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
