<!-- src/views/paciente/RecuperarPassword.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div v-if="clinicaInfo?.logo" class="flex justify-center mb-4">
          <img :src="clinicaInfo.logo" :alt="clinicaInfo.nombre" class="h-16">
        </div>
        <h2 class="text-3xl font-bold text-gray-900">
          Recuperar Contraseña
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ clinicaInfo?.nombre || 'Ingresa tu email para recuperar tu contraseña' }}
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        
        <!-- Paso 1: Solicitar email -->
        <div v-if="!emailEnviado">
          <form @submit.prevent="enviarSolicitud">
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  v-model="email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="tu@email.com"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <div class="flex items-center gap-2 text-red-800">
                <i class="fas fa-exclamation-circle"></i>
                <span class="text-sm">{{ error }}</span>
              </div>
            </div>

            <!-- Botones -->
            <div class="space-y-3">
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-paper-plane mr-2"></i>
                {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
              </button>

              <router-link
                :to="`/${clinicaSlug}/paciente/login`"
                class="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition flex items-center justify-center"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Volver al login
              </router-link>
            </div>

          </form>
        </div>

        <!-- Paso 2: Confirmación -->
        <div v-else class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-check text-3xl text-green-600"></i>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            ¡Email enviado!
          </h3>
          
          <p class="text-gray-600 mb-6">
            Hemos enviado las instrucciones para recuperar tu contraseña a <strong>{{ email }}</strong>
          </p>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p class="text-sm text-blue-900">
              <i class="fas fa-info-circle mr-2"></i>
              <strong>Nota:</strong> Si no recibes el email en los próximos minutos, verifica tu carpeta de spam o correo no deseado.
            </p>
          </div>

          <router-link
            :to="`/${clinicaSlug}/paciente/login`"
            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <i class="fas fa-arrow-left"></i>
            Volver al login
          </router-link>
        </div>

      </div>

      <!-- Link adicional -->
      <div class="text-center mt-6">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/paciente/api'

const router = useRouter()
const route = useRoute()

// State
const email = ref('')
const emailEnviado = ref(false)
const loading = ref(false)
const error = ref(null)
const clinicaInfo = ref(null)

// Computed
const clinicaSlug = computed(() => route.params.clinicaSlug || 'demo')

// Methods
async function enviarSolicitud() {
  if (!email.value) {
    error.value = 'Por favor ingresa tu email'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Endpoint: POST /auth/recuperar-password o /paciente/recuperar-password
    const response = await api.post('/auth/recuperar-password', {
      clinica_slug: clinicaSlug.value,
      email: email.value
    })

    if (response.data.success) {
      emailEnviado.value = true
    } else {
      error.value = response.data.message || 'Error al enviar el email'
    }
  } catch (err) {
    console.error('Error recuperar password:', err)
    
    if (err.response?.status === 404) {
      error.value = 'No encontramos una cuenta con ese email'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Error al enviar el email. Por favor intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}

async function cargarInfoClinica() {
  try {
    const response = await api.get(`/clinica/${clinicaSlug.value}`)
    if (response.data.success) {
      clinicaInfo.value = response.data.data
    }
  } catch (err) {
    console.error('Error cargar clínica:', err)
  }
}

// Lifecycle
onMounted(() => {
  cargarInfoClinica()
})
</script>