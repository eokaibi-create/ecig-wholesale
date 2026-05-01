'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CategoriesRedirect() {
 const router = useRouter()
 useEffect(() => { router.replace('/admin/products') }, [router])
 return <div className="p-8 text-gray-400 text-center text-sm">重定向到产品管理...</div>
}
