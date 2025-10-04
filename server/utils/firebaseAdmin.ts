import { cert, getApps, initializeApp } from 'firebase-admin/app'

export function initializeFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0]!

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  const credential = serviceAccount
    ? cert(serviceAccount.startsWith('{') ? JSON.parse(serviceAccount) : serviceAccount)
    : undefined
  return initializeApp({ credential })
}
