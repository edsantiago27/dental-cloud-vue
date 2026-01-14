<!-- src/views/superadmin/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">SuperAdmin</h1>
          <p class="text-gray-500 mt-2">DentalCloud</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin">
          
          <!-- Email -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                v-model="email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="admin@dentalcloud.cl"
              >
            </div>
          </div>

          <!-- Password -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              >
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center gap-2 text-red-800">
              <i class="fas fa-exclamation-circle"></i>
              <span class="text-sm">{{ error }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-sign-in-alt mr-2"></i>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSuperAdminAuthStore } from '../stores/superadmin/auth'

const router = useRouter()
const authStore = useSuperAdminAuthStore()

// State
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Methods
async function handleLogin() {
  // Validación básica
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  error.value = ''
  loading.value = true

  try {
    console.log('🔐 Enviando login...', { email: email.value })
    
    // Llamar al store pasando email y password como argumentos separados
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      console.log('✅ Login exitoso, redirigiendo...')
      router.push('/superadmin/dashboard')
    } else {
      error.value = result.message || 'Error al iniciar sesión'
    }
  } catch (err) {
    console.error('❌ Error en handleLogin:', err)
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>