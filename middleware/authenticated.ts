import { useUserStore } from '~/store/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()
  await userStore.fetchUser()
  if (!userStore.getUser) {
    navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
