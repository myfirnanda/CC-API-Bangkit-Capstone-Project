module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': 'google',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    'linebreak-style': 0,
    'new-cap': ['error', {capIsNewExceptions: ['ENUM']}],
    'new-cap': 'off',
    'camelcase': 'off',
  },
};
