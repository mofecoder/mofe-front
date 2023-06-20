import { useUserStore } from '~/store/user'

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()
  await userStore.fetchUser()
  if (!userStore.user) {
    return navigateTo({
      path: '/auth/signin',
      query: { ...to.query, redirect: to.path }
    })
  }
})
