<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 text-center">Admin Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="admin@devblog.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-900 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ errorMessage }}
      </div>

      <div class="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p class="font-semibold mb-2">Demo Credentials:</p>
        <p>Email: admin@devblog.com</p>
        <p>Password: admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginRequest } from '~/types'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Admin Login - DevBlog'
})

const router = useRouter()
const credentials = ref<LoginRequest>({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: credentials.value
    })

    if (error.value) {
      errorMessage.value = 'Invalid email or password'
      return
    }

    if (data.value) {
      // Token is set in cookie by the server
      await router.push('/admin/posts')
    }
  } catch (err) {
    errorMessage.value = 'An error occurred during login'
  } finally {
    isLoading.value = false
  }
}
</script>
