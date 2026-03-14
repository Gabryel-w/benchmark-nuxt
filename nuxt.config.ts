export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],
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
      title: 'DevBlog - Seu portal de notícias e artigos',
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { name: 'description', content: 'Acompanhe as principais notícias sobre tecnologia, economia, saúde, ciência, esportes, cultura, política e meio ambiente.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
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
