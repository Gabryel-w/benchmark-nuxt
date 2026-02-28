<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div class="mb-8 text-center">
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="text-3xl font-bold text-gray-900">PulseNews</span>
            <div class="w-2 h-2 bg-blue-600 rounded-full pulse-dot"></div>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p class="text-gray-600 text-sm mt-2">Faça login para gerenciar artigos</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-start gap-3">
            <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ errorMessage }}
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              required
              :disabled="isLoading"
              placeholder="admin@pulsesnews.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-900 mb-2">
              Senha
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              required
              :disabled="isLoading"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Conectando...' : 'Entrar' }}
          </button>

          <div class="text-xs text-gray-500 text-center bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p class="font-medium text-gray-700 mb-2">Credenciais de demonstração:</p>
            <p>Email: <span class="font-mono text-blue-600">admin@pulsesnews.com</span></p>
            <p>Senha: <span class="font-mono text-blue-600">admin123</span></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Painel Admin - PulseNews',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

const router = useRouter()
const formData = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    if (!formData.value.email || !formData.value.password) {
      errorMessage.value = 'Email e senha são obrigatórios'
      isLoading.value = false
      return
    }

    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: formData.value
    })

    if (response) {
      window.location.href = '/admin/posts'
    }
  } catch (err: any) {
    errorMessage.value = err.data?.error || 'Falha ao fazer login'
  } finally {
    isLoading.value = false
  }
}
</script>
