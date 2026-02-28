import type { LoginRequest, LoginResponse } from '~/types'

export const useAuth = () => {
  const isAuthenticated = ref(false)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const checkAuth = async () => {
    try {
      // Try to verify token by making an authenticated request
      const { data } = await useFetch('/api/posts', {
        method: 'GET'
      })
      isAuthenticated.value = !!data.value
    } catch {
      isAuthenticated.value = false
    }
  }

  const login = async (credentials: LoginRequest) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (fetchError.value) {
        error.value = 'Invalid credentials'
        return false
      }

      if (data.value?.token) {
        isAuthenticated.value = true
        return true
      }

      return false
    } catch (err) {
      error.value = 'An error occurred during login'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore error
    } finally {
      isAuthenticated.value = false
    }
  }

  onMounted(() => {
    checkAuth()
  })

  return {
    isAuthenticated: readonly(isAuthenticated),
    error: readonly(error),
    loading: readonly(loading),
    login,
    logout,
    checkAuth
  }
}
