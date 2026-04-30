// GoDaddy SMTP Email Service
// SMTP: smtpout.secureserver.net:465 (SSL)
// Account: sales@okaibiglobal.com

import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtpout.secureserver.net'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER || 'sales@okaibiglobal.com'
const SMTP_PASS = process.env.SMTP_PASS || '12138Ekke'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sales@okaibiglobal.com'
const EMAIL_FROM = process.env.EMAIL_FROM || 'sales@okaibiglobal.com'

/**
 * Create a fresh transporter for each call.
 * IMPORTANT: In Vercel Serverless, singleton transporter connections go stale,
 * causing "Greeting never received" errors. Always create a new connection.
 */
function createTransporter(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
  from?: string
}

/**
 * Send email via GoDaddy SMTP
 * Always creates a fresh connection to avoid stale connection issues in serverless.
 */
export async function sendEmail({ to, subject, html, replyTo, from }: SendEmailParams) {
  const transporter = createTransporter()
  try {
    const info = await transporter.sendMail({
      from: `VAPOR-X <${from || EMAIL_FROM}>`,
      to,
      subject,
      html,
      replyTo: replyTo || from || EMAIL_FROM,
    })

    console.log('[Email] Sent successfully:', info.messageId)
    return { success: true, id: info.messageId }
  } catch (error) {
    console.error('[Email] Send error:', error)
    return { success: false, error: 'Failed to send email' }
  } finally {
    transporter.close()
  }
}

/**
 * Build HTML email template
 */
