const PROD = process.env.NODE_ENV === 'production';

const rules = {};

if (!PROD) {
  rules['no-debugger'] = ['off'];
}

module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  extends: ['prettier'],
  rules,
  env: {
    browser: true,
  },
  globals: {
    customElements: false,
  },
};
