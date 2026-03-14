<template>
  <article v-if="featured" class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden mb-12 border border-gray-200/60 hover:border-gray-300">
    <div class="md:flex">
      <!-- Featured Image -->
      <div class="md:w-2/5 relative">
        <img
          v-if="post.image"
          :src="post.image"
          :alt="post.title"
          class="w-full h-64 md:h-full object-cover"
        />
        <div
          v-else
          :class="['w-full h-64 md:h-full bg-gradient-to-br flex items-center justify-center', categoryGradient]"
        >
          <span class="text-white/30 text-8xl font-bold">{{ post.category[0] }}</span>
        </div>
      </div>
      <div class="md:w-3/5 p-8 md:p-10">
        <div class="mb-4 flex items-center gap-3">
          <div :class="[colors.bg, colors.text, 'inline-block px-3 py-1 rounded-full text-xs font-semibold']">
            {{ post.category }}
          </div>
          <span class="text-xs text-gray-400">Destaque</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
          <NuxtLink :to="`/posts/${post.slug}`" class="hover:text-indigo-600 transition-colors">
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
            class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Ler mais
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>

  <article v-else class="bg-white rounded-2xl border border-gray-200/60 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden flex flex-col h-full group">
    <!-- Card Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        :class="['w-full h-full bg-gradient-to-br flex items-center justify-center', categoryGradient]"
      >
        <span class="text-white/30 text-6xl font-bold">{{ post.category[0] }}</span>
      </div>
      <div class="absolute top-3 left-3">
        <span :class="[colors.bg, colors.text, 'inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm']">
          {{ post.category }}
        </span>
      </div>
    </div>
    <div class="p-6 flex flex-col flex-1">
      <h3 class="text-lg font-semibold leading-snug mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
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
    'Tecnologia': { bg: 'bg-blue-50', text: 'text-blue-600' },
    'Economia': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    'Saúde': { bg: 'bg-rose-50', text: 'text-rose-600' },
    'Ciência': { bg: 'bg-violet-50', text: 'text-violet-600' },
    'Esportes': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'Cultura': { bg: 'bg-pink-50', text: 'text-pink-600' },
    'Política': { bg: 'bg-sky-50', text: 'text-sky-600' },
    'Meio Ambiente': { bg: 'bg-teal-50', text: 'text-teal-600' },
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

const getCategoryGradient = (category: string): string => {
  const gradients: Record<string, string> = {
    'Tecnologia': 'from-blue-400 to-indigo-500',
    'Economia': 'from-emerald-400 to-teal-500',
    'Saúde': 'from-rose-400 to-pink-500',
    'Ciência': 'from-violet-400 to-purple-500',
    'Esportes': 'from-amber-400 to-orange-500',
    'Cultura': 'from-pink-400 to-rose-500',
    'Política': 'from-sky-400 to-blue-500',
    'Meio Ambiente': 'from-teal-400 to-green-500',
  }
  return gradients[category] || 'from-gray-400 to-gray-500'
}

const colors = computed(() => getCategoryColor(props.post.category))
const initials = computed(() => getAuthorInitials(props.post.author))
const avatarColor = computed(() => getAvatarColor(props.post.author))
const categoryGradient = computed(() => getCategoryGradient(props.post.category))

const publishDate = computed(() => {
  return new Date(props.post.published_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>
