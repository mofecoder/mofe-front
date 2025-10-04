import { defineStore } from 'pinia'
import type { AuthUser } from '~/types/AuthUser'
import Auth from '~/apis/Auth'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'

interface UserState {
  user: AuthUser | null
}

async function fetchUser() {
  try {
    const cookie = useCookie(AUTH_COOKIE_NAME)
    if (!cookie.value) return 'error'
    const { data } = await useApi(Auth.validateToken, [])
    if (!data.value) return 'network'
    if (!data.value.success) return 'error'
    return data.value.data
  } catch {
    return 'network'
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null
  }),
  getters: {
    isAdmin: (state) => {
      return state.user?.role === 'admin'
    }
  },
  actions: {
    async fetchUser(forceRequest: boolean = false) {
      if (!forceRequest && this.user) return this.user

      const user = await fetchUser()
      console.log('fetch user: %o', user)
      if (user === 'network') return null
      if (user === 'error') this.user = null
      else this.updateUser(user)
      return typeof user === 'string' ? null : user
    },
    updateUser(user: AuthUser | null) {
      // if (user) localStorage.setItem('user', JSON.stringify(user))
      // else localStorage.removeItem('user')
      console.log('update user: %o', user)
      this.user = user
    }
  }
})
