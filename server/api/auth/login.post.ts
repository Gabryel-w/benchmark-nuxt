import bcrypt from 'bcryptjs'
import { getPrismaClient } from '~/server/utils/prisma'
import { generateToken, setTokenCookie } from '~/server/utils/auth'
import type { LoginRequest, LoginResponse } from '~/types'

export default defineEventHandler(async (event): Promise<LoginResponse> => {
  const prisma = getPrismaClient()
  const config = useRuntimeConfig()

  try {
    const body = await readBody<LoginRequest>(event)

    // Validate required fields
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Find admin user
    const user = await prisma.adminUser.findUnique({
      where: { email: body.email }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(body.password, user.password_hash)

    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = generateToken(
      { userId: user.id, email: user.email },
      config.jwtSecret
    )

    // Set token in cookie
    setTokenCookie(event, token)

    return { token }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error during login:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to login'
    })
  }
})
