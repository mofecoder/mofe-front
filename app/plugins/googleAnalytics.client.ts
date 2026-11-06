import { createGtag } from 'vue-gtag'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const runtimeConfig = useRuntimeConfig()
  const trackingId = runtimeConfig.public.gaTrackingId
  if (!trackingId) return
  nuxtApp.vueApp.use(
    createGtag({
      tagId: trackingId,
      appName: 'mofe',
      pageTracker: {
        router,
        useScreenview: true
      }
    })
  )
})
