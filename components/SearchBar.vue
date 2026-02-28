<template>
  <div class="w-full bg-white border-b border-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <!-- Search Input -->
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Pesquisar Artigos
          </label>
          <div class="relative">
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Procure por títulos, autores ou conteúdo..."
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              @keyup.enter="handleSearch"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute right-3 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="w-full md:w-48">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="category"
            v-model="selectedCategory"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            @change="handleSearch"
          >
            <option value="">Todas as categorias</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Economia">Economia</option>
            <option value="Saúde">Saúde</option>
            <option value="Ciência">Ciência</option>
            <option value="Esportes">Esportes</option>
            <option value="Cultura">Cultura</option>
            <option value="Política">Política</option>
            <option value="Meio Ambiente">Meio Ambiente</option>
          </select>
        </div>

        <!-- Search Button -->
        <button
          @click="handleSearch"
          class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Pesquisar
        </button>
      </div>

      <!-- Category Pills (Optional quick filters) -->
      <div v-if="false" class="mt-6 flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat; handleSearch()"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === cat
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const selectedCategory = ref('')

const categories = [
  'Tecnologia',
  'Economia',
  'Saúde',
  'Ciência',
  'Esportes',
  'Cultura',
  'Política',
  'Meio Ambiente',
]

// Initialize from route query params
onMounted(() => {
  searchQuery.value = (route.query.q as string) || ''
  selectedCategory.value = (route.query.category as string) || ''
})

const handleSearch = () => {
  const query: Record<string, string> = {}
  if (searchQuery.value) {
    query.q = searchQuery.value
  }
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }

  router.push({
    path: '/',
    query: query.q || query.category ? query : undefined
  })
}
</script>
