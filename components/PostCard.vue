<template>
  <article class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden h-full flex flex-col">
    <div class="p-6 flex flex-col flex-1">
      <h2 class="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
        <NuxtLink :to="`/posts/${slug}`">
          {{ title }}
        </NuxtLink>
      </h2>
      <p class="text-gray-600 text-sm mb-4 flex-1">
        {{ excerpt }}
      </p>
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>{{ author }}</span>
        <span>{{ formatDate(publishedAt) }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Props {
  title: string
  slug: string
  excerpt: string
  publishedAt: string | Date
  author: string
}

defineProps<Props>()

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
