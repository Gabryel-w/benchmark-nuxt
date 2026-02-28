<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-gray-900">Edit Post</h1>

    <div v-if="pending" class="text-center py-12">
      <p class="text-gray-600">Loading post...</p>
    </div>

    <div v-else-if="error || !post" class="text-center py-12">
      <p class="text-red-600">Post not found</p>
      <NuxtLink to="/admin/posts" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
        Back to posts
      </NuxtLink>
    </div>

    <div v-else>
      <AdminPostForm :post="post" @submit="handleUpdatePost" />

      <NuxtLink
        to="/admin/posts"
        class="text-blue-600 hover:text-blue-800 mt-8 inline-block"
      >
        ← Back to posts
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SinglePostResponse, UpdatePostRequest } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'admin-auth'
})

const route = useRoute()
const postId = route.params.id as string

useHead({
  title: 'Edit Post - Admin - DevBlog'
})

const router = useRouter()

// Fetch all posts to find by ID
const { data: postsData, pending, error } = useFetch(
  '/api/posts?perPage=100'
)

const post = computed(() => {
  const posts = (postsData.value as any)?.posts || []
  return posts.find((p: any) => p.id === parseInt(postId))
})

const handleUpdatePost = async (formData: UpdatePostRequest) => {
  if (!post.value) return

  try {
    const { error: updateError } = await useFetch(`/api/posts/${post.value.slug}`, {
      method: 'PUT',
      body: formData
    })

    if (updateError.value) {
      alert('Failed to update post')
      return
    }

    await router.push('/admin/posts')
  } catch (err) {
    alert('An error occurred while updating the post')
  }
}
</script>
