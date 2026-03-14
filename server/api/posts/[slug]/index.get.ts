import { getPrismaClient } from '~/server/utils/prisma'
import { fetchRssPosts, findRssPostBySlug } from '~/server/utils/rss'
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

    // Try DB first
    const id = parseInt(slugOrId, 10)
    let post

    if (!isNaN(id) && id > 0) {
      post = await prisma.post.findUnique({ where: { id } })
    } else {
      post = await prisma.post.findUnique({ where: { slug: slugOrId } })
    }

    if (post) {
      return { post: { ...post, source: 'db' } }
    }

    // Fall back to RSS
    await fetchRssPosts()
    const rssPost = findRssPostBySlug(slugOrId)

    if (!rssPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    return { post: rssPost }
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
