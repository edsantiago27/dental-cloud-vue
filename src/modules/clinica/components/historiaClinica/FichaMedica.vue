<!-- components/historiaClinica/FichaMedica.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-gray-800">
          <i class="fas fa-file-medical text-blue-600 mr-2"></i>
          Ficha Médica
        </h3>
        <p class="text-sm text-gray-600 mt-1">Información médica general del paciente</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="!isEditing"
          @click="startEdit"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <i class="fas fa-edit mr-2"></i>
          Editar
        </button>
        <template v-else>
          <button
            @click="cancelEdit"
            :disabled="saving"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            @click="handleSave"
            :disabled="saving"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <i class="fas fa-save mr-2"></i>
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </template>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando ficha médica...</p>
    </div>

    <!-- Contenido -->
    <div v-else>

      <!-- Modo Vista -->
      <div v-if="!isEditing" class="space-y-6">
        
        <!-- Alergias -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-allergies text-red-600"></i>
            <h4 class="font-semibold text-gray-900">Alergias</h4>
          </div>
          <div v-if="form.alergias?.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(alergia, index) in form.alergias"
              :key="index"
              class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
            >
              {{ alergia }}
            </span>
          </div>
          <p v-else class="text-gray-500 text-sm">Sin alergias registradas</p>
        </div>

        <!-- Enfermedades Crónicas -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-heartbeat text-orange-600"></i>
            <h4 class="font-semibold text-gray-900">Enfermedades Crónicas</h4>
          </div>
          <p v-if="form.enfermedades_actuales" class="text-gray-700 whitespace-pre-wrap">{{ form.enfermedades_actuales }}</p>
          <p v-else class="text-gray-500 text-sm">Sin enfermedades crónicas registradas</p>
        </div>

        <!-- Medicamentos Actuales -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-pills text-purple-600"></i>
            <h4 class="font-semibold text-gray-900">Medicamentos Actuales</h4>
          </div>
          <div v-if="form.medicamentos_actuales?.length > 0" class="space-y-2">
            <div
              v-for="(med, index) in form.medicamentos_actuales"
              :key="index"
              class="flex items-center gap-2 p-2 bg-purple-50 rounded"
            >
              <i class="fas fa-capsules text-purple-600 text-xs"></i>
              <span class="text-sm text-gray-700">{{ med }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm">Sin medicamentos actuales</p>
        </div>

        <!-- Antecedentes Quirúrgicos -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-cut text-blue-600"></i>
            <h4 class="font-semibold text-gray-900">Antecedentes Quirúrgicos</h4>
          </div>
          <p v-if="form.cirugias_previas" class="text-gray-700 whitespace-pre-wrap">{{ form.cirugias_previas }}</p>
          <p v-else class="text-gray-500 text-sm">Sin cirugías previas</p>
        </div>

        <!-- Hospitalizaciones -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-hospital text-teal-600"></i>
            <h4 class="font-semibold text-gray-900">Hospitalizaciones</h4>
          </div>
          <p v-if="form.hospitalizaciones" class="text-gray-700 whitespace-pre-wrap">{{ form.hospitalizaciones }}</p>
          <p v-else class="text-gray-500 text-sm">Sin hospitalizaciones previas</p>
        </div>

        <!-- Hábitos -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-smoking text-gray-600"></i>
            <h4 class="font-semibold text-gray-900">Hábitos</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <i class="fas fa-smoking text-gray-600"></i>
              <div>
                <p class="text-sm font-medium text-gray-700">Tabaco</p>
                <p class="text-sm text-gray-600">
                  {{ form.fuma ? (form.frecuencia_tabaco || 'Sí') : 'No fuma' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <i class="fas fa-wine-glass text-gray-600"></i>
              <div>
                <p class="text-sm font-medium text-gray-700">Alcohol</p>
                <p class="text-sm text-gray-600">
                  {{ form.consume_alcohol ? (form.frecuencia_alcohol || 'Sí') : 'No consume' }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="form.bruxismo" class="mt-3 p-3 bg-yellow-50 rounded flex items-center gap-2">
            <i class="fas fa-exclamation-triangle text-yellow-600"></i>
            <span class="text-sm text-yellow-800">Presenta bruxismo</span>
          </div>
          <div v-if="form.otros_habitos" class="mt-3 p-3 bg-gray-50 rounded">
            <p class="text-sm text-gray-700">{{ form.otros_habitos }}</p>
          </div>
        </div>

        <!-- Grupo Sanguíneo -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-tint text-red-600"></i>
            <h4 class="font-semibold text-gray-900">Grupo Sanguíneo</h4>
          </div>
          <p v-if="form.grupo_sanguineo" class="text-2xl font-bold text-red-600">{{ form.grupo_sanguineo }}</p>
          <p v-else class="text-gray-500 text-sm">No especificado</p>
        </div>

        <!-- Contacto de Emergencia -->
        <div class="border-b border-gray-200 pb-6">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-phone-alt text-green-600"></i>
            <h4 class="font-semibold text-gray-900">Contacto de Emergencia</h4>
          </div>
          <div v-if="form.contacto_emergencia_nombre" class="space-y-2">
            <div class="flex items-center gap-2">
              <i class="fas fa-user text-gray-400 w-4"></i>
              <span class="text-gray-700">{{ form.contacto_emergencia_nombre }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-phone text-gray-400 w-4"></i>
              <span class="text-gray-700">{{ form.contacto_emergencia_telefono }}</span>
            </div>
            <div v-if="form.contacto_emergencia_relacion" class="flex items-center gap-2">
              <i class="fas fa-heart text-gray-400 w-4"></i>
              <span class="text-gray-700">{{ form.contacto_emergencia_relacion }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm">Sin contacto de emergencia</p>
        </div>

        <!-- Notas Importantes -->
        <div v-if="form.notas_importantes">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-sticky-note text-yellow-600"></i>
            <h4 class="font-semibold text-gray-900">Notas Importantes</h4>
          </div>
          <div class="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p class="text-gray-700 whitespace-pre-wrap">{{ form.notas_importantes }}</p>
          </div>
        </div>

      </div>

      <!-- Modo Edición -->
      <form v-else @submit.prevent="handleSave" class="space-y-6">
        
        <!-- Alergias -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-allergies text-red-600 mr-1"></i>
            Alergias
          </label>
          <input
            v-model="alergiasInput"
            type="text"
            placeholder="Ej: Penicilina, Polen, Latex (separadas por coma)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
          <p class="text-xs text-gray-500 mt-1">Separar con comas si son múltiples</p>
        </div>

        <!-- Enfermedades Crónicas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-heartbeat text-orange-600 mr-1"></i>
            Enfermedades Crónicas / Actuales
          </label>
          <textarea
            v-model="form.enfermedades_actuales"
            rows="3"
            placeholder="Diabetes, Hipertensión, etc..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Medicamentos Actuales -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-pills text-purple-600 mr-1"></i>
            Medicamentos Actuales
          </label>
          <input
            v-model="medicamentosInput"
            type="text"
            placeholder="Ej: Metformina 500mg, Losartán 50mg (separados por coma)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
          <p class="text-xs text-gray-500 mt-1">Incluir dosis si es posible</p>
        </div>

        <!-- Antecedentes Quirúrgicos -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-cut text-blue-600 mr-1"></i>
            Antecedentes Quirúrgicos
          </label>
          <textarea
            v-model="form.cirugias_previas"
            rows="3"
            placeholder="Descripción de cirugías previas..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Hospitalizaciones -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-hospital text-teal-600 mr-1"></i>
            Hospitalizaciones Previas
          </label>
          <textarea
            v-model="form.hospitalizaciones"
            rows="2"
            placeholder="Motivo y fecha de hospitalizaciones..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Hábitos -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-4">Hábitos</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Tabaco -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <input
                  v-model="form.fuma"
                  type="checkbox"
                  id="fuma"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                >
                <label for="fuma" class="text-sm font-medium text-gray-700">
                  Consume tabaco
                </label>
              </div>
              <input
                v-if="form.fuma"
                v-model="form.frecuencia_tabaco"
                type="text"
                placeholder="Frecuencia (Ej: 5 cigarrillos/día)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
            </div>

            <!-- Alcohol -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <input
                  v-model="form.consume_alcohol"
                  type="checkbox"
                  id="alcohol"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                >
                <label for="alcohol" class="text-sm font-medium text-gray-700">
                  Consume alcohol
                </label>
              </div>
              <input
                v-if="form.consume_alcohol"
                v-model="form.frecuencia_alcohol"
                type="text"
                placeholder="Frecuencia (Ej: Social, fines de semana)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
            </div>
          </div>

          <!-- Bruxismo -->
          <div class="mt-4">
            <div class="flex items-center gap-2">
              <input
                v-model="form.bruxismo"
                type="checkbox"
                id="bruxismo"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              >
              <label for="bruxismo" class="text-sm font-medium text-gray-700">
                Presenta bruxismo (rechinar de dientes)
              </label>
            </div>
          </div>

          <!-- Otros hábitos -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Otros hábitos relevantes
            </label>
            <textarea
              v-model="form.otros_habitos"
              rows="2"
              placeholder="Morderse las uñas, uso de piercings orales, etc..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            ></textarea>
          </div>
        </div>

        <!-- Grupo Sanguíneo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-tint text-red-600 mr-1"></i>
            Grupo Sanguíneo
          </label>
          <select
            v-model="form.grupo_sanguineo"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No especificado</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <!-- Contacto de Emergencia -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-4">
            <i class="fas fa-phone-alt text-green-600 mr-1"></i>
            Contacto de Emergencia
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                v-model="form.contacto_emergencia_nombre"
                type="text"
                placeholder="Nombre completo"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                v-model="form.contacto_emergencia_telefono"
                type="tel"
                placeholder="+56 9 1234 5678"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Relación</label>
              <input
                v-model="form.contacto_emergencia_relacion"
                type="text"
                placeholder="Ej: Esposo/a, Hijo/a"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
            </div>
          </div>
        </div>

        <!-- Notas Importantes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-sticky-note text-yellow-600 mr-1"></i>
            Notas Importantes
          </label>
          <textarea
            v-model="form.notas_importantes"
            rows="3"
            placeholder="Información relevante que el profesional debe saber..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

      </form>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHistoriaClinicaStore } from '../stores/historiaClinica'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({
  pacienteId: {
    type: Number,
    required: true
  }
})

const historiaStore = useHistoriaClinicaStore()
const notify = useNotification()

// State
const loading = ref(false)
const saving = ref(false)
const isEditing = ref(false)

const form = ref({
  alergias: [],
  enfermedades_actuales: '',
  medicamentos_actuales: [],
  cirugias_previas: '',
  hospitalizaciones: '',
  fuma: false,
  frecuencia_tabaco: '',
  consume_alcohol: false,
  frecuencia_alcohol: '',
  bruxismo: false,
  otros_habitos: '',
  grupo_sanguineo: '',
  contacto_emergencia_nombre: '',
  contacto_emergencia_telefono: '',
  contacto_emergencia_relacion: '',
  notas_importantes: ''
})

const originalForm = ref(null)
const alergiasInput = ref('')
const medicamentosInput = ref('')

// Methods
async function fetchFichaMedica() {
  loading.value = true

  try {
    const response = await historiaStore.fetchFichaMedica(props.pacienteId)
    
    if (response.success && response.data) {
      // Cargar datos existentes
      const data = response.data
      
      form.value = {
        alergias: data.alergias || [],
        enfermedades_actuales: data.enfermedades_actuales || '',
        medicamentos_actuales: data.medicamentos_actuales || [],
        cirugias_previas: data.cirugias_previas || '',
        hospitalizaciones: data.hospitalizaciones || '',
        fuma: data.fuma || false,
        frecuencia_tabaco: data.frecuencia_tabaco || '',
        consume_alcohol: data.consume_alcohol || false,
        frecuencia_alcohol: data.frecuencia_alcohol || '',
        bruxismo: data.bruxismo || false,
        otros_habitos: data.otros_habitos || '',
        grupo_sanguineo: data.grupo_sanguineo || '',
        contacto_emergencia_nombre: data.contacto_emergencia_nombre || '',
        contacto_emergencia_telefono: data.contacto_emergencia_telefono || '',
        contacto_emergencia_relacion: data.contacto_emergencia_relacion || '',
        notas_importantes: data.notas_importantes || ''
      }
      
      // Para los inputs de texto
      alergiasInput.value = form.value.alergias.join(', ')
      medicamentosInput.value = form.value.medicamentos_actuales.join(', ')
    }
  } catch (error) {
    notify.error('Error al cargar ficha médica')
  } finally {
    loading.value = false
  }
}

function startEdit() {
  originalForm.value = JSON.parse(JSON.stringify(form.value))
  isEditing.value = true
}

function cancelEdit() {
  if (originalForm.value) {
    form.value = JSON.parse(JSON.stringify(originalForm.value))
    alergiasInput.value = form.value.alergias.join(', ')
    medicamentosInput.value = form.value.medicamentos_actuales.join(', ')
  }
  isEditing.value = false
}

async function handleSave() {
  saving.value = true

  try {
    // Procesar arrays
    form.value.alergias = alergiasInput.value
      ? alergiasInput.value.split(',').map(a => a.trim()).filter(a => a)
      : []
    
    form.value.medicamentos_actuales = medicamentosInput.value
      ? medicamentosInput.value.split(',').map(m => m.trim()).filter(m => m)
      : []

    const response = await historiaStore.saveFichaMedica(props.pacienteId, form.value)

    if (response.success) {
      notify.success('Ficha médica guardada correctamente', 'Guardado')
      isEditing.value = false
      originalForm.value = null
    } else {
      notify.error(response.message || 'Error al guardar ficha médica')
    }
  } catch (error) {
    notify.error('Error al guardar ficha médica')
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await fetchFichaMedica()
})
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>