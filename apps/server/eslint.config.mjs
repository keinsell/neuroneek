// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import {recommended as putoutRecommended} from 'eslint-plugin-putout/config'
import {recommended as diffRecommended} from 'eslint-plugin-diff'

// https://eslint.org/blog/2022/08/new-config-system-part-2/
export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
        ...putoutRecommended,
        ...diffRecommended,
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