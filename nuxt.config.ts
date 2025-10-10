import tailwindcss from '@tailwindcss/vite'

const description = '予算内でほっともっとのメニューをランダムに提案するガチャです。'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        {
          content: description,
          name: 'description',
        },
        {
          content: 'summary',
          name: 'twitter:card',
        },
        {
          content: '@tmprar',
          name: 'twitter:site',
        },
        {
          content: '@tmprar',
          name: 'twitter:creator',
        },
        {
          content: description,
          property: 'twitter:description',
        },
        {
          content: '',
          property: 'twitter:image',
        },
        {
          content: 'https://tmprar.github.io/hottomotto-gacha',
          property: 'og:url',
        },
        {
          content: 'ほっともっと 800円ガチャ',
          property: 'og:title',
        },
        {
          content: description,
          property: 'og:description',
        },
        {
          content: '',
          property: 'og:image',
        },
      ],
      title: 'ほっともっと 800円ガチャ',
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
  site: {
    trailingSlash: true,
  },
  sitemap: {
    credits: false,
    xsl: false,
  },
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
