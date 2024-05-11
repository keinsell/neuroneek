// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: "tsconfig.lint.json",
                sourceType: "module",
                ecmaVersion: "latest",
                tsconfigRootDir: import.meta.dirname,
                // EXPERIMENTAL_useProjectService: true,
            },
        }
    },
    {
        files: ['**/*.js'],
        extends: [tseslint.configs.disableTypeChecked],
    },
);