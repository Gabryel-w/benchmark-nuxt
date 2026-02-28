import { verifyToken, getTokenFromCookie } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  // Check if this is an admin API route that requires authentication
  if (event.node.req.url?.startsWith('/api/posts') &&
      (event.node.req.method === 'POST' ||
       event.node.req.method === 'PUT' ||
       event.node.req.method === 'DELETE')) {

    const token = getTokenFromCookie(event)

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const decoded = verifyToken(token, config.jwtSecret)

    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    // Attach user to event context
    event.context.user = decoded
  }
})
