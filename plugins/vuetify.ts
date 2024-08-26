import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import DayJsAdapter from '@date-io/dayjs'
import { ja } from 'vuetify/locale'
import { VNumberInput } from 'vuetify/labs/components'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      VNumberInput,
      ...components
    },
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    date: {
      adapter: DayJsAdapter
    },
    locale: {
      locale: 'ja',
      messages: { ja }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
