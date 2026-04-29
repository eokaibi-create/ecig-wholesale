'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroVideosRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/home') }, [router])
  return <div className="p-8 text-gray-400 text-center text-sm">重定向到首页管理...</div>
}
