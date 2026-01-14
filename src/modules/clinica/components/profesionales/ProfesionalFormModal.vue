<!-- components/profesionales/ProfesionalFormModal.vue -->
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
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 rounded-t-xl sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-white">
                <i :class="isEdit ? 'fas fa-edit' : 'fas fa-plus-circle'" class="mr-2"></i>
                {{ isEdit ? 'Editar Profesional' : 'Nuevo Profesional' }}
              </h3>
              <button
                @click="handleClose"
                class="text-white hover:text-gray-200 transition"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6">
            
            <!-- Información Personal -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-user text-blue-600 mr-2"></i>
                Información Personal
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    v-model="form.nombre"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan"
                  >
                </div>

                <!-- Apellido -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    v-model="form.apellido"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pérez"
                  >
                </div>

                <!-- RUT -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    RUT
                  </label>
                  <input
                    v-model="form.rut"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12.345.678-9"
                  >
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="doctor@clinica.com"
                  >
                </div>

                <!-- Teléfono -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    v-model="form.telefono"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+56912345678"
                  >
                </div>

                <!-- Estado (solo en edición) -->
                <div v-if="isEdit">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    v-model="form.estado"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option
                      v-for="estado in profesionalesStore.ESTADOS"
                      :key="estado.value"
                      :value="estado.value"
                    >
                      {{ estado.label }}
                    </option>
                  </select>
                </div>

              </div>
            </div>

            <!-- Información Profesional -->
            <div class="mb-6 border-t border-gray-200 pt-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-user-md text-blue-600 mr-2"></i>
                Información Profesional
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <!-- Especialidad -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad
                  </label>
                  <select
                    v-model="form.especialidad"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar especialidad</option>
                    <option
                      v-for="esp in profesionalesStore.ESPECIALIDADES"
                      :key="esp"
                      :value="esp"
                    >
                      {{ esp }}
                    </option>
                  </select>
                </div>

                <!-- Registro Profesional -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Registro Profesional
                  </label>
                  <input
                    v-model="form.registro_profesional"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 123456"
                  >
                </div>

                <!-- Duración cita por defecto -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Duración de Cita (minutos)
                  </label>
                  <input
                    v-model.number="form.duracion_cita_default"
                    type="number"
                    min="10"
                    max="240"
                    step="5"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                  >
                </div>

                <!-- Color en agenda -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Color en Agenda
                  </label>
                  <div class="flex gap-2">
                    <input
                      v-model="form.color_agenda"
                      type="color"
                      class="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                    >
                    <input
                      v-model="form.color_agenda"
                      type="text"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#3B82F6"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    >
                  </div>
                </div>

              </div>
            </div>

            <!-- Horarios de Atención -->
            <div class="mb-6 border-t border-gray-200 pt-6">
              <HorariosEditor v-model="form.horarios" />
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else :class="isEdit ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
                {{ loading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Profesional') }}
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
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useNotification } from '@shared/composables/useNotification'
import HorariosEditor from './HorariosEditor.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  profesional: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'created', 'updated'])

const profesionalesStore = useProfesionalesStore()
const notify = useNotification()

const loading = ref(false)

const form = ref({
  nombre: '',
  apellido: '',
  rut: '',
  email: '',
  telefono: '',
  especialidad: '',
  registro_profesional: '',
  duracion_cita_default: 30,
  color_agenda: '#3B82F6',
  estado: 'activo',
  horarios: []
})

const isEdit = computed(() => !!props.profesional)

// Watch para cargar datos cuando se abre en modo edición
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.profesional) {
      // Modo edición
      form.value = {
        nombre: props.profesional.nombre || '',
        apellido: props.profesional.apellido || '',
        rut: props.profesional.rut || '',
        email: props.profesional.email || '',
        telefono: props.profesional.telefono || '',
        especialidad: props.profesional.especialidad || '',
        registro_profesional: props.profesional.registro_profesional || '',
        duracion_cita_default: props.profesional.duracion_cita_default || 30,
        color_agenda: props.profesional.color_agenda || '#3B82F6',
        estado: props.profesional.estado || 'activo',
        horarios: props.profesional.horarios ? [...props.profesional.horarios] : []
      }
    } else {
      // Modo creación
      form.value = {
        nombre: '',
        apellido: '',
        rut: '',
        email: '',
        telefono: '',
        especialidad: '',
        registro_profesional: '',
        duracion_cita_default: 30,
        color_agenda: '#3B82F6',
        estado: 'activo',
        horarios: []
      }
    }
  }
})

async function handleSubmit() {
  loading.value = true

  try {
    let result

    if (isEdit.value) {
      // Actualizar
      result = await profesionalesStore.updateProfesional(props.profesional.id, form.value)
      
      if (result.success) {
        notify.success('Profesional actualizado correctamente', 'Actualizado')
        emit('updated', result.data)
        handleClose()
      } else {
        notify.error(result.message || 'Error al actualizar profesional')
      }
    } else {
      // Crear
      result = await profesionalesStore.createProfesional(form.value)
      
      if (result.success) {
        notify.success('Profesional creado correctamente', 'Creado')
        emit('created', result.data)
        handleClose()
      } else {
        notify.error(result.message || 'Error al crear profesional')
      }
    }

    // Mostrar errores de validación si existen
    if (result.errors) {
      Object.keys(result.errors).forEach(field => {
        notify.error(result.errors[field][0], `Error en ${field}`)
      })
    }

  } catch (error) {
    console.error('Error al guardar profesional:', error)
    notify.error('Error inesperado al guardar profesional')
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>