export default defineRouteMiddleware((to, from) => {
  if (to.path.startsWith('/admin')) {
    // Check if user has auth token in cookies
    const authCookie = useCookie('auth-token')

    if (!authCookie.value) {
      return navigateTo('/admin/login')
    }
  }
})
