import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
    },
    pageTransition: {
      mode: 'out-in',
      name: 'page',
    },
  },
  compatibilityDate: '2025-07-15',
  components: {
    dirs: [],
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  eslint: {
    checker: true,
  },
  hooks: {
    ['prepare:types']: (options) => {
      if (options.tsConfig.compilerOptions?.paths) {
        // nuxtのデフォルトのaliasを一部無効化
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        delete options.tsConfig.compilerOptions.paths['@']
        delete options.tsConfig.compilerOptions.paths['@/*']
        // delete options.tsConfig.compilerOptions.paths['~~']
        // delete options.tsConfig.compilerOptions.paths['~~/*']
        delete options.tsConfig.compilerOptions.paths['@@']
        delete options.tsConfig.compilerOptions.paths['@@/*']
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */
      }
    },
  },
  imports: {
    // autoImport: false,
    dirs: [],
    scan: false,
  },
  modules: ['nitro-cloudflare-dev', '@nuxt/eslint', '@nuxtjs/sitemap'],
  nitro: {
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    preset: 'cloudflare_module',
    scanDirs: [],
  },
  pages: true,
  ssr: false,
  telemetry: {
    enabled: false,
  },
  // typescript: {
  //   typeCheck: true,
  // },
  vite: {
    optimizeDeps: {
      entries: [
        'pages/**/*.vue',
        'layouts/**/*.vue',
        'components/**/*.vue',
        'app.vue',
        'error.vue',
      ],
    },
    plugins: [
      tailwindcss(),
    ],
  },
})
