import type { AuthUser } from '~/types/AuthUser'

// devise_token_auth の成功レスポンス
export type AuthResponse = { success?: true; data: AuthUser }
// devise_token_auth の失敗レスポンス (/auth/* のみ。統一エラー形式の対象外)
export type AuthErrorResponse = {
  success?: false
  errors: string[] | { fullMessages: string[]; [field: string]: string[] }
}

export const authApi = () => {
  const api = useNuxtApp().$api
  return {
    signIn: (body: { name: string; password: string }) =>
      api<AuthResponse>('/auth/sign_in', { method: 'POST', body }),
    validateToken: () =>
      api<AuthResponse>('/auth/validate_token', {
        headers: { accept: '*/*' }
      }),
    signUp: (body: {
      name: string
      email: string
      password: string
      passwordConfirmation: string
    }) => api<AuthResponse>('/auth', { method: 'POST', body }),
    signOut: () => api<unknown>('/auth/sign_out', { method: 'DELETE' }),
    updateUser: (id: number, body: { atcoderId: string | null; name: string }) =>
      api<unknown>(`/users/${id}`, { method: 'PUT', body }),
    resetPasswordRequest: (body: { email: string; redirectUrl: string }) =>
      api<{ message: string }>('/auth/password', { method: 'POST', body }),
    resetPassword: (body: {
      user: {
        resetPasswordToken: string
        password: string
        passwordConfirmation: string
      }
    }) => api<{ message: string }>('/auth/password', { method: 'PUT', body })
  }
}
