module.exports = {
    "extends": "eslint:recommended",
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "globals": {
        document: true,
        window: true
    },
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "rules": {
        "semi": 2
    }
};