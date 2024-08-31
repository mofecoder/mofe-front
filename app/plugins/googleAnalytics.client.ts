import VueGtagPlugin from 'vue-gtag'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const runtimeConfig = useRuntimeConfig()
  const trackingId = runtimeConfig.public.gaTrackingId
  if (!trackingId) return
  nuxtApp.vueApp.use(
    VueGtagPlugin,
    {
      appName: 'mofe',
      pageTrackerScreenviewEnabled: true,
      config: { id: trackingId }
    },
    router
  )
})
