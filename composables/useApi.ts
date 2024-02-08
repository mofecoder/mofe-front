import type { Api, ArgsType } from '~/types/api'
import useHttp from '~/composables/useHttp'
import type { UseFetchOptions } from '#app'
import type { MaybeRef } from 'vue'

function useApi<
  T,
  U extends ArgsType,
  V extends RequestInit['body'] | Record<string, any>
>(
  api: Api<T, U, V>,
  args: MaybeRef<U> | (() => U),
  options: UseFetchOptions<T> = {},
  body?: V
) {
  const apiOption = api.options(toValue(args))
  const path = computed(() => api.$path(toValue(args)))
  return useHttp<T>(path, {
    method: api.method,
    body: body,
    ...apiOption,
    ...options
  })
}

export default useApi
