<template>
  <div class="w-full max-w-4xl mx-auto px-4 md:px-6 py-12">
    <div v-if="pending" class="text-center py-16">
      <div class="inline-block">
        <div class="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p class="mt-2 text-gray-600">Carregando artigo...</p>
    </div>

    <div v-else-if="error || !post" class="text-center py-16">
      <a
        href="/admin/posts"
        class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para artigos
      </a>
      <div class="bg-red-50 rounded-lg border border-red-100 p-6">
        <p class="text-red-600 text-lg">Artigo não encontrado</p>
      </div>
    </div>

    <div v-else>
      <div class="mb-8">
        <a
          href="/admin/posts"
          class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para artigos
        </a>
        <h1 class="text-4xl font-bold text-gray-900">Editar Artigo</h1>
        <p class="text-gray-600 mt-2">Atualize os dados do artigo "{{ post.title }}"</p>
      </div>
      <AdminPostForm :initial-post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const postId = route.params.id as string

useHead({
  title: () => post.value ? `Editar "${post.value.title}" - Admin - DevBlog` : 'Editar Artigo - Admin - DevBlog',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

const { data, pending, error } = useFetch<{ post: Post }>(
  () => `/api/posts/${postId}`
)

const post = computed(() => data.value?.post)
</script>
