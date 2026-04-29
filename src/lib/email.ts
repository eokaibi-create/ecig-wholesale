// Resend Email Service
// Sign up: https://resend.com
// API Key: Set in Vercel environment variable RESEND_API_KEY

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sales@vapor-x.com'
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
  from?: string
}

/**
 * Send email via Resend API
 */
export async function sendEmail({ to, subject, html, replyTo, from }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured, email not sent')
    console.warn(`[Email] To: ${to}, Subject: ${subject}`)
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `VAPOR-X <${from || EMAIL_FROM}>`,
        to: [to],
        subject,
        html,
        replyTo: replyTo || from || EMAIL_FROM,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('[Email] Resend error:', data)
      return { success: false, error: data.message || 'Failed to send' }
    }

    console.log('[Email] Sent successfully:', data.id)
    return { success: true, id: data.id }
  } catch (error) {
    console.error('[Email] Send error:', error)
    return { success: false, error: 'Network error' }
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
  name, email, phone, company, message,
}: {
  name: string; email: string; phone?: string | null; company?: string | null; message: string
}) {
  return buildEmailHtml({
    title: 'New Inquiry',
    body: `
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;width:90px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
        ${company ? `<tr><td style="padding:8px 0;color:#999;">Company</td><td style="padding:8px 0;">${company}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#999;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
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

// ========== Additional Templates ==========

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
      <div style="background:#f0fdf4;padding:16px;border-radius:6px;border-left:4px solid #22c55e;margin:16px 0;">
        <p style="margin:0 0 8px 0;color:#333;font-weight:600;">You can now:</p>
        <ul style="margin:0;padding-left:20px;color:#555;line-height:1.8;">
          <li>Log in to your account</li>
          <li>Browse all products and place orders</li>
          <li>Submit inquiries</li>
          <li>View your order status</li>
        </ul>
      </div>
      <p style="margin-top:16px;">
        <a href="https://okaibiglobal.com/login" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
          Log In Now ->
        </a>
      </p>
      <p style="margin-top:16px;color:#666;">If you have any questions, please contact us: <a href="mailto:${ADMIN_EMAIL}" style="color:#f59e0b;">${ADMIN_EMAIL}</a></p>
      <p style="color:#666;">VAPOR-X Team</p>
    `,
    footer: 'This email was sent automatically by VAPOR-X. Please do not reply directly.',
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
    title: 'Your Account Has Not Been Approved',
    body: `
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>Unfortunately, your registration at <strong>VAPOR-X</strong> has not been approved at this time.</p>
      <p style="margin-top:16px;">Possible reasons include:</p>
      <ul style="color:#555;line-height:1.8;">
        <li>Incomplete or inaccurate information provided</li>
        <li>Does not meet our wholesale partnership criteria</li>
        <li>Other business considerations</li>
      </ul>
      <div style="background:#fef2f2;padding:16px;border-radius:6px;border-left:4px solid #ef4444;margin:16px 0;">
        <p style="margin:0;color:#333;">If you believe this is a mistake, or would like to re-submit your application, please contact us:</p>
        <p style="margin:8px 0 0 0;font-weight:600;"><a href="mailto:${ADMIN_EMAIL}" style="color:#f59e0b;">${ADMIN_EMAIL}</a></p>
      </div>
      <p style="color:#666;margin-top:16px;">Thank you for your understanding.</p>
      <p style="color:#666;">VAPOR-X Team</p>
    `,
    footer: 'This email was sent automatically by VAPOR-X. Please do not reply directly.',
  })
}

// ========== Customer Password Reset ==========

/**
 * Password reset email => Sent to customer
 */
export function passwordResetHtml({
  customerName,
  resetLink,
}: {
  customerName: string
  resetLink: string
}) {
  return buildEmailHtml({
    title: 'Reset Your Password',
    body: `
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>We received a request to reset the password for your VAPOR-X account.</p>
      <p>Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${resetLink}" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:16px;">
          Reset Password →
        </a>
      </p>
      <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p style="color:#999;font-size:13px;margin-top:16px;">If the button above doesn't work, copy and paste this link into your browser:</p>
      <p style="color:#999;font-size:13px;word-break:break-all;">${resetLink}</p>
    `,
    footer: 'This email was sent automatically by VAPOR-X. If you did not request this, please ignore it.',
  })
}

// ========== Admin Password Reset ==========

/**
 * Password reset email => Sent to admin/brand/superadmin
 */
export function adminPasswordResetHtml({
  adminName,
  resetLink,
}: {
  adminName: string
  resetLink: string
}) {
  return buildEmailHtml({
    title: 'Reset Your Admin Password',
    body: `
      <p>Hello <strong>${adminName}</strong>,</p>
      <p>We received a request to reset the password for your VAPOR-X admin account.</p>
      <p>Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${resetLink}" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:16px;">
          Reset Password →
        </a>
      </p>
      <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p style="color:#999;font-size:13px;margin-top:16px;">If the button above doesn't work, copy and paste this link into your browser:</p>
      <p style="color:#999;font-size:13px;word-break:break-all;">${resetLink}</p>
    `,
    footer: 'This email was sent automatically by VAPOR-X. If you did not request this, please ignore it.',
  })
}
