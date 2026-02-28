import { getPrismaClient } from '~/server/utils/prisma'
import type { SinglePostResponse } from '~/types'

export default defineEventHandler(async (event): Promise<SinglePostResponse> => {
  const prisma = getPrismaClient()

  try {
    const slugOrId = getRouterParam(event, 'slug')

    if (!slugOrId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug or ID parameter is required'
      })
    }

    // Try to parse as number (ID)
    const id = parseInt(slugOrId, 10)
    let post

    if (!isNaN(id) && id > 0) {
      // It's an ID
      post = await prisma.post.findUnique({
        where: { id }
      })
    } else {
      // It's a slug
      post = await prisma.post.findUnique({
        where: { slug: slugOrId }
      })
    }

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
