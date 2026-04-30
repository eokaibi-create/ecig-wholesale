import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, newRegistrationNotificationHtml } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, companyAddress, state, country, countryCode, type, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Stores/Wholesalers must provide company name, address, country and phone code
    if (type !== 'individual') {
      if (!company) return NextResponse.json({ error: 'Stores/Wholesalers must provide a company name' }, { status: 400 })
      if (!companyAddress) return NextResponse.json({ error: 'Address is required' }, { status: 400 })
      if (!country) return NextResponse.json({ error: 'Country is required' }, { status: 400 })
      if (!countryCode) return NextResponse.json({ error: 'Country code is required' }, { status: 400 })
      if (!phone) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Individual accounts auto-approved, stores/wholesalers require review
    const isIndividual = type === 'individual'
    const approved = isIndividual

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        companyAddress: companyAddress || null,
        state: state || null,
        country: country || null,
        countryCode: countryCode || null,
        type: type || 'wholesaler',
        password: hashedPassword,
        approved,
      },
    })

    // Non-individual users (require approval) -> send email to admin
    if (!isIndividual) {
      sendEmail({
        to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
        subject: `New Registration Pending - ${name}${company ? ` (${company})` : ''}`,
        html: newRegistrationNotificationHtml({
          name,
          email,
          phone: phone || null,
          company: company || null,
          companyAddress: companyAddress || null,
          state: state || null,
          country: country || null,
          countryCode: countryCode || null,
          type: type || 'wholesaler',
        }),
      }).then(result => {
        if (result.success) {
          console.log('[Register] Approval notification email sent to admin')
        } else {
          console.warn('[Register] Approval notification email failed to send:', result.error)
        }
      })
    }

    const token = Buffer.from(`customer:${customer.id}:${customer.email}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        type: customer.type,
        approved: customer.approved,
      }
    })

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Customer register error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
