import { Api } from '~/types/api'
import { AuthUser } from '~/types/AuthUser'

type AuthResponse<
  SuccessType extends true | undefined = undefined,
  ErrorsType = string[]
> =
  | {
      success: false
      errors: ErrorsType
    }
  | ({ data: AuthUser } & (SuccessType extends undefined
      ? {}
      : { success: true }))

const signIn = new Api<AuthResponse, [string, string]>(
  '/auth/sign_in',
  'POST',
  ([userName, password]) => ({
    body: { name: userName, password }
  })
)

const validateToken = new Api<AuthResponse<true>>(
  '/auth/validate_token',
  'GET',
  () => ({
    headers: {
      accept: '*/*'
    }
  })
)

const updateUser = new Api<
  void,
  [number],
  {
    atcoderId: string | null
    name: string
  }
>(([id]) => `/users/${id}`, 'PUT')

const signUp = new Api<
  AuthResponse<
    undefined,
    {
      [_: string]: string[]
      fullMessages: string[]
    }
  >,
  [],
  {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
>('/auth', 'POST')

const signOut = new Api<void, []>('/auth/sign_out', 'DELETE')

const resetPasswordRequest = new Api<
  { message: string },
  [],
  {
    email: string
    redirectUrl: string
  }
>('/auth/password', 'POST')

const resetPassword = new Api<
  { message: string },
  [],
  {
    user: {
      resetPasswordToken: string
      password: string
      passwordConfirmation: string
    }
  }
>('/auth/password', 'PUT')

export default {
  signIn,
  validateToken,
  updateUser,
  signOut,
  signUp,
  resetPasswordRequest,
  resetPassword
}
