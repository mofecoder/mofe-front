import { CafeCoderApi } from '~/apis'

// eslint-disable-next-line import/no-mutable-exports
let $api: CafeCoderApi

export function initializeApi(apiInstance: CafeCoderApi) {
  $api = apiInstance
}

export { $api }
