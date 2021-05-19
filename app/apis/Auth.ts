import { httpDelete, httpPost, httpPut } from '~/utils/axios'
import { AuthUser } from '~/types/AuthUser'
import { userStore } from '~/utils/store-accessor'

type AuthResponse =
  | {
      success: false
      errors: string[]
    }
  | {
      success?: true
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
      userStore.updateUser(res.data)
    }
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
