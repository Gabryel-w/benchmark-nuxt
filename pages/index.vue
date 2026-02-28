<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-gray-900">Latest Posts</h1>

    <div v-if="pending" class="text-center py-12">
      <p class="text-gray-600">Loading posts...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">Error loading posts</p>
    </div>

    <div v-else>
      <PostList :posts="posts" />
      <Pagination
        :current="page"
        :total="total"
        :per-page="perPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostsListResponse } from '~/types'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Home - DevBlog',
  meta: [
    {
      name: 'description',
      content: 'Latest blog posts from DevBlog'
    }
  ]
})

const page = ref(1)
const perPage = 10

const route = useRoute()

// Watch query params for pagination
watch(() => route.query.page, (newPage) => {
  if (newPage) {
    page.value = parseInt(newPage as string) || 1
  }
}, { immediate: true })

const { data, pending, error, refresh } = useFetch<PostsListResponse>(
  () => `/api/posts?page=${page.value}&perPage=${perPage}`,
  {
    watch: [page]
  }
)

const posts = computed(() => data.value?.posts || [])
const total = computed(() => data.value?.total || 0)
</script>
