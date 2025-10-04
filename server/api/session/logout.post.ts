import { initializeFirebaseAdmin } from '~~/server/utils/firebaseAdmin'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'

initializeFirebaseAdmin()

export default defineEventHandler(async (event) => {
  try {
    deleteCookie(event, AUTH_COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to logout'
    })
  }
})
