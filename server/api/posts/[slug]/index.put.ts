import { getPrismaClient } from '~/server/utils/prisma'
import type { PostUpdateInput } from '~/types'

export default defineEventHandler(async (event) => {
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

    const body = await readBody<PostUpdateInput>(event)

    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.excerpt || !body.author) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
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

    // If slug is being changed, check if new slug already exists
    if (body.slug !== slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: body.slug }
      })

      if (slugExists) {
        throw createError({
          statusCode: 400,
          statusMessage: 'New slug already exists'
        })
      }
    }

    const post = await prisma.post.update({
      where: { slug },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        author: body.author,
        category: body.category || 'Geral'
      }
    })

    return { post }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error updating post:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update post'
    })
  }
})
