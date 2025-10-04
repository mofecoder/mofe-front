import { configure } from 'vue-gtag'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  const runtimeConfig = useRuntimeConfig()
  const trackingId = runtimeConfig.public.gaTrackingId
  if (!trackingId) return
  configure({
    appName: 'mofe',
    pageTracker: {
      router,
      useScreenview: true
    },
    tagId: trackingId
  })
})
