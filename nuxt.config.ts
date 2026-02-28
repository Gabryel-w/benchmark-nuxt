export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image'
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/posts/**': { swr: 60 },
    '/admin/**': { ssr: true }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    databaseUrl: process.env.DATABASE_URL || ''
  },
  app: {
    head: {
      title: 'DevBlog - Nuxt',
      meta: [
        { name: 'description', content: 'A benchmark blog built with Nuxt' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml']
    }
  }
})
