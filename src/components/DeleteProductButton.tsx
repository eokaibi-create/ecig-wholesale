'use client'

import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ productId, productName }: { productId: number, productName: string }) {
 const router = useRouter()

 const handleDelete = async () => {
 if (!confirm(`确定要删除「${productName}」吗？此操作不可撤销。`)) return
 
 const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
 if (res.ok) {
 router.refresh()
 } else {
 const err = await res.json()
 alert(`删除失败: ${err.error || '未知错误'}`)
 }
 }

 return (
 <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-700 ml-2">
 删除
 </button>
 )
}
