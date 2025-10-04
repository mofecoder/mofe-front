import defu from 'defu'
import type { MaybeRef } from 'vue'
import type { FetchError } from 'ofetch'
import type { AvailableRouterMethod, NitroFetchRequest } from 'nitropack'
import type { UseFetchOptions } from '#app'
import { useUserStore } from '~/store/user'
import { toCamelCase, toSnakeCase, log } from '~/utils/http'
import type { FetchResult } from '#app/composables/fetch'

type ReqT = NitroFetchRequest
const useHttp = async <
  ResT,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  DataT = ResT extends void
    ? FetchResult<ReqT, AvailableRouterMethod<ReqT>>
    : ResT
>(
  url: MaybeRef<string>,
  options: UseFetchOptions<ResT, DataT> = {}
) => {
  const serverHeaders = useRequestHeaders(['cookie'])
  const headers: HeadersInit = {
    ...serverHeaders,
    accept: 'application/json'
  }
  const userStore = useUserStore()

  const handleResponse: UseFetchOptions<ResT, DataT>['onResponse'] = (ctx) => {
    const res = ctx.response
    log(
      (typeof ctx.request === 'string'
        ? ctx.options.method
        : ctx.request.method) || '',
      unref(url),
      res
    )
    res._data = toCamelCase(ctx.response._data)

    if (res.status === 401) {
      // TODO: 401
      userStore.signOut()
    }

    // if (isErrorCode(res.status)) {
    //   throw new HttpError(`HTTP Error (Response: ${res.status})`, res)
    // }
  }

  if (options.body && !(options.body instanceof FormData)) {
    options.body = toSnakeCase(options.body)
  }
  const defaults: UseFetchOptions<ResT, DataT> = {
    baseURL: '/api/proxy',
    key: unref(url),
    headers: toSnakeCase(headers, true),
    method: 'GET',
    mode: 'cors',

    onResponse: handleResponse
  }

  watchEffect(() => {
    defaults.key = unref(url)
  })

  const onResponse = options.onResponse
  const nuxtLoading = useLoadingIndicator()
  options['onResponse'] = (ctx) => {
    handleResponse(ctx)

    if (onResponse) {
      if ('value' in onResponse) {
        if (onResponse.value) onResponse.value(ctx)
      } else {
        onResponse(ctx)
      }
    }
    nuxtLoading.finish()
  }
  nuxtLoading.start()
  return useFetch<
    ResT,
    FetchError,
    NitroFetchRequest,
    AvailableRouterMethod<NitroFetchRequest>,
    DataT,
    DataT
  >(url, defu(options, defaults) as any) // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default useHttp as typeof useHttp
