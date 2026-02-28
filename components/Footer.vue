<template>
  <footer class="w-full bg-gray-900 text-gray-300 mt-20">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand Section -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl font-bold text-white">PulseNews</span>
            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          </div>
          <p class="text-sm text-gray-400">Fique por dentro do que importa</p>
        </div>

        <!-- Links Section -->
        <div>
          <h4 class="font-semibold text-white mb-4">Navegação</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/" class="hover:text-blue-400 transition-colors">
                Início
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/admin/posts" class="hover:text-blue-400 transition-colors">
                Admin
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal Section -->
        <div>
          <h4 class="font-semibold text-white mb-4">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-blue-400 transition-colors">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-blue-400 transition-colors">
                Política de Privacidade
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-blue-400 transition-colors">
                Termos de Uso
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-blue-400 transition-colors">
                Contato
              </a>
            </li>
          </ul>
        </div>

        <!-- Social Section -->
        <div>
          <h4 class="font-semibold text-white mb-4">Redes Sociais</h4>
          <div class="flex gap-4">
            <a href="#" class="hover:text-blue-400 transition-colors" title="Twitter">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
              </svg>
            </a>
            <a href="#" class="hover:text-blue-400 transition-colors" title="LinkedIn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#" class="hover:text-blue-400 transition-colors" title="Facebook">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {{ currentYear }} PulseNews. Todos os direitos reservados.</p>
          <p>Feito com <span class="text-blue-500">♥</span> para a comunidade</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
