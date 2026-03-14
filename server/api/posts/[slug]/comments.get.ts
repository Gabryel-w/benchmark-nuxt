import { getPrismaClient } from '~/server/utils/prisma'
import type { CommentsListResponse } from '~/types'

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

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

    // Fetch all pool comments
    const allComments = await prisma.comment.findMany({
      orderBy: { id: 'asc' },
    })

    if (allComments.length === 0) {
      return { comments: [] }
    }

    // Select 50 deterministic comments based on slug hash
    const hash = hashCode(slug)
    const count = Math.min(50, allComments.length)
    const selected = []
    const used = new Set<number>()

    for (let i = 0; i < count; i++) {
      let index = (hash + i * 7 + i * i) % allComments.length
      while (used.has(index)) {
        index = (index + 1) % allComments.length
      }
      used.add(index)
      selected.push(allComments[index])
    }

    // Sort by created_at desc
    selected.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return { comments: selected }
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
