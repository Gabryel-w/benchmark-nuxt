<template>
  <div class="border-b border-gray-200 py-4 last:border-b-0">
    <div class="flex items-start gap-4">
      <div class="flex-grow">
        <div class="flex items-center gap-2">
          <h4 class="font-semibold text-gray-900">{{ authorName }}</h4>
          <time class="text-sm text-gray-500">{{ formatDate(createdAt) }}</time>
        </div>
        <p class="text-gray-700 mt-2">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  authorName: string
  content: string
  createdAt: string | Date
}

defineProps<Props>()

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
