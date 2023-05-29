import { FetchOptions } from 'ofetch'

export type Methods = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'
export type ArgsType = Array<string | number | undefined>

export class Api<T, U extends ArgsType = []> {
  $path: (params: U) => string
  method: Methods
  options: FetchOptions<any>
  constructor(
    path: string | ((params: U) => string),
    method: Methods = 'GET',
    options?: FetchOptions<any>
  ) {
    this.$path = typeof path === 'string' ? () => path : (args) => path(args)
    this.method = method
    this.options = options || {}
  }

  get POST() {
    return new Api<T, U>(this.$path, 'POST', this.options)
  }

  get GET() {
    return new Api<T, U>(this.$path, 'GET', this.options)
  }

  get PUT() {
    return new Api<T, U>(this.$path, 'PUT', this.options)
  }

  get PATCH() {
    return new Api<T, U>(this.$path, 'PATCH', this.options)
  }

  get DELETE() {
    return new Api<T, U>(this.$path, 'DELETE', this.options)
  }
}
