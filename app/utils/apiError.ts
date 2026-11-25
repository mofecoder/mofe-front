import type { ApiError } from '~/types/apiError'

// FetchError と、useAsyncData の error (NuxtError) のどちらからも data / statusCode を読めるようにする
type ErrorLike = { data?: unknown; statusCode?: number; status?: number }

function asErrorLike(e: unknown): ErrorLike | null {
  return e !== null && typeof e === 'object' ? (e as ErrorLike) : null
}

// API のエラーレスポンス ({ error, details }) を取り出す
export function getApiError(e: unknown): ApiError | undefined {
  const data = asErrorLike(e)?.data
  return data !== null && typeof data === 'object'
    ? (data as ApiError)
    : undefined
}

// API のエラーからメッセージを取り出す。取り出せなければ fallback を返す
export function getErrorMessage(e: unknown, fallback: string): string {
  const message = getApiError(e)?.error
  return typeof message === 'string' && message ? message : fallback
}

// HTTP ステータスコードを取り出す (取り出せなければ undefined)
export function getErrorStatus(e: unknown): number | undefined {
  const err = asErrorLike(e)
  return err?.statusCode ?? err?.status
}
