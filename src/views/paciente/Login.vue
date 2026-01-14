<!-- src/views/paciente/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      
      <!-- Logo/Header -->
      <div class="text-center">
        <div v-if="clinicaInfo?.logo" class="mb-4">
          <img :src="clinicaInfo.logo" :alt="clinicaInfo.nombre" class="mx-auto h-16 w-auto">
        </div>
        <h2 class="text-3xl font-bold text-gray-900">
          {{ clinicaInfo?.nombre || 'Portal del Paciente' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa a tu cuenta
        </p>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="tu@email.com"
              >
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400 hover:text-gray-600"></i>
              </button>
            </div>
          </div>

          <!-- Recordar / Olvidé -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="recordar"
                v-model="recordar"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="recordar" class="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <router-link
                :to="`/${clinicaSlug}/paciente/recuperar-password`"
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-4">
            <div class="flex items-center gap-2 text-red-800">
              <i class="fas fa-exclamation-circle"></i>
              <span class="text-sm">{{ error }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-sign-in-alt mr-2"></i>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

        </form>

        <!-- Registro -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta?
            <router-link
              :to="`/${clinicaSlug}/paciente/registro`"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePacienteAuthStore } from '@/stores/paciente/auth'

const router = useRouter()
const route = useRoute()
const authStore = usePacienteAuthStore()

// State
const email = ref('')
const password = ref('')
const recordar = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Computed
const clinicaSlug = computed(() => route.params.clinicaSlug || 'demo')
const clinicaInfo = computed(() => authStore.clinica)

// Methods
async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(
      clinicaSlug.value,
      email.value,
      password.value
    )

    if (result.success) {
      console.log('✅ Login exitoso, redirigiendo...')
      router.push(`/${clinicaSlug.value}/paciente/dashboard`)
    } else {
      error.value = result.message || 'Error al iniciar sesión'
    }
  } catch (err) {
    console.error('❌ Error en handleLogin:', err)
    error.value = 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Limpiar cualquier error previo
  authStore.clearError()
})
</script>