<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Manage Posts</h1>
      <NuxtLink
        to="/admin/posts/new"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        New Post
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center py-12">
      <p class="text-gray-600">Loading posts...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">Error loading posts</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b border-gray-300">
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
            <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm text-gray-900">{{ post.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ post.slug }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ post.author }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(post.published_at) }}</td>
            <td class="px-6 py-4 text-sm text-right">
              <NuxtLink
                :to="`/admin/posts/${post.id}/edit`"
                class="text-blue-600 hover:text-blue-800 mr-4"
              >
                Edit
              </NuxtLink>
              <button
                @click="deletePost(post.id)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostsListResponse } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'admin-auth'
})

useHead({
  title: 'Manage Posts - Admin - DevBlog'
})

const { data, pending, error, refresh } = useFetch<PostsListResponse>(
  '/api/posts?perPage=100'
)

const posts = computed(() => data.value?.posts || [])

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const deletePost = async (postId: number) => {
  if (!confirm('Are you sure you want to delete this post?')) {
    return
  }

  try {
    // Get the post slug first
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const { error: deleteError } = await useFetch(`/api/posts/${post.slug}`, {
      method: 'DELETE'
    })

    if (deleteError.value) {
      alert('Failed to delete post')
      return
    }

    await refresh()
  } catch (err) {
    alert('An error occurred')
  }
}
</script>
