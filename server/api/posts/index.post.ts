import { getPrismaClient } from '~/server/utils/prisma'
import type { CreatePostRequest } from '~/types'

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
    const body = await readBody<CreatePostRequest>(event)

    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.excerpt || !body.author) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug: body.slug }
    })

    if (existingPost) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        author: body.author
      }
    })

    return { post }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error creating post:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create post'
    })
  }
})
