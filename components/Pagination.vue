<template>
  <div class="flex flex-col md:flex-row items-center justify-between gap-4 py-8 px-6 bg-gray-50 rounded-lg border border-gray-100">
    <div class="order-2 md:order-1">
      <NuxtLink
        v-if="hasPrev"
        :to="prevLink"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </NuxtLink>
      <button
        v-else
        disabled
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-medium opacity-60"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>
    </div>

    <div class="order-1 md:order-2 text-center">
      <div class="text-gray-700 font-medium">
        Página <span class="font-bold text-gray-900">{{ current }}</span> de
        <span class="font-bold text-gray-900">{{ total }}</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ totalArticles }} artigos no total</p>
    </div>

    <div class="order-3">
      <NuxtLink
        v-if="hasNext"
        :to="nextLink"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Próxima
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
      <button
        v-else
        disabled
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-medium opacity-60"
      >
        Próxima
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  current: number
  total: number
  perPage?: number
}

const props = withDefaults(defineProps<Props>(), { perPage: 10 })
const route = useRoute()

const hasPrev = computed(() => props.current > 1)
const hasNext = computed(() => props.current < props.total)
const prevPage = computed(() => props.current - 1)
const nextPage = computed(() => props.current + 1)
const totalArticles = computed(() => props.total * props.perPage)

// Build links that preserve query parameters
const buildLink = (page: number) => {
  const query: Record<string, string> = { page: page.toString() }

  if (route.query.q) {
    query.q = route.query.q as string
  }

  if (route.query.category) {
    query.category = route.query.category as string
  }

  return { path: '/', query }
}

const prevLink = computed(() => buildLink(prevPage.value))
const nextLink = computed(() => buildLink(nextPage.value))
</script>
