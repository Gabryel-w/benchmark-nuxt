<template>
  <div class="flex flex-col min-h-screen bg-white">
    <Header />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
</script>
