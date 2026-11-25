import type { FetchResponse } from 'ofetch'
import camelCase from 'lodash.camelcase'
import isObject from 'lodash.isobject'
import mapKeys from 'lodash.mapkeys'
import mapValues from 'lodash.mapvalues'
import snakeCase from 'lodash.snakecase'

// 戻り値は呼び出し側の代入先の都合で any のままにしている
function mapKeysDeep(
  data: unknown,
  callback: (_: unknown, key: string) => string
): any {
  if (Array.isArray(data)) {
    return data.map((innerData) => mapKeysDeep(innerData, callback))
  } else if (isObject(data)) {
    return mapValues(mapKeys(data, callback), (val) =>
      mapKeysDeep(val, callback)
    )
  } else {
    return data
  }
}

export function toCamelCase(data: any) {
  const callback = (_: unknown, key: string) => camelCase(key)
  return mapKeysDeep(data, callback)
}

export function toSnakeCase(data: any, header = false) {
  const callback = (_: unknown, key: string) => {
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
  if (!import.meta.client) return
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
