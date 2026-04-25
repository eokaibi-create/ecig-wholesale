import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <AdminLayout active="询价管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">询价管理</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">客户</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">公司</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">需求</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{inq.customer.name}</p>
                    <p className="text-xs text-gray-400">{inq.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inq.customer.company || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{inq.message}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{inq.status === 'new' ? '新询价' : inq.status === 'contacted' ? '已联系' : '已完成'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(inq.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
