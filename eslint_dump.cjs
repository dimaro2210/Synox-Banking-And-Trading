const { ESLint } = require('eslint');

(async function main() {
  try {
    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfig: {
        parserOptions: {
          ecmaFeatures: { jsx: true },
          ecmaVersion: 2022,
          sourceType: "module"
        }
      }
    });

    const results = await eslint.lintFiles(['src/pages/LandingPage.jsx']);
    
    // Dump the exact problems
    console.log(JSON.stringify(results[0].messages, null, 2));
    
  } catch (error) {
    console.error("Linter error:", error);
  }
})();
