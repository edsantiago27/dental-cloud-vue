<!-- components/superadmin/PlanFormModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] overflow-y-auto">
        
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

        <!-- Loading State -->
        <div v-if="loadingInicial" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p class="text-gray-500">Cargando configuración...</p>
        </div>

        <!-- Body -->
        <form v-else @submit.prevent="handleSubmit" class="p-6">
          
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
                Precios y Configuración
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  >
                  <p v-if="form.precio_mensual && form.precio_anual" class="text-xs text-green-600 mt-1">
                    <i class="fas fa-check-circle mr-1"></i>
                    Descuento: {{ calcularDescuento() }}%
                  </p>
                </div>

                 <!-- Días Trial -->
                 <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Días de Prueba
                  </label>
                  <input
                    v-model.number="form.dias_trial"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <!-- Tipo Soporte -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nivel Soporte
                  </label>
                  <select v-model="form.tipo_soporte" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="email">Email</option>
                      <option value="chat">Chat</option>
                      <option value="telefono">Teléfono</option>
                      <option value="dedicado">Dedicado</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Límites -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-sliders-h text-blue-600 mr-2"></i>
                Límites de Recursos
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Max Pacientes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Max Pacientes</label>
                  <input v-model.number="form.max_pacientes" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0 = ilimitado">
                </div>
                <!-- Max Profesionales -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Max Profesionales</label>
                  <input v-model.number="form.max_profesionales" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0 = ilimitado">
                </div>
                <!-- Max Usuarios -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Max Usuarios</label>
                  <input v-model.number="form.max_usuarios" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0 = ilimitado">
                </div>
                <!-- Almacenamiento -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Almacenamiento (MB)</label>
                  <input v-model.number="form.max_almacenamiento_mb" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0 = ilimitado">
                </div>
                 <!-- Limite Emails -->
                 <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Límite Email/Mes</label>
                  <input v-model.number="form.limite_emails_mes" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0 = ilimitado">
                </div>
                 <!-- Limite SMS -->
                 <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Límite SMS/Mes</label>
                  <input v-model.number="form.limite_sms_mes" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0 = ilimitado">
                </div>
                  <!-- Limite Whatsapp -->
                  <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Límite WP/Mes</label>
                  <input v-model.number="form.limite_whatsapp_mes" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0 = ilimitado">
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2"><i class="fas fa-info-circle mr-1"></i> Ingresa 0 para ilimitado</p>
            </div>

            <!-- Módulos Dinámicos -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900 border-b pb-2">Módulos del Sistema</h4>
              
              <div v-for="(categoria, catKey) in modulosDisponibles" :key="catKey" class="bg-gray-50 p-4 rounded-lg">
                  <h5 class="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center">
                    {{ categoria.nombre }}
                  </h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <label 
                          v-for="(info, key) in categoria.modulos" 
                          :key="key"
                          class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                          :class="{'ring-2 ring-blue-500 border-transparent': form[key]}"
                      >
                          <input 
                              v-model="form[key]" 
                              type="checkbox" 
                              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          >
                          <div class="flex items-center gap-2">
                              <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                  <i :class="`fas ${info.icono} text-sm`"></i>
                              </div>
                              <span class="text-sm font-medium text-gray-700">{{ info.nombre }}</span>
                          </div>
                      </label>
                  </div>
              </div>
            </div>

            <!-- Estado y Visibilidad -->
            <div class="bg-gray-50 p-4 rounded-lg flex items-center gap-6">
              <label class="flex items-center gap-3 cursor-pointer">
                <input v-model="form.estado" true-value="activo" false-value="inactivo" type="checkbox" class="w-5 h-5 text-green-600 rounded">
                <div>
                  <p class="font-medium text-gray-900">Plan Activo</p>
                  <p class="text-xs text-gray-500">Disponible para nuevas clínicas</p>
                </div>
              </label>
              
               <label class="flex items-center gap-3 cursor-pointer">
                <input v-model="form.es_publico" type="checkbox" class="w-5 h-5 text-blue-600 rounded">
                <div>
                  <p class="font-medium text-gray-900">Público</p>
                  <p class="text-xs text-gray-500">Visible en Landing Page</p>
                </div>
              </label>

               <label class="flex items-center gap-3 cursor-pointer">
                <input v-model="form.es_popular" type="checkbox" class="w-5 h-5 text-yellow-500 rounded">
                <div>
                  <p class="font-medium text-gray-900">Destacado</p>
                  <p class="text-xs text-gray-500">Etiqueta "Más Popular"</p>
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
        <div class="sticky bottom-0 bg-white flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 rounded-b-xl z-10">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading || loadingInicial"
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
import { useSuperAdminPlanesStore } from '@superadmin/stores/planes'
import planesService from '@superadmin/services/planesService'

const props = defineProps({
  plan: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])
const planesStore = useSuperAdminPlanesStore()

const loading = ref(false)
const loadingInicial = ref(true)
const errorMessage = ref('')
const modulosDisponibles = ref({})
const isEdit = computed(() => !!props.plan)

// Formulario reactivo
const form = ref({})

// Inicializar formulario con valores por defecto
const initForm = () => ({
  nombre: '',
  slug: '',
  descripcion: '',
  precio_mensual: 0,
  precio_anual: 0,
  max_pacientes: 0,
  max_profesionales: 0,
  max_usuarios: 0,
  max_almacenamiento_mb: 0,
  limite_emails_mes: 0,
  limite_sms_mes: 0,
  limite_whatsapp_mes: 0,
  dias_trial: 14,
  tipo_soporte: 'email',
  es_publico: true,
  es_popular: false,
  estado: 'activo',
  // Los módulos se llenarán dinámicamente, pero inicializamos algunos base
  mod_dashboard: true,
  mod_pacientes: true
})

onMounted(async () => {
  try {
    // 1. Cargar metadatos de módulos desde el backend
    const response = await planesService.getModulosDisponibles()
    if (response.success) {
      modulosDisponibles.value = response.data
    }
  } catch (error) {
    console.error('Error cargando módulos:', error)
    errorMessage.value = 'Error al cargar la configuración de módulos'
  } finally {
    loadingInicial.value = false
    
    // 2. Inicializar form
    if (props.plan) {
      cargarDatosEdicion()
    } else {
      form.value = initForm()
    }
  }
})

function cargarDatosEdicion() {
  // Copiar propiedades base
  form.value = { ...initForm(), ...props.plan }
  
  // Asegurarse de que los booleanos sean booleanos reales
  // El backend devuelve 1/0 a veces, dependiendo del driver PDO
  Object.keys(form.value).forEach(key => {
    if (key.startsWith('mod_') || key.startsWith('portal_') || key.startsWith('es_')) {
      form.value[key] = !!form.value[key] // cast to boolean
    }
  })
}

function calcularDescuento() {
  if (!form.value.precio_mensual || !form.value.precio_anual) return 0
  const mensualAnualizado = form.value.precio_mensual * 12
  const descuento = ((mensualAnualizado - form.value.precio_anual) / mensualAnualizado) * 100
  return Math.round(descuento)
}

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    // Auto-generar slug
    if (!form.value.slug && form.value.nombre) {
      form.value.slug = form.value.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    let result
    if (isEdit.value) {
      result = await planesStore.actualizarPlan(props.plan.id, form.value)
    } else {
      result = await planesStore.crearPlan(form.value)
    }

    if (result.success) {
      emit('saved')
    } else {
      errorMessage.value = result.message || 'Error al guardar plan'
    }
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = 'Error inesperado al procesar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>