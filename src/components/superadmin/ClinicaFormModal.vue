<!-- components/superadmin/ClinicaFormModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            <i class="fas fa-hospital text-blue-600 mr-2"></i>
            {{ isEdit ? 'Editar Clínica' : 'Nueva Clínica' }}
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
          
          <div class="space-y-4">
            
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Clínica *
              </label>
              <input
                v-model="form.nombre"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Clínica Dental Sonrisa"
              >
            </div>

            <!-- Email y Teléfono -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contacto@clinica.cl"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  v-model="form.telefono"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+56 9 1234 5678"
                >
              </div>
            </div>

            <!-- Dirección -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                v-model="form.direccion"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Av. Providencia 123"
              >
            </div>

            <!-- Ciudad y Región -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  v-model="form.ciudad"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Santiago"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Región
                </label>
                <input
                  v-model="form.region"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Metropolitana"
                >
              </div>
            </div>

            <!-- RUT y Razón Social -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Razón Social
                </label>
                <input
                  v-model="form.razon_social"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Clínica Dental SpA"
                >
              </div>
            </div>

            <!-- Plan (solo para nueva clínica) -->
            <div v-if="!isEdit">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Plan *
              </label>
              <select
                v-model="form.plan_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar plan...</option>
                <option value="1">Básico</option>
                <option value="2">Profesional</option>
                <option value="3">Enterprise</option>
              </select>
            </div>

            <!-- Estado (solo para editar) -->
            <div v-if="isEdit">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                v-model="form.estado"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>

            <!-- Credenciales (solo para nueva clínica) -->
            <div v-if="!isEdit" class="border-t pt-4 mt-4">
              <h4 class="font-medium text-gray-900 mb-3">Credenciales del Administrador</h4>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      v-model="form.admin_nombre"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Juan"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      v-model="form.admin_apellido"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Pérez"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email del Administrador *
                  </label>
                  <input
                    v-model="form.admin_email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@clinica.cl"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <input
                    v-model="form.admin_password"
                    type="password"
                    required
                    minlength="8"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mínimo 8 caracteres"
                  >
                </div>
              </div>
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
        <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
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
            {{ isEdit ? 'Guardar Cambios' : 'Crear Clínica' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdminClinicasStore } from '@/stores/superadmin/clinicas'

const props = defineProps({
  clinica: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const clinicasStore = useSuperAdminClinicasStore()

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  region: '',
  rut: '',
  razon_social: '',
  plan_id: '',
  estado: 'activa',
  // Credenciales admin (solo para crear)
  admin_nombre: '',
  admin_apellido: '',
  admin_email: '',
  admin_password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const isEdit = computed(() => !!props.clinica)

onMounted(() => {
  if (props.clinica) {
    // Modo edición - cargar datos
    form.value = {
      nombre: props.clinica.nombre || '',
      email: props.clinica.email || '',
      telefono: props.clinica.telefono || '',
      direccion: props.clinica.direccion || '',
      ciudad: props.clinica.ciudad || '',
      region: props.clinica.region || '',
      rut: props.clinica.rut || '',
      razon_social: props.clinica.razon_social || '',
      estado: props.clinica.estado || 'activa'
    }
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    let result

    if (isEdit.value) {
      // Actualizar clínica
      result = await clinicasStore.actualizarClinica(props.clinica.id, form.value)
    } else {
      // Crear nueva clínica
      result = await clinicasStore.crearClinica(form.value)
    }

    if (result.success) {
      emit('saved')
    } else {
      errorMessage.value = result.message || 'Error al guardar clínica'
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    errorMessage.value = 'Error al procesar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>