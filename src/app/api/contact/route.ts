import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 联系资料可见性 API
// GET /api/contact → 返回联系信息和可见性设置（前台用）
// POST /api/contact/visibility → 保存可见性设置（后台用）

export async function GET() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))

  // 检查用户是否登录
  let isLoggedIn = false
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('customer_token')?.value
      || cookieStore.get('admin_token')?.value
    if (token) {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString())
      isLoggedIn = !!payload.id || !!payload.customerId
    }
  } catch {
    // Cookie 读取失败，视为未登录
  }

  // 判断各项目的可见性
  const showWhatsapp = isLoggedIn || map.show_whatsapp !== 'false'
  const showEmail = isLoggedIn || map.show_email !== 'false'
  const showPhone = isLoggedIn || map.show_phone !== 'false'
  const showAddress = isLoggedIn || map.show_address !== 'false'
  const showWechat = isLoggedIn || map.show_wechat !== 'false'

  return NextResponse.json({
    isLoggedIn,
    whatsapp: showWhatsapp ? (map.whatsapp || '+1 (323) 926-0829') : null,
    email: showEmail ? (map.email || 'EOKAIBI@GMAIL.COM') : null,
    phone: showPhone ? (map.phone || '+1 (323) 926-0829') : null,
    address: showAddress ? (map.address || 'Los Angeles, CA') : null,
    wechat: showWechat ? (map.wechat || 'EA_YONG') : null,
    siteName: map.site_name || 'VAPOR-X USA',
    minOrder: map.min_order || '500',
    shippingInfo: map.shipping_info || '全美48州免运费，订单满$500起批',
    visibility: {
      showWhatsapp: map.show_whatsapp !== 'false',
      showEmail: map.show_email !== 'false',
      showPhone: map.show_phone !== 'false',
      showAddress: map.show_address !== 'false',
      showWechat: map.show_wechat !== 'false',
    },
  })
}
