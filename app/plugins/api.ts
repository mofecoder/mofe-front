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
// $api は v1 (/api/)、$apiV4 は v4 (/v4/) を呼ぶ。処理は共通で baseURL だけが違う
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const dayjs = useDayjs()
  const loading = useLoadingIndicator()

  // 401 時に消すユーザー状態。フック内では inject が使えないので pinia を明示して先に取得する
  const userStore = useUserStore(nuxtApp.$pinia)

  // 認証 cookie の有効期限。トークンを保存する直前に更新する
  let authExpires: Date | undefined
  const authCookieOptions = { expires: () => authExpires }

  // ofetch のフックは await の後に呼ばれるため、Nuxt のコンテキストがなく composable を呼べない。
  // サーバーでは nuxtApp.runWithContext も Promise を返すので (unctx の callAsync が async)、
  // その中で useCookie しても値を同期的に読み書きできない。
  // プラグインはリクエストごとに実行されるので、サーバーでは初期化時に作った ref を使い回す。
  // クライアントでは store なども同じ cookie を別の ref で書き換えるので、呼ぶたびに作り直す。
  const serverAuthCookie = import.meta.server
    ? useCookie<AuthTokens | null>(AUTH_COOKIE_NAME, authCookieOptions)
    : null
  const serverOldAuthCookie = import.meta.server
    ? useCookie<AuthTokens | null>('auth')
    : null
  const authCookie = () =>
    serverAuthCookie ??
    useCookie<AuthTokens | null>(AUTH_COOKIE_NAME, authCookieOptions)
  const oldAuthCookie = () =>
    serverOldAuthCookie ?? useCookie<AuthTokens | null>('auth')

  const readAuthTokens = () => {
    const auth = authCookie()
    // 旧 cookie 名 (auth) からの移行
    const oldAuth = oldAuthCookie()
    const tokens = auth.value || oldAuth.value
    if (oldAuth.value) oldAuth.value = null
    return tokens
  }

  const createApi = (baseURL: string) => $fetch.create({
    baseURL,
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
        authExpires = dayjs.unix(authHeader.expiry).toDate()
        authCookie().value = authHeader
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
        userStore.updateUser(null)
        authCookie().value = null
      }
    }
  })

  const api = createApi(config.public.apiBase)
  const apiV4 = createApi(config.public.apiV4Base)

  return { provide: { api, apiV4 } }
})
