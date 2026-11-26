// Next.js 16's own flat configs, as node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md shows them. The earlier
// FlatCompat wrapper around 'next/core-web-vitals' stopped ESLint with "Converting circular structure to JSON", so the rules had never
// run on this code; the settings below say which of them describe a choice of this codebase rather than a fault (docs/MODERNIZATION-2026-11.md).
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The calculation engines are plain CommonJS (src/**); the pages and server actions require them on purpose.
      '@typescript-eslint/no-require-imports': 'off',
      // The engines' results are untyped JSON: `any` at those seams is shown, not failed, so new code can do better.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Tamil and English text in JSX holds quotes and apostrophes as text, and React renders them as written.
      'react/no-unescaped-entities': 'off',
      // The React Compiler checks of eslint-plugin-react-hooks 6, newer than the pages they look at: shown, not failed.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
  {
    // The many `eslint-disable-next-line @typescript-eslint/no-var-requires` comments name a rule typescript-eslint has since renamed.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
  },
  globalIgnores([
    // eslint-config-next's own defaults
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // as before: the engines and their tests are plain CommonJS checked by the test suite, not by the React rules
    'node_modules/**',
    'src/**',
    'test-*.js',
  ]),
]);

export default eslintConfig;
