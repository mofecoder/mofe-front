import VueGtagPlugin from 'vue-gtag'

export default defineNuxtPlugin(({ vueApp }) => {
  const router = useRouter()

  const runtimeConfig = useRuntimeConfig()
  const trackingId = runtimeConfig.public.gaTrackingId
  if (!trackingId) return
  vueApp.use(
    VueGtagPlugin,
    {
      appName: 'mofe',
      pageTrackerScreenviewEnabled: true,
      config: { id: trackingId }
    },
    router
  )
})
