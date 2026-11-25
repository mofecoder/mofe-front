import type AuthTokens from '~/types/AuthTokens'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'
import { useUserStore } from '~/store/user'
import { log, toCamelCase, toSnakeCase } from '~/utils/http'

// レスポンスヘッダーから認証トークンを取り出す
function getAuthHeader(headers: Headers): AuthTokens | null {
  const client = headers.get('client')
  const accessToken = headers.get('access-token')
  const uid = headers.get('uid')
  const expiry = headers.get('expiry')
  if (!client || !accessToken || !uid || !expiry) return null
  return { client, accessToken, uid, expiry: parseInt(expiry) }
}

// JSON として扱うデータ (配列かプレーンなオブジェクト) か。FormData や Blob、ストリームは変換しない
function isJsonLike(data: unknown): boolean {
  if (Array.isArray(data)) return true
  if (data === null || typeof data !== 'object') return false
  const proto = Object.getPrototypeOf(data)
  return proto === Object.prototype || proto === null
}

// backend API 用の共通クライアント
// 認証ヘッダーの付与、キーのケース変換、トークンの更新、401 時のサインアウトをまとめて行う
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const dayjs = useDayjs()
  const loading = useLoadingIndicator()

  // フックは Nuxt のコンテキスト外で呼ばれることがあるため、composable はこの中で使う
  // (同期関数を渡すので戻り値は Promise にならない)
  const withContext = <T>(fn: () => T): T => nuxtApp.runWithContext(fn) as T

  const authCookie = (expires?: Date) =>
    withContext(() =>
      useCookie<AuthTokens | null>(AUTH_COOKIE_NAME, { expires })
    )

  const readAuthTokens = () =>
    withContext(() => {
      const auth = useCookie<AuthTokens | null>(AUTH_COOKIE_NAME)
      // 旧 cookie 名 (auth) からの移行
      const oldAuth = useCookie<AuthTokens | null>('auth')
      const tokens = auth.value || oldAuth.value
      if (oldAuth.value) oldAuth.value = null
      return tokens
    })

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    mode: 'cors',
    onRequest({ options }) {
      const tokens = readAuthTokens()
      if (tokens?.client && tokens.accessToken && tokens.uid) {
        options.headers.set('access-token', tokens.accessToken)
        options.headers.set('client', tokens.client)
        options.headers.set('uid', tokens.uid)
      }
      // query は変換しない (task[] などのキーが壊れるため。repository 側でワイヤー上のキーを書く)
      if (isJsonLike(options.body)) {
        options.body = toSnakeCase(options.body)
      }
      loading.start()
    },
    onResponse({ request, options, response }) {
      log(
        options.method || 'GET',
        typeof request === 'string' ? request : request.url,
        response
      )
      if (isJsonLike(response._data)) {
        response._data = toCamelCase(response._data)
      }

      // トークンが返ってきたら cookie を更新する
      const authHeader = getAuthHeader(response.headers)
      if (authHeader) {
        authCookie(dayjs.unix(authHeader.expiry).toDate()).value = authHeader
      }
      loading.finish()
    },
    onRequestError() {
      loading.finish()
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // トークンが無効なのでログイン状態を破棄する
        // (サインアウト API を呼ぶとそれも 401 になるため、状態と cookie だけを消す)
        withContext(() => useUserStore()).updateUser(null)
        authCookie().value = null
      }
    }
  })

  return { provide: { api } }
})
