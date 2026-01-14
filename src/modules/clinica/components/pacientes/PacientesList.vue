<template>
  <div>
    
    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      
      <!-- Loading -->
      <div v-if="pacientesStore.loading" class="p-12 text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Cargando pacientes...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="pacientesStore.pacientes.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-users text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay pacientes</h3>
        <p class="text-gray-600 mb-6">
          {{ pacientesStore.filters.search ? 'No se encontraron resultados' : 'Comienza agregando tu primer paciente' }}
        </p>
        <button
          v-if="!pacientesStore.filters.search"
          @click="$emit('new')"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <i class="fas fa-plus mr-2"></i>
          Nuevo Paciente
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RUT
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
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
              v-for="paciente in pacientesStore.pacientes"
              :key="paciente.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- Paciente -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {{ getInitials(paciente.nombre, paciente.apellido) }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ paciente.nombre }} {{ paciente.apellido }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ calculateAge(paciente.fecha_nacimiento) }} años
                    </p>
                  </div>
                </div>
              </td>

              <!-- RUT -->
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ paciente.rut }}</p>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ paciente.email || '-' }}</p>
              </td>

              <!-- Teléfono -->
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ paciente.telefono || '-' }}</p>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    paciente.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ paciente.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="$emit('agendar-cita', paciente)"
                    class="text-green-600 hover:text-green-900 transition"
                    title="Agendar Cita"
                  >
                    <i class="fas fa-calendar-plus"></i>
                  </button>
                  <button
                    @click="$emit('perfil', paciente)"
                    class="text-blue-600 hover:text-blue-900 transition"
                    title="Ver Perfil">
                    <i class="fas fa-user"></i>
                  </button>
                 <!-- Después del botón "Ver" y antes de "Editar" -->
<HistoriaClinicaButton 
  :paciente-id="paciente.id"
  variant="icon"
  @click="$emit('historial', paciente)"
/>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pacientesStore.pacientes.length > 0"
        class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between"
      >
        <!-- Info -->
        <div class="text-sm text-gray-700">
          Mostrando 
          <span class="font-medium">{{ pacientesStore.paginationInfo.from }}</span>
          a 
          <span class="font-medium">{{ pacientesStore.paginationInfo.to }}</span>
          de 
          <span class="font-medium">{{ pacientesStore.paginationInfo.total }}</span>
          pacientes
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-2">
          <button
            @click="handlePrevPage"
            :disabled="!pacientesStore.hasPrevPage"
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
                page === pacientesStore.currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="handleNextPage"
            :disabled="!pacientesStore.hasNextPage"
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
import { usePacientesStore } from '@clinica/stores'
import HistoriaClinicaButton from '@clinica/components/pacientes/HistoriaClinicaButton.vue'

const pacientesStore = usePacientesStore()

defineEmits(['new', 'agendar-cita', 'perfil', 'historial'])

// Computed
const visiblePages = computed(() => {
  const total = pacientesStore.totalPages
  const current = pacientesStore.currentPage
  const pages = []

  if (total <= 7) {
    // Mostrar todas las páginas
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Mostrar páginas con ellipsis
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
function getInitials(nombre, apellido) {
  const n = nombre?.[0] || ''
  const a = apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
}

function calculateAge(fechaNacimiento) {
  if (!fechaNacimiento) return '-'
  
  const birth = new Date(fechaNacimiento)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

function handlePrevPage() {
  if (pacientesStore.hasPrevPage) {
    pacientesStore.changePage(pacientesStore.currentPage - 1)
  }
}

function handleNextPage() {
  if (pacientesStore.hasNextPage) {
    pacientesStore.changePage(pacientesStore.currentPage + 1)
  }
}

function handlePageChange(page) {
  if (page !== '...') {
    pacientesStore.changePage(page)
  }
}
</script>