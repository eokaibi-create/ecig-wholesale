import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <AdminLayout active="产品管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
          <Link href="/admin/products/new" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">+ 新增产品</Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">图片</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">产品</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">分类</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">品牌</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">批发价</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">批发商价</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">零售价</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">库存</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">💨</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.brand || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-amber-600">${p.wholesalePrice?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-purple-600">${p.wholesalerPrice?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.published ? '已上架' : '草稿'}
                    </span>
                    {p.hot && <span className="ml-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">热卖</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-sm text-amber-600 hover:text-amber-700">编辑</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
