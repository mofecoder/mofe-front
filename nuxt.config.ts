import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

const nuxtConfig = defineNuxtConfig({
  devServer: {
    port: 8000
  },
  devtools: { enabled: true },
  alias: {
    'katex/contrib/auto-render': 'katex/dist/contrib/auto-render.js',
    'codemirror/mode': 'codemirror/mode'
  },
  build: {
    transpile: [
      'vuetify',
      'codemirror/lib/codemirror.css',
      '@vuepic/vue-datepicker'
    ]
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(vuetify())
    }
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'dayjs-nuxt'
  ],
  vite: {
    ssr: {
      noExternal: ['vuetify']
    },
    define: {
      'process.env.DEBUG': false
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  },
  runtimeConfig: {
    privateKey: process.env.NUXT_PRIVATE_KEY,
    apiBaseUrl: process.env.NUXT_API_BASE_URL,
    secret: process.env.NUXT_SECRET,
    public: {
      authDomain: '',
      apiBase: '',
      gaTrackingId: '',
      firebaseAppId: '',
      firebaseApiKey: '',
      firebaseProjectId: ''
    }
  },
  routeRules: {
    '/privacy_policy': { prerender: true },
    // '/languages': { prerender: true },
    '/admin/**': { ssr: false },
    '/manage/**': { ssr: false },
    '/auth/login': { ssr: false },
    '/auth/callback/**': { ssr: false },
    '/firebase/login': { ssr: false }
  },
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-08-31',
  dayjs: {
    locales: ['ja'],
    defaultLocale: 'ja',
    plugins: ['duration']
  }
})

export default nuxtConfig
