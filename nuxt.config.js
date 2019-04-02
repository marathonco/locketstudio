const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: pkg.description
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
    src: '~/plugins/aos',
    ssr: false
  },
  {
    src: '~plugins/vee-validate.js',
    ssr: true
  },
  {
    src: '~plugins/vue-slider-component.js',
    ssr: false
  }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'nuxt-device-detect',
    'nuxt-polyfill',
    'nuxt-svg'
  ],

  polyfill: {
    features: [
      /*
            Feature without detect:

            Note:
              This is not recommended for most polyfills
              because the polyfill will always be loaded, parsed and executed.
        */
      {
        require: 'url-polyfill' // NPM package or require path of file
      },

      /*
            Feature with detect:

            Detection is better because the polyfill will not be
            loaded, parsed and executed if it's not necessary.
        */
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      },

      /*
            Feature with detect & install:

            Some polyfills require a installation step
            Hence you could supply a install function which accepts the require result
        */
      {
        require: 'smoothscroll-polyfill',

        // Detection found in source: https://github.com/iamdustan/smoothscroll/blob/master/src/smoothscroll.js
        detect: () => 'scrollBehavior' in document.documentElement.style && window.__forceSmoothScrollPolyfill__ !== true,

        // Optional install function called client side after the package is required:
        install: (smoothscroll) => smoothscroll.polyfill()
      }
    ]
  },

  /*
   ** Global Resources
   */
  styleResources: {
    scss: ['~/assets/style/main.scss']
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
