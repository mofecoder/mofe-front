import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth } from 'firebase/auth'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: `${config.public.authDomain}`,
    projectId: config.public.firebaseProjectId,
    appId: config.public.firebaseAppId
  }
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  auth.languageCode = 'ja'

  await auth.setPersistence(browserLocalPersistence)

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth
    }
  }
})
