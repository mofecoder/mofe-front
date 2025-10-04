import { getAuth } from 'firebase-admin/auth'
import { initializeFirebaseAdmin } from '~~/server/utils/firebaseAdmin'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'

// Initialize Firebase Admin
initializeFirebaseAdmin()

export default defineEventHandler(async (event) => {
  if (!getRequestURL(event).pathname.startsWith('/api')) return

  const sessionCookie = getCookie(event, AUTH_COOKIE_NAME)

  if (!sessionCookie) {
    event.context.user = null
    return
  }

  try {
    event.context.user = await getAuth().verifySessionCookie(sessionCookie, true)
  } catch {
    event.context.user = null
  }
})
