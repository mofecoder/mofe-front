import type { UseFetchOptions } from '#app'
import type { ApiVersion } from '#shared/types'

/* eslint-disable @typescript-eslint/no-explicit-any */

export type Methods = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'
export type ArgsType = any[] | Record<string, any>

export class Api<
  T,
  U extends ArgsType = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  V extends RequestInit['body'] | Record<string, any> = undefined
> {
  $path: (params: U) => string
  method: Methods
  version: ApiVersion = 'v1'
  options: (params: U) => UseFetchOptions<any>

  constructor(
    apiVersion: ApiVersion = 'v1',
    path: string | ((params: U) => string),
    method: Methods = 'GET',
    options?: UseFetchOptions<any> | ((params: U) => UseFetchOptions<any>)
  ) {
    this.version = apiVersion
    this.$path = typeof path === 'string'
      ? () => `${this.version}${path}`
      : (args) => `${this.version}${path(args)}`
    this.method = method
    if (options) {
      this.options = typeof options === 'function' ? options : () => options
    } else {
      this.options = () => ({})
    }
  }

  get POST() {
    return new Api<T, U>(this.version, this.$path, 'POST', this.options)
  }

  get GET() {
    return new Api<T, U>(this.version, this.$path, 'GET', this.options)
  }

  get PUT() {
    return new Api<T, U>(this.version, this.$path, 'PUT', this.options)
  }

  get PATCH() {
    return new Api<T, U>(this.version, this.$path, 'PATCH', this.options)
  }

  get DELETE() {
    return new Api<T, U>(this.version, this.$path, 'DELETE', this.options)
  }
}
