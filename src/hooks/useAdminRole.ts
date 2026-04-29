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
    // 统一旧角色名（兼容数据库旧数据）
    const normalized = rawRole === 'product_admin' || rawRole === 'product' ? 'brand'
      : rawRole === 'super_admin' ? 'superadmin'
      : rawRole
    setRole(normalized)
  }, [])

  const isSuperadmin = role === 'superadmin'
  const isAdmin = role === 'admin'
  const isBrand = role === 'brand'

  // 是否可以编辑内容（增删改）- 除 viewer 外都可以
  const canEdit = isSuperadmin || isAdmin || isBrand

  // 是否可以管理管理员 - 仅 superadmin
  const canManageAdmins = isSuperadmin

  // 是否可以访问系统设置 - superadmin + admin
  const canAccessSettings = isSuperadmin || isAdmin

  // 角色中文名
  const roleLabel: Record<string, string> = {
    superadmin: '超级管理员',
    admin: '管理员',
    brand: '品牌方',
  }

  return {
    role,
    roleLabel: roleLabel[role] || role,
    isSuperadmin,
    isAdmin,
    isBrand,
    canEdit,
    canManageAdmins,
    canAccessSettings,
  }
}