export function buildEmailHtml({
  title,
  body,
  footer,
}: {
  title: string
  body: string
  footer?: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:#1a1a2e;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">VAPOR-X</h1>
        <p style="color:#f59e0b;margin:4px 0 0 0;font-size:14px;">Premium Vape Wholesale</p>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:32px;border-radius:0 0 8px 8px;">
        <h2 style="color:#1a1a2e;margin:0 0 16px 0;font-size:20px;">${title}</h2>
        <div style="color:#555;line-height:1.6;font-size:15px;">${body}</div>
      </td>
    </tr>
    ${footer ? `
    <tr>
      <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
        <p style="color:#999;font-size:12px;margin:0;">${footer}</p>
      </td>
    </tr>` : ''}
    <tr>
      <td style="padding:16px;text-align:center;">
        <p style="color:#aaa;font-size:12px;margin:0;">
          VAPOR-X USA &bull; Los Angeles, CA<br>
          <a href="https://okaibiglobal.com" style="color:#f59e0b;">okaibiglobal.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Customer inquiry => Notify admin
 */
export function inquiryNotificationHtml({
  name, email, phone, company, message, productName,
}: {
  name: string; email: string; phone?: string | null; company?: string | null; message: string; productName?: string | null}) {
  return buildEmailHtml({
    title: 'New Inquiry',
    body: `
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;width:90px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
        ${company ? `<tr><td style="padding:8px 0;color:#999;">Company</td><td style="padding:8px 0;">${company}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#999;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
        ${productName ? `<tr><td style="padding:8px 0;color:#999;">Product</td><td style="padding:8px 0;font-weight:600;">${productName}</td></tr>` : ''}
        ${phone ? `<tr><td style="padding:8px 0;color:#999;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ''}
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
      <p style="font-weight:600;margin:0 0 8px 0;">Message:</p>
      <p style="background:#f9fafb;padding:12px;border-radius:6px;color:#333;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
      <p style="margin-top:20px;">
        <a href="https://okaibiglobal.com/admin/inquiries" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
          View in Admin ->
        </a>
      </p>
    `,
    footer: 'This email was sent automatically by VAPOR-X. Please do not reply directly.',
  })
}

/**
 * Admin reply to customer inquiry
 */
export function adminReplyHtml({
  customerName, replyMessage, originalMessage,
}: {
  customerName: string; replyMessage: string; originalMessage: string
}) {
  return buildEmailHtml({
    title: 'Reply from VAPOR-X',
    body: `
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>Thank you for your inquiry! Here is our reply:</p>
      <div style="background:#fef3c7;padding:16px;border-radius:6px;border-left:4px solid #f59e0b;color:#333;line-height:1.6;">
        ${replyMessage.replace(/\n/g, '<br>')}
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
      <p style="color:#999;font-size:13px;">Your original message:</p>
      <p style="background:#f9fafb;padding:12px;border-radius:6px;color:#999;font-size:13px;line-height:1.6;">
        ${originalMessage.replace(/\n/g, '<br>')}
      </p>
      <p>If you have any questions, feel free to contact us anytime!</p>
      <p style="font-weight:600;">VAPOR-X Team</p>
    `,
  })
}

/**
 * New customer registration => Notify admin for approval
 */
export function newRegistrationNotificationHtml({
  name, email, phone, company, companyAddress, state, country, countryCode, type,
}: {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  companyAddress?: string | null
  state?: string | null
  country?: string | null
  countryCode?: string | null
  type: string
}) {
  const typeLabels: Record<string, string> = {
    wholesaler: 'Wholesaler',
    store: 'Store',
    individual: 'Individual',
  }

  return buildEmailHtml({
    title: 'New Registration - Pending Approval',
    body: `
      <p style="margin-bottom:16px;">A new customer has registered and requires your review:</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;width:120px;">Account Type</td><td style="padding:8px 0;font-weight:600;">${typeLabels[type] || type}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#999;">Phone</td><td style="padding:8px 0;">${countryCode || ''} ${phone}</td></tr>` : ''}
        ${company ? `<tr><td style="padding:8px 0;color:#999;">Company</td><td style="padding:8px 0;">${company}</td></tr>` : ''}
        ${companyAddress ? `<tr><td style="padding:8px 0;color:#999;">Address</td><td style="padding:8px 0;">${companyAddress}</td></tr>` : ''}
        ${state || country ? `<tr><td style="padding:8px 0;color:#999;">Region</td><td style="padding:8px 0;">${[state, country].filter(Boolean).join(', ')}</td></tr>` : ''}
      </table>
      <p style="margin-top:20px;">
        <a href="https://okaibiglobal.com/admin/customers" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
          Approve in Admin ->
        </a>
      </p>
    `,
    footer: 'This email was sent automatically by VAPOR-X. Please do not reply directly.',
  })
}

/**
 * Customer approved => Notify customer
 */
export function customerApprovedHtml({
  customerName, customerEmail, type,
}: {
  customerName: string
  customerEmail: string
  type: string
}) {
  return buildEmailHtml({
    title: 'Your Account Has Been Approved',
    body: `
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>Congratulations! Your account at <strong>VAPOR-X</strong> has been approved!</p>
      <div style="background:#f0fdf4;padding:16px;border-radius:6px;border-left:4px solid #22c55e;color:#333;line-height:1.6;">
        <p style="margin:0;font-weight:600;">✅ You can now:</p>
        <ul style="margin:8px 0 0 0;padding-left:20px;">
          <li>View wholesale pricing</li>
          <li>Place bulk orders</li>
          <li>Track your orders</li>
        </ul>
      </div>
      <p style="margin-top:16px;">
        <a href="https://okaibiglobal.com/login" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
          Login to Your Account ->
        </a>
      </p>
    `,
    footer: "If you have any questions, please contact our support team.",
  })
}

/**
 * Customer rejected => Notify customer
 */
export function customerRejectedHtml({
  customerName,
}: {
  customerName: string
}) {
  return buildEmailHtml({
    title: 'Account Status Update',
    body: `
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>Thank you for your interest in <strong>VAPOR-X</strong>.</p>
      <p>After reviewing your application, we regret to inform you that we are unable to approve your account at this time.</p>
      <p>If you believe this is an error or would like to reapply with additional information, please contact our support team.</p>
      <p>We appreciate your understanding.</p>
      <p style="font-weight:600;">VAPOR-X Team</p>
    `,
    footer: "This is an automated message. Please do not reply directly.",
  })
}

/**
 * Password reset email for customers
 */
export function passwordResetHtml({
  name, resetLink,
}: {
  name: string
  resetLink: string
}) {
  return buildEmailHtml({
    title: 'Password Reset',
    body: `
      <p>Hello <strong>${name}</strong>,</p>
      <p>We received a request to reset your password for your <strong>VAPOR-X</strong> account.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${resetLink}" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link into your browser:</p>
      <p style="background:#f9fafb;padding:10px;border-radius:4px;word-break:break-all;font-size:13px;color:#666;">
        ${resetLink}
      </p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `,
    footer: "For security, do not share this link with anyone.",
  })
}

/**
 * Admin password reset email
 */
export function adminPasswordResetHtml({
  name, resetLink,
}: {
  name: string
  resetLink: string
}) {
  return buildEmailHtml({
    title: 'Admin Password Reset',
    body: `
      <p>Hello <strong>${name}</strong>,</p>
      <p>An administrator password reset has been requested.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${resetLink}" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;">
          Reset Admin Password
        </a>
      </p>
      <p>Or copy this link into your browser:</p>
      <p style="background:#f9fafb;padding:10px;border-radius:4px;word-break:break-all;font-size:13px;color:#666;">
        ${resetLink}
      </p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this reset, please contact the system administrator immediately.</p>
    `,
    footer: "This is an automated message. For security, do not share this link.",
  })
}
