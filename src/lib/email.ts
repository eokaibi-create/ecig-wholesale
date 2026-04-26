// Resend 邮件服务
// 注册: https://resend.com
// API Key: 设置到 Vercel 环境变量 RESEND_API_KEY

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'EOKAIBI@GMAIL.COM'
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
  from?: string
}

/**
 * 发送邮件
 */
export async function sendEmail({ to, subject, html, replyTo, from }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('[Email] 未配置 RESEND_API_KEY，邮件未发送')
    console.warn(`[Email] 收件人: ${to}, 主题: ${subject}`)
    return { success: false, error: 'RESEND_API_KEY 未配置' }
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
      return { success: false, error: data.message || '发送失败' }
    }

    console.log('[Email] 发送成功:', data.id)
    return { success: true, id: data.id }
  } catch (error) {
    console.error('[Email] 发送异常:', error)
    return { success: false, error: '网络错误' }
  }
}

/**
 * 拼装 HTML 邮件模板
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
 * 客户询价 → 通知管理员
 */
export function inquiryNotificationHtml({
  name, email, phone, company, message,
}: {
  name: string; email: string; phone?: string | null; company?: string | null; message: string
}) {
  return buildEmailHtml({
    title: '📩 新的询价',
    body: `
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;width:90px;">姓名</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
        ${company ? `<tr><td style="padding:8px 0;color:#999;">公司</td><td style="padding:8px 0;">${company}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#999;">邮箱</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#999;">电话</td><td style="padding:8px 0;">${phone}</td></tr>` : ''}
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
      <p style="font-weight:600;margin:0 0 8px 0;">留言内容：</p>
      <p style="background:#f9fafb;padding:12px;border-radius:6px;color:#333;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
      <p style="margin-top:20px;">
        <a href="https://okaibiglobal.com/admin/inquiries" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
          去后台查看 →
        </a>
      </p>
    `,
    footer: '此邮件由 VAPOR-X 网站自动发送，请勿直接回复。',
  })
}

/**
 * 管理员回复客户
 */
export function adminReplyHtml({
  customerName, replyMessage, originalMessage,
}: {
  customerName: string; replyMessage: string; originalMessage: string
}) {
  return buildEmailHtml({
    title: '来自 VAPOR-X 的回复',
    body: `
      <p>您好 ${customerName}，</p>
      <p>感谢您的询价！以下是我们的回复：</p>
      <div style="background:#fef3c7;padding:16px;border-radius:6px;border-left:4px solid #f59e0b;color:#333;line-height:1.6;">
        ${replyMessage.replace(/\n/g, '<br>')}
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
      <p style="color:#999;font-size:13px;">您之前的留言：</p>
      <p style="background:#f9fafb;padding:12px;border-radius:6px;color:#999;font-size:13px;line-height:1.6;">
        ${originalMessage.replace(/\n/g, '<br>')}
      </p>
      <p>如有任何疑问，欢迎随时联系我们！</p>
      <p style="font-weight:600;">VAPOR-X 团队</p>
    `,
  })
}

// ========== 新增模板 ==========

/**
 * 新客户注册 → 通知管理员审批
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
    wholesaler: '🏬 Wholesaler',
    store: '🏪 Store',
    individual: '👤 Individual',
  }

  return buildEmailHtml({
    title: '🆕 新客户注册 - 待审批',
    body: `
      <p style="margin-bottom:16px;">有新的客户注册，需要您的审核：</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;width:120px;">账户类型</td><td style="padding:8px 0;font-weight:600;">${typeLabels[type] || type}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">姓名</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">邮箱</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#999;">电话</td><td style="padding:8px 0;">${countryCode || ''} ${phone}</td></tr>` : ''}
        ${company ? `<tr><td style="padding:8px 0;color:#999;">公司</td><td style="padding:8px 0;">${company}</td></tr>` : ''}
        ${companyAddress ? `<tr><td style="padding:8px 0;color:#999;">地址</td><td style="padding:8px 0;">${companyAddress}</td></tr>` : ''}
        ${state || country ? `<tr><td style="padding:8px 0;color:#999;">地区</td><td style="padding:8px 0;">${[state, country].filter(Boolean).join(', ')}</td></tr>` : ''}
      </table>
      <p style="margin-top:20px;">
        <a href="https://okaibiglobal.com/admin/customers" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
          去后台审批 →
        </a>
      </p>
    `,
    footer: '此邮件由 VAPOR-X 网站自动发送，请勿直接回复。',
  })
}

/**
 * 客户审批通过 → 通知客户
 */
export function customerApprovedHtml({
  customerName, customerEmail, type,
}: {
  customerName: string
  customerEmail: string
  type: string
}) {
  return buildEmailHtml({
    title: '✅ 您的账户已通过审批',
    body: `
      <p>您好 <strong>${customerName}</strong>，</p>
      <p>恭喜！您在 <strong>VAPOR-X</strong> 的账户已通过审批 🎉</p>
      <div style="background:#f0fdf4;padding:16px;border-radius:6px;border-left:4px solid #22c55e;margin:16px 0;">
        <p style="margin:0 0 8px 0;color:#333;font-weight:600;">您现在可以：</p>
        <ul style="margin:0;padding-left:20px;color:#555;line-height:1.8;">
          <li>🔐 登录您的账户</li>
          <li>📦 浏览所有产品并下单</li>
          <li>📩 提交询价咨询</li>
          <li>📋 查看您的订单状态</li>
        </ul>
      </div>
      <p style="margin-top:16px;">
        <a href="https://okaibiglobal.com/login" 
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
          立即登录 →
        </a>
      </p>
      <p style="margin-top:16px;color:#666;">如有任何问题，欢迎随时联系我们：<a href="mailto:${ADMIN_EMAIL}" style="color:#f59e0b;">${ADMIN_EMAIL}</a></p>
      <p style="color:#666;">VAPOR-X 团队</p>
    `,
    footer: '此邮件由 VAPOR-X 网站自动发送，请勿直接回复。',
  })
}

/**
 * 客户审批被拒绝 → 通知客户
 */
export function customerRejectedHtml({
  customerName,
}: {
  customerName: string
}) {
  return buildEmailHtml({
    title: '❌ 您的账户未通过审批',
    body: `
      <p>您好 <strong>${customerName}</strong>，</p>
      <p>很遗憾，您在 <strong>VAPOR-X</strong> 的注册账户未通过审批。</p>
      <p style="margin-top:16px;">可能的原因包括：</p>
      <ul style="color:#555;line-height:1.8;">
        <li>提供的信息不完整或不准确</li>
        <li>不符合我们的批发合作条件</li>
        <li>其他业务考量</li>
      </ul>
      <div style="background:#fef2f2;padding:16px;border-radius:6px;border-left:4px solid #ef4444;margin:16px 0;">
        <p style="margin:0;color:#333;">如果您认为这是一个误判，或者想重新提交申请，请通过以下邮箱联系我们：</p>
        <p style="margin:8px 0 0 0;font-weight:600;"><a href="mailto:${ADMIN_EMAIL}" style="color:#f59e0b;">${ADMIN_EMAIL}</a></p>
      </div>
      <p style="color:#666;margin-top:16px;">感谢您的理解。</p>
      <p style="color:#666;">VAPOR-X 团队</p>
    `,
    footer: '此邮件由 VAPOR-X 网站自动发送，请勿直接回复。',
  })
}
