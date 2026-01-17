<!-- components/superadmin/PlanFormModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[90vh] overflow-y-auto">
        
        <!-- Header -->
        <div class="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl z-10">
          <h3 class="text-xl font-semibold text-gray-900">
            <i class="fas fa-layer-group text-blue-600 mr-2"></i>
            {{ isEdit ? 'Editar Plan' : 'Nuevo Plan' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit" class="p-6">
          
          <div class="space-y-6">
            
            <!-- Información Básica -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-4">Información Básica</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Plan *
                  </label>
                  <input
                    v-model="form.nombre"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Básico, Profesional, Enterprise"
                  >
                </div>

                <!-- Slug -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL amigable)
                  </label>
                  <input
                    v-model="form.slug"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ej: basico, profesional"
                  >
                </div>
              </div>

              <!-- Descripción -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  v-model="form.descripcion"
                  rows="2"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción breve del plan"
                ></textarea>
              </div>
            </div>

            <!-- Precios -->
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-dollar-sign text-green-600 mr-2"></i>
                Precios
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Precio Mensual -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Precio Mensual (CLP) *
                  </label>
                  <input
                    v-model.number="form.precio_mensual"
                    type="number"
                    min="0"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="29990"
                  >
                </div>

                <!-- Precio Anual -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Precio Anual (CLP) *
                  </label>
                  <input
                    v-model.number="form.precio_anual"
                    type="number"
                    min="0"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="299990"
                  >
                  <p v-if="form.precio_mensual && form.precio_anual" class="text-xs text-green-600 mt-1">
                    <i class="fas fa-check-circle mr-1"></i>
                    Descuento: {{ calcularDescuento() }}%
                  </p>
                </div>
              </div>
            </div>

            <!-- Límites -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-sliders-h text-blue-600 mr-2"></i>
                Límites de Recursos
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Max Pacientes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Máximo Pacientes
                  </label>
                  <input
                    v-model.number="form.max_pacientes"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 = ilimitado"
                  >
                </div>

                <!-- Max Profesionales -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Máximo Profesionales
                  </label>
                  <input
                    v-model.number="form.max_profesionales"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 = ilimitado"
                  >
                </div>

                <!-- Max Almacenamiento -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Almacenamiento (GB)
                  </label>
                  <input
                    v-model.number="form.max_almacenamiento"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 = ilimitado"
                  >
                </div>
              </div>

              <p class="text-xs text-gray-500 mt-2">
                <i class="fas fa-info-circle mr-1"></i>
                Ingresa 0 o deja vacío para recursos ilimitados
              </p>
            </div>

            <!-- Módulos -->
            <div class="bg-purple-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-puzzle-piece text-purple-600 mr-2"></i>
                Módulos Incluidos
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  v-for="modulo in modulosDisponibles"
                  :key="modulo.key"
                  class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition"
                >
                  <input
                    v-model="form.modulos[modulo.key]"
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  >
                  <div>
                    <p class="font-medium text-gray-900 text-sm">{{ modulo.label }}</p>
                    <p class="text-xs text-gray-500">{{ modulo.descripcion }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Estado -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-4">Estado</h4>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="form.activo"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
                <div>
                  <p class="font-medium text-gray-900">Plan Activo</p>
                  <p class="text-sm text-gray-500">El plan estará disponible para nuevas clínicas</p>
                </div>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center gap-2 text-red-800">
                <i class="fas fa-exclamation-circle"></i>
                <span class="text-sm">{{ errorMessage }}</span>
              </div>
            </div>

          </div>

        </form>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-white flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ isEdit ? 'Guardar Cambios' : 'Crear Plan' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdminPlanesStore } from '@superadmin/stores/superadmin/planes'

const props = defineProps({
  plan: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const planesStore = useSuperAdminPlanesStore()

const form = ref({
  nombre: '',
  slug: '',
  descripcion: '',
  precio_mensual: 0,
  precio_anual: 0,
  max_pacientes: 0,
  max_profesionales: 0,
  max_almacenamiento: 0,
  modulos: {
    agenda: true,
    historia_clinica: true,
    facturacion: true,
    inventario: false,
    reportes: true,
    whatsapp: false,
    recordatorios: true
  },
  activo: true
})

const loading = ref(false)
const errorMessage = ref('')

const isEdit = computed(() => !!props.plan)

const modulosDisponibles = [
  { key: 'agenda', label: 'Agenda y Citas', descripcion: 'Calendario de citas' },
  { key: 'historia_clinica', label: 'Historia Clínica', descripcion: 'Fichas médicas digitales' },
  { key: 'facturacion', label: 'Facturación', descripcion: 'Emisión de facturas' },
  { key: 'inventario', label: 'Inventario', descripcion: 'Control de stock' },
  { key: 'reportes', label: 'Reportes', descripcion: 'Analytics y reportes' },
  { key: 'whatsapp', label: 'WhatsApp', descripcion: 'Integración WhatsApp' },
  { key: 'recordatorios', label: 'Recordatorios', descripcion: 'Recordatorios automáticos' }
]

function calcularDescuento() {
  if (!form.value.precio_mensual || !form.value.precio_anual) return 0
  const mensualAnualizado = form.value.precio_mensual * 12
  const descuento = ((mensualAnualizado - form.value.precio_anual) / mensualAnualizado) * 100
  return Math.round(descuento)
}

onMounted(() => {
  if (props.plan) {
    // Modo edición - cargar datos
    form.value = {
      nombre: props.plan.nombre || '',
      slug: props.plan.slug || '',
      descripcion: props.plan.descripcion || '',
      precio_mensual: props.plan.precio_mensual || 0,
      precio_anual: props.plan.precio_anual || 0,
      max_pacientes: props.plan.max_pacientes || 0,
      max_profesionales: props.plan.max_profesionales || 0,
      max_almacenamiento: props.plan.max_almacenamiento || 0,
      modulos: props.plan.modulos || {
        agenda: true,
        historia_clinica: true,
        facturacion: true,
        inventario: false,
        reportes: true,
        whatsapp: false,
        recordatorios: true
      },
      activo: props.plan.activo !== undefined ? props.plan.activo : true
    }
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    // Generar slug automático si está vacío
    if (!form.value.slug && form.value.nombre) {
      form.value.slug = form.value.nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    let result

    if (isEdit.value) {
      // Actualizar plan
      result = await planesStore.actualizarPlan(props.plan.id, form.value)
    } else {
      // Crear nuevo plan
      result = await planesStore.crearPlan(form.value)
    }

    if (result.success) {
      emit('saved')
    } else {
      errorMessage.value = result.message || 'Error al guardar plan'
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    errorMessage.value = 'Error al procesar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>