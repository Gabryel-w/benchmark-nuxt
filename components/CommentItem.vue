<template>
  <div class="bg-white rounded-lg p-5 border border-gray-100 hover:border-gray-200 transition-colors">
    <div class="flex items-start gap-3 mb-3">
      <div :class="[avatarColor, 'w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0']">
        {{ initials }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-gray-900">{{ comment.author_name }}</span>
          <span class="text-xs text-gray-400">•</span>
          <span class="text-xs text-gray-500">{{ createdDate }}</span>
        </div>
      </div>
    </div>
    <p class="text-gray-700 leading-relaxed text-sm">{{ comment.content }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '@/types'

interface Props {
  comment: Comment
}

const props = defineProps<Props>()

const getAvatarColor = (name: string): string => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const createdDate = computed(() => {
  return new Date(props.comment.created_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const avatarColor = computed(() => getAvatarColor(props.comment.author_name))
const initials = computed(() => getInitials(props.comment.author_name))
</script>
