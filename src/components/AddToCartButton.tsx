'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddToCartButton({
  productId,
  productName,
  flavors,
}: {
  productId: number
  productName: string
  flavors?: string[]
}) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [selectedFlavor, setSelectedFlavor] = useState(flavors && flavors.length > 0 ? flavors[0] : '')
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const addToCart = async () => {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          flavor: selectedFlavor || undefined,
        }),
      })
      if (res.ok) {
        setMsg(`✅ 已加入购物车${selectedFlavor ? ' (' + selectedFlavor + ')' : ''}`)
        setTimeout(() => setMsg(''), 2000)
      } else if (res.status === 401) {
        setMsg('🔐 请先登录')
        setTimeout(() => router.push('/login'), 1200)
      } else {
        const err = await res.json()
        setMsg(`❌ ${err.error || '加入失败'}`)
      }
    } catch {
      setMsg('❌ 网络错误')
    }
    setLoading(false)
  }

  const flavorList = flavors && flavors.length > 0 ? flavors : []

  return (
    <div className="space-y-3">
      {/* 口味选择器 */}
      {flavorList.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            🎨 选择口味
          </label>
          <div className="flex flex-wrap gap-2">
            {flavorList.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFlavor(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedFlavor === f
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 数量 */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">数量</label>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 transition"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 text-center border-x py-1.5 text-sm outline-none"
            min="1"
          />
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* 加入购物车按钮 */}
      <button
        onClick={addToCart}
        disabled={loading}
        className="w-full text-center px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-black font-semibold rounded-lg transition"
      >
        {loading ? '🔄 添加中...' : '🛒 加入购物车'}
      </button>

      {msg && (
        <p className={`text-sm text-center ${
          msg.includes('✅') ? 'text-green-600' :
          msg.includes('🔐') ? 'text-amber-600' : 'text-red-500'
        }`}>{msg}</p>
      )}
    </div>
  )
}
