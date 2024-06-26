module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@nuxt/eslint-config',
    'plugin:vuetify/base',
    '@vue/prettier',
  ],
  plugins: ['vue', '@typescript-eslint', 'import'],
  // add your custom rules here
  rules: {
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
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-indent': 'off',
    'vue/no-v-html': 'off',
    'vue/valid-v-slot': 'off',
    'unicorn/number-literal-case': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vuetify/no-deprecated-props': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    'import/order': 'warn'
  }
}
