<template>
  <header class="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-4">
      <nav class="flex items-center justify-between">
        <NuxtLink
          to="/"
          class="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
        >
          DevBlog
        </NuxtLink>
        <div class="flex gap-6 items-center">
          <NuxtLink
            to="/"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/admin/posts"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Admin
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>
