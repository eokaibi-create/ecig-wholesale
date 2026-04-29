'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InquiriesRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/orders') }, [router])
  return <div className="p-8 text-gray-400 text-center text-sm">重定向到订单管理...</div>
}
