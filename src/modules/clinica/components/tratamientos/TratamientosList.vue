<!-- components/tratamientos/TratamientosList.vue -->
<template>
  <div>
    
    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      
      <!-- Loading -->
      <div v-if="tratamientosStore.loading" class="p-12 text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Cargando tratamientos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="tratamientosStore.tratamientos.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-tooth text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay tratamientos</h3>
        <p class="text-gray-600 mb-6">
          {{ tratamientosStore.filters.search ? 'No se encontraron resultados' : 'Comienza agregando tu primer tratamiento' }}
        </p>
        <button
          v-if="!tratamientosStore.filters.search"
          @click="$emit('new')"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <i class="fas fa-plus mr-2"></i>
          Nuevo Tratamiento
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamiento
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="tratamiento in tratamientosStore.tratamientos"
              :key="tratamiento.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- Código -->
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm font-mono font-bold text-gray-900">{{ tratamiento.codigo }}</p>
              </td>

              <!-- Tratamiento -->
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ tratamiento.nombre }}</p>
                  <p v-if="tratamiento.descripcion" class="text-xs text-gray-500 line-clamp-1">
                    {{ tratamiento.descripcion }}
                  </p>
                </div>
              </td>

              <!-- Categoría -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getCategoriaColor(tratamiento.categoria)
                  ]"
                >
                  {{ getCategoriaLabel(tratamiento.categoria) }}
                </span>
              </td>

              <!-- Precio -->
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm font-semibold text-gray-900">
                  ${{ formatPrice(tratamiento.precio) }}
                </p>
              </td>

              <!-- Duración -->
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">
                  {{ formatDuration(tratamiento.duracion_estimada) }}
                </p>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    tratamiento.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ tratamiento.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="$emit('edit', tratamiento)"
                    class="text-blue-600 hover:text-blue-900 transition"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="$emit('delete', tratamiento)"
                    class="text-red-600 hover:text-red-900 transition"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="tratamientosStore.tratamientos.length > 0"
        class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between"
      >
        <!-- Info -->
        <div class="text-sm text-gray-700">
          Mostrando 
          <span class="font-medium">{{ tratamientosStore.paginationInfo.from }}</span>
          a 
          <span class="font-medium">{{ tratamientosStore.paginationInfo.to }}</span>
          de 
          <span class="font-medium">{{ tratamientosStore.paginationInfo.total }}</span>
          tratamientos
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-2">
          <button
            @click="handlePrevPage"
            :disabled="!tratamientosStore.hasPrevPage"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition',
                page === tratamientosStore.currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="handleNextPage"
            :disabled="!tratamientosStore.hasNextPage"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTratamientosStore } from '@clinica/stores/tratamientos'

const tratamientosStore = useTratamientosStore()

defineEmits(['new', 'edit', 'delete'])

// Computed
const visiblePages = computed(() => {
  const total = tratamientosStore.totalPages
  const current = tratamientosStore.currentPage
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})

// Methods
function getCategoriaLabel(categoria) {
  const cat = tratamientosStore.categorias.find(c => c.value === categoria)
  return cat ? cat.label : categoria
}

function getCategoriaColor(categoria) {
  const colors = {
    'preventivo': 'bg-blue-100 text-blue-800',
    'restaurador': 'bg-green-100 text-green-800',
    'quirurgico': 'bg-red-100 text-red-800',
    'estetico': 'bg-purple-100 text-purple-800',
    'ortodontico': 'bg-indigo-100 text-indigo-800',
    'endodoncia': 'bg-yellow-100 text-yellow-800',
    'periodoncia': 'bg-pink-100 text-pink-800',
    'otro': 'bg-gray-100 text-gray-800'
  }
  return colors[categoria] || 'bg-gray-100 text-gray-800'
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-CL').format(price)
}

function formatDuration(minutes) {
  if (!minutes) return '-'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${mins}m`
  }
}

function handlePrevPage() {
  if (tratamientosStore.hasPrevPage) {
    tratamientosStore.changePage(tratamientosStore.currentPage - 1)
  }
}

function handleNextPage() {
  if (tratamientosStore.hasNextPage) {
    tratamientosStore.changePage(tratamientosStore.currentPage + 1)
  }
}

function handlePageChange(page) {
  if (page !== '...') {
    tratamientosStore.changePage(page)
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>