// https://eslint.nuxt.com
import { createConfigForNuxt } from '@nuxt/eslint'

export default createConfigForNuxt({
  features: {
    stylistic: false,
  },
}).overrideRules({
  'no-console': 'off',
  'vue/multi-word-component-names': 'off',
  'vue/max-attributes-per-line': 'off',
  'vue/html-self-closing': 'off',
  'vue/no-mutating-props': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/multiline-html-element-content-newline': 'off',
})
