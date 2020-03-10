import { httpPost } from '../utils/axios'

interface AuthUser {
  id: number
  email: string
  name: string
  provider: string
  uid: string
  allowPasswordChange: boolean
  role: string
}
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
}
