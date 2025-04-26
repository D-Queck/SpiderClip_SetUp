// .eslintrc.cjs
module.exports = {
    root: true,                    // stop ESLint from looking up the folder structure
    env: {
      browser: true,               // Browser-Globals wie `window`
      node: true,                  // Node-Globals wie `process`
      es2021: true,                // moderne ECMAScript-Syntax
    },
    parserOptions: {
      ecmaVersion: 'latest',       // moderne JS-Features
      sourceType: 'module',        // import/export
    },
    extends: [
      'eslint:recommended',        // Basisset an Regeln
    ],
    rules: {
      // hier kannst du projekt­spezifische Regeln überschreiben
      // z.B. "no-console": "warn"
    },
  };
  