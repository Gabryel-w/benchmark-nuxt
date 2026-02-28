<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
      :slug="post.slug"
      :excerpt="post.excerpt"
      :published-at="post.published_at"
      :author="post.author"
    />
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

interface Props {
  posts: Post[]
}

defineProps<Props>()
</script>
