import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  const results: string[] = []
  
  // 1. Check environment variables
  results.push(`SMTP_HOST env: "${process.env.SMTP_HOST}"`)
  results.push(`SMTP_PORT env: "${process.env.SMTP_PORT}"`)
  results.push(`SMTP_USER env: "${process.env.SMTP_USER}"`)
  results.push(`SMTP_PASS env: "${process.env.SMTP_PASS ? '***SET***' : 'NOT SET'}"`)
  results.push(`ADMIN_EMAIL env: "${process.env.ADMIN_EMAIL}"`)
  results.push(`EMAIL_FROM env: "${process.env.EMAIL_FROM}"`)
  
  // 2. Try SMTP connection
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
    results.push('✅ SMTP VERIFY: SUCCESS')
    
    // 3. Try sending test email
    const info = await transporter.sendMail({
      from: `VAPOR-X <${process.env.EMAIL_FROM || 'sales@okaibiglobal.com'}>`,
      to: 'eokaibi@gmail.com',
      subject: 'VAPOR-X - Diagnostic Test Email from Vercel',
      html: `<h1>Diagnostic Test</h1><p>This email was sent from Vercel Serverless environment at ${new Date().toISOString()}</p>
             <p>SMTP_HOST: ${process.env.SMTP_HOST || 'default'}</p>
             <p>EMAIL_FROM: ${process.env.EMAIL_FROM || 'default'}</p>`,
    })
    
    results.push(`✅ SEND TEST: SUCCESS - messageId: ${info.messageId}`)
    results.push(`✅ Accepted: ${info.accepted.join(', ')}`)
    
  } catch (error: any) {
    results.push(`❌ ERROR: ${error.message}`)
    if (error.code) results.push(`   Code: ${error.code}`)
    if (error.command) results.push(`   Command: ${error.command}`)
  }
  
  return NextResponse.json({ results })
}
