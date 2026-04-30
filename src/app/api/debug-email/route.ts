import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  const results: any = {}

  results.env = {
    SMTP_HOST: process.env.SMTP_HOST || 'default',
    SMTP_PORT: process.env.SMTP_PORT || 'default',
    SMTP_USER: process.env.SMTP_USER ? '***SET***' : 'NOT SET',
    SMTP_PASS: process.env.SMTP_PASS ? '***SET***' : 'NOT SET',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'default',
    EMAIL_FROM: process.env.EMAIL_FROM || 'default',
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'sales@okaibiglobal.com',
        pass: process.env.SMTP_PASS || '12138Ekke',
      },
    })

    await transporter.verify()
    results.verify = 'SUCCESS'

    const info = await transporter.sendMail({
      from: 'VAPOR-X <sales@okaibiglobal.com>',
      to: 'eokaibi@gmail.com',
      subject: 'DEBUG - SMTP Test from Vercel',
      html: '<p>SMTP works from Vercel!</p>',
    })
    results.send = 'SUCCESS - messageId: ' + info.messageId
  } catch (error: any) {
    results.error = {
      message: error.message,
      code: error.code,
      command: error.command,
    }
  }

  return NextResponse.json(results)
}
