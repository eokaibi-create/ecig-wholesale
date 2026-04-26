import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, newRegistrationNotificationHtml } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, companyAddress, state, country, countryCode, type, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: '姓名、邮箱和密码为必填项' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 })
    }

    // 店铺/批发商必须有公司名、地址、国家、电话区号
    if (type !== 'individual') {
      if (!company) return NextResponse.json({ error: '店铺/批发商必须填写公司名称' }, { status: 400 })
      if (!companyAddress) return NextResponse.json({ error: '必须填写地址' }, { status: 400 })
      if (!country) return NextResponse.json({ error: '必须选择国家' }, { status: 400 })
      if (!countryCode) return NextResponse.json({ error: '必须选择国家区号' }, { status: 400 })
      if (!phone) return NextResponse.json({ error: '必须填写手机号' }, { status: 400 })
    }

    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // 个人买家直接通过，店铺/批发商需要审核
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

    // 非个人用户（需要审批）→ 发邮件通知管理员
    if (!isIndividual) {
      sendEmail({
        to: process.env.ADMIN_EMAIL || 'EOKAIBI@GMAIL.COM',
        subject: `🆕 新客户注册待审批 - ${name}${company ? ` (${company})` : ''}`,
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
          console.log('[Register] 审批通知邮件已发送给管理员')
        } else {
          console.warn('[Register] 审批通知邮件发送失败:', result.error)
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
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
