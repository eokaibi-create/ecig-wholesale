import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || process.env.RESET_SECRET || 'vaporx-jwt-secret-key-2024'
const encoder = new TextEncoder()
const secretKey = encoder.encode(JWT_SECRET)

const TOKEN_EXPIRY = '24h'

export interface AdminTokenPayload {
  type: 'admin'
  id: number
  username: string
  role: string
  iat?: number
  exp?: number
}

export interface UserTokenPayload {
  type: 'user'
  id: number
  username: string
  role: string
  iat?: number
  exp?: number
}

export type TokenPayload = AdminTokenPayload | UserTokenPayload

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secretKey)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export function getTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get('admin_token')?.value || null
}

export function getTokenFromHeader(request: NextRequest): string | null {
  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7)
  }
  return null
}

export function getToken(request: NextRequest): string | null {
  return getTokenFromCookie(request) || getTokenFromHeader(request)
}

/**
 * 从请求中解析管理员身份
 */
export async function parseToken(request: NextRequest): Promise<TokenPayload | null> {
  const token = getToken(request)
  if (!token) return null
  return verifyToken(token)
}

/**
 * 标准化角色名（兼容旧数据）
 */
export function normalizeRole(role: string): string {
  const normalized = role === 'product_admin' || role === 'product' ? 'brand'
    : role === 'super_admin' ? 'superadmin'
    : role === 'editor' || role === 'viewer' ? 'admin'
    : role
  return normalized
}

/**
 * 检查是否有管理员权限
 */
export async function requireAdmin(request: NextRequest, requiredRoles?: string[]): Promise<{ 
  authorized: boolean
  payload: TokenPayload | null
  error?: { message: string; status: number }
}> {
  const payload = await parseToken(request)
  
  if (!payload) {
    return {
      authorized: false,
      payload: null,
      error: { message: '未登录或登录已过期', status: 401 }
    }
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const normalized = normalizeRole(payload.role)
    if (!requiredRoles.includes(normalized)) {
      return {
        authorized: false,
        payload,
        error: { message: '权限不足', status: 403 }
      }
    }
  }

  return { authorized: true, payload }
}
