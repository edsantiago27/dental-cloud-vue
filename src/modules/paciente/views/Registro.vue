<!-- src/views/paciente/Registro.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full space-y-8">
      
      <!-- Logo/Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">
          Crear Cuenta de Paciente
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ clinicaInfo?.nombre || 'Completa tus datos para registrarte' }}
        </p>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleRegistro" class="space-y-6">
          
          <!-- Datos Personales -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              <i class="fas fa-user mr-2 text-blue-600"></i>
              Datos Personales
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- RUT -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  RUT <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.rut"
                  type="text"
                  required
                  placeholder="12.345.678-9"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <!-- Fecha Nacimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.fecha_nacimiento"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.nombre"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <!-- Apellido -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Apellido <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.apellido"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>
          </div>

          <!-- Datos de Contacto -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              <i class="fas fa-address-book mr-2 text-blue-600"></i>
              Datos de Contacto
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <!-- Teléfono -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.telefono"
                  type="tel"
                  required
                  placeholder="+56 9 1234 5678"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>
          </div>

          <!-- Contraseña -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              <i class="fas fa-lock mr-2 text-blue-600"></i>
              Contraseña
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="new-password"
                    minlength="6"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              <!-- Confirmar Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.password_confirmation"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>
          </div>

          <!-- Términos -->
          <div class="flex items-start">
            <input
              id="terminos"
              v-model="aceptaTerminos"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="terminos" class="ml-2 text-sm text-gray-700">
              Acepto los 
              <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">términos y condiciones</a>
              y la 
              <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">política de privacidad</a>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-4">
            <div class="flex items-center gap-2 text-red-800">
              <i class="fas fa-exclamation-circle"></i>
              <span class="text-sm">{{ error }}</span>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="rounded-lg bg-green-50 border border-green-200 p-4">
            <div class="flex items-center gap-2 text-green-800">
              <i class="fas fa-check-circle"></i>
              <span class="text-sm">{{ success }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="router.push(`/${clinicaSlug}/paciente/login`)"
              class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Volver
            </button>
            
            <button
              type="submit"
              :disabled="loading || !aceptaTerminos"
              class="flex-1 py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-user-plus mr-2"></i>
              {{ loading ? 'Registrando...' : 'Registrarme' }}
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePacienteAuthStore } from '@paciente/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = usePacienteAuthStore()

// State
const form = ref({
  rut: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fecha_nacimiento: '',
  password: '',
  password_confirmation: ''
})

const showPassword = ref(false)
const aceptaTerminos = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

// Computed
const clinicaSlug = computed(() => route.params.clinicaSlug || 'demo')
const clinicaInfo = computed(() => authStore.clinica)

// Methods
async function handleRegistro() {
  // Validaciones
  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (!aceptaTerminos.value) {
    error.value = 'Debes aceptar los términos y condiciones'
    return
  }

  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const result = await authStore.registro(clinicaSlug.value, form.value)

    if (result.success) {
      success.value = '¡Registro exitoso! Redirigiendo...'
      
      setTimeout(() => {
        router.push(`/${clinicaSlug.value}/paciente/dashboard`)
      }, 1500)
    } else {
      error.value = result.message || 'Error al registrarse'
    }
  } catch (err) {
    console.error('❌ Error en handleRegistro:', err)
    error.value = 'Error al registrarse. Por favor intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>