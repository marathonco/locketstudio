module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': ['warn', {
      allow: ['warn', 'error']
    }],
    'space-before-function-paren': 'off',
    'arrow-parens': 'off',
    'vue/multiline-html-element-content-newline': ['error', {
      'ignoreWhenEmpty': true,
      'ignores': ['pre', 'textarea', 'nuxt-link'],
      'allowEmptyLines': false
    }]
  }
}
