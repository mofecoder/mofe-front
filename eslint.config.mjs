// @ts-check

import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: {
      arrowParens: true,
      braceStyle: '1tbs',
      commaDangle: 'never'
    }
  }
}).override('nuxt/vue/rules', {
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/valid-v-slot': 'off'
  }
})
