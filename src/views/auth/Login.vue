<!-- views/auth/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
    <!-- Decoraciones de fondo (Animated gradients) -->
    <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] animate-pulse" style="animation-delay: 3s"></div>

    <div class="w-full max-w-lg p-6 relative z-10">
      <!-- Header / Logo Area -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-indigo-800 shadow-2xl shadow-violet-500/20 mb-8 group transition-transform hover:scale-110 duration-500">
          <i class="fas fa-tooth text-4xl text-white"></i>
        </div>
        <h1 class="text-5xl font-black text-white tracking-tighter mb-2 uppercase">DentalCloud</h1>
        <div class="flex items-center justify-center gap-3">
          <span class="h-[1px] w-12 bg-white/10"></span>
          <span class="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em]">Professional Clinic Management</span>
          <span class="h-[1px] w-12 bg-white/10"></span>
        </div>
      </div>

      <!-- Login Card (Glassmorphism) -->
      <div class="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden relative group">
        <div class="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>
        
        <div class="p-10 relative z-10">
          <div class="mb-8">
            <h2 class="text-2xl font-black text-white uppercase tracking-tight">Acceso Staff</h2>
            <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Ingresa los credenciales de tu clínica</p>
          </div>

          <!-- Error Alert (Modern) -->
          <transition 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="authStore.error" class="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
              <div class="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <p class="text-xs font-bold text-red-500 uppercase tracking-tight flex-1">{{ authStore.error }}</p>
              <button @click="authStore.clearError" class="p-2 text-red-500/50 hover:text-red-500">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </transition>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Clinic Identifier -->
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Identificador de Clínica</label>
              <div class="relative group/input">
                <i class="fas fa-clinic-medical absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within/input:text-violet-500"></i>
                <input
                  v-model="form.clinica_slug"
                  type="text"
                  required
                  placeholder="SLUG-DE-TU-CLINICA"
                  class="w-full pl-14 pr-6 py-5 bg-white/[0.05] border border-white/5 focus:bg-white/[0.08] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.1em] transition-all outline-none"
                  :disabled="authStore.loading"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Email -->
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Email</label>
                <div class="relative group/input">
                  <i class="fas fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within/input:text-violet-500"></i>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="CORREO@EJEMPLO.COM"
                    class="w-full pl-14 pr-6 py-5 bg-white/[0.05] border border-white/5 focus:bg-white/[0.08] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.1em] transition-all outline-none"
                    :disabled="authStore.loading"
                  >
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Contraseña</label>
                <div class="relative group/input">
                  <i class="fas fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within/input:text-violet-500"></i>
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                    class="w-full pl-14 pr-14 py-5 bg-white/[0.05] border border-white/5 focus:bg-white/[0.08] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 rounded-2xl text-[11px] font-black text-white transition-all outline-none"
                    :disabled="authStore.loading"
                  >
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Recordar sesión -->
            <div class="flex items-center justify-between px-2">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative w-5 h-5 flex items-center justify-center border-2 border-white/10 rounded-lg bg-white/5 transition-all group-hover:border-violet-500/50">
                  <input
                    v-model="form.remember"
                    type="checkbox"
                    class="peer opacity-0 absolute inset-0 cursor-pointer"
                  >
                  <i class="fas fa-check text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                </div>
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">Recordar Sesión</span>
              </label>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full py-6 bg-white text-black rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              <div v-if="authStore.loading" class="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              <span v-if="!authStore.loading">Autenticar Sistema</span>
              <span v-else>Procesando...</span>
              <i v-if="!authStore.loading" class="fas fa-chevron-right text-[10px] mt-0.5"></i>
            </button>
          </form>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <p class="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          DentalCloud Intelligent Systems &copy; {{ currentYear }}
        </p>
        <div class="flex items-center gap-6">
          <a href="#" class="text-[9px] font-bold text-gray-500 hover:text-violet-400 uppercase tracking-widest transition-colors">Soporte</a>
          <a href="#" class="text-[9px] font-bold text-gray-500 hover:text-violet-400 uppercase tracking-widest transition-colors">Seguridad</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@shared/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  clinica_slug: '',
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const currentYear = computed(() => new Date().getFullYear())

async function handleLogin() {
  const result = await authStore.loginClinica({
    clinica_slug: form.value.clinica_slug,
    email: form.value.email,
    password: form.value.password
  })

  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

.font-sans {
  font-family: 'Outfit', sans-serif;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.15; }
}

.animate-pulse {
  animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
