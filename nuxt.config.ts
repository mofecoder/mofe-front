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
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/eslint-module'],
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
      apiBase: process.env.API_BASE
    }
  }
})

export default nuxtConfig
