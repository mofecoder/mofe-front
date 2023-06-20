import {
  camelCase,
  isArray,
  isObject,
  mapKeys,
  mapValues,
  snakeCase
} from 'lodash'
import defu from 'defu'
import { FetchResponse } from 'ofetch'
import { UseFetchOptions } from '#app'
import AuthTokens from '~/types/AuthTokens'
import { MaybeRef } from 'vue'
import { useUserStore } from '~/store/user'

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

function toCamelCase(data: any) {
  const callback = (_: any, key: any) => camelCase(key)
  return mapKeysDeep(data, callback)
}

function toSnakeCase(data: any, header = false) {
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

function log<T>(method: string, url: string, res: FetchResponse<T>) {
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

const isErrorCode = (statusCode: number) => statusCode >= 400

const useHttp = async <T>(
  url: MaybeRef<string>,
  options: UseFetchOptions<T> = {}
) => {
  const auth = useCookie<AuthTokens>('auth')
  const { client, accessToken, uid } = auth.value || {}
  const headers: HeadersInit = {
    ...(client && accessToken && uid && { accessToken, client, uid })
  }
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const handleResponse: UseFetchOptions<T>['onResponse'] = (ctx) => {
    const res = ctx.response
    log(
      typeof ctx.request === 'string' ? '' : ctx.request.method,
      unref(url),
      res
    )
    res._data = toCamelCase(ctx.response._data)

    if (res.status === 401) {
      userStore.signOut()
      useCookie('auth').value = null
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
      if ('value' in onResponse) {
        if (onResponse.value) onResponse.value(ctx)
      } else {
        onResponse(ctx)
      }
    }
  }
  return useFetch<T>(url, defu(options, defaults) as any)
}

export default useHttp as typeof useHttp
