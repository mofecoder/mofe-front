import {
  camelCase,
  isArray,
  isObject,
  mapKeys,
  mapValues,
  snakeCase
} from 'lodash'
import defu from 'defu'
import { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { FetchContext, FetchResponse } from 'ofetch'
import { UseFetchOptions } from '#app'
import { AxiosResponse } from 'axios'
import { Fetch } from 'openapi-typescript'

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
  console.log(
    `[Axios] %c[${res.status} ${res.statusText}] %c${method} %c${url}\n%o`,
    `color: ${color(res.status)}; font-weight: bold`,
    'color: #F7DC6F; font-weight: bold',
    'color: #F7DC6F;',
    res._data
  )
}

interface AuthState {
  client: string
  accessToken: string
  uid: string
}

const isErrorCode = (statusCode: number) => statusCode >= 400

const useHttp = async <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const auth = useState<AuthState | null>()
  const { client, accessToken, uid } = auth.value || {}
  const headers = {
    ...(client && accessToken && uid && { accessToken, client, uid })
  }
  const config = useRuntimeConfig()

  const handleResponse: UseFetchOptions<T>['onResponse'] = (ctx) => {
    const res = ctx.response
    log(typeof ctx.request === 'string' ? '' : ctx.request.method, url, res)
    res._data = toCamelCase(ctx.response._data)
    if (isErrorCode(res.status)) {
      throw new HttpError(`HTTP Error (Response: ${res.status})`, res)
    }
  }

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBase,
    key: url,
    headers: toSnakeCase(headers, true),
    method: 'GET',

    onResponse: handleResponse,
    onResponseError: handleResponse
  }

  return useFetch(url, defu(options, defaults))
}

export default useHttp as typeof useHttp
