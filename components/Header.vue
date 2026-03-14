<template>
  <header class="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/60">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-4">
      <nav class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span class="text-2xl font-bold tracking-tight text-gray-900">DevBlog<span class="text-indigo-600">.</span></span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex gap-8 items-center">
          <NuxtLink
            to="/"
            class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Início
          </NuxtLink>

          <!-- Auth Section -->
          <div v-if="isAdmin" class="relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
              title="Menu do Admin"
            >
              A
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <NuxtLink
                to="/admin/posts"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                @click="dropdownOpen = false"
              >
                Painel Admin
              </NuxtLink>
              <div class="border-t border-gray-100"></div>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>

          <NuxtLink
            v-else
            to="/admin/login"
            class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Entrar
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      <!-- Mobile Navigation -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-4 pt-4 border-t border-gray-200/60 flex flex-col gap-4"
      >
        <NuxtLink
          to="/"
          class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          @click="mobileMenuOpen = false"
        >
          Início
        </NuxtLink>

        <template v-if="isAdmin">
          <NuxtLink
            to="/admin/posts"
            class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            @click="mobileMenuOpen = false"
          >
            Painel Admin
          </NuxtLink>
          <button
            @click="handleLogoutMobile"
            class="text-left text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sair
          </button>
        </template>

        <NuxtLink
          v-else
          to="/admin/login"
          class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          @click="mobileMenuOpen = false"
        >
          Entrar
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const mobileMenuOpen = ref(false)
const isAdmin = ref(false)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLDivElement | null>(null)

const checkAuthStatus = async () => {
  try {
    const response = await fetch('/api/auth/me')
    const data = await response.json()
    isAdmin.value = data.authenticated || false
  } catch (error) {
    console.error('Error checking auth status:', error)
    isAdmin.value = false
  }
}

const handleLogout = async () => {
  try {
    dropdownOpen.value = false
    await fetch('/api/auth/logout', {
      method: 'POST',
    })
    window.location.href = '/'
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

const handleLogoutMobile = async () => {
  try {
    mobileMenuOpen.value = false
    await fetch('/api/auth/logout', {
      method: 'POST',
    })
    window.location.href = '/'
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  checkAuthStatus()
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
