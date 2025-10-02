import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importNewlines from 'eslint-plugin-import-newlines'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

import withNuxt from './.nuxt/eslint.config.mjs'

const recommended = [
  eslint.configs.recommended,
  eslintPluginUnicorn.configs['recommended'],
  perfectionist.configs['recommended-natural'],
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    rules: {
      ['array-callback-return']: 'error',
      ['block-scoped-var']: 'error',
      ['class-methods-use-this']: 'error',
      ['curly']: ['error', 'multi-line', 'consistent'],
      ['default-case']: 'error',
      ['default-case-last']: 'error',
      ['default-param-last']: 'error',
      ['func-style']: ['error', 'declaration', { allowArrowFunctions: true }],
      ['guard-for-in']: 'error',
      ['no-await-in-loop']: 'error',
      ['no-caller']: 'error',
      ['no-console']: ['error', { allow: ['warn', 'error'] }],
      ['no-div-regex']: 'error',
      ['no-else-return']: ['error', { allowElseIf: false }],
      ['no-eval']: 'error',
      ['no-extend-native']: 'error',
      ['no-extra-bind']: 'error',
      ['no-extra-label']: 'error',
      ['no-fallthrough']: [
        'error',
        {
          allowEmptyCase: true,
        },
      ],
      ['no-implicit-coercion']: ['error', { boolean: true }],
      ['no-implicit-globals']: 'error',
      ['no-implied-eval']: 'error',
      ['no-inner-declarations']: 'error',
      ['no-invalid-this']: 'error',
      ['no-iterator']: 'error',
      ['no-lone-blocks']: 'error',
      ['no-lonely-if']: 'error',
      ['no-multi-str']: 'error',
      ['no-new']: 'error',
      ['no-new-func']: 'error',
      ['no-new-wrappers']: 'error',
      ['no-octal-escape']: 'error',
      ['no-proto']: 'error',
      ['no-restricted-globals']: ['error', 'event', 'fdescribe'],
      ['no-script-url']: 'error',
      ['no-self-compare']: 'error',
      ['no-sequences']: ['error', { allowInParentheses: true }],
      ['no-throw-literal']: 'error',
      ['no-unmodified-loop-condition']: 'error',
      ['no-unused-expressions']: 'error',
      ['no-useless-call']: 'error',
      ['no-useless-concat']: 'error',
      ['no-useless-return']: 'error',
      ['no-var']: 'error',
      ['object-shorthand']: ['error', 'always'],
      ['perfectionist/sort-imports']: [
        'error',
        {
          fallbackSort: {
            order: 'asc',
            type: 'line-length',
          },
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      ['perfectionist/sort-object-types']: [
        'error',
        {
          fallbackSort: {
            order: 'asc',
            type: 'line-length',
          },
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      ['perfectionist/sort-objects']: [
        'error',
        {
          fallbackSort: {
            order: 'asc',
            type: 'line-length',
          },
          order: 'asc',
          type: 'alphabetical',
        },
      ],
      ['prefer-const']: 'error',
      ['prefer-promise-reject-errors']: 'error',
      ['prefer-rest-params']: 'error',
      ['prefer-spread']: 'error',
      ['prefer-template']: 'error',
      ['radix']: 'error',
      // アロー関数を定義するスコープを内部に定義したい場合もあるので無効化
      ['unicorn/consistent-function-scoping']: 'off',
      ['unicorn/filename-case']: [
        'error',
        {
          cases: {
            camelCase: false,
            kebabCase: true,
            pascalCase: false,
            snakeCase: false,
          },
          multipleFileExtensions: false,
        },
      ],
      // arrayメソッド以外の場合でも引っかかるため無効化
      ['unicorn/no-array-callback-reference']: 'off',
      ['unicorn/no-array-method-this-argument']: 'off',
      ['unicorn/no-array-reduce']: 'off',
      ['unicorn/no-null']: 'off',
      ['unicorn/no-process-exit']: 'off',
      ['unicorn/numeric-separators-style']: 'off',
      ['unicorn/prefer-top-level-await']: 'off',
      ['unicorn/prevent-abbreviations']: 'off',
      ['yoda']: 'error',
    },
  },
]

const recommendedTs = [
  ...tseslint.configs.strictTypeChecked,
  {
    rules: {
      ['@typescript-eslint/naming-convention']: [
        'error',
        {
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
          selector: 'variable',
        },
        {
          format: ['strictCamelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          modifiers: ['const'],
          selector: 'variable',
        },
        {
          format: ['strictCamelCase', 'StrictPascalCase'],
          leadingUnderscore: 'allow',
          selector: 'function',
        },
        {
          format: ['strictCamelCase'],
          selector: 'accessor',
        },
        {
          format: ['strictCamelCase'],
          selector: 'property',
        },
        {
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
          selector: 'parameter',
        },
        {
          format: ['StrictPascalCase'],
          prefix: ['T'],
          selector: 'typeAlias',
        },
        {
          format: ['StrictPascalCase'],
          selector: 'class',
        },
        {
          format: ['StrictPascalCase'],
          prefix: ['I'],
          selector: 'interface',
        },
      ],
      ['@typescript-eslint/no-empty-object-type']: [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
      ['@typescript-eslint/no-import-type-side-effects']: 'error',
      ['@typescript-eslint/no-misused-promises']: [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      ['@typescript-eslint/no-non-null-assertion']: 'error',
      ['@typescript-eslint/no-unnecessary-condition']: [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      ['@typescript-eslint/no-unnecessary-type-parameters']: 'off',
      ['@typescript-eslint/promise-function-async']: 'error',
      ['@typescript-eslint/return-await']: ['error', 'always'],
    },
  },
]

const recommendedStylistic = [
  {
    plugins: {
      ['@stylistic']: stylistic,
      ['import-newlines']: importNewlines,
    },
  },
  stylistic.configs.customize({
    commaDangle: 'always-multiline',
    indent: 2,
    jsx: false,
    quotes: 'single',
    semi: false,
  }),
  {
    rules: {
      ['@stylistic/array-bracket-spacing']: ['error', 'never'],
      ['@stylistic/arrow-spacing']: ['error', {
        after: true,
        before: true,
      }],
      ['@stylistic/block-spacing']: ['error', 'always'],
      ['@stylistic/brace-style']: ['error', '1tbs', { allowSingleLine: true }],
      ['@stylistic/comma-spacing']: ['error', {
        after: true,
        before: false,
      }],
      ['@stylistic/dot-location']: ['error', 'property'],
      ['@stylistic/eol-last']: ['error', 'always'],
      ['@stylistic/function-call-spacing']: ['error', 'never'],
      ['@stylistic/key-spacing']: [
        'error',
        {
          afterColon: true,
          beforeColon: false,
        },
      ],
      ['@stylistic/lines-around-comment']: 'off',
      ['@stylistic/no-extra-parens']: 'error',
      ['@stylistic/no-extra-semi']: 'error',
      ['@stylistic/no-floating-decimal']: 'error',
      ['@stylistic/no-multi-spaces']: 'error',
      // "@stylistic/jsx-quotes": ["error", "prefer-double"],
      ['@stylistic/no-multiple-empty-lines']: [
        'error',
        {
          max: 1,
          ['maxEOF']: 1,
        },
      ],
      ['@stylistic/object-curly-newline']: [
        'error',
        {
          ['ExportDeclaration']: {
            consistent: true,
            minProperties: 2,
            multiline: true,
          },
          // ['ObjectPattern']: {
          //   minProperties: 2,
          //   multiline: true,
          //   consistent: true,
          // },
          ['ImportDeclaration']: {
            consistent: true,
            minProperties: 2,
            multiline: true,
          },
          ['ObjectExpression']: {
            consistent: true,
            minProperties: 2,
            multiline: true,
          },
          ['TSInterfaceBody']: {
            consistent: true,
            minProperties: 2,
            multiline: true,
          },
          ['TSTypeLiteral']: {
            consistent: true,
            minProperties: 2,
            multiline: true,
          },
        },
      ],
      ['@stylistic/object-curly-spacing']: ['error', 'always'],
      ['@stylistic/object-property-newline']: [
        'error',
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],
      ['@stylistic/padding-line-between-statements']: [
        'error',
        {
          blankLine: 'always',
          next: 'return',
          prev: '*',
        },
        {
          blankLine: 'always',
          next: '*',
          prev: ['const', 'let', 'var'],
        },
        {
          blankLine: 'any',
          next: ['const', 'let', 'var'],
          prev: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          next: '*',
          prev: 'directive',
        },
        {
          blankLine: 'any',
          next: 'directive',
          prev: 'directive',
        },
        {
          blankLine: 'any',
          next: '*',
          prev: ['case', 'default'],
        },
      ],
      ['@stylistic/quotes']: ['error', 'single', { allowTemplateLiterals: 'avoidEscape' }],
      ['@stylistic/space-before-blocks']: ['error', 'always'],
      ['@stylistic/space-before-function-paren']: [
        'error',
        {
          anonymous: 'always',
          asyncArrow: 'always',
          named: 'never',
        },
      ],
      ['@stylistic/space-in-parens']: ['error', 'never'],
      ['@stylistic/spaced-comment']: [
        'error',
        'always',
        {
          exceptions: ['-', '+'],
          markers: ['/'],
        },
      ],
      ['@stylistic/switch-colon-spacing']: [
        'error',
        {
          after: true,
          before: false,
        },
      ],
      ['@stylistic/template-curly-spacing']: ['error', 'never'],
      ['@stylistic/wrap-iife']: ['error', 'inside'],
      ['import-newlines/enforce']: ['error', {
        items: 1,
        semi: false,
      }],
    },
  },
]

export default withNuxt().prepend(
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/.nuxt',
      '**/.output',
      'assets',
      '**/*.d.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        projectService: {
          allowDefaultProject: [
            'scripts/migrate.ts',
            'drizzle.config.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        project: true,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...recommended,
  ...recommendedStylistic,
  ...recommendedTs.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.vue'],
  })),
).append(
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: ['eslint.config.mjs'],
    plugins: {
      ['no-relative-import-paths']: noRelativeImportPaths,
    },
    rules: {
      ['no-relative-import-paths/no-relative-import-paths']: ['error', {
        allowSameFolder: false,
        prefix: '~',
      }],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      ['vue/attributes-order']: ['error', {
        alphabetical: true,
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
      }],
      ['vue/block-lang']: [
        'error',
        {
          script: {
            lang: 'ts',
          },
        },
      ],
      ['vue/block-order']: ['error', {
        order: ['script', 'template', 'style'],
      }],
      ['vue/block-tag-newline']: ['error', {
        maxEmptyLines: 0,
        multiline: 'always',
        singleline: 'always',
      }],
      ['vue/component-api-style']: ['error', ['script-setup']],
      ['vue/component-name-in-template-casing']: ['error', 'PascalCase', {}],
      ['vue/component-options-name-casing']: ['error', 'kebab-case'],
      ['vue/custom-event-name-casing']: ['error', 'camelCase', {}],
      ['vue/define-emits-declaration']: ['error', 'type-based'],
      ['vue/define-macros-order']: ['error', {
        defineExposeLast: true,
        order: ['defineProps', 'defineEmits'],
      }],
      ['vue/define-props-declaration']: ['error', 'type-based'],
      ['vue/enforce-style-attribute']: ['error', { allow: ['scoped'] }],
      ['vue/html-button-has-type']: ['error', {}],
      ['vue/html-comment-content-newline']: ['error', {
        multiline: 'always',
        singleline: 'never',
      }, {}],
      ['vue/html-comment-content-spacing']: ['error', 'always', {}],
      ['vue/html-comment-indent']: ['error', 2],
      ['vue/multi-word-component-names']: 'off',
      ['vue/no-duplicate-attr-inheritance']: ['error', {
        checkMultiRootNodes: true,
      }],
      ['vue/no-empty-component-block']: 'error',
      ['vue/no-import-compiler-macros']: 'error',
      ['vue/no-lone-template']: ['error', {
        ignoreAccessible: true,
      }],
      ['vue/no-multiple-objects-in-class']: 'error',
      ['vue/no-required-prop-with-default']: ['error', {
        autofix: true,
      }],
      ['vue/no-restricted-block']: ['error', 'style'],
      ['vue/no-restricted-html-elements']: ['error', 'button'],
      ['vue/no-root-v-if']: 'error',
      ['vue/no-template-target-blank']: ['error', { allowReferrer: false }],
      ['vue/no-v-text']: 'error',
      ['vue/padding-line-between-blocks']: ['error', 'always'],
      ['vue/prefer-define-options']: 'error',
      ['vue/prefer-use-template-ref']: 'error',
      ['vue/require-macro-variable-name']: ['error', {
        defineEmits: 'emit',
        defineProps: 'props',
        defineSlots: 'slots',
        useAttrs: 'attrs',
        useSlots: 'slots',
      }],
      ['vue/slot-name-casing']: ['error', 'camelCase'],
      ['vue/v-bind-style']: ['error', 'shorthand', { sameNameShorthand: 'never' }],
      // ['vue/static-class-names-order']: 'error',
      ['vue/v-for-delimiter-style']: ['error', 'in'],
      ['vue/v-on-event-hyphenation']: ['error', 'always', {
        autofix: true,
      }],
      ['vue/v-on-handler-style']: ['error', 'inline', {
        ignoreIncludesComment: false,
      }],
      ['vue/v-on-style']: ['error', 'shorthand'],
      ['vue/v-slot-style']: ['error', {
        atComponent: 'shorthand',
        default: 'shorthand',
        named: 'shorthand',
      }],
    },
  },
)

