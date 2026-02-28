<template>
  <div class="flex items-center justify-center gap-4">
    <NuxtLink
      v-if="hasPrev"
      :to="`/?page=${current - 1}`"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Previous
    </NuxtLink>
    <button
      v-else
      disabled
      class="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
    >
      Previous
    </button>

    <div class="flex items-center gap-2">
      <span class="text-gray-600">
        Page <span class="font-bold text-gray-900">{{ current }}</span> of
        <span class="font-bold text-gray-900">{{ totalPages }}</span>
      </span>
    </div>

    <NuxtLink
      v-if="hasNext"
      :to="`/?page=${current + 1}`"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Next
    </NuxtLink>
    <button
      v-else
      disabled
      class="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
interface PaginationProps {
  current: number
  total: number
  perPage?: number
}

const props = withDefaults(defineProps<PaginationProps>(), {
  perPage: 10
})

const hasPrev = computed(() => props.current > 1)
const hasNext = computed(() => props.current < totalPages.value)
const totalPages = computed(() => Math.ceil(props.total / props.perPage!))
</script>
