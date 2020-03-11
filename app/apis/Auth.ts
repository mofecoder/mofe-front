import { httpPost } from '~/utils/axios'
import { AuthUser } from '~/types/AuthUser'

type AuthResponse =
  | {
      success: boolean
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
    return res
  }
}
