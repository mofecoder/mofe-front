import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { AuthUser } from '~/types/AuthUser'

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

  @Mutation
  updateUser(user: AuthUser | null) {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
    this.user = user
  }
}
