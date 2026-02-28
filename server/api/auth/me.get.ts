import { getPrismaClient } from '~/server/utils/prisma'
import { getTokenFromCookie, verifyToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const token = getTokenFromCookie(event)

    if (!token) {
      return { authenticated: false }
    }

    const decoded = verifyToken(token, config.jwtSecret)

    if (!decoded) {
      return { authenticated: false }
    }

    return {
      authenticated: true,
      email: decoded.email,
    }
  } catch (error) {
    console.error('GET /api/auth/me error:', error)
    return { authenticated: false }
  }
})
