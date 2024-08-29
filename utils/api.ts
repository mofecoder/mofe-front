import type { ArgsType } from '~/types/api'
import type { Api } from '~/types/api'
import type { UseFetchOptions } from '#app'

export function api<
  ResT,
  Args extends ArgsType,
  Body extends RequestInit['body'] | Record<string, any>
>(
  api: Api<ResT, Args, Body>,
  args: MaybeRefOrGetter<Args>,
  options: Omit<UseFetchOptions<ResT>, 'method' | 'body'> = {},
  body?: Body
) {
  const apiOptions = api.options(toValue(args))
  const path = api.$path(toValue(args))
  return http<ResT>(path, {
    method: api.method,
    body,
    ...options,
    ...apiOptions
  })
}
