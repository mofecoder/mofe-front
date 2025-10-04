import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import DayJsAdapter from '@date-io/dayjs'
import { ja } from 'vuetify/locale'
import { md3 } from 'vuetify/blueprints'
import dayJsJa from 'dayjs/locale/ja'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    blueprint: md3,
    date: {
      adapter: DayJsAdapter,
      locale: { dayJsJa }
    },
    locale: {
      locale: 'ja',
      messages: { ja }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
