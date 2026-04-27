import { NextResponse } from 'next/server';
import { 
  sendEmail, 
  newRegistrationNotificationHtml,
  customerApprovedHtml,
  customerRejectedHtml,
  inquiryNotificationHtml,
  adminReplyHtml
} from '@/lib/email';

export async function GET() {
  const results: Record<string, any> = {};

  try {
    // 1. 检查环境变量
    results.env = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? `存在 (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : '不存在',
      EMAIL_FROM: process.env.EMAIL_FROM || '不存在',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '不存在',
    };

    const adminEmail = process.env.ADMIN_EMAIL || 'EOKAIBI@GMAIL.COM';
    const testCustomer = {
      name: '测试客户',
      email: adminEmail,
      phone: '+1234567890',
      company: '测试公司',
      type: 'wholesaler',
    };

    // 2. 测试 sendEmail 函数（和注册 API 使用完全相同的函数）
    results.test_sendEmail_direct = await sendEmail({
      to: adminEmail,
      subject: '🔬 测试1: sendEmail 函数',
      html: '<p>测试 sendEmail 函数是否正常工作</p>',
    });

    // 3. 测试注册通知（和注册 API 使用完全相同的模板）
    const regHtml = newRegistrationNotificationHtml({
      name: testCustomer.name,
      email: testCustomer.email,
      phone: testCustomer.phone,
      company: testCustomer.company,
      companyAddress: '123 Test St',
      state: 'CA',
      country: 'US',
      countryCode: '+1',
      type: testCustomer.type,
    });
    results.test_registration_notification = await sendEmail({
      to: adminEmail,
      subject: `🔬 测试2: 注册通知模板 - ${testCustomer.name}`,
      html: regHtml,
    });

    // 4. 测试审批通过通知
    const approvedHtml = customerApprovedHtml({
      customerName: testCustomer.name,
      customerEmail: testCustomer.email,
      type: testCustomer.type,
    });
    results.test_approval_notification = await sendEmail({
      to: testCustomer.email,
      subject: '🔬 测试3: 审批通过通知模板',
      html: approvedHtml,
    });

    // 5. 测试审批拒绝通知
    const rejectedHtml = customerRejectedHtml({
      customerName: testCustomer.name,
    });
    results.test_rejection_notification = await sendEmail({
      to: testCustomer.email,
      subject: '🔬 测试4: 审批拒绝通知模板',
      html: rejectedHtml,
    });

    // 6. 测试询价通知
    const inquiryHtml = inquiryNotificationHtml({
      name: testCustomer.name,
      email: testCustomer.email,
      phone: testCustomer.phone,
      company: testCustomer.company,
      message: '这是一个测试询价消息',
    });
    results.test_inquiry_notification = await sendEmail({
      to: adminEmail,
      subject: `🔬 测试5: 询价通知模板 - ${testCustomer.name}`,
      html: inquiryHtml,
    });

    // 7. 测试管理员回复模板
    const replyHtml = adminReplyHtml({
      customerName: testCustomer.name,
      replyMessage: '感谢您的询价，我们会在24小时内回复。',
      originalMessage: '这是一个测试消息',
    });
    results.test_reply_notification = await sendEmail({
      to: testCustomer.email,
      subject: '🔬 测试6: 管理员回复模板',
      html: replyHtml,
    });

  } catch (err: any) {
    results.critical_error = err.message || String(err);
    results.critical_stack = err.stack;
  }

  return NextResponse.json(results);
}
