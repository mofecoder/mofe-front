import axios, { AxiosResponse } from 'axios'
import isArray from 'lodash.isarray'
import isObject from 'lodash.isobject'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'
import mapValues from 'lodash.mapvalues'
import mapKeys from 'lodash.mapkeys'

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

async function httpGet<T>(
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  const res = await client.get(url, {
    headers: toSnakeCase(header),
    data: toSnakeCase(body)
  })
  log('GET', url, res)

  if (isErrorCode(res.status))
    throw new Error(`HTTP Error (Response: ${res.status})`)

  return toCamelCase(res.data) as T
}

async function httpPost<T>(
  url: string,
  header: any = {},
  body: any = {}
): Promise<T> {
  const res = await client.post(url, {
    headers: toSnakeCase(header),
    data: toSnakeCase(body)
  })
  log('POST', url, res)

  if (isErrorCode(res.status))
    throw new Error(`HTTP Error (Response: ${res.status})`)

  return toCamelCase(res.data) as T
}

export default client
export { httpGet, httpPost }
