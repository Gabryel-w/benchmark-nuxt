export default defineNuxtRouteMiddleware((to, from) => {
  // Only apply to /admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  // Use the non-httpOnly companion cookie for client-side middleware checks.
  // The actual httpOnly 'auth-token' JWT is verified server-side in API routes.
  const authCookie = useCookie('auth-logged-in')

  // If user is logged in and trying to access login page, redirect to admin panel
  if (to.path === '/admin/login') {
    if (authCookie.value) {
      return navigateTo('/admin/posts')
    }
    return
  }

  // If user is NOT logged in and trying to access any other admin page, redirect to login
  if (!authCookie.value) {
    return navigateTo('/admin/login')
  }
})
