import { defineStore } from 'pinia'
// import { httpGet } from '~~/utils/axios'
import dayjs from 'dayjs'
import type { AuthUser } from '~~/types/AuthUser'
import Auth from '~/utils/apis/Auth'
import type { UseFetchOptions } from '#app'
import type AuthTokens from '~/types/AuthTokens'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'

interface UserState {
  user: AuthUser | null
}

function getAuthHeader(headers: Headers) {
  const client = headers.get('client')
  const accessToken = headers.get('access-token')
  const uid = headers.get('uid')
  const expiry = headers.get('expiry')
  if (!client || !accessToken || !uid || !expiry) return null
  return { client, accessToken, uid, expiry: parseInt(expiry) }
}

const onResponse: UseFetchOptions<any>['onResponse'] = ({ response }) => {
  const { headers } = response
  const authHeader = getAuthHeader(headers)
  if (!authHeader) return
  const cookie = useCookie<AuthTokens>(AUTH_COOKIE_NAME, {
    expires: dayjs.unix(authHeader.expiry).toDate()
  })
  cookie.value = authHeader
}

async function fetchUser() {
  try {
    const cookie = useCookie(AUTH_COOKIE_NAME)
    if (!cookie.value) return 'error'
    const res = await useApi(Auth.validateToken, [])
    if (!res.data.value) return 'network'
    if (!res.data.value.success) return 'error'
    return res.data.value.data
  } catch {
    return 'network'
  }
}
export const useUserStore = defineStore({
  id: 'user',
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
      const res = await useApi(Auth.signIn, [userName, password], {
        onResponse
      })

      if (!res.data.value) return { ok: false, errors: ['Network Error'] }
      const data = res.data.value
      if ('success' in data) return { ok: false, errors: data.errors }

      this.updateUser(data.data)
      return { ok: true, user: data.data }
    },
    async signUp(
      email: string,
      userName: string,
      password: string,
      passwordConfirmation: string
    ) {
      const res = await useApi(
        Auth.signUp,
        [],
        {
          onResponse
        },
        {
          email,
          name: userName,
          password,
          passwordConfirmation
        }
      )

      console.log(res)
      let data = res.data.value
      if (!data) data = res.error.value?.data

      if (!data) return { ok: false, errors: ['Network Error'] }
      if ('errors' in data) {
        return { ok: false, errors: data.errors.fullMessages }
      }

      this.updateUser(data.data)
      return { ok: true, user: data.data }
    },
    async signOut() {
      if (!this.user) return
      await useApi(Auth.signOut, [])
      this.updateUser(null)
      const cookie = useCookie(AUTH_COOKIE_NAME)
      cookie.value = null
    },
    updateUser(user: AuthUser | null) {
      // if (user) localStorage.setItem('user', JSON.stringify(user))
      // else localStorage.removeItem('user')
      this.user = user
    }
  }
})
