// import vuetify from 'eslint-plugin-vuetify'
import stylistic from '@stylistic/eslint-plugin'
import withNuxt from './.nuxt/eslint.config.mjs'

/** @type {import('eslint').Linter.Config[]} */
export default withNuxt([
  // ...vuetify.configs['flat/base'],
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
    commaDangle: 'never'
  }),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/valid-v-slot': 'off'
      /*
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],

      curly: 'off',
      'arrow-parens': 'off',
      indent: 'off',
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/no-v-html': 'off',
      'unicorn/number-literal-case': 'off',
      'no-console': 'off',
      'vuetify/no-deprecated-props': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'import/order': 'warn'
      */
    }
  }
])
