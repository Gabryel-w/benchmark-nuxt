<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-900 mb-2">
        Title
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        maxlength="100"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Post title"
      />
    </div>

    <div>
      <label for="slug" class="block text-sm font-medium text-gray-900 mb-2">
        Slug
      </label>
      <input
        id="slug"
        v-model="formData.slug"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="post-slug"
      />
      <p class="text-sm text-gray-500 mt-1">
        Auto-generate from title
      </p>
    </div>

    <div>
      <label for="excerpt" class="block text-sm font-medium text-gray-900 mb-2">
        Excerpt
      </label>
      <textarea
        id="excerpt"
        v-model="formData.excerpt"
        maxlength="200"
        rows="3"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Brief excerpt of the post"
      />
    </div>

    <div>
      <label for="content" class="block text-sm font-medium text-gray-900 mb-2">
        Content
      </label>
      <textarea
        id="content"
        v-model="formData.content"
        rows="12"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        placeholder="Markdown content"
      />
    </div>

    <div>
      <label for="author" class="block text-sm font-medium text-gray-900 mb-2">
        Author
      </label>
      <input
        id="author"
        v-model="formData.author"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Author name"
      />
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
    >
      {{ isSubmitting ? 'Saving...' : 'Save Post' }}
    </button>

    <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

interface Props {
  post?: Post
}

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: FormData]
}>()

const formData = ref<FormData>({
  title: props.post?.title || '',
  slug: props.post?.slug || '',
  excerpt: props.post?.excerpt || '',
  content: props.post?.content || '',
  author: props.post?.author || 'DevBlog Team'
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

watch(() => formData.value.title, (newTitle) => {
  if (!props.post) {
    formData.value.slug = generateSlug(newTitle)
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    emit('submit', formData.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isSubmitting.value = false
  }
}
</script>
