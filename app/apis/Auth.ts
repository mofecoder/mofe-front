import { httpPost } from '~/utils/axios'
import { AuthUser } from '~/types/AuthUser'
import { userStore } from '~/utils/store-accessor'

type AuthResponse =
  | {
      success: false
      errors: string[]
    }
  | {
      data: AuthUser
    }

export default class {
  async signIn(userName: string, password: string) {
    const res = await httpPost<AuthResponse>(
      '/auth/sign_in',
      {},
      {
        name: userName,
        password
      }
    )
    if (res && 'data' in res) {
      userStore.updateUser(res.data)
    }
    return res
  }

  async signUp(email: string, userName: string, password: string) {
    const res = await httpPost<AuthResponse>(
      '/auth',
      {},
      {
        name: userName,
        email,
        password
      }
    )
    if (res && 'data' in res) {
      userStore.updateUser(res.data)
    }
    return res
  }
}
