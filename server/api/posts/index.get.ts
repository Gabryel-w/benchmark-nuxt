import { getPrismaClient } from '~/server/utils/prisma'
import type { PostsListResponse } from '~/types'

export default defineEventHandler(async (event): Promise<PostsListResponse> => {
  const prisma = getPrismaClient()

  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 10

    const skip = (page - 1) * perPage

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: perPage,
        orderBy: { published_at: 'desc' }
      }),
      prisma.post.count()
    ])

    return {
      posts,
      total
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})
