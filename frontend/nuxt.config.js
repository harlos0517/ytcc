import FS from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

export default {
  ssr: false,

  dev: process.env.MODE !== 'production',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ytcc-frontend',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  server: {
    https: process.env.MODE === 'production' ? {
      key: FS.readFileSync(process.env.PRIVATE_KEY_PATH),
      cert: FS.readFileSync(process.env.CERTIFICATE_PATH),
    } : undefined,
    host: process.env.FRONTEND_HOST,
    port: process.env.FRONTEND_PORT,
  }, // default: 3000

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/vue-youtube/index.ts',
  ],

  router: { middleware: ['auth', 'api'] },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-analytics',
  ],

  styleResources: {
    sass: ['./assets/styles/*.sass'],
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
    credentials: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.node = {
        fs: 'empty',
      }
    },
  },

  publicRuntimeConfig: {
    mode: process.env.MODE,
    host: process.env.FRONTEND_URL,
    apiHost: process.env.BACKEND_URL,
    axios: {
      baseURL: process.env.BACKEND_URL,
    },
  },

  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
    debug: 'enabled',
  },

  target: 'static',
  
  generate: {
    dir: '../docs'
  }
}
