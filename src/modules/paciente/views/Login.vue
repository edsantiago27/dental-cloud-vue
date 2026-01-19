<!-- src/views/paciente/Login.vue -->
<
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <!-- Formulario de Login -->
    <div v-if="!showClinicaSelector" class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo/Título -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-tooth text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Portal del Paciente</h1>
          <p class="text-gray-600 mt-2">Accede a tu información dental</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            >
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-sm text-red-600">
              <i class="fas fa-exclamation-circle mr-2"></i>
              {{ authStore.error }}
            </p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="!canSubmit"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!authStore.loading">Iniciar Sesión</span>
            <span v-else>
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Ingresando...
            </span>
          </button>
        </form>

        <!-- Registro -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta?
            <router-link to="/paciente/registro" class="text-blue-600 hover:text-blue-700 font-medium">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Selector de Clínica -->
    <ClinicaSelector
      v-else
      :clinicas="availableClinics"
      :loading="authStore.loading"
      @select="handleClinicaSelection"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePacienteAuthStore } from '@paciente/stores/auth' // ✅ Usar store correcto
import { useToast } from 'vue-toastification'
import ClinicaSelector from '@paciente/components/ClinicaSelector.vue'

const router = useRouter()
const route = useRoute()
const authStore = usePacienteAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showClinicaSelector = ref(false)
const availableClinics = ref([])

// Computed
// Obtener slug de la URL o usar uno por defecto (esto debería venir de la configuración del dominio o subdominio)
const clinicaSlug = computed(() => {
  // Si estamos en un subdominio, usarlo
  // Si estamos en ruta /:clinicaSlug/login, usarlo
  // Por ahora hardcodeamos 'demo' o lo sacamos del route query
  return route.query.clinica || 'demo'
})

const canSubmit = computed(() => {
  return email.value && password.value && !authStore.loading
})

// Methods
async function handleLogin() {
  if (!canSubmit.value) return

  // Usar la acción login del store de paciente
  // Nota: El store espera (clinicaSlug, email, password)
  const result = await authStore.login(
    clinicaSlug.value, 
    email.value, 
    password.value
  )

  if (result.success) {
    toast.success('¡Bienvenido!')
    
    // Verificar si hay una ruta intencionada guardada
    const intendedRoute = sessionStorage.getItem('intended_route')
    if (intendedRoute) {
      router.push(intendedRoute)
      sessionStorage.removeItem('intended_route')
    } else {
      router.push({ name: 'paciente-portal' })
    }
  } else {
    toast.error(result.message || 'Error al iniciar sesión')
  }
}
async function handleClinicaSelection(clinicaId) {
  const result = await authStore.selectClinica(clinicaId)
  
  if (result.success) {
    toast.success('¡Bienvenido!')
    router.push('/paciente/portal')
  } else {
    toast.error(result.message || 'Error al seleccionar clínica')
  }
}
onMounted(() => {
  // Limpiar cualquier error previo
  authStore.clearError()
})
</script>