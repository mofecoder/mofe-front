// @ts-ignore
// import colors from 'vuetify/es5/util/colors'
import { defineNuxtConfig } from 'nuxt/config'

const nuxtConfig = defineNuxtConfig({
  devServer: {
    port: 8000
  },
  /*
   ** Customize the progress-bar color
   */
  // loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/styles/style.scss', '~/styles/variables.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/api.ts', '~/plugins/language.ts'],
  /*
   ** Nuxt.js dev-modules
   */
  // buildModules: [
  //   // Doc: https://github.com/nuxt-community/eslint-module
  //   '@nuxtjs/eslint-module',
  //   // Doc: https://github.com/nuxt-community/stylelint-module
  //   '@nuxtjs/stylelint-module',
  //   '@nuxtjs/vuetify',
  // ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt'
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
  ]
  // env: {
  //   API_BASE: process.env.API_BASE!
  // },
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
