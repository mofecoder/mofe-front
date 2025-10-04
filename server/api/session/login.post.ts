import { getAuth } from 'firebase-admin/auth'
import { z } from 'zod'
import { initializeFirebaseAdmin } from '~~/server/utils/firebaseAdmin'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'
import issueJwtToken from '~~/server/utils/jwt'

initializeFirebaseAdmin()

const loginSchema = z.object({
  idToken: z.string()
  // email: z.string().email().optional(),
  // name: z.string().min(3).max(16).regex(/^\w+$/).regex(/[a-zA-Z]/).optional()
})

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) => loginSchema.safeParse(body))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: Invalid body',
      data: result.error.issues
    })
  }

  const { idToken } = result.data
  const auth = getAuth()

  if (!idToken) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Missing idToken'
    })
  }

  const decodedToken = await auth.verifyIdToken(idToken, true)
  const { uid: userUid, email, firebase } = decodedToken
  if (!email) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Email is required'
    })
  }
  if (firebase.sign_in_provider !== 'password') {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Only password sign-in is allowed'
    })
  }

  try {
    // Create a session cookie valid for 14 days (14 * 24 * 60 * 60 * 1000 ms)
    const expiresIn = 14 * 24 * 60 * 60 * 1000
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })

    // Set the cookie
    setCookie(event, AUTH_COOKIE_NAME, sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax'
    })

    event.context.user = decodedToken
  } catch (error) {
    console.error('Session creation error:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid idToken'
    })
  }

  const { secret } = useRuntimeConfig()
  try {
    const token = await issueJwtToken(secret, 'v1', decodedToken.uid)
    await $fetch(`/api/proxy/v1/api/internal/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ user: { uid: userUid, email } })
    })
  } catch {
    throw createError({
      statusCode: 422,
      message: 'Unauthorized: Failed to create user'
    })
  }
})
