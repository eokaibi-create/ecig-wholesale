'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactRedirect() {
 const router = useRouter()
 useEffect(() => { router.replace('/admin/settings') }, [router])
 return <div className="p-8 text-gray-400 text-center text-sm">重定向到系统设置...</div>
}
