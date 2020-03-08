import axios from 'axios'
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

const client = axios.create({
  baseURL: process.env.API_BASE
})

async function httpGet<T>(url: string, header = {}, body = {}): Promise<T> {
  const res = await client.get(url, {
    headers: toSnakeCase(header),
    data: toSnakeCase(body)
  })
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[axios] %cResponse%c from ${url}: %o`,
      'color: #F7DC6F; font-weight: bold',
      'color: #F7DC6F;',
      res.data
    )
  }
  return toCamelCase(res.data) as T
}

export default client
export { httpGet }
