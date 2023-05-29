import { Api, ArgsType } from '~/types/api'
import useHttp from '~/composables/useHttp'
import { UseFetchOptions } from '#app'
import defu from 'defu'

function useApi<T, U extends ArgsType>(
  api: Api<T, U>,
  args: U,
  options: UseFetchOptions<any> = {}
) {
  return useHttp<T>(api.$path(args), defu(options, { method: api.method }))
}

export default useApi
