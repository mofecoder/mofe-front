import { CafeCoderApi } from '~~/apis'

let $api: CafeCoderApi

export function initializeApi(apiInstance: CafeCoderApi) {
  $api = apiInstance
}

export { $api }
