import VueGtagPlugin from 'vue-gtag'

export default defineNuxtPlugin(({ vueApp }) => {
  const router = useRouter()

  if (!process.env.GA_TRACKING_ID) return
  vueApp.use(
    VueGtagPlugin,
    {
      appName: 'mofe',
      pageTrackerScreenviewEnabled: true,
      config: { id: process.env.GA_TRACKING_ID }
    },
    router
  )
})
