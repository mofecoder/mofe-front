import { Plugin } from '@nuxt/types'
import { initializeApi } from '../utils/api'
import apis from '~/apis'

const plugin: Plugin = (_, inject) => {
  inject('api', apis)
  initializeApi(apis)
}
export default plugin
