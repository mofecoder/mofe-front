import type { FetchResponse } from 'ofetch'
import type { MaybeRef } from 'vue'
import lodash from 'lodash'
import defu from 'defu'
import type { UseFetchOptions } from '#app'
import type AuthTokens from '~/types/AuthTokens'
import { AUTH_COOKIE_NAME } from '~/constants/cookies'
import { useUserStore } from '~/store/user'
const { camelCase, isArray, isObject, mapKeys, mapValues, snakeCase } = lodash

function mapKeysDeep(data: any, callback: (_: any, key: any) => string): any {
  if (isArray(data)) {
    return data.map((innerData: any) => mapKeysDeep(innerData, callback))
  } else if (isObject(data)) {
    return mapValues(mapKeys(data, callback), (val) =>
      mapKeysDeep(val, callback)
    )
  } else {
    return data
  }
}

export function toCamelCase(data: any) {
  const callback = (_: any, key: any) => camelCase(key)
  return mapKeysDeep(data, callback)
}

export function toSnakeCase(data: any, header = false) {
  const callback = (_: any, key: any) => {
    let k = snakeCase(key)
    if (header) k = k.replace('_', '-')
    return k
  }
  return mapKeysDeep(data, callback)
}

function color(responseCode: number) {
  if (responseCode < 200) return 'palegreen'
  if (responseCode < 400) return 'cyan'
  if (responseCode < 500) return 'orangered'
  return 'deeppink'
}

export function log<T>(method: string, url: string, res: FetchResponse<T>) {
  if (process.env.NODE_ENV === 'production') return
  if (!process.client) return
  console.log(
    `[Fetch] %c[${res.status} ${res.statusText}] %c${method} %c${url}\n%o`,
    `color: ${color(res.status)}; font-weight: bold`,
    'color: #F7DC6F; font-weight: bold',
    'color: #F7DC6F;',
    {
      headers: Object.fromEntries(res.headers.entries()),
      data: res._data
    }
  )
}

export class HttpError extends Error {
  constructor(message: string, response: FetchResponse<unknown>) {
    super(message)
    this.response = response
    this.response._data = toCamelCase(this.response._data)
    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      value: 'HttpError',
      writable: true
    })

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError)
    }

    Object.setPrototypeOf(this, new.target.prototype)
  }

  response: FetchResponse<any>
}

export function http<T>(
  url: MaybeRef<string>,
  options: UseFetchOptions<T> = {}
) {
  const auth = useCookie<AuthTokens>(AUTH_COOKIE_NAME)
  const { client, accessToken, uid } = auth.value || {}
  const headers: HeadersInit = {
    ...(client && accessToken && uid && { accessToken, client, uid })
  }
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const handleResponse: UseFetchOptions<T>['onResponse'] = async (ctx) => {
    const res = ctx.response
    log(
      typeof ctx.request === 'string' ? '' : ctx.request.method,
      unref(url),
      res
    )
    res._data = toCamelCase(ctx.response._data)

    if (res.status === 401) {
      await userStore.signOut()
      useCookie(AUTH_COOKIE_NAME).value = null
    }

    // if (isErrorCode(res.status)) {
    //   throw new HttpError(`HTTP Error (Response: ${res.status})`, res)
    // }
  }

  if (options.body && !(options.body instanceof FormData)) {
    options.body = toSnakeCase(options.body)
  }
  const defaults: UseFetchOptions<T> = {
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
  options['onResponse'] = (ctx) => {
    handleResponse(ctx)

    if (onResponse) {
      const onResponseValue = toValue(onResponse)
      onResponseValue(ctx)
    }
  }
  return $fetch<T>(unref(url), defu(options, defaults) as any)
}
