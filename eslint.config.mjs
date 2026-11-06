// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    name: 'mofe/rules',
    rules: {
      // Vuetify のデータテーブルは v-slot:item.xxx が公式 API
      'vue/valid-v-slot': ['error', { allowModifiers: true }],
      // Markdown / KaTeX のレンダリングで意図的に使用している
      'vue/no-v-html': 'off',
      // Record<string, any> / UseFetchOptions<any> など慣用的な箇所が残るため警告に留める
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    // yos1up/scratch2cpp のフォーク。上流の JS をほぼそのまま移植しており型付けは別作業
    name: 'mofe/vendored',
    files: ['app/utils/scratch2cpp.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' }
  }
)
