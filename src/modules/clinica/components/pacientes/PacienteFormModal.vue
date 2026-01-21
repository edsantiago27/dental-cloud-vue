<!-- components/pacientes/PacienteFormModal.vue -->
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
                {{ isEdit ? 'Editar Paciente' : 'Nuevo Paciente' }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ isEdit ? 'Actualiza la información del paciente' : 'Completa los datos del nuevo paciente' }}
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
                  placeholder="Juan"
                  @blur="v$.nombre.$touch"
                >
                <p v-if="v$.nombre.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.nombre.$errors[0].$message }}
                </p>
              </div>

              <!-- Apellido -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.apellido"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.apellido.$error }"
                  placeholder="Pérez"
                  @blur="v$.apellido.$touch"
                >
                <p v-if="v$.apellido.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.apellido.$errors[0].$message }}
                </p>
              </div>

              <!-- RUT -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  RUT <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.rut"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.rut.$error }"
                  placeholder="12.345.678-9"
                  @input="handleRutInput"
                  @blur="v$.rut.$touch"
                  maxlength="12"
                >
                <p v-if="v$.rut.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.rut.$errors[0].$message }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.email.$error }"
                  placeholder="juan@ejemplo.com"
                  @blur="v$.email.$touch"
                >
                <p v-if="v$.email.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.email.$errors[0].$message }}
                </p>
              </div>

              <!-- Teléfono -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.telefono"
                  type="tel"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.telefono.$error }"
                  placeholder="+56 9 1234 5678"
                  @blur="v$.telefono.$touch"
                >
                <p v-if="v$.telefono.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.telefono.$errors[0].$message }}
                </p>
              </div>

              <!-- Fecha de Nacimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.fecha_nacimiento"
                  type="date"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.fecha_nacimiento.$error }"
                  :max="maxDate"
                  @blur="v$.fecha_nacimiento.$touch"
                >
                <p v-if="v$.fecha_nacimiento.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.fecha_nacimiento.$errors[0].$message }}
                </p>
              </div>

              <!-- Género -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  v-model="form.genero"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <!-- Dirección -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  v-model="form.direccion"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Av. Principal 123"
                >
              </div>

              <!-- Ciudad -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  v-model="form.ciudad"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Santiago"
                >
              </div>

              <!-- Previsión -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Previsión
                </label>
                <select
                  v-model="form.prevision"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="fonasa">Fonasa</option>
                  <option value="isapre">Isapre</option>
                  <option value="particular">Particular</option>
                </select>
              </div>

              <!-- Ocupación -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ocupación
                </label>
                <input
                  v-model="form.ocupacion"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Estudiante, Ingeniero, etc."
                >
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

              <!-- Notas (Full Width) -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Notas / Antecedentes
                </label>
                <textarea
                  v-model="form.notas"
                  rows="3"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notas adicionales sobre el paciente..."
                ></textarea>
              </div>

              <!-- Info Portal Access -->
              <div v-if="!isEdit && form.email" class="md:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4 animate-fade-in">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <i class="fas fa-key"></i>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Acceso al Portal</h4>
                  <p class="text-[10px] text-blue-700 leading-relaxed">
                    Al guardar, se enviará un email con las credenciales de acceso. La contraseña temporal será los primeros 6 dígitos de su RUT.
                  </p>
                </div>
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
import { required, email, minLength, maxLength } from '@vuelidate/validators'
import { usePacientesStore } from '@clinica/stores/pacientes'
import { formatRut, validateRut } from '@shared/utils/rutUtils'

const pacientesStore = usePacientesStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  paciente: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

// State
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  nombre: '',
  apellido: '',
  rut: '',
  email: '',
  telefono: '',
  fecha_nacimiento: '',
  genero: '',
  direccion: '',
  ciudad: '',
  prevision: '',
  ocupacion: '',
  estado: 'activo',
  notas: ''
})

// Computed
const isEdit = computed(() => !!props.paciente)

const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Custom validator for RUT
const validRut = (value) => {
  if (!value) return true // El required ya maneja esto
  return validateRut(value)
}

// Validation rules
const rules = {
  nombre: { 
    required,
    minLength: minLength(2),
    maxLength: maxLength(100)
  },
  apellido: { 
    required,
    minLength: minLength(2),
    maxLength: maxLength(100)
  },
  rut: { 
    required,
    validRut
  },
  email: { 
    required,
    email
  },
  telefono: { 
    required,
    minLength: minLength(9)
  },
  fecha_nacimiento: { 
    required
  }
}

const v$ = useVuelidate(rules, form)

// Methods
function handleRutInput(event) {
  const formatted = formatRut(event.target.value)
  form.value.rut = formatted
}

function handleClose() {
  if (!loading.value) {
    emit('update:modelValue', false)
    resetForm()
  }
}

function resetForm() {
  form.value = {
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    direccion: '',
    ciudad: '',
    prevision: '',
    ocupacion: '',
    estado: 'activo',
    notas: ''
  }
  errorMessage.value = ''
  v$.value.$reset()
}

function loadPaciente() {
  if (props.paciente) {
    form.value = {
      nombre: props.paciente.nombre || '',
      apellido: props.paciente.apellido || '',
      rut: props.paciente.rut || '',
      email: props.paciente.email || '',
      telefono: props.paciente.telefono || '',
      fecha_nacimiento: props.paciente.fecha_nacimiento || '',
      genero: props.paciente.genero || '',
      direccion: props.paciente.direccion || '',
      ciudad: props.paciente.ciudad || '',
      prevision: props.paciente.prevision || '',
      ocupacion: props.paciente.ocupacion || '',
      estado: props.paciente.estado || 'activo',
      notas: props.paciente.notas || props.paciente.observaciones || ''
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
      result = await pacientesStore.updatePaciente(props.paciente.id, form.value)
    } else {
      // Crear
      result = await pacientesStore.createPaciente(form.value)
    }

    if (result.success) {
      emit('saved')
      handleClose()
    } else {
      errorMessage.value = result.message || 'Error al guardar el paciente'
    }
  } catch (error) {
    errorMessage.value = 'Error inesperado al guardar el paciente'
  } finally {
    loading.value = false
  }
}

// Watch for modal open/close
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadPaciente()
  } else {
    resetForm()
  }
})

// Load paciente on mount if editing
if (props.modelValue && props.paciente) {
  loadPaciente()
}
</script>