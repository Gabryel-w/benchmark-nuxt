import { getPrismaClient } from '~/server/utils/prisma'
import type { PostsListResponse } from '~/types'

export default defineEventHandler(async (event): Promise<PostsListResponse> => {
  const prisma = getPrismaClient()

  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 10
    const searchQuery = query.q as string
    const category = query.category as string

    const skip = (page - 1) * perPage

    // Build where clause for filtering
    const where: any = {}

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { excerpt: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
        { author: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { published_at: 'desc' }
      }),
      prisma.post.count({ where })
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
