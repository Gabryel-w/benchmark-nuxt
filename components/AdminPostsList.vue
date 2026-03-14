<template>
  <div>
    <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-6 flex items-start gap-3">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div>

    <div class="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Título
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Categoria
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Autor
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Data
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="localPosts.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 4v-4z" />
                </svg>
                <p>Nenhum artigo encontrado</p>
              </td>
            </tr>
            <tr
              v-for="(post, index) in localPosts"
              :key="post.id"
              :class="[
                'border-b border-gray-200 hover:bg-gray-50 transition-colors',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              ]"
            >
              <td class="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                {{ post.title }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                  {{ post.category }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ post.author }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(post.published_at) }}
              </td>
              <td class="px-6 py-4 text-sm flex gap-3">
                <a
                  :href="`/admin/posts/${post.id}/edit`"
                  class="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </a>
                <button
                  @click="openDeleteModal(post.slug, post.id, post.title)"
                  :disabled="deletingId === post.id"
                  class="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {{ deletingId === post.id ? 'Excluindo...' : 'Excluir' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
      <div>
        <NuxtLink
          v-if="currentPage > 1"
          :to="{ query: { page: currentPage - 1 } }"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </NuxtLink>
        <button
          v-else
          disabled
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-medium opacity-60"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
      </div>

      <span class="text-gray-700 font-medium">
        Página {{ currentPage }} de {{ totalPages }}
      </span>

      <div>
        <NuxtLink
          v-if="currentPage < totalPages"
          :to="{ query: { page: currentPage + 1 } }"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          Próxima
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
        <button
          v-else
          disabled
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-medium opacity-60"
        >
          Próxima
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="confirmModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeDeleteModal"
      >
        <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Excluir Artigo</h3>
          </div>

          <p class="text-gray-600 mb-2">
            Tem certeza de que deseja excluir o artigo:
          </p>
          <p class="text-gray-900 font-semibold mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            "{{ confirmModal.title }}"
          </p>
          <p class="text-sm text-red-600 mb-6">
            Esta ação não pode ser desfeita.
          </p>

          <div class="flex gap-3 justify-end">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

interface Props {
  posts: Post[]
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()

const localPosts = ref<Post[]>([...props.posts])
const deletingId = ref<number | null>(null)
const error = ref<string | null>(null)
const confirmModal = ref<{
  slug: string
  id: number
  title: string
} | null>(null)

// Keep localPosts synced when props change (e.g. pagination)
watch(() => props.posts, (newPosts) => {
  localPosts.value = [...newPosts]
})

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const openDeleteModal = (slug: string, id: number, title: string) => {
  confirmModal.value = { slug, id, title }
}

const closeDeleteModal = () => {
  confirmModal.value = null
}

const handleDelete = async () => {
  if (!confirmModal.value) return

  const { slug, id } = confirmModal.value
  closeDeleteModal()
  deletingId.value = id
  error.value = null

  try {
    await $fetch(`/api/posts/${slug}`, {
      method: 'DELETE'
    })

    // Remove post from local state
    localPosts.value = localPosts.value.filter(p => p.id !== id)
    deletingId.value = null
  } catch (err: any) {
    error.value = err.data?.error || 'Falha ao excluir artigo'
    deletingId.value = null
  }
}
</script>
