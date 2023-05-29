import { defineStore } from 'pinia'
// import { httpGet } from '~~/utils/axios'
import { AuthUser } from '~~/types/AuthUser'

interface UserState {
  user: AuthUser | null
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    user: null
  }),
  getters: {
    getUser: (state) => {
      // const json = localStorage.getItem('user')
      // return state.user || (json && JSON.parse(json))
      return state.user
    },
    isAdmin: (state) => {
      return state.user?.role === 'admin'
    }
  },
  actions: {
    async fetchUser() {
      // try {
      //   const res = await httpGet<{
      //     success: boolean
      //     data?: AuthUser
      //   }>('/auth/validate_token', {
      //     accept: '*/*'
      //   })
      //   if (!res.success) return null
      //   this.updateUser(res.data ?? null)
      //   return res.data
      // } catch {
      //   return null
      // }
    },
    updateUser(user: AuthUser | null) {
      // if (user) localStorage.setItem('user', JSON.stringify(user))
      // else localStorage.removeItem('user')
      this.user = user
    }
  }
})
