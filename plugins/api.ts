import { initializeApi } from '../utils/api'
import apis from '~~/apis'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin(async (nuxt) => {
  initializeApi(apis(nuxt.$pinia as Pinia))
  return {
    provide: {
      apis
    }
  }
})
