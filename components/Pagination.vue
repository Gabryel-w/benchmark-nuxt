<template>
  <div class="flex flex-col items-center gap-4 py-8">
    <div class="flex items-center gap-1.5">
      <NuxtLink
        v-if="hasPrev"
        :to="buildLink(current - 1)"
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
        aria-label="Página anterior"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <span
        v-else
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 text-gray-300 cursor-not-allowed"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </span>

      <template v-for="(page, idx) in pages" :key="idx">
        <span
          v-if="page === null"
          class="inline-flex items-center justify-center w-10 h-10 text-gray-400 text-sm"
        >
          ...
        </span>
        <span
          v-else-if="page === current"
          class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
        >
          {{ page }}
        </span>
        <NuxtLink
          v-else
          :to="buildLink(page)"
          class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm"
        >
          {{ page }}
        </NuxtLink>
      </template>

      <NuxtLink
        v-if="hasNext"
        :to="buildLink(current + 1)"
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
        aria-label="Próxima página"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
      <span
        v-else
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 text-gray-300 cursor-not-allowed"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>

    <p v-if="totalCount !== undefined" class="text-sm text-gray-500">
      {{ totalCount }} artigos no total
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  current: number
  total: number
  totalCount?: number
}

const props = defineProps<Props>()
const route = useRoute()

const hasPrev = computed(() => props.current > 1)
const hasNext = computed(() => props.current < props.total)

function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | null)[] = []

  pages.push(1)

  if (current > 3) {
    pages.push(null)
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push(null)
  }

  pages.push(total)

  return pages
}

const pages = computed(() => getPageNumbers(props.current, props.total))

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
</script>
