import { getPrismaClient } from '~/server/utils/prisma'
import type { CommentsListResponse } from '~/types'

export default defineEventHandler(async (event): Promise<CommentsListResponse> => {
  const prisma = getPrismaClient()

  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required'
      })
    }

    // Get post by slug
    const post = await prisma.post.findUnique({
      where: { slug }
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    // Get comments for the post
    const comments = await prisma.comment.findMany({
      where: { post_id: post.id },
      orderBy: { created_at: 'desc' }
    })

    return { comments }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error fetching comments:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch comments'
    })
  }
})
