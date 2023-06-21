import { UseFetchOptions } from '#app'

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
  options: (params: U) => UseFetchOptions<any>
  constructor(
    path: string | ((params: U) => string),
    method: Methods = 'GET',
    options?: UseFetchOptions<any> | ((params: U) => UseFetchOptions<any>)
  ) {
    this.$path = typeof path === 'string' ? () => path : (args) => path(args)
    this.method = method
    if (options) {
      this.options = typeof options === 'function' ? options : () => options
    } else {
      this.options = () => ({})
    }
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
