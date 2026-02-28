import { getPrismaClient } from '~/server/utils/prisma'
import type { SinglePostResponse } from '~/types'

export default defineEventHandler(async (event): Promise<SinglePostResponse> => {
  const prisma = getPrismaClient()

  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required'
      })
    }

    const post = await prisma.post.findUnique({
      where: { slug }
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    return { post }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error fetching post:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post'
    })
  }
})
