<!-- views/auth/Login.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      
      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <!-- Header con Logo -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i class="fas fa-tooth text-4xl text-blue-600"></i>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">DentalCloud</h1>
          <p class="text-blue-100 text-sm">Sistema de Gestión Dental</p>
        </div>

        <!-- Formulario -->
        <div class="p-8">
          
          <!-- Título -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-1">Iniciar Sesión</h2>
            <p class="text-gray-600 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="authStore.error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <i class="fas fa-exclamation-circle text-red-500 text-xl mt-0.5"></i>
              <div class="flex-1">
                <h3 class="font-semibold text-red-800 text-sm mb-1">Error de Autenticación</h3>
                <p class="text-red-700 text-sm">{{ authStore.error }}</p>
              </div>
              <button 
                @click="authStore.clearError" 
                class="text-red-400 hover:text-red-600 transition"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            
            <!-- Slug de Clínica -->
            <div>
              <label for="clinica_slug" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-clinic-medical text-blue-600 mr-2"></i>
                Clínica
              </label>
              <input
                id="clinica_slug"
                v-model="form.clinica_slug"
                type="text"
                required
                placeholder="slug-de-tu-clinica"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                :disabled="authStore.loading"
              >
              <p class="text-xs text-gray-500 mt-1">
                <i class="fas fa-info-circle mr-1"></i>
                Ejemplo: clinica-dental-centro
              </p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-envelope text-blue-600 mr-2"></i>
                Correo Electrónico
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="tu@email.com"
                autocomplete="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                :disabled="authStore.loading"
              >
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-lock text-blue-600 mr-2"></i>
                Contraseña
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  autocomplete="current-password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  :disabled="authStore.loading"
                  @keyup.enter="handleLogin"
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabindex="-1"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Recordar sesión -->
            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                <span class="ml-2 text-sm text-gray-700">Recordar sesión</span>
              </label>
              
              <!-- <a href="#" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                ¿Olvidaste tu contraseña?
              </a> -->
            </div>

            <!-- Botón de Login -->
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <span v-if="!authStore.loading" class="flex items-center justify-center gap-2">
                <i class="fas fa-sign-in-alt"></i>
                <span>Iniciar Sesión</span>
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Autenticando...</span>
              </span>
            </button>

          </form>

        </div>

      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          DentalCloud © {{ currentYear }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          Sistema de Gestión para Clínicas Dentales
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = ref({
  clinica_slug: '',
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)

const currentYear = computed(() => new Date().getFullYear())

// Handle login
async function handleLogin() {
  const result = await authStore.login({
    clinica_slug: form.value.clinica_slug,
    email: form.value.email,
    password: form.value.password
  })

  if (result.success) {
    console.log('✅ Login exitoso, redirigiendo a dashboard...')
    router.push('/dashboard')
  } else {
    console.log('❌ Login fallido:', result.message)
    // El error ya está en authStore.error
  }
}
</script>

<style scoped>
/* Animaciones suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>