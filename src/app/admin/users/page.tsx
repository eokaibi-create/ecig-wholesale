'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  state: string | null
  approved: boolean
  createdAt: string
  _count: { inquiries: number; orders: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    const res = await fetch('/api/customers')
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleApprove = async (id: number, approved: boolean) => {
    const res = await fetch('/api/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    })
    if (res.ok) fetchUsers()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此用户？')) return
    await fetch(`/api/customers?id=${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  return (
    <AdminLayout active="用户管理">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">用户管理</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">客户</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">公司</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">电话</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">州</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">询价</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">订单</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">审核</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">注册日期</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">加载中...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">暂无用户</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.company || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.state || '-'}</td>
                    <td className="px-4 py-3 text-center text-sm">{u._count.inquiries}</td>
                    <td className="px-4 py-3 text-center text-sm">{u._count.orders}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleApprove(u.id, !u.approved)}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          u.approved
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {u.approved ? '已通过' : '待审核'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">删除</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
