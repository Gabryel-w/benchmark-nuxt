<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-gray-900">Create New Post</h1>

    <AdminPostForm @submit="handleCreatePost" />

    <NuxtLink
      to="/admin/posts"
      class="text-blue-600 hover:text-blue-800 mt-8 inline-block"
    >
      ← Back to posts
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { CreatePostRequest } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'admin-auth'
})

useHead({
  title: 'Create Post - Admin - DevBlog'
})

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleCreatePost = async (formData: CreatePostRequest) => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const { error } = await useFetch('/api/posts', {
      method: 'POST',
      body: formData
    })

    if (error.value) {
      errorMessage.value = 'Failed to create post'
      return
    }

    await router.push('/admin/posts')
  } catch (err) {
    errorMessage.value = 'An error occurred while creating the post'
  } finally {
    isSubmitting.value = false
  }
}
</script>
