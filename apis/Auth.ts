import { httpDelete, httpPost, httpPut } from '~~/utils/axios'
import { AuthUser } from '~~/types/AuthUser'
import { useUserStore } from '~/store/user'
import { Pinia } from 'pinia'

type AuthResponse =
  | {
      success: false
      errors: string[]
    }
  | {
      success?: true
      data: AuthUser
    }

class Auth {
  constructor(app: Pinia) {
    this.userStore = useUserStore(app)
  }
  userStore: ReturnType<typeof useUserStore>

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
      this.userStore.updateUser(res.data)
    }
    return res
  }

  async signUp(
    email: string,
    userName: string,
    password: string,
    passwordConfirmation: string
  ) {
    const res = await httpPost<AuthResponse>(
      '/auth',
      {},
      {
        name: userName,
        email,
        password,
        passwordConfirmation
      }
    )
    if (res && 'data' in res) {
      this.userStore.updateUser(res.data)
    }
    return res
  }

  async resetPasswordRequest(email: string) {
    const res = await httpPost<{ message: string }>(
      '/auth/password',
      {},
      {
        email,
        redirectUrl: '/reset_password'
      }
    )
    return res
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ) {
    const res = await httpPut<{ message: string }>(
      '/auth/password',
      {},
      {
        user: {
          resetPasswordToken: token,
          password,
          passwordConfirmation
        }
      }
    )
    return res
  }

  async updateUser(
    userId: number,
    { atcoderId, name: userName }: { atcoderId: string | null; name: string }
  ) {
    await httpPut(
      `/users/${userId}`,
      {},
      { user: { atcoderId, name: userName } }
    )
  }

  async signOut() {
    const res = await httpDelete('/auth/sign_out')
    return res
  }
}

export default Auth
