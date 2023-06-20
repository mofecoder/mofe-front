// @ts-ignore
// import colors from 'vuetify/es5/util/colors'
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

const nuxtConfig = defineNuxtConfig({
  devServer: {
    port: 8000
  },
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
   ** Global CSS
   */
  css: ['~/styles/style.scss', '~/styles/variables.scss'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/eslint-module'
    //   // Doc: https://axios.nuxtjs.org/usage
    //   '@nuxtjs/axios',
    //   // Doc: https://github.com/nuxt-community/dotenv-module
    //   '@nuxtjs/dotenv',
    // '@nuxtjs/markdownit',
    //   [
    //     '@nuxtjs/google-adsense',
    //     {
    //       id: process.env.ADSENSE_ID,
    //       pageLevelAds: true
    //     }
    //   ],
    //   '@nuxt/typescript-build',
    // [
    //   '@nuxtjs/google-analytics',
    //   {
    //     id: process.env.GA_TRACKING_ID
    //   }
    // ]
  ],
  // env: {
  //   API_BASE: process.env.API_BASE!
  // },
  vite: {
    ssr: {
      noExternal: ['vuetify']
    },
    define: {
      'process.env.DEBUG': false
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000/api/'
    }
  }
})
// nuxtConfig.vuetify = {
//   customVariables: ['~/assets/variables.scss'],
//   theme: {
//     dark: false,
//     themes: {
//       dark: {
//         primary: colors.blue.darken2,
//         accent: colors.grey.darken3,
//         secondary: colors.amber.darken3,
//         info: colors.teal.lighten1,
//         warning: colors.amber.base,
//         error: colors.deepOrange.accent4,
//         success: colors.green.accent3
//       }
//     }
//   }
// }
// nuxtConfig.markdownit = {
//   injected: true,
//   breaks: true,
//   html: true,
//   linkify: true,
//   typography: true
// }

export default nuxtConfig
