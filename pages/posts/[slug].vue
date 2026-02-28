<template>
  <div class="w-full bg-white">
    <!-- Article Header -->
    <article class="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div v-if="pending" class="text-center py-16">
        <div class="inline-block">
          <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p class="mt-2 text-gray-600">Carregando artigo...</p>
      </div>

      <div v-else-if="error || !post">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para início
        </NuxtLink>
        <div class="text-center py-16 bg-red-50 rounded-lg border border-red-100">
          <p class="text-red-600 text-lg">Artigo não encontrado</p>
        </div>
      </div>

      <template v-else>
        <!-- Navigation -->
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para início
        </NuxtLink>

        <!-- Category Badge -->
        <div class="mb-6">
          <span :class="[categoryColor.bg, categoryColor.text, 'inline-block px-3 py-1 rounded-full text-sm font-medium']">
            {{ post.category }}
          </span>
        </div>

        <!-- Title -->
        <header class="mb-8">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            {{ post.title }}
          </h1>

          <!-- Author Info -->
          <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pb-8 border-b border-gray-200">
            <div class="flex items-center gap-4">
              <div :class="[avatarColor, 'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0']">
                {{ initials }}
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ post.author }}</p>
                <p class="text-sm text-gray-500">{{ publishDate }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600 md:ml-auto">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ readingTime }} min de leitura
              </span>
            </div>
          </div>
        </header>

        <!-- Article Content -->
        <div class="mb-12 prose-wrapper">
          <PostContent :content="post.content" />
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-12"></div>

        <!-- Comments Section -->
        <section class="mt-12">
          <CommentList :post-slug="slug" />
        </section>
      </template>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const slug = route.params.slug as string

const { data, pending, error } = useFetch<{ post: Post }>(
  () => `/api/posts/${slug}`
)

const post = computed(() => data.value?.post)

useHead({
  title: () => post.value ? `${post.value.title} - PulseNews` : 'PulseNews',
  meta: () => post.value ? [
    {
      name: 'description',
      content: post.value.excerpt
    }
  ] : []
})

// Category color function
const getCategoryColor = (category: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    'Tecnologia': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'Economia': { bg: 'bg-green-100', text: 'text-green-700' },
    'Saúde': { bg: 'bg-red-100', text: 'text-red-700' },
    'Ciência': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'Esportes': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'Cultura': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'Política': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'Meio Ambiente': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  }
  return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
}

const getAuthorInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getAvatarColor = (name: string): string => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const categoryColor = computed(() => post.value ? getCategoryColor(post.value.category) : { bg: '', text: '' })
const initials = computed(() => post.value ? getAuthorInitials(post.value.author) : '')
const avatarColor = computed(() => post.value ? getAvatarColor(post.value.author) : '')

const publishDate = computed(() => {
  if (!post.value) return ''
  return new Date(post.value.published_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const readingTime = computed(() => {
  if (!post.value) return 0
  return Math.ceil(post.value.content.split(/\s+/).length / 200)
})
</script>
