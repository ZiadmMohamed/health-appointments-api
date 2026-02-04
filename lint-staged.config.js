module.exports = {
  // // Check all TypeScript files
  // '**/*.ts': [
  //   'npm run lint',
  //   'npm run test:related', // Run tests for changed files
  // ],
  // // Format all files
  // '**/*.{js,ts,json,md,yml,yaml}': ['prettier --write'],
  'apps/**/*.ts': ['eslint --fix', 'prettier --write'],
  'libs/**/*.ts': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml,css,scss}': ['prettier --write'],
};
