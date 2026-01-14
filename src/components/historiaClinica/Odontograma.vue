<!-- components/historiaClinica/Odontograma.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-gray-800">
          <i class="fas fa-tooth text-blue-600 mr-2"></i>
          Odontograma
        </h3>
        <p class="text-sm text-gray-600 mt-1">Click en un diente para cambiar su estado</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="resetOdontograma"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <i class="fas fa-undo mr-2"></i>
          Resetear
        </button>
        <button
          @click="guardarOdontograma"
          :disabled="saving"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
        >
          <i class="fas fa-save mr-2"></i>
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="historiaStore.loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando odontograma...</p>
    </div>

    <!-- Odontograma -->
    <div v-else>
      
      <!-- Cuadrante Superior -->
      <div class="mb-8">
        <div class="text-center mb-3">
          <span class="text-sm font-semibold text-gray-700 bg-blue-50 px-4 py-1 rounded-full">
            Arcada Superior
          </span>
        </div>
        
        <div class="flex justify-center items-center gap-1 mb-2">
          <!-- Superior Derecha (18-11) -->
          <div class="flex gap-1">
            <Diente
              v-for="diente in dientesSuperioresDerecha"
              :key="diente.numero"
              :numero="diente.numero"
              :estado="diente.estado"
              :notas="diente.notas"
              @click="abrirModalDiente(diente)"
            />
          </div>
          
          <!-- Línea Media -->
          <div class="w-1 h-16 bg-red-500 mx-2"></div>
          
          <!-- Superior Izquierda (21-28) -->
          <div class="flex gap-1">
            <Diente
              v-for="diente in dientesSuperioresIzquierda"
              :key="diente.numero"
              :numero="diente.numero"
              :estado="diente.estado"
              :notas="diente.notas"
              @click="abrirModalDiente(diente)"
            />
          </div>
        </div>
      </div>

      <!-- Cuadrante Inferior -->
      <div class="mb-8">
        <div class="flex justify-center items-center gap-1 mb-2">
          <!-- Inferior Derecha (48-41) -->
          <div class="flex gap-1">
            <Diente
              v-for="diente in dientesInferioresDerecha"
              :key="diente.numero"
              :numero="diente.numero"
              :estado="diente.estado"
              :notas="diente.notas"
              @click="abrirModalDiente(diente)"
            />
          </div>
          
          <!-- Línea Media -->
          <div class="w-1 h-16 bg-red-500 mx-2"></div>
          
          <!-- Inferior Izquierda (31-38) -->
          <div class="flex gap-1">
            <Diente
              v-for="diente in dientesInferioresIzquierda"
              :key="diente.numero"
              :numero="diente.numero"
              :estado="diente.estado"
              :notas="diente.notas"
              @click="abrirModalDiente(diente)"
            />
          </div>
        </div>
        
        <div class="text-center mt-3">
          <span class="text-sm font-semibold text-gray-700 bg-blue-50 px-4 py-1 rounded-full">
            Arcada Inferior
          </span>
        </div>
      </div>

      <!-- Leyenda de Estados -->
      <div class="border-t border-gray-200 pt-6">
        <h4 class="text-sm font-semibold text-gray-700 mb-4">Estados de Dientes:</h4>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div
            v-for="estado in historiaStore.estadosDiente"
            :key="estado.value"
            class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition cursor-pointer"
            @click="estadoSeleccionado = estado.value"
          >
            <div
              class="w-8 h-8 rounded border-2 border-gray-300 flex items-center justify-center"
              :style="{ backgroundColor: estado.color }"
            >
              <i :class="estado.icon" class="text-xs"></i>
            </div>
            <span class="text-sm text-gray-700">{{ estado.label }}</span>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="border-t border-gray-200 pt-6 mt-6">
        <h4 class="text-sm font-semibold text-gray-700 mb-4">Resumen:</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Dientes Sanos</p>
            <p class="text-2xl font-bold text-green-600">{{ dientesSanos.length }}</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Con Tratamiento</p>
            <p class="text-2xl font-bold text-yellow-600">{{ dientesConTratamiento.length }}</p>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Con Problemas</p>
            <p class="text-2xl font-bold text-red-600">{{ dientesConProblemas.length }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Ausentes</p>
            <p class="text-2xl font-bold text-gray-600">{{ dientesAusentes.length }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Editar Diente -->
    <DienteModal
      v-model="showModal"
      :diente="dienteSeleccionado"
      @save="actualizarDiente"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHistoriaClinicaStore } from '@/stores/historiaClinica'
import { useNotification } from '@/composables/useNotification'
import Diente from './Diente.vue'
import DienteModal from './DienteModal.vue'

const props = defineProps({
  pacienteId: {
    type: Number,
    required: true
  }
})

const historiaStore = useHistoriaClinicaStore()
const notify = useNotification()

// State
const showModal = ref(false)
const dienteSeleccionado = ref(null)
const estadoSeleccionado = ref('sano')
const saving = ref(false)

// Computed - Organizar dientes por cuadrante
const dientesSuperioresDerecha = computed(() => {
  return historiaStore.odontograma
    .filter(d => d.numero >= 11 && d.numero <= 18)
    .sort((a, b) => b.numero - a.numero) // 18 a 11
})

const dientesSuperioresIzquierda = computed(() => {
  return historiaStore.odontograma
    .filter(d => d.numero >= 21 && d.numero <= 28)
    .sort((a, b) => a.numero - b.numero) // 21 a 28
})

const dientesInferioresDerecha = computed(() => {
  return historiaStore.odontograma
    .filter(d => d.numero >= 41 && d.numero <= 48)
    .sort((a, b) => b.numero - a.numero) // 48 a 41
})

const dientesInferioresIzquierda = computed(() => {
  return historiaStore.odontograma
    .filter(d => d.numero >= 31 && d.numero <= 38)
    .sort((a, b) => a.numero - b.numero) // 31 a 38
})

// Computed - Estadísticas
const dientesSanos = computed(() => {
  return historiaStore.odontograma.filter(d => d.estado === 'sano')
})

const dientesConTratamiento = computed(() => {
  return historiaStore.odontograma.filter(d => 
    ['obturacion', 'endodoncia', 'corona', 'puente', 'implante', 'protesis'].includes(d.estado)
  )
})

const dientesConProblemas = computed(() => {
  return historiaStore.odontograma.filter(d => 
    ['caries', 'fractura'].includes(d.estado)
  )
})

const dientesAusentes = computed(() => {
  return historiaStore.odontograma.filter(d => d.estado === 'ausente')
})

// Methods
function abrirModalDiente(diente) {
  dienteSeleccionado.value = { ...diente }
  showModal.value = true
}

async function actualizarDiente(dienteActualizado) {
  console.group('🦷 Odontograma - Actualizar Diente')
  console.log('Diente recibido:', dienteActualizado)
  console.log('Estado (tipo):', typeof dienteActualizado.estado)
  console.log('Estado (valor):', dienteActualizado.estado)
  console.log('Notas:', dienteActualizado.notas)
  console.groupEnd()
  
  const result = await historiaStore.updateDiente(
    props.pacienteId,
    dienteActualizado.numero,
    dienteActualizado.estado,
    dienteActualizado.notas
  )

  if (result.success) {
    notify.success(`Diente ${dienteActualizado.numero} actualizado`, 'Guardado')
  } else {
    notify.error(result.message || 'Error al actualizar diente')
  }
}

async function guardarOdontograma() {
  saving.value = true

  const result = await historiaStore.saveOdontograma(props.pacienteId)

  if (result.success) {
    notify.success('Odontograma guardado correctamente', 'Éxito')
  } else {
    notify.error(result.message || 'Error al guardar odontograma')
  }

  saving.value = false
}

function resetOdontograma() {
  notify.confirm(
    '¿Estás seguro de resetear el odontograma? Todos los dientes volverán al estado "Sano".',
    () => {
      historiaStore.odontograma = historiaStore.generarOdontogramaVacio()
      notify.success('Odontograma reseteado')
    }
  )
}

// Lifecycle
onMounted(async () => {
  await historiaStore.fetchOdontograma(props.pacienteId)
})
</script>