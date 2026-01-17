<!-- components/tratamientos/TratamientoFormModal.vue -->
<template>
  <!-- Backdrop -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Modal -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 class="text-xl font-bold text-gray-800">
                {{ isEdit ? 'Editar Tratamiento' : 'Nuevo Tratamiento' }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ isEdit ? 'Actualiza los datos del tratamiento' : 'Completa los datos del nuevo tratamiento' }}
              </p>
            </div>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Código -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Código <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.codigo"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.codigo.$error }"
                  placeholder="T001"
                  @blur="v$.codigo.$touch"
                  maxlength="20"
                >
                <p v-if="v$.codigo.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.codigo.$errors[0].$message }}
                </p>
              </div>

              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.nombre"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.nombre.$error }"
                  placeholder="Limpieza Dental"
                  @blur="v$.nombre.$touch"
                >
                <p v-if="v$.nombre.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.nombre.$errors[0].$message }}
                </p>
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Categoría <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.categoria"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.categoria.$error }"
                  @blur="v$.categoria.$touch"
                >
                  <option value="">Seleccionar categoría</option>
                  <option 
                    v-for="cat in categorias" 
                    :key="cat.value" 
                    :value="cat.value"
                  >
                    {{ cat.label }}
                  </option>
                </select>
                <p v-if="v$.categoria.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.categoria.$errors[0].$message }}
                </p>
              </div>

              <!-- Precio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Precio (CLP) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.precio"
                  type="number"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.precio.$error }"
                  placeholder="30000"
                  min="0"
                  step="1000"
                  @blur="v$.precio.$touch"
                >
                <p v-if="v$.precio.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.precio.$errors[0].$message }}
                </p>
              </div>

              <!-- Duración (minutos) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.duracion_estimada"
                  type="number"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.duracion_estimada.$error }"
                  placeholder="30"
                  min="15"
                  step="15"
                  @blur="v$.duracion_estimada.$touch"
                >
                <p v-if="v$.duracion_estimada.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.duracion_estimada.$errors[0].$message }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDuration(form.duracion_estimada) }}
                </p>
              </div>

              <!-- Estado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  v-model="form.estado"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <!-- Descripción (Full Width) -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  v-model="form.descripcion"
                  rows="3"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción detallada del tratamiento..."
                ></textarea>
              </div>

            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm text-red-700">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ errorMessage }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                :disabled="loading"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading || v$.$invalid"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  <span>{{ isEdit ? 'Actualizar' : 'Guardar' }}</span>
                </span>
                <span v-else class="flex items-center gap-2">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Guardando...</span>
                </span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, minLength, maxLength } from '@vuelidate/validators'
import { useTratamientosStore } from '@clinica/stores/tratamientos'

const tratamientosStore = useTratamientosStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  tratamiento: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

// State
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: 0,
  duracion_estimada: 30,
  estado: 'activo'
})

// Computed
const isEdit = computed(() => !!props.tratamiento)

const categorias = computed(() => tratamientosStore.categorias)

// Validation rules
const rules = {
  codigo: { 
    required,
    minLength: minLength(2),
    maxLength: maxLength(20)
  },
  nombre: { 
    required,
    minLength: minLength(3),
    maxLength: maxLength(200)
  },
  categoria: { 
    required
  },
  precio: { 
    required,
    minValue: minValue(0)
  },
  duracion_estimada: { 
    required,
    minValue: minValue(15)
  }
}

const v$ = useVuelidate(rules, form)

// Methods
function formatDuration(minutes) {
  if (!minutes) return ''
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0 && mins > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''} ${mins} minutos`
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`
  } else {
    return `${mins} minutos`
  }
}

function handleClose() {
  if (!loading.value) {
    emit('update:modelValue', false)
    resetForm()
  }
}

function resetForm() {
  form.value = {
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    duracion_estimada: 30,
    estado: 'activo'
  }
  errorMessage.value = ''
  v$.value.$reset()
}

function loadTratamiento() {
  if (props.tratamiento) {
    form.value = {
      codigo: props.tratamiento.codigo || '',
      nombre: props.tratamiento.nombre || '',
      descripcion: props.tratamiento.descripcion || '',
      categoria: props.tratamiento.categoria || '',
      precio: props.tratamiento.precio || 0,
      duracion_estimada: props.tratamiento.duracion_estimada || 30,
      estado: props.tratamiento.estado || 'activo'
    }
  }
}

async function handleSubmit() {
  // Validar
  const isValid = await v$.value.$validate()
  if (!isValid) {
    errorMessage.value = 'Por favor corrige los errores en el formulario'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    let result

    if (isEdit.value) {
      // Actualizar
      result = await tratamientosStore.updateTratamiento(props.tratamiento.id, form.value)
    } else {
      // Crear
      result = await tratamientosStore.createTratamiento(form.value)
    }

    if (result.success) {
      emit('saved')
      handleClose()
    } else {
      errorMessage.value = result.message || 'Error al guardar el tratamiento'
    }
  } catch (error) {
    errorMessage.value = 'Error inesperado al guardar el tratamiento'
  } finally {
    loading.value = false
  }
}

// Watch for modal open/close
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadTratamiento()
  } else {
    resetForm()
  }
})

// Load tratamiento on mount if editing
if (props.modelValue && props.tratamiento) {
  loadTratamiento()
}
</script>