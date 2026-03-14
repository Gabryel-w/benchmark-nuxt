import { getPrismaClient } from '~/server/utils/prisma'
import type { PostsListResponse } from '~/types'

export default defineEventHandler(async (event): Promise<PostsListResponse> => {
  const prisma = getPrismaClient()

  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 15

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { slug: { not: '__comment-pool__' } },
        orderBy: { published_at: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.post.count({
        where: { slug: { not: '__comment-pool__' } },
      }),
    ])

    return { posts, total }
  } catch (error) {
    console.error('Error fetching admin posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})
