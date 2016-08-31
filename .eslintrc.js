module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  env: {
    'browser': true,
    'shared-node-browser': true,
    jquery: true
  },
  globals: {
    jsonuri: true,
  },
  rules: {
    'generator-star-spacing': 0,
    'no-implicit-globals': 2,
    'eol-last': 2,
    'no-var': 2,
    'strict': 0,
    'yoda': 0,
    'comma-dangle': 0,
    'spaced-comment': 0,
    'arrow-parens': 0,
    'space-before-function-paren': 0,
    'no-trailing-spaces': 0,
    'no-unused-vars': 0,
    'quotes': [2, 'single', {avoidEscape: true, allowTemplateLiterals: true}],
    'no-lone-blocks': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-alert': process.env.NODE_ENV === 'production' ? 2 : 0,
  }
}
