import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import isArray from 'lodash.isarray'
import isObject from 'lodash.isobject'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'
import mapValues from 'lodash.mapvalues'
import mapKeys from 'lodash.mapkeys'

export class HttpError extends Error {
  constructor(message: string, response: AxiosResponse) {
    super(message)
    this.response = response
    this.response.data = toCamelCase(this.response.data)
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

  response: AxiosResponse
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

function log(method: string, url: string, res: AxiosResponse) {
  if (process.env.NODE_ENV === 'production') return
  console.log(
    `[Axios] %c[${res.status} ${res.statusText}] %c${method} %c${url}\n%o`,
    `color: ${color(res.status)}; font-weight: bold`,
    'color: #F7DC6F; font-weight: bold',
    'color: #F7DC6F;',
    res
  )
}

const isErrorCode = (statusCode: number) => statusCode >= 400

const client = axios.create({
  baseURL: process.env.API_BASE,
  validateStatus: () => true
})

function setToken(header: any) {
  const client = localStorage.getItem('client')
  const accessToken = localStorage.getItem('accessToken')
  const uid = localStorage.getItem('uid')

  if (client && accessToken && uid) {
    header.client = client
    header.accessToken = accessToken
    header.uid = uid
  }
}

function updateToken(header: any) {
  const client: string | undefined = header.client
  const accessToken: string | undefined = header.accessToken
  const uid: string | undefined = header.uid

  if (client && accessToken && uid) {
    localStorage.setItem('client', client)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('uid', uid)
  }
}

async function http<T>(
  method: (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>,
  name: string,
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  setToken(header)
  if (!header.accept) header.accept = 'application/json'
  const res = await method(url, {
    headers: toSnakeCase(header, true),
    data: toSnakeCase(body)
  })
  log(name, url, res)

  if (res.status === 401) throw new Error('Not logged in.')

  updateToken(toCamelCase(res.headers))
  if (isErrorCode(res.status))
    throw new HttpError(`HTTP Error (Response: ${res.status})`, res)

  return toCamelCase(res.data) as T
}

async function httpWithData<T>(
  method: (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse>,
  name: string,
  url: string,
  header: any = {},
  body: any = {},
  formData = false,
  timeout?: number
): Promise<T> {
  setToken(header)
  if (!header.accept) header.accept = 'application/json'
  const data = typeof body === 'object' && !formData ? toSnakeCase(body) : body
  if (typeof body === 'string') header['content-type'] = 'text/plain'
  const res = await method(url, data, {
    headers: toSnakeCase(header, true),
    timeout
  })
  log(name, url, res)

  if (res.status === 401) throw new Error('Not logged in.')

  updateToken(toCamelCase(res.headers))
  if (isErrorCode(res.status))
    throw new HttpError(`HTTP Error (Response: ${res.status})`, res)

  return toCamelCase(res.data) as T
}

async function httpGet<T>(
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  const ret = await http<T>(client.get, 'GET', url, header, body)
  return ret
}

async function httpPost<T>(
  url: string,
  header: any = {},
  body: any = {},
  formData: boolean = false,
  timeout?: number
): Promise<T> {
  if (formData) header['content-type'] = 'multipart/form-data'

  const ret = await httpWithData<T>(
    client.post,
    'POST',
    url,
    header,
    body,
    formData,
    timeout
  )
  return ret
}

async function httpPut<T>(
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  const ret = await httpWithData<T>(client.put, 'PUT', url, header, body)
  return ret
}

async function httpPatch<T>(
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  const ret = await httpWithData<T>(client.patch, 'PATCH', url, header, body)
  return ret
}

async function httpDelete<T>(url: string, header: any = {}): Promise<T> {
  const ret = await http<T>(client.delete, 'DELETE', url, header)
  return ret
}

export default client
export { httpGet, httpPost, httpPut, httpPatch, httpDelete }
