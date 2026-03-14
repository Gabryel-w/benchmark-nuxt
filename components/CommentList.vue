<template>
  <div v-if="pending" class="text-gray-500 text-center py-12">
    <div class="inline-block">
      <div class="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
    <p class="mt-2">Carregando comentários...</p>
  </div>

  <div v-else-if="error" class="text-red-500 text-center py-8 bg-red-50 rounded-lg">
    {{ error }}
  </div>

  <div v-else-if="comments.length === 0" class="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
    <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
  </div>

  <div v-else class="space-y-4">
    <h3 class="text-2xl font-bold text-gray-900 mb-6">
      Comentários ({{ comments.length }})
    </h3>
    <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '@/types'

interface Props {
  postSlug: string
}

const props = defineProps<Props>()

const comments = ref<Comment[]>([])
const pending = ref(true)
const error = ref<string | null>(null)

const { data, error: fetchError } = await useFetch(
  () => `/api/posts/${props.postSlug}/comments`,
  {
    method: 'GET'
  }
)

watch(
  () => data.value,
  (newData) => {
    if (newData && 'comments' in newData) {
      comments.value = (newData as any).comments as Comment[]
    } else if (newData) {
      comments.value = newData as any
    }
    pending.value = false
    if (fetchError.value) {
      error.value = 'Falha ao carregar comentários'
    }
  },
  { immediate: true }
)
</script>
