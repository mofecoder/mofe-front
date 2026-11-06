import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import DayJsAdapter from '@date-io/dayjs'
import { ja } from 'vuetify/locale'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    // Vuetify 4 の既定は 'system' (OS 設定追従) に変わったため明示的に 'light' を指定する。
    // app.vue の prefers-color-scheme 追従は意図的に無効化されており、
    // styles/style.scss などが light 前提の色をハードコードしているため既定の追従は不可。
    theme: {
      defaultTheme: 'light'
    },
    components: {
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
