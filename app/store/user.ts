import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { AuthUser } from '~/types/AuthUser'
import { httpGet } from '~/utils/axios'

interface UserState {
  user: AuthUser | null
}

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true
})
export default class UserModule extends VuexModule implements UserState {
  user: AuthUser | null = null

  get getUser(): AuthUser | null {
    const json = localStorage.getItem('user')
    return this.user || (json && JSON.parse(json))
  }

  get isAdmin() {
    return this.getUser?.role === 'admin'
  }

  @Action({ commit: 'updateUser' })
  async fetchUser() {
    try {
      const res = await httpGet<{
        success: boolean
        data?: AuthUser
      }>('/auth/validate_token', {
        accept: '*/*'
      })
      if (!res.success) return null
      return res.data
    } catch {
      return null
    }
  }

  @Mutation
  updateUser(user: AuthUser | null) {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
    this.user = user
  }
}
