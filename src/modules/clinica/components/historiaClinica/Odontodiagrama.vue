<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-gray-800">
          <i class="fas fa-teeth text-indigo-600 mr-2"></i>
          Odontodiagrama (Periodontograma)
        </h3>
        <p class="text-sm text-gray-600 mt-1">Registro periodontal detallado (Enterprise)</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="fetchUltimoDiagrama"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          Recargar
        </button>
        <button
          @click="guardarDiagrama"
          :disabled="saving"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
        >
          <i class="fas fa-save mr-2"></i>
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
      <p class="text-gray-600">Cargando odontodiagrama...</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Legend / Instructions -->
      <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-bold text-blue-800 mb-2 flex items-center">
          <i class="fas fa-info-circle mr-2"></i> Instrucciones de Llenado
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-900">
          <div>
            <span class="font-semibold">PS (Profundidad):</span> Ingrese valor en mm.
            <br>
            <span class="text-red-600 font-bold">> 3mm</span> se marcará en rojo automáticamente.
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500 border border-red-600 inline-block"></span>
            <span><strong>Sangrado:</strong> Haga clic en el círculo inferior izquierdo.</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500 inline-block"></span>
            <span><strong>Placa:</strong> Haga clic en el círculo inferior derecho.</span>
          </div>
        </div>
      </div>
      <!-- Upper Arch (Superior) -->
      <div class="mb-8">
        <h4 class="text-center font-bold text-gray-700 mb-2 bg-indigo-50 py-1 rounded">Arcada Superior</h4>
        <div class="flex justify-center gap-8 overflow-x-auto pb-4">
          <!-- Q1: 18-11 -->
          <div class="flex gap-1">
            <PeriodontoDiente
              v-for="i in [8,7,6,5,4,3,2,1]"
              :key="'1'+i"
              :numero="parseInt('1'+i)"
              v-model="datosDientes['1'+i]"
              :is-selected="dienteSeleccionado === parseInt('1'+i)"
              @select="dienteSeleccionado = parseInt('1'+i)"
            />
          </div>
          <!-- Q2: 21-28 -->
          <div class="flex gap-1">
            <PeriodontoDiente
              v-for="i in [1,2,3,4,5,6,7,8]"
              :key="'2'+i"
              :numero="parseInt('2'+i)"
              v-model="datosDientes['2'+i]"
              :is-selected="dienteSeleccionado === parseInt('2'+i)"
              @select="dienteSeleccionado = parseInt('2'+i)"
            />
          </div>
        </div>
      </div>

      <!-- Lower Arch (Inferior) -->
      <div class="mb-4">
        <h4 class="text-center font-bold text-gray-700 mb-2 bg-indigo-50 py-1 rounded">Arcada Inferior</h4>
        <div class="flex justify-center gap-8 overflow-x-auto pb-4">
          <!-- Q4: 48-41 -->
          <div class="flex gap-1">
            <PeriodontoDiente
              v-for="i in [8,7,6,5,4,3,2,1]"
              :key="'4'+i"
              :numero="parseInt('4'+i)"
              v-model="datosDientes['4'+i]"
              :is-selected="dienteSeleccionado === parseInt('4'+i)"
              @select="dienteSeleccionado = parseInt('4'+i)"
            />
          </div>
          <!-- Q3: 31-38 -->
          <div class="flex gap-1">
            <PeriodontoDiente
              v-for="i in [1,2,3,4,5,6,7,8]"
              :key="'3'+i"
              :numero="parseInt('3'+i)"
              v-model="datosDientes['3'+i]"
              :is-selected="dienteSeleccionado === parseInt('3'+i)"
              @select="dienteSeleccionado = parseInt('3'+i)"
            />
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import api from '@clinica/services/api'
import { useNotification } from '@shared/composables/useNotification'
import PeriodontoDiente from './PeriodontoDiente.vue'

const props = defineProps({
  pacienteId: {
    type: Number,
    required: true
  }
})

const notify = useNotification()
const loading = ref(false)
const saving = ref(false)
const diagramaId = ref(null) // Para saber si actualizamos o creamos nuevo
const dienteSeleccionado = ref(null)

// Estructura reactiva para todos los dientes (11-18, 21-28, 31-38, 41-48)
const datosDientes = reactive({})

// Inicializar estructura vacía
function initDientes() {
  const cuadrantes = [1, 2, 3, 4]
  cuadrantes.forEach(q => {
    for (let i = 1; i <= 8; i++) {
        const num = `${q}${i}`
        datosDientes[num] = {
            vestibular: {
                distal: { ps: null, mg: 0, sangrado: false, placa: false },
                central: { ps: null, mg: 0, sangrado: false, placa: false },
                mesial: { ps: null, mg: 0, sangrado: false, placa: false }
            },
            palatino: {
                distal: { ps: null, mg: 0, sangrado: false, placa: false },
                central: { ps: null, mg: 0, sangrado: false, placa: false },
                mesial: { ps: null, mg: 0, sangrado: false, placa: false }
            },
            movilidad: 0,
            furca: 0
        }
    }
  })
}

initDientes()

async function fetchUltimoDiagrama() {
  loading.value = true
  try {
    const response = await api.get(`/pacientes/${props.pacienteId}/odontodiagramas/ultimo`)
    if (response.data.success && response.data.data) {
      const data = response.data.data
      diagramaId.value = data.id
      
      // Merge data logic simplificado
      if (data.datos) {
          Object.keys(data.datos).forEach(key => {
              if (datosDientes[key]) {
                  Object.assign(datosDientes[key], data.datos[key])
              }
          })
      }
      
      notify.success('Diagrama cargado correctamente')
    }
  } catch (err) {
    console.error('Error cargando diagrama:', err)
    notify.error('Error al cargar el odontodiagrama')
  } finally {
    loading.value = false
  }
}

async function guardarDiagrama() {
  saving.value = true
  try {
    const payload = {
      fecha: new Date().toISOString().split('T')[0],
      datos: datosDientes,
      observaciones: 'Guardado desde Odontodiagrama Enterprise'
    }
    
    // Siempre guardamos uno nuevo por historial clínico, o actualizamos el de hoy?
    // Lógica: Si ya existe uno hoy, actualizarlo. Si no, crear nuevo.
    // Simples: POST siempre crea nuevo en historial.
    // Mejora: Si diagramaId existe y es de hoy, PUT. Sino POST.
    
    await api.post(`/pacientes/${props.pacienteId}/odontodiagramas`, payload)
    notify.success('Odontodiagrama guardado correctamente', 'Éxito')
    
    // Recargar para obtener el ID nuevo si es necesario
    await fetchUltimoDiagrama()
    
  } catch (err) {
    console.error('Error guardando:', err)
    notify.error('Error al guardar')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchUltimoDiagrama()
})
</script>
