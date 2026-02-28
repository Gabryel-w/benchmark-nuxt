<template>
  <div class="w-full">
    <!-- Hero Section -->
    <div v-if="currentPage === 1 && !searchQuery && !categoryQuery" class="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="max-w-3xl">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            PulseNews
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-2 font-medium">
            Fique por dentro do que importa
          </p>
          <p class="text-lg text-gray-500">
            As principais notícias sobre tecnologia, economia, saúde, ciência, esportes, cultura, política e meio ambiente, tudo em um só lugar.
          </p>
        </div>
      </div>
    </div>

    <!-- Search Bar (appears when on page 1 without filters or always on subsequent pages/filters) -->
    <SearchBar />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div v-if="pending" class="text-center py-16">
        <div class="inline-block">
          <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p class="mt-2 text-gray-600">Carregando artigos...</p>
      </div>

      <div v-else-if="error" class="text-center py-16 bg-red-50 rounded-lg border border-red-100">
        <p class="text-red-600 text-lg">Erro ao carregar artigos</p>
      </div>

      <div v-else-if="posts.length > 0">
        <PostList :posts="posts" :featured="currentPage === 1 && !searchQuery && !categoryQuery" />
        <div v-if="totalPages > 1" class="mt-16">
          <Pagination
            :current="currentPage"
            :total="totalPages"
            :per-page="postsPerPage"
          />
        </div>
      </div>

      <div v-else class="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 4v-4z" />
        </svg>
        <p class="text-gray-500 text-lg">Nenhum artigo encontrado. Tente uma busca diferente.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostsListResponse } from '~/types'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'PulseNews - Fique por dentro do que importa',
  meta: [
    {
      name: 'description',
      content: 'Acompanhe as principais notícias sobre tecnologia, economia, saúde, ciência, esportes, cultura, política e meio ambiente.'
    }
  ]
})

const route = useRoute()
const postsPerPage = 9

const currentPage = computed(() => {
  const page = parseInt((route.query.page as string) || '1', 10)
  return Math.max(1, page)
})

const searchQuery = computed(() => route.query.q as string || '')
const categoryQuery = computed(() => route.query.category as string || '')

// Build query params for API call
const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  params.append('perPage', postsPerPage.toString())

  if (searchQuery.value) {
    params.append('q', searchQuery.value)
  }

  if (categoryQuery.value) {
    params.append('category', categoryQuery.value)
  }

  return params.toString()
})

const { data, pending, error, refresh } = useFetch<PostsListResponse>(
  () => `/api/posts?${queryParams.value}`,
  {
    watch: [currentPage, searchQuery, categoryQuery]
  }
)

const posts = computed(() => data.value?.posts || [])
const totalPages = computed(() => {
  const total = data.value?.total || 0
  return Math.ceil(total / postsPerPage)
})
</script>
