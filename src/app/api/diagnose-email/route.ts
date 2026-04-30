import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { 
  sendEmail, 
  inquiryNotificationHtml, 
  adminReplyHtml, 
  newRegistrationNotificationHtml, 
  customerApprovedHtml, 
  customerRejectedHtml, 
  passwordResetHtml, 
  adminPasswordResetHtml 
} from '@/lib/email'
import crypto from 'crypto'

export async function GET() {
  const results: string[] = []
  
  // 1. Check environment variables
  results.push(`=== ENV VARS ===`)
  results.push(`SMTP_HOST: "${process.env.SMTP_HOST}"`)
  results.push(`SMTP_PORT: "${process.env.SMTP_PORT}"`)
  results.push(`SMTP_USER: "${process.env.SMTP_USER}"`)
  results.push(`SMTP_PASS: ${process.env.SMTP_PASS ? '***SET***' : 'NOT SET'}`)
  results.push(`ADMIN_EMAIL: "${process.env.ADMIN_EMAIL}"`)
  results.push(`EMAIL_FROM: "${process.env.EMAIL_FROM}"`)
  results.push(`RESET_SECRET: ${process.env.RESET_SECRET ? '***SET***' : 'NOT SET'}`)
  
  // 2. Test SMTP verify
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'sales@okaibiglobal.com',
        pass: process.env.SMTP_PASS || '12138Ekke',
      },
      connectionTimeout: 10000,
    })
    
    await transporter.verify()
    results.push(`✅ SMTP VERIFY: SUCCESS`)

    // 3. Test ALL email templates
    results.push(``)
    results.push(`=== TEST 1: Inquiry Notification (咨询 → 管理员) ===`)
    let r1 = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
      subject: `[TEST] New Inquiry - Test User`,
      html: inquiryNotificationHtml({
        name: 'Test User', email: 'test@example.com', phone: '1234567890',
        company: 'Test Company', message: 'This is a test inquiry message.'
      }),
    })
    results.push(r1.success ? `✅ SUCCESS: ${r1.id}` : `❌ FAILED: ${r1.error}`)

    results.push(``)
    results.push(`=== TEST 2: Admin Reply (管理员回复咨询 → 客户) ===`)
    let r2 = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
      subject: `[TEST] Reply - VAPOR-X Regarding Your Inquiry`,
      html: adminReplyHtml({
        customerName: 'Test Customer',
        replyMessage: 'Thank you for your inquiry. We will get back to you soon.',
        originalMessage: 'I am interested in your products.'
      }),
    })
    results.push(r2.success ? `✅ SUCCESS: ${r2.id}` : `❌ FAILED: ${r2.error}`)

    results.push(``)
    results.push(`=== TEST 3: New Registration (新注册通知 → 管理员) ===`)
    let r3 = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
      subject: `[TEST] New Registration Pending - Test User`,
      html: newRegistrationNotificationHtml({
        name: 'Test User', email: 'test@example.com', phone: '1234567890',
        company: 'Test Company', companyAddress: '123 Test St',
        state: 'CA', country: 'US', countryCode: '+1', type: 'wholesaler'
      }),
    })
    results.push(r3.success ? `✅ SUCCESS: ${r3.id}` : `❌ FAILED: ${r3.error}`)

    results.push(``)
    results.push(`=== TEST 4: Customer Approved (审核通过 → 客户) ===`)
    let r4 = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
      subject: `[TEST] Your VAPOR-X Account Has Been Approved`,
      html: customerApprovedHtml({
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        type: 'wholesaler'
      }),
    })
    results.push(r4.success ? `✅ SUCCESS: ${r4.id}` : `❌ FAILED: ${r4.error}`)

    results.push(``)
    results.push(`=== TEST 5: Customer Rejected (审核拒绝 → 客户) ===`)
    let r5 = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
      subject: `[TEST] Your VAPOR-X Account Has Not Been Approved`,
      html: customerRejectedHtml({
        customerName: 'Test Customer',
      }),
    })
    results.push(r5.success ? `✅ SUCCESS: ${r5.id}` : `❌ FAILED: ${r5.error}`)

    results.push(``)
    results.push(`=== TEST 6: Password Reset (客户忘记密码) ===`)
    const timestamp = Date.now().toString()
    const rawToken = `1:test@example.com:${timestamp}`
    const resetSecret = process.env.RESET_SECRET || process.env.RESET_TOKEN_SECRET || 'okaibiglobal-reset-secret-key-2024'
    const hmac = crypto.createHmac('sha256', resetSecret).update(rawToken).digest('hex')
    const token = Buffer.from(`${rawToken}:${hmac}`).toString('base64url')
    const resetLink = `https://okaibiglobal.com/reset-password?token=${token}`
    
    let r6 = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
      subject: `[TEST] Reset Your VAPOR-X Password`,
      html: passwordResetHtml({
        customerName: 'Test Customer',
        resetLink,
      }),
    })
    results.push(r6.success ? `✅ SUCCESS: ${r6.id}` : `❌ FAILED: ${r6.error}`)

    results.push(``)
    results.push(`=== TEST 7: Admin Password Reset (管理员忘记密码) ===`)
    let r7 = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com',
      subject: `[TEST] Reset Your OKAIBIGLOBAL Admin Password`,
      html: adminPasswordResetHtml({
        adminName: 'Admin Test',
        resetLink: `https://okaibiglobal.com/admin/reset-password?token=${token}`,
      }),
    })
    results.push(r7.success ? `✅ SUCCESS: ${r7.id}` : `❌ FAILED: ${r7.error}`)

  } catch (error: any) {
    results.push(`❌ ERROR: ${error.message}`)
    if (error.code) results.push(`   Code: ${error.code}`)
  }
  
  results.push(``)
  results.push(`=== DONE ===`)
  
  return NextResponse.json({ results })
}
