<template>
  <div v-if="featured && posts.length > 0">
    <PostCard :post="firstPost" :featured="true" />
    <div v-if="restPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PostCard v-for="post in restPosts" :key="post.id" :post="post" />
    </div>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types'

interface Props {
  posts: Post[]
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false
})

const firstPost = computed(() => props.posts[0])
const restPosts = computed(() => props.posts.slice(1))
</script>
