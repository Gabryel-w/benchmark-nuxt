<template>
  <div class="mt-8">
    <h3 class="text-2xl font-bold mb-6 text-gray-900">Comments</h3>
    <div v-if="comments.length === 0" class="text-gray-600 py-8">
      <p>No comments yet.</p>
    </div>
    <div v-else class="space-y-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :author-name="comment.author_name"
        :content="comment.content"
        :created-at="comment.created_at"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'

interface Props {
  comments: Comment[]
}

defineProps<Props>()
</script>
