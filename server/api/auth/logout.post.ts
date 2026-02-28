import { clearTokenCookie } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    clearTokenCookie(event)

    return { success: true }
  } catch (error) {
    console.error('POST /api/auth/logout error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to logout',
    })
  }
})
