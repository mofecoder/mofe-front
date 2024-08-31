import type { MaybeRef } from 'vue'
import type { Api, ArgsType } from '~/types/api'
import useHttp from '~/composables/useHttp'
import type { UseFetchOptions } from '#app'

function useApi<
  ResT,
  U extends ArgsType,
  V extends RequestInit['body'] | Record<string, any>,
  DataT = ResT
>(
  api: Api<ResT, U, V>,
  args: MaybeRef<U> | (() => U),
  options: UseFetchOptions<ResT, DataT> = {},
  body?: V
) {
  const apiOption = api.options(toValue(args))
  const path = computed(() => api.$path(toValue(args)))
  return useHttp<ResT, DataT>(path, {
    method: api.method,
    body: body,
    ...apiOption,
    ...options
  })
}

export default useApi
