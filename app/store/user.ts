import { defineStore } from 'pinia'
import type { AuthUser } from '~/types/AuthUser'
import { authApi, type AuthErrorResponse } from '~/utils/apis'
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '~/constants/cookies'

interface UserState {
  user: AuthUser | null
}

// devise_token_auth のエラーレスポンスからメッセージの配列を取り出す
function getAuthErrors(e: unknown): string[] {
  const data = getApiError(e) as AuthErrorResponse | undefined
  if (!data?.errors) return ['Network Error']
  return Array.isArray(data.errors) ? data.errors : data.errors.fullMessages
}

// トークンの更新 (cookie への保存) と 401 時の破棄は plugins/api.ts で共通に行う
async function fetchUser() {
  const cookie = useCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS)
  if (!cookie.value) return 'error'
  const auth = authApi()
  try {
    const res = await auth.validateToken()
    if (!res.success) return 'error'
    return res.data
  } catch (e) {
    return getErrorStatus(e) === 401 ? 'error' : 'network'
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
      if (user === 'network') return null
      if (user === 'error') this.user = null
      else this.updateUser(user)
      return typeof user === 'string' ? null : user
    },
    async signIn(userName: string, password: string) {
      const auth = authApi()
      try {
        const res = await auth.signIn({ name: userName, password })
        this.updateUser(res.data)
        return { ok: true, user: res.data }
      } catch (e) {
        return { ok: false, errors: getAuthErrors(e) }
      }
    },
    async signUp(
      email: string,
      userName: string,
      password: string,
      passwordConfirmation: string
    ) {
      const auth = authApi()
      try {
        const res = await auth.signUp({
          email,
          name: userName,
          password,
          passwordConfirmation
        })
        this.updateUser(res.data)
        return { ok: true, user: res.data }
      } catch (e) {
        return { ok: false, errors: getAuthErrors(e) }
      }
    },
    async signOut() {
      if (!this.user) return
      const auth = authApi()
      try {
        await auth.signOut()
      } finally {
        this.updateUser(null)
        useCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS).value = null
      }
    },
    updateUser(user: AuthUser | null) {
      this.user = user
    }
  }
})
