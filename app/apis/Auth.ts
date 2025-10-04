import { Api } from '~/types/api'
import type { AuthUser } from '~/types/AuthUser'

type AuthResponse<
  SuccessType extends true | undefined = undefined,
  ErrorsType = string[]
>
  = | {
    success: false
    errors: ErrorsType
  }
  | ({ data: AuthUser } & (SuccessType extends undefined
    ? object
    : { success: true }))

const signIn = new Api<AuthResponse, [string, string]>('v1',
  '/api/auth/sign_in',
  'POST',
  ([userName, password]) => ({
    body: { name: userName, password }
  })
)

const validateToken = new Api<AuthResponse<true>>('v1',
  '/api/auth/validate_token',
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
>('v1', ([id]) => `/api/users/${id}`, 'PUT')

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
>('v1', '/auth', 'POST')

const signOut = new Api<void, []>('v1', '/api/auth/sign_out', 'DELETE')

const resetPasswordRequest = new Api<
  { message: string },
  [],
  {
    email: string
    redirectUrl: string
  }
>('v1', '/auth/password', 'POST')

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
>('v1', '/auth/password', 'PUT')

export default {
  signIn,
  validateToken,
  updateUser,
  signOut,
  signUp,
  resetPasswordRequest,
  resetPassword
}
