<!-- src/modules/superadmin/views/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
    <!-- Decoraciones de fondo (Animated gradients) -->
    <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] animate-pulse" style="animation-delay: 3s"></div>

    <div class="w-full max-w-lg p-6 relative z-10">
      <!-- Header / Logo Area -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-indigo-800 shadow-2xl shadow-violet-500/20 mb-8 group transition-transform hover:scale-110 duration-500">
          <i class="fas fa-crown text-4xl text-white"></i>
        </div>
        <h1 class="text-5xl font-black text-white tracking-tighter mb-2 uppercase">DentalCloud</h1>
        <div class="flex items-center justify-center gap-3">
          <span class="h-[1px] w-12 bg-white/10"></span>
          <span class="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">SuperAdmin Portal</span>
          <span class="h-[1px] w-12 bg-white/10"></span>
        </div>
      </div>

      <!-- Login Card (Glassmorphism) -->
      <div class="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden relative group">
        <div class="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>
        
        <div class="p-10 relative z-10">
          <div class="mb-8">
            <h2 class="text-2xl font-black text-white uppercase tracking-tight">Acceso Global</h2>
            <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Gestión centralizada del ecosistema</p>
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
            <div v-if="error" class="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
              <div class="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <p class="text-xs font-bold text-red-500 uppercase tracking-tight flex-1">{{ error }}</p>
              <button @click="error = ''" class="p-2 text-red-500/50 hover:text-red-500">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </transition>

          <form @submit.prevent="handleLogin" class="space-y-6">
            
            <div class="grid grid-cols-1 gap-6">
              <!-- Email -->
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Email Administrativo</label>
                <div class="relative group/input">
                  <i class="fas fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within/input:text-violet-500"></i>
                  <input
                    v-model="email"
                    type="email"
                    required
                    placeholder="contacto@opendevs.cl"
                    class="w-full pl-14 pr-6 py-5 bg-white/[0.05] border border-white/5 focus:bg-white/[0.08] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.1em] transition-all outline-none"
                    :disabled="loading"
                  >
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Contraseña Maestra</label>
                <div class="relative group/input">
                  <i class="fas fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within/input:text-violet-500"></i>
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                    class="w-full pl-14 pr-14 py-5 bg-white/[0.05] border border-white/5 focus:bg-white/[0.08] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 rounded-2xl text-[11px] font-black text-white transition-all outline-none"
                    :disabled="loading"
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

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-6 bg-white text-black rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              <div v-if="loading" class="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              <span v-if="!loading">Acceder al Panel</span>
              <span v-else>Verificando...</span>
              <i v-if="!loading" class="fas fa-chevron-right text-[10px] mt-0.5"></i>
            </button>
          </form>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <p class="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          DentalCloud SuperAdmin &copy; {{ new Date().getFullYear() }}
        </p>
        <div class="flex items-center gap-6">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-widest">System Operational</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSuperAdminAuthStore } from '@superadmin/stores/auth'

const router = useRouter()
const authStore = useSuperAdminAuthStore()

// State
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

// Methods
async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      router.push('/superadmin/dashboard')
    } else {
      error.value = result.message || 'Error al iniciar sesión'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
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
