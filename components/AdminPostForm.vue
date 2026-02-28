<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-8 rounded-lg border border-gray-100">
    <!-- Error Alert -->
    <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-start gap-3">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div>

    <!-- Title and Category -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="title" class="block text-sm font-semibold text-gray-900 mb-2">
          Título
        </label>
        <input
          type="text"
          id="title"
          v-model="formData.title"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          required
          :disabled="isLoading"
          placeholder="Digite o título do artigo"
        />
      </div>

      <div>
        <label for="category" class="block text-sm font-semibold text-gray-900 mb-2">
          Categoria
        </label>
        <select
          id="category"
          v-model="formData.category"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          required
          :disabled="isLoading"
        >
          <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <!-- Slug -->
    <div>
      <label for="slug" class="block text-sm font-semibold text-gray-900 mb-2">
        Slug
      </label>
      <input
        type="text"
        id="slug"
        v-model="formData.slug"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono text-sm"
        required
        :disabled="isLoading"
        placeholder="titulo-do-artigo"
      />
      <p class="text-xs text-gray-500 mt-1">Gerado automaticamente a partir do título</p>
    </div>

    <!-- Excerpt -->
    <div>
      <label for="excerpt" class="block text-sm font-semibold text-gray-900 mb-2">
        Resumo
      </label>
      <input
        type="text"
        id="excerpt"
        v-model="formData.excerpt"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        maxlength="200"
        required
        :disabled="isLoading"
        placeholder="Resumo breve do artigo (até 200 caracteres)"
      />
      <p class="text-xs text-gray-500 mt-1">{{ formData.excerpt.length }}/200</p>
    </div>

    <!-- Author -->
    <div>
      <label for="author" class="block text-sm font-semibold text-gray-900 mb-2">
        Autor
      </label>
      <input
        type="text"
        id="author"
        v-model="formData.author"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        required
        :disabled="isLoading"
        placeholder="Nome do autor"
      />
    </div>

    <!-- Content -->
    <div>
      <label for="content" class="block text-sm font-semibold text-gray-900 mb-2">
        Conteúdo (Markdown)
      </label>
      <textarea
        id="content"
        v-model="formData.content"
        rows="16"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono text-sm"
        required
        :disabled="isLoading"
        placeholder="Escreva o conteúdo em Markdown..."
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">{{ wordCount }} palavras</p>
    </div>

    <!-- Submit Buttons -->
    <div class="flex gap-4 pt-4 border-t border-gray-200">
      <button
        type="submit"
        :disabled="isLoading"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {{ isLoading ? 'Salvando...' : initialPost ? 'Atualizar Artigo' : 'Criar Artigo' }}
      </button>
      <button
        type="button"
        @click="navigateBack"
        :disabled="isLoading"
        class="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed font-medium"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

interface Props {
  initialPost?: Post
}

const CATEGORIES = [
  'Tecnologia',
  'Economia',
  'Saúde',
  'Ciência',
  'Esportes',
  'Cultura',
  'Política',
  'Meio Ambiente',
]

const router = useRouter()
const props = defineProps<Props>()

const isLoading = ref(false)
const error = ref<string | null>(null)

const formData = reactive({
  title: props.initialPost?.title || '',
  slug: props.initialPost?.slug || '',
  content: props.initialPost?.content || '',
  excerpt: props.initialPost?.excerpt || '',
  author: props.initialPost?.author || '',
  category: props.initialPost?.category || 'Tecnologia',
})

const wordCount = computed(() => {
  return formData.content.split(/\s+/).filter(w => w.length > 0).length
})

watch(() => formData.title, (newTitle) => {
  if (!props.initialPost) {
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
    formData.slug = generatedSlug
  }
})

const handleSubmit = async () => {
  error.value = null
  isLoading.value = true

  try {
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt || !formData.author || !formData.category) {
      error.value = 'Todos os campos são obrigatórios'
      isLoading.value = false
      return
    }

    const url = props.initialPost
      ? `/api/posts/${props.initialPost.slug}`
      : '/api/posts'
    const method = props.initialPost ? 'PUT' : 'POST'

    const { error: fetchError } = await useFetch(url, {
      method,
      body: formData
    })

    if (fetchError.value) {
      throw new Error('Falha ao salvar post')
    }

    router.push('/admin/posts')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Um erro ocorreu'
  } finally {
    isLoading.value = false
  }
}

const navigateBack = () => {
  router.back()
}
</script>
