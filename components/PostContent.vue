<template>
  <div class="prose prose-sm sm:prose lg:prose-lg max-w-none mx-auto" v-html="htmlContent" />
</template>

<script setup lang="ts">
interface Props {
  content: string
}

const props = defineProps<Props>()

const htmlContent = computed(() => {
  return markdownToHtml(props.content)
})
</script>

<style scoped>
:deep(h1) {
  @apply text-3xl font-bold mt-8 mb-4 text-gray-900;
}

:deep(h2) {
  @apply text-2xl font-bold mt-6 mb-3 text-gray-900;
}

:deep(h3) {
  @apply text-xl font-bold mt-4 mb-2 text-gray-900;
}

:deep(p) {
  @apply text-gray-700 leading-7 mb-4;
}

:deep(ul), :deep(ol) {
  @apply mb-4 ml-4;
}

:deep(li) {
  @apply text-gray-700 mb-2;
}

:deep(code) {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
}

:deep(pre) {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}

:deep(pre code) {
  @apply bg-transparent px-0 py-0;
}

:deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4;
}

:deep(a) {
  @apply text-blue-600 hover:text-blue-800 underline;
}
</style>
