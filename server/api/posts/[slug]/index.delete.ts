import { getPrismaClient } from '~/server/utils/prisma'
import type { DeletePostResponse } from '~/types'

export default defineEventHandler(async (event): Promise<DeletePostResponse> => {
  const prisma = getPrismaClient()

  // Check authentication via middleware
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required'
      })
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    await prisma.post.delete({
      where: { slug }
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error deleting post:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete post'
    })
  }
})
