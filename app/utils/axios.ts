import axios, { AxiosResponse } from 'axios'
import isArray from 'lodash.isarray'
import isObject from 'lodash.isobject'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'
import mapValues from 'lodash.mapvalues'
import mapKeys from 'lodash.mapkeys'
import { userStore } from '~/utils/store-accessor'

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

function toSnakeCase(data: any) {
  const callback = (_: any, key: any) => snakeCase(key)
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

function updateToken(header: any, data: any) {
  const client: string | undefined = header.client
  const accessToken: string | undefined = header.accessToken
  const uid: string | undefined = header.uid

  if (client && accessToken && uid) {
    localStorage.setItem('client', client)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('uid', uid)
    userStore.updateUser(data)
  }
}

async function httpGet<T>(
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  setToken(header)
  const res = await client.get(url, {
    headers: toSnakeCase(header),
    data: toSnakeCase(body)
  })
  log('GET', url, res)

  if (res.status === 401) throw new Error('Not logged in.')

  if (isErrorCode(res.status))
    throw new Error(`HTTP Error (Response: ${res.status})`)

  updateToken(toCamelCase(res.headers), toCamelCase(res.data.data))

  return toCamelCase(res.data) as T
}

async function httpPost<T>(
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  setToken(header)
  const res = await client.post(url, toSnakeCase(body), {
    headers: toSnakeCase(header)
  })
  log('POST', url, res)

  if (res.status === 401) throw new Error('Not logged in.')

  if (isErrorCode(res.status))
    throw new Error(`HTTP Error (Response: ${res.status})`)

  updateToken(toCamelCase(res.headers), toCamelCase(res.data.data))

  return toCamelCase(res.data) as T
}

export default client
export { httpGet, httpPost }
