<!-- src/views/paciente/Perfil.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
      <p class="text-gray-600 mt-1">Gestiona tu información personal</p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-green-800">
        <i class="fas fa-check-circle"></i>
        <span>{{ successMessage }}</span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-red-800">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Perfil Card -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      
      <!-- Avatar y nombre -->
      <div class="flex items-center gap-6 pb-6 border-b border-gray-200">
        <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {{ authStore.iniciales }}
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ authStore.nombreCompleto }}
          </h2>
          <p class="text-gray-600 mt-1">{{ authStore.paciente?.email }}</p>
          <p class="text-sm text-gray-500 mt-1">
            Paciente desde {{ formatFecha(authStore.paciente?.created_at) }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mt-6">
        <div class="flex gap-6">
          <button
            @click="tabActivo = 'informacion'"
            :class="[
              'pb-4 px-2 font-medium transition border-b-2',
              tabActivo === 'informacion'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            ]"
          >
            Información Personal
          </button>
          <button
            @click="tabActivo = 'seguridad'"
            :class="[
              'pb-4 px-2 font-medium transition border-b-2',
              tabActivo === 'seguridad'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            ]"
          >
            Seguridad
          </button>
        </div>
      </div>

      <!-- Información Personal -->
      <div v-if="tabActivo === 'informacion'" class="mt-6">
        <form @submit.prevent="guardarPerfil" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                v-model="form.nombre"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Apellido -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                v-model="form.apellido"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- RUT (no editable) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                RUT
              </label>
              <input
                :value="authStore.paciente?.rut"
                type="text"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              >
              <p class="text-xs text-gray-500 mt-1">El RUT no puede ser modificado</p>
            </div>

            <!-- Email (no editable) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                :value="authStore.paciente?.email"
                type="email"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              >
              <p class="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                v-model="form.telefono"
                type="tel"
                placeholder="+56 9 1234 5678"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Fecha de Nacimiento -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                v-model="form.fecha_nacimiento"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Género -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Género
              </label>
              <select
                v-model="form.genero"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

          </div>

          <!-- Dirección -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              v-model="form.direccion"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Ciudad -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                v-model="form.ciudad"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Comuna -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Comuna
              </label>
              <input
                v-model="form.comuna"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

          </div>

          <!-- Contacto de Emergencia -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Contacto de Emergencia
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  v-model="form.contacto_emergencia_nombre"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  v-model="form.contacto_emergencia_telefono"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Relación
                </label>
                <input
                  v-model="form.contacto_emergencia_relacion"
                  type="text"
                  placeholder="Ej: Madre, Esposo"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="cancelar"
              :disabled="loading"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              Guardar Cambios
            </button>
          </div>

        </form>
      </div>

      <!-- Seguridad -->
      <div v-else class="mt-6">
        <form @submit.prevent="cambiarPassword" class="space-y-6 max-w-xl">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="passwordForm.password_actual"
                :type="showPasswordActual ? 'text' : 'password'"
                required
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <button
                type="button"
                @click="showPasswordActual = !showPasswordActual"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="showPasswordActual ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="passwordForm.password"
                :type="showPasswordNueva ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <button
                type="button"
                @click="showPasswordNueva = !showPasswordNueva"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="showPasswordNueva ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña <span class="text-red-500">*</span>
            </label>
            <input
              v-model="passwordForm.password_confirmation"
              :type="showPasswordNueva ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="cancelarPassword"
              :disabled="loadingPassword"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loadingPassword"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              <i v-if="loadingPassword" class="fas fa-spinner fa-spin mr-2"></i>
              Cambiar Contraseña
            </button>
          </div>

        </form>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePacienteAuthStore } from '@/stores/paciente/auth'

const authStore = usePacienteAuthStore()

// State
const tabActivo = ref('informacion')
const loading = ref(false)
const loadingPassword = ref(false)
const error = ref(null)
const successMessage = ref(null)
const showPasswordActual = ref(false)
const showPasswordNueva = ref(false)

const form = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  fecha_nacimiento: '',
  genero: '',
  direccion: '',
  ciudad: '',
  comuna: '',
  contacto_emergencia_nombre: '',
  contacto_emergencia_telefono: '',
  contacto_emergencia_relacion: ''
})

const passwordForm = ref({
  password_actual: '',
  password: '',
  password_confirmation: ''
})

// Methods
function formatFecha(fecha) {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  })
}

function cargarDatos() {
  const paciente = authStore.paciente
  
  form.value = {
    nombre: paciente.nombre || '',
    apellido: paciente.apellido || '',
    telefono: paciente.telefono || '',
    fecha_nacimiento: paciente.fecha_nacimiento || '',
    genero: paciente.genero || '',
    direccion: paciente.direccion || '',
    ciudad: paciente.ciudad || '',
    comuna: paciente.comuna || '',
    contacto_emergencia_nombre: paciente.contacto_emergencia_nombre || '',
    contacto_emergencia_telefono: paciente.contacto_emergencia_telefono || '',
    contacto_emergencia_relacion: paciente.contacto_emergencia_relacion || ''
  }
}

async function guardarPerfil() {
  loading.value = true
  error.value = null
  successMessage.value = null

  try {
    const response = await authStore.fetchPerfil()
    // Actualizar con el servicio
    await authStore.store.actualizarPerfil(form.value)
    
    successMessage.value = 'Perfil actualizado correctamente'
    await authStore.fetchPerfil() // Recargar datos
    
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    error.value = 'Error al actualizar el perfil'
  } finally {
    loading.value = false
  }
}

function cancelar() {
  cargarDatos()
}

async function cambiarPassword() {
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (passwordForm.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loadingPassword.value = true
  error.value = null
  successMessage.value = null

  try {
    await authStore.cambiarPassword(
      passwordForm.value.password_actual,
      passwordForm.value.password,
      passwordForm.value.password_confirmation
    )
    
    successMessage.value = 'Contraseña actualizada correctamente'
    cancelarPassword()
    
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Error al cambiar la contraseña'
  } finally {
    loadingPassword.value = false
  }
}

function cancelarPassword() {
  passwordForm.value = {
    password_actual: '',
    password: '',
    password_confirmation: ''
  }
  showPasswordActual.value = false
  showPasswordNueva.value = false
}

// Lifecycle
onMounted(() => {
  cargarDatos()
})
</script>