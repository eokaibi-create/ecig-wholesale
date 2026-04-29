'use client'

import { useEffect, useState } from 'react'

/**
 * 获取当前管理员角色的 Hook
 * 用于前端页面级别控制按钮显示
 */
export function useAdminRole() {
  const [role, setRole] = useState<string>('admin')

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)admin_role\s*=\s*([^;]*)/)
    const rawRole = match ? match[1] : 'admin'
    // 统一旧角色名
    const normalized = rawRole === 'product_admin' ? 'product'
      : rawRole === 'super_admin' ? 'admin'
      : rawRole
    setRole(normalized)
  }, [])

  const isSuperadmin = role === 'superadmin'
  const isAdmin = role === 'admin'
  const isEditor = role === 'editor'
  const isViewer = role === 'viewer'
  const isProduct = role === 'product'

  // 是否可以编辑内容（增删改）
  const canEdit = isSuperadmin || isAdmin || isEditor || isProduct

  // 是否可以管理管理员
  const canManageAdmins = isSuperadmin

  // 是否可以访问系统设置
  const canAccessSettings = isSuperadmin || isAdmin

  // 角色中文名
  const roleLabel: Record<string, string> = {
    superadmin: '超级管理员',
    admin: '管理员',
    editor: '编辑',
    viewer: '仅查看',
    product: '产品管理员',
  }

  return {
    role,
    roleLabel: roleLabel[role] || role,
    isSuperadmin,
    isAdmin,
    isEditor,
    isViewer,
    isProduct,
    canEdit,
    canManageAdmins,
    canAccessSettings,
  }
}
