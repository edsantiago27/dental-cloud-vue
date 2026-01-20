<template>
  <div class="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-6 font-sans">
    <!-- Fondo decorativo sutil -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
    </div>

    <!-- Contenedor de Login -->
    <div v-if="!showClinicaSelector" class="w-full max-w-[440px] relative z-10 transition-all duration-500">
      <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-10 md:p-12">
        
        <!-- Logo y Bienvenida -->
        <div class="text-center mb-10">
          <div class="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 rotate-3 transition-transform hover:rotate-0 cursor-default">
            <i class="fas fa-tooth text-white text-3xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido</h1>
          <p class="text-gray-500 mt-2 font-medium">Gestiona tu salud dental con estilo</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 ml-1">
              Correo Electrónico
            </label>
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <i class="fas fa-envelope"></i>
              </span>
              <input
                v-model="email"
                type="email"
                required
                class="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="nombre@ejemplo.com"
              >
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <div class="flex justify-between items-center ml-1">
              <label class="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <router-link to="/paciente/recuperar-password" class="text-xs font-bold text-blue-600 hover:text-blue-700">
                ¿La olvidaste?
              </router-link>
            </div>
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <i class="fas fa-lock"></i>
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Mostrar/Ocultar contraseña"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <transition enter-active-class="animate-shake" leave-active-class="opacity-0">
            <div v-if="authStore.error" class="bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-2xl p-4 flex items-center gap-3">
              <div class="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-red-600 text-sm"></i>
              </div>
              <p class="text-sm font-semibold text-red-700">
                {{ authStore.error }}
              </p>
            </div>
          </transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!canSubmit"
            class="w-full group relative overflow-hidden bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
          >
            <div class="relative z-10 flex items-center justify-center gap-2">
              <span v-if="!authStore.loading">Iniciar Sesión</span>
              <template v-else>
                <i class="fas fa-circle-notch fa-spin"></i>
                <span>Verificando...</span>
              </template>
              <i v-if="!authStore.loading" class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </div>
          </button>
        </form>

        <!-- Registro Footer -->
        <div class="mt-10 text-center">
          <p class="text-gray-500 font-medium">
            ¿Nuevo aquí?
            <router-link to="/paciente/registro" class="text-blue-600 hover:text-blue-700 font-bold ml-1">
              Crea tu cuenta gratis
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Selector de Clínica (Con el mismo estilo premium) -->
    <div v-else class="w-full max-w-2xl relative z-10 animate-fade-in">
      <div class="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-10 md:p-12 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Selecciona tu Clínica</h2>
        <p class="text-gray-500 mb-10 font-medium">Parece que tienes fichas en múltiples centros</p>
        
        <ClinicaSelector
          :clinicas="availableClinics"
          :loading="authStore.loading"
          @select="handleClinicaSelection"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePacienteAuthStore } from '@paciente/stores/auth'
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
const clinicaSlug = computed(() => {
  return route.query.slug || 'demo'
})

const canSubmit = computed(() => {
  return email.value && password.value && !authStore.loading
})

// Methods
async function handleLogin() {
  if (!canSubmit.value) return

  const result = await authStore.login(
    clinicaSlug.value, 
    email.value, 
    password.value
  )

  if (result.success) {
    if (result.requiresSelection) {
      availableClinics.value = result.clinicas
      showClinicaSelector.value = true
    } else {
      toast.success('¡Bienvenido de nuevo!')
      const intendedRoute = sessionStorage.getItem('intended_route')
      if (intendedRoute) {
        router.push(intendedRoute)
        sessionStorage.removeItem('intended_route')
      } else {
        router.push({ name: 'paciente-portal' })
      }
    }
  } else {
    // El store ya maneja el mensaje de error que se muestra en el template
    toast.error(result.message || 'Error al iniciar sesión')
  }
}

async function handleClinicaSelection(clinicaId) {
  const result = await authStore.selectClinica(clinicaId)
  
  if (result.success) {
    toast.success('¡Clínica seleccionada!')
    router.push({ name: 'paciente-portal' })
  } else {
    toast.error(result.message || 'Error al seleccionar clínica')
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>

<style>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
