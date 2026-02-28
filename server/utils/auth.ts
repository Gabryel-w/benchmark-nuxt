import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface TokenPayload {
  userId: number
  email: string
}

export function generateToken(payload: TokenPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string, secret: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload
    return decoded
  } catch {
    return null
  }
}

export function getTokenFromCookie(event: H3Event): string | null {
  const cookie = getCookie(event, 'auth-token')
  return cookie || null
}

export function setTokenCookie(event: H3Event, token: string): void {
  // httpOnly JWT cookie (for API route verification)
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  })
  // Non-httpOnly flag cookie (readable by client-side middleware)
  setCookie(event, 'auth-logged-in', '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  })
}

export function clearTokenCookie(event: H3Event): void {
  deleteCookie(event, 'auth-token')
  deleteCookie(event, 'auth-logged-in')
}
