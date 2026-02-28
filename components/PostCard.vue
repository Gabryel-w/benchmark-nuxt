<template>
  <article v-if="featured" class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-12 border border-gray-100">
    <div class="p-8 md:p-10">
      <div class="mb-4 flex items-center gap-3">
        <div :class="[colors.bg, colors.text, 'inline-block px-3 py-1 rounded-full text-sm font-medium']">
          {{ post.category }}
        </div>
        <span class="text-xs text-gray-400">Destaque</span>
      </div>
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
        <NuxtLink :to="`/posts/${post.slug}`" class="hover:text-blue-600 transition-colors">
          {{ post.title }}
        </NuxtLink>
      </h2>
      <p class="text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3">
        {{ post.excerpt }}
      </p>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div :class="[avatarColor, 'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm']">
            {{ initials }}
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ post.author }}</p>
            <p class="text-sm text-gray-500">{{ publishDate }}</p>
          </div>
        </div>
        <NuxtLink
          :to="`/posts/${post.slug}`"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Ler mais
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </article>

  <article v-else class="bg-white rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full group">
    <div class="p-6 flex flex-col flex-1">
      <div class="mb-3">
        <span :class="[colors.bg, colors.text, 'inline-block px-2.5 py-1 rounded-full text-xs font-medium']">
          {{ post.category }}
        </span>
      </div>
      <h3 class="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
        <NuxtLink :to="`/posts/${post.slug}`">
          {{ post.title }}
        </NuxtLink>
      </h3>
      <p class="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
        {{ post.excerpt }}
      </p>
      <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div :class="[avatarColor, 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0']">
          {{ initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ post.author }}</p>
          <p class="text-xs text-gray-500">{{ publishDate }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Post } from '@/types'

interface Props {
  post: Post
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false
})

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

const colors = computed(() => getCategoryColor(props.post.category))
const initials = computed(() => getAuthorInitials(props.post.author))
const avatarColor = computed(() => getAvatarColor(props.post.author))

const publishDate = computed(() => {
  return new Date(props.post.published_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>
