module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["eslint:recommended", "airbnb", "airbnb/hooks"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks"
  ],
  "rules": {
    "strict": 0,
    "indent": [
      "error",
      2,
      { "SwitchCase": 1 }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "arrow-parens": ["error", "as-needed"],
    "jsx-quotes": ["error", "prefer-single"],
    "space-before-function-paren": ["error", "always"],
    "no-console": "off",
    "react/prop-types": 0,
    "comma-dangle": ["error", "never"],
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 1,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  }
};
