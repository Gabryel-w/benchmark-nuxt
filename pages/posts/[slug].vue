<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div v-if="pending" class="text-center py-12">
      <p class="text-gray-600">Loading post...</p>
    </div>

    <div v-else-if="error || !post" class="text-center py-12">
      <p class="text-red-600">Post not found</p>
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
        Back to home
      </NuxtLink>
    </div>

    <div v-else>
      <article>
        <header class="mb-8">
          <h1 class="text-4xl font-bold mb-4 text-gray-900">{{ post.title }}</h1>
          <div class="flex items-center gap-4 text-gray-600">
            <span>By {{ post.author }}</span>
            <span>{{ formatDate(post.published_at) }}</span>
          </div>
        </header>

        <PostContent :content="post.content" />
      </article>

      <CommentList :comments="comments" />
    </div>

    <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 mt-8 inline-block">
      ← Back to posts
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { SinglePostResponse, CommentsListResponse } from '~/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const slug = route.params.slug as string

useHead({
  title: `Post - DevBlog`,
  meta: [
    {
      name: 'description',
      content: 'Read this blog post on DevBlog'
    }
  ]
})

const { data, pending, error } = useFetch<SinglePostResponse>(
  () => `/api/posts/${slug}`
)

const post = computed(() => data.value?.post)

const { data: commentsData } = useFetch<CommentsListResponse>(
  () => `/api/posts/${slug}/comments`,
  {
    watch: [slug]
  }
)

const comments = computed(() => commentsData.value?.comments || [])

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
