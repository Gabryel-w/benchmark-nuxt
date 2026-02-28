<template>
  <div class="w-full max-w-7xl mx-auto px-4 md:px-6 py-12">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Gerenciar Artigos</h1>
        <p class="text-gray-600">Total de {{ totalCount }} artigos publicados</p>
      </div>
      <NuxtLink
        to="/admin/posts/new"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Artigo
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center py-16">
      <div class="inline-block">
        <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p class="mt-2 text-gray-600">Carregando artigos...</p>
    </div>

    <div v-else-if="error" class="text-center py-16 bg-red-50 rounded-lg border border-red-100">
      <p class="text-red-600 text-lg">Erro ao carregar artigos</p>
    </div>

    <AdminPostsList
      v-else
      :posts="posts"
      :current-page="currentPage"
      :total-pages="totalPages"
    />
  </div>
</template>

<script setup lang="ts">
import type { PostsListResponse } from '~/types'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Gerenciar Artigos - Admin - PulseNews',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

const route = useRoute()
const postsPerPage = 15

const currentPage = computed(() => {
  const page = parseInt((route.query.page as string) || '1', 10)
  return Math.max(1, page)
})

const { data, pending, error } = useFetch<PostsListResponse>(
  () => `/api/posts?page=${currentPage.value}&perPage=${postsPerPage}`,
  {
    watch: [currentPage]
  }
)

const posts = computed(() => data.value?.posts || [])
const totalCount = computed(() => data.value?.total || 0)
const totalPages = computed(() => {
  const total = data.value?.total || 0
  return Math.ceil(total / postsPerPage)
})
</script>
