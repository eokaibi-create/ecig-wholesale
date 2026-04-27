import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  const results: Record<string, any> = {};

  try {
    // 1. 检查环境变量
    results.env = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? `存在 (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : '不存在',
      EMAIL_FROM: process.env.EMAIL_FROM || '不存在',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '不存在',
    };

    // 2. 测试 Resend 连接
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'EOKAIBI@GMAIL.COM',
      subject: '🔬 VAPOR-X 生产环境邮件测试',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626;">🔬 邮件测试</h1>
            <p>这封邮件是从 <strong>Vercel 生产环境</strong> 直接发送的。</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p><strong>发件人:</strong> ${process.env.EMAIL_FROM || 'onboarding@resend.dev'}</p>
            <p><strong>收件人:</strong> ${process.env.ADMIN_EMAIL || 'EOKAIBI@GMAIL.COM'}</p>
            <p><strong>时间:</strong> ${new Date().toISOString()}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666;">如果您收到这封邮件，说明生产环境的邮件系统完全正常！</p>
          </div>
        </div>
      `,
    });

    if (error) {
      results.sendResult = { success: false, error };
    } else {
      results.sendResult = { success: true, data };
    }
  } catch (err: any) {
    results.error = err.message || String(err);
  }

  return NextResponse.json(results);
}
