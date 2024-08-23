import defu from 'defu'
import type { MaybeRef } from 'vue'
import type { UseFetchOptions } from '#app'
import type AuthTokens from '~/types/AuthTokens'
import { useUserStore } from '~/store/user'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'
import { toCamelCase, toSnakeCase, log } from '~/utils/http'

const useHttp = async <ResT, DataT = ResT>(
  url: MaybeRef<string>,
  options: UseFetchOptions<ResT, DataT> = {}
) => {
  const oldAuth = useCookie<AuthTokens | null>('auth')
  const auth = useCookie<AuthTokens>(AUTH_COOKIE_NAME)
  const { client, accessToken, uid } = auth.value || oldAuth.value || {}
  if (oldAuth.value) {
    oldAuth.value = null
  }
  const headers: HeadersInit = {
    ...(client && accessToken && uid && { accessToken, client, uid })
  }
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const handleResponse: UseFetchOptions<ResT, DataT>['onResponse'] = (ctx) => {
    const res = ctx.response
    log(
      typeof ctx.request === 'string' ? '' : ctx.request.method,
      unref(url),
      res
    )
    res._data = toCamelCase(ctx.response._data)

    if (res.status === 401) {
      userStore.signOut()
      useCookie(AUTH_COOKIE_NAME).value = null
    }

    // if (isErrorCode(res.status)) {
    //   throw new HttpError(`HTTP Error (Response: ${res.status})`, res)
    // }
  }

  if (options.body && !(options.body instanceof FormData)) {
    options.body = toSnakeCase(options.body)
  }
  const defaults: UseFetchOptions<ResT, DataT> = {
    baseURL: config.public.apiBase,
    key: unref(url),
    headers: toSnakeCase(headers, true),
    method: 'GET',
    mode: 'cors',

    onResponse: handleResponse
  }

  watchEffect(() => {
    defaults.key = unref(url)
  })

  const onResponse = options.onResponse
  const nuxtLoading = useLoadingIndicator()
  options['onResponse'] = (ctx) => {
    handleResponse(ctx)

    if (onResponse) {
      if ('value' in onResponse) {
        if (onResponse.value) onResponse.value(ctx)
      } else {
        onResponse(ctx)
      }
    }
    nuxtLoading.finish()
  }
  nuxtLoading.start()
  return useFetch<ResT, DataT>(url, defu(options, defaults) as any)
}

export default useHttp as typeof useHttp
