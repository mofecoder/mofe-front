import { Plugin } from '@nuxt/types'
import { CafeCoderApi } from '../apis/types'
import apis from '~/apis'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $api: CafeCoderApi
  }
}

const plugin: Plugin = (_, inject) => inject('api', apis)
export default plugin
