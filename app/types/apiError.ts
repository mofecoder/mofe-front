import type { FetchError } from 'ofetch'

// backend の統一エラー形式: { error: string, details?: { [field]: string[] } }
export type ApiError = {
  error?: string
  details?: Record<string, string[]>
}

export type ApiFetchError = FetchError<ApiError>
