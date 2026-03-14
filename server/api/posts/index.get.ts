import { fetchRssPosts, mergeAndPaginate } from '~/server/utils/rss'
import { getPrismaClient } from '~/server/utils/prisma'
import type { PostsListResponse } from '~/types'

export default defineEventHandler(async (event): Promise<PostsListResponse> => {
  const prisma = getPrismaClient()

  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 10
    const q = (query.q as string) || undefined
    const category = (query.category as string) || undefined

    const [rssPosts, dbPosts] = await Promise.all([
      fetchRssPosts(),
      prisma.post.findMany({ orderBy: { published_at: 'desc' } }),
    ])

    const { posts, total } = mergeAndPaginate(rssPosts, dbPosts, {
      page, perPage, q, category,
    })

    return { posts, total }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})
