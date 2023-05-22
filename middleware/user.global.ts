import { useUserStore } from '~~/store/user'

export default defineNuxtRouteMiddleware(async () => {
  const app = useNuxtApp()
  const userStore = useUserStore(app.$pinia)
  await userStore.fetchUser()
})
