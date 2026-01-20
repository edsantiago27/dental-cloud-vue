<template>
  <div class="max-w-4xl mx-auto space-y-6 flex flex-col h-full animate-fade-in-up p-4">
    
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Mi Perfil</h1>
        <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
          Gestiona tu cuenta y preferencias
        </p>
      </div>
    </div>

    <!-- Alert Messages -->
    <div v-if="statusMessage" :class="`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${statusType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`">
      <i :class="statusType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      {{ statusMessage }}
    </div>

    <!-- Profile Card -->
    <div class="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] p-8 shadow-xl shadow-gray-100/10 border border-gray-100 dark:border-white/5">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
        
        <!-- Avatar -->
        <div class="relative group">
          <div class="w-32 h-32 rounded-3xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-4xl font-black shadow-lg">
            {{ userInitials }}
          </div>
          <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-xl border-4 border-white dark:border-[#1e1e1e] flex items-center justify-center text-white text-xs shadow-lg">
            <i class="fas fa-check"></i>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 text-center md:text-left space-y-1">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">{{ user.name }}</h2>
          <p class="text-sm font-bold text-gray-400 dark:text-gray-500">{{ user.email }}</p>
          <div class="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
            <span class="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">
              {{ user.rol || 'Profesional' }}
            </span>
            <span class="px-3 py-1 bg-violet-100 dark:bg-violet-900/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Dental Cloud ID: #{{ user.id }}
            </span>
          </div>
        </div>

      </div>
    </div>

    <!-- Integrations Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Google Calendar -->
      <div class="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] p-8 shadow-xl shadow-gray-100/10 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
        <!-- Background Decoration -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10"></div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg border border-gray-50 dark:border-white/5">
              <i class="fab fa-google text-2xl text-gray-900 dark:text-white"></i>
            </div>
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">Google Calendar</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sincronización de Citas</p>
            </div>
          </div>

          <div v-if="loadingStatus" class="py-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
            <i class="fas fa-spinner fa-spin mr-2"></i> Cargando estado...
          </div>

          <div v-else>
            <div v-if="googleStatus.connected" class="space-y-6 animate-fade-in">
              <div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20">
                <i class="fas fa-check-circle text-green-500"></i>
                <div class="flex-1">
                  <p class="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-tight">Conectado</p>
                  <p class="text-[10px] text-green-600/80 dark:text-green-400/80 font-bold">Sincronizando automáticamente</p>
                </div>
              </div>
              
              <button 
                @click="disconnectGoogle" 
                :disabled="processing"
                class="w-full py-4 rounded-2xl border-2 border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <i v-if="processing" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-unlink"></i>
                Desconectar Cuenta
              </button>
            </div>

            <div v-else class="space-y-6 animate-fade-in">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                Conecta tu calendario personal para evitar conflictos de horarios. Tus citas de DentalCloud se sincronizarán automáticamente.
              </p>
              
              <button 
                @click="connectGoogle" 
                :disabled="processing"
                class="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <i v-if="processing" class="fas fa-spinner fa-spin"></i>
                <span v-else class="flex items-center gap-2">
                  <i class="fab fa-google"></i> Conectar con Google
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

       <!-- Security Placeholder -->
      <div class="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] p-8 shadow-xl shadow-gray-100/10 border border-gray-100 dark:border-white/5 relative overflow-hidden opacity-50 pointer-events-none">
        <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg border border-gray-50 dark:border-white/5">
              <i class="fas fa-shield-alt text-2xl text-gray-900 dark:text-white"></i>
            </div>
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">Seguridad</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contraseña y Accesos</p>
            </div>
          </div>
          <p class="text-sm text-gray-400 font-bold mb-4">Gestiona tu contraseña y sesiones activas.</p>
           <button class="w-full py-4 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest">
              Próximamente
          </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/shared/stores/auth'
import googleService from '@/modules/clinica/services/googleService'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const user = computed(() => authStore.user || {})
const userInitials = computed(() => {
  if (user.value.name) {
    return user.value.name.substring(0, 2).toUpperCase()
  }
  return 'MN'
})

const googleStatus = ref({ connected: false })
const loadingStatus = ref(true)
const processing = ref(false)
const statusMessage = ref('')
const statusType = ref('success')

// URL actual para redirect
// Si estamos en localhost:5173/perfil, la usaremos como redirect uri
const currentUrl = window.location.origin + window.location.pathname

async function fetchStatus() {
  loadingStatus.value = true
  try {
    const data = await googleService.getStatus()
    googleStatus.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loadingStatus.value = false
  }
}

async function connectGoogle() {
  processing.value = true
  try {
    // 1. Get Auth URL
    const { url } = await googleService.getAuthUrl(currentUrl)
    // 2. Redirect
    window.location.href = url
  } catch (e) {
    statusMessage.value = 'Error al iniciar conexión con Google'
    statusType.value = 'error'
    processing.value = false
  }
}

async function handleCallback(code) {
  processing.value = true
  statusMessage.value = 'Procesando conexión...'
  try {
    await googleService.handleCallback(code, currentUrl)
    statusMessage.value = 'Cuenta conectada exitosamente'
    statusType.value = 'success'
    await fetchStatus()
    // Limpiar Query Params
    router.replace({ query: {} })
  } catch (e) {
    statusMessage.value = 'Error al conectar cuenta'
    statusType.value = 'error'
  } finally {
    processing.value = false
  }
}

async function disconnectGoogle() {
  if(!confirm('¿Estás seguro de desconectar tu calendario? Dejarán de sincronizarse las citas.')) return
  
  processing.value = true
  try {
    await googleService.disconnect()
    statusMessage.value = 'Cuenta desconectada'
    statusType.value = 'success'
    await fetchStatus()
  } catch (e) {
    statusMessage.value = 'Error al desconectar'
    statusType.value = 'error'
  } finally {
    processing.value = false
  }
}

onMounted(async () => {
    // Check for callback code
    if (route.query.code) {
        await handleCallback(route.query.code)
    } else {
        fetchStatus()
    }
})
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>