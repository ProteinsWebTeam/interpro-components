const PROD = process.env.NODE_ENV === 'production';

const rules = {
  'no-console': ['off'],
};

if (!PROD) {
  rules['no-debugger'] = ['off'];
}

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  extends: ['eslint:recommended', 'prettier'],
  rules,
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    customElements: false,
  },
};
