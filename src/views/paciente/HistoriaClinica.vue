<!-- src/views/paciente/HistoriaClinica.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Mi Historia Clínica</h1>
      <p class="text-gray-600 mt-1">Visualiza tu información médica y tratamientos</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Cargando historia clínica...</p>
      </div>
    </div>

    <!-- Sin Historia -->
    <div v-else-if="!historia" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <i class="fas fa-file-medical text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        Aún no tienes historia clínica registrada
      </h3>
      <p class="text-gray-600">
        Tu historia clínica se generará después de tu primera consulta
      </p>
    </div>

    <!-- Historia Clínica -->
    <div v-else class="space-y-6">
      
      <!-- Información General -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          <i class="fas fa-user-circle text-blue-600 mr-2"></i>
          Información General
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="text-sm text-gray-600">Ficha N°</label>
            <p class="text-lg font-semibold text-gray-900">{{ historia.numero_ficha || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Tipo de Sangre</label>
            <p class="text-lg font-semibold text-gray-900">{{ historia.tipo_sangre || 'No registrado' }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Estado</label>
            <span :class="[
              'inline-flex px-3 py-1 rounded-full text-sm font-medium',
              historia.estado === 'activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            ]">
              {{ historia.estado === 'activa' ? 'Activa' : historia.estado }}
            </span>
          </div>
        </div>
      </div>

      <!-- Antecedentes Médicos -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          <i class="fas fa-notes-medical text-blue-600 mr-2"></i>
          Antecedentes Médicos
        </h2>

        <div class="space-y-4">
          <!-- Alergias -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 class="font-semibold text-red-900 mb-2">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              Alergias
            </h3>
            <p class="text-red-800">
              {{ historia.alergias || 'No se registran alergias' }}
            </p>
          </div>

          <!-- Medicamentos Actuales -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="font-semibold text-blue-900 mb-2">
              <i class="fas fa-pills mr-2"></i>
              Medicamentos Actuales
            </h3>
            <p class="text-blue-800">
              {{ historia.medicamentos_actuales || 'No toma medicamentos actualmente' }}
            </p>
          </div>

          <!-- Enfermedades Preexistentes -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="font-semibold text-yellow-900 mb-2">
              <i class="fas fa-heartbeat mr-2"></i>
              Enfermedades Preexistentes
            </h3>
            <p class="text-yellow-800">
              {{ historia.enfermedades_preexistentes || 'No se registran enfermedades preexistentes' }}
            </p>
          </div>

          <!-- Cirugías Previas -->
          <div v-if="historia.cirugias_previas" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 class="font-semibold text-purple-900 mb-2">
              <i class="fas fa-stethoscope mr-2"></i>
              Cirugías Previas
            </h3>
            <p class="text-purple-800">{{ historia.cirugias_previas }}</p>
          </div>
        </div>
      </div>

      <!-- Odontograma -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          <i class="fas fa-tooth text-blue-600 mr-2"></i>
          Odontograma
        </h2>
        
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <i class="fas fa-tooth text-6xl text-blue-300 mb-4"></i>
          <p class="text-gray-600">Visualización del odontograma disponible próximamente</p>
          <p class="text-sm text-gray-500 mt-2">
            Tu dentista actualizará esta información durante tus consultas
          </p>
        </div>
      </div>

      <!-- Entradas/Evoluciones -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            <i class="fas fa-history text-blue-600 mr-2"></i>
            Historial de Consultas
          </h2>
          <div class="text-sm text-gray-600">
            Total: {{ historia.entradas?.length || 0 }} registros
          </div>
        </div>

        <!-- Sin entradas -->
        <div v-if="!historia.entradas || historia.entradas.length === 0" class="text-center py-8">
          <i class="fas fa-clipboard-list text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-600">Aún no hay registros de consultas</p>
        </div>

        <!-- Lista de entradas -->
        <div v-else class="space-y-4">
          <div
            v-for="entrada in historia.entradas"
            :key="entrada.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-semibold text-gray-900">{{ entrada.titulo || 'Consulta' }}</h3>
                <div class="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span>
                    <i class="fas fa-calendar mr-1"></i>
                    {{ formatFecha(entrada.fecha) }}
                  </span>
                  <span v-if="entrada.profesional">
                    <i class="fas fa-user-md mr-1"></i>
                    {{ entrada.profesional.nombre }} {{ entrada.profesional.apellido }}
                  </span>
                </div>
              </div>
              <span :class="[
                'px-2 py-1 rounded text-xs font-medium',
                getEstadoClass(entrada.estado)
              ]">
                {{ getEstadoLabel(entrada.estado) }}
              </span>
            </div>

            <!-- Diagnóstico -->
            <div v-if="entrada.diagnostico" class="mb-2">
              <label class="text-xs font-medium text-gray-600">Diagnóstico:</label>
              <p class="text-sm text-gray-900">{{ entrada.diagnostico }}</p>
            </div>

            <!-- Tratamiento Realizado -->
            <div v-if="entrada.tratamiento_realizado" class="mb-2">
              <label class="text-xs font-medium text-gray-600">Tratamiento:</label>
              <p class="text-sm text-gray-900">{{ entrada.tratamiento_realizado }}</p>
            </div>

            <!-- Observaciones -->
            <div v-if="entrada.observaciones" class="mt-3 bg-gray-50 rounded p-3">
              <label class="text-xs font-medium text-gray-600">Observaciones:</label>
              <p class="text-sm text-gray-700 whitespace-pre-line">{{ entrada.observaciones }}</p>
            </div>

            <!-- Próximo Control -->
            <div v-if="entrada.proximo_control" class="mt-3 flex items-center gap-2 text-sm text-blue-600">
              <i class="fas fa-calendar-check"></i>
              <span>Próximo control: {{ formatFecha(entrada.proximo_control) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentos Adjuntos -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          <i class="fas fa-paperclip text-blue-600 mr-2"></i>
          Documentos Adjuntos
        </h2>

        <div class="text-center py-8">
          <i class="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-600">Radiografías, imágenes y documentos relacionados</p>
          <p class="text-sm text-gray-500 mt-2">
            Disponible próximamente en el módulo de Documentos
          </p>
        </div>
      </div>

      <!-- Notas Adicionales -->
      <div v-if="historia.notas_adicionales" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 class="font-semibold text-yellow-900 mb-3">
          <i class="fas fa-sticky-note mr-2"></i>
          Notas Adicionales
        </h3>
        <p class="text-yellow-800 whitespace-pre-line">{{ historia.notas_adicionales }}</p>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { historiaClinicaService } from '@/services/paciente'

// State
const historia = ref(null)
const loading = ref(false)

// Methods
function formatFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getEstadoClass(estado) {
  const classes = {
    'finalizada': 'bg-green-100 text-green-700',
    'firmada': 'bg-blue-100 text-blue-700',
    'borrador': 'bg-gray-100 text-gray-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

function getEstadoLabel(estado) {
  const labels = {
    'finalizada': 'Finalizada',
    'firmada': 'Firmada',
    'borrador': 'Borrador'
  }
  return labels[estado] || estado
}

async function cargarHistoria() {
  loading.value = true

  try {
    const response = await historiaClinicaService.getHistoriaClinica()
    
    if (response.success) {
      historia.value = response.data
    }
  } catch (err) {
    console.error('Error cargar historia:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  cargarHistoria()
})
</script>