<!-- components/shared/Header.vue -->
<template>
  <header class="h-24 px-8 flex items-center justify-between relative z-30 bg-gray-50/50 backdrop-blur-md">
    <!-- Left: Breadcrumbs / Title -->
    <div class="flex items-center gap-6">
      <!-- Mobile Toggle -->
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 hover:text-violet-600 transition-colors"
      >
        <i class="fas fa-bars"></i>
      </button>

      <div>
        <h2 class="text-xl font-black text-gray-900 uppercase tracking-tight">
          {{ pageTitle }}
        </h2>
        <div class="flex items-center gap-2 mt-1">
          <span class="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse"></span>
          <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {{ pageSubtitle || 'Sistema de Gestión Inteligente' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right: Actions & User -->
    <div class="flex items-center gap-6">
      <!-- Search (Premium Style) -->
      <div class="hidden xl:block relative group">
        <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-violet-600 transition-colors text-xs"></i>
        <input
          type="text"
          placeholder="BUSCAR PACIENTE, CITA..."
          class="w-72 pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600/20 transition-all shadow-sm group-hover:shadow-md"
        >
      </div>

      <!-- Notifications -->
      <div class="relative">
        <button
          @click="toggleNotifications"
          class="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-violet-600 hover:shadow-md transition-all relative"
        >
          <i class="fas fa-bell text-sm"></i>
          <span
            v-if="unreadNotifications > 0"
            class="absolute top-3 right-3 w-4 h-4 bg-violet-600 text-white text-[8px] rounded-lg flex items-center justify-center font-black border-2 border-white shadow-lg shadow-violet-500/20"
          >
            {{ unreadNotifications }}
          </span>
        </button>

        <!-- Notifications Panel (Absoluto) -->
        <transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
        >
          <div v-show="notificationsOpen" class="absolute right-0 mt-4 w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 z-[60] overflow-hidden">
             <!-- Header -->
             <div class="flex items-center justify-between mb-6">
                <h4 class="text-sm font-black text-gray-900 uppercase tracking-tight">Notificaciones</h4>
                <button @click="markAllAsRead" class="text-[9px] font-black text-violet-600 uppercase tracking-widest hover:underline">Limpiar</button>
             </div>
             <!-- List -->
             <div class="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <div v-for="notif in notifications" :key="notif.id" class="flex gap-4 p-4 rounded-3xl bg-gray-50/50 hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-xs flex-shrink-0" :class="getNotifBg(notif.type)">
                    <i :class="getNotifIcon(notif.type)"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-black text-gray-900 uppercase tracking-tight mb-1">{{ notif.title }}</p>
                    <p class="text-[10px] font-bold text-gray-500 leading-relaxed line-clamp-2 uppercase tracking-tight opacity-70">{{ notif.message }}</p>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">{{ notif.time }}</p>
                  </div>
                </div>
             </div>
          </div>
        </transition>
      </div>

      <!-- Divider -->
      <div class="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

      <!-- User Menu -->
      <div class="relative">
        <button
          @click="toggleUserMenu"
          class="flex items-center gap-4 bg-white border border-gray-100 h-14 pl-2 pr-5 rounded-[1.2rem] hover:shadow-md transition-all group"
        >
          <!-- Avatar con gradiente -->
          <div class="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
            {{ authStore.userInitials }}
          </div>

          <!-- User Info -->
          <div class="hidden md:flex flex-col text-left">
            <span class="text-[10px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
              {{ authStore.userName }}
            </span>
            <span class="text-[8px] font-bold text-violet-500 uppercase tracking-widest leading-none">
              {{ authStore.user?.rol || 'Staff' }}
            </span>
          </div>

          <i class="fas fa-chevron-down text-[10px] text-gray-400 group-hover:text-violet-600 transition-colors"></i>
        </button>

        <!-- Dropdown (Absoluto) -->
        <transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-show="userMenuOpen" class="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 z-[60]">
             <div class="space-y-1">
                <router-link to="/perfil" @click="userMenuOpen = false" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-[10px] font-black text-gray-600 uppercase tracking-widest transition-colors">
                  <i class="fas fa-user-circle text-gray-400"></i> Mi Perfil
                </router-link>
                <router-link to="/configuracion" @click="userMenuOpen = false" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-[10px] font-black text-gray-600 uppercase tracking-widest transition-colors">
                  <i class="fas fa-cog text-gray-400"></i> Ajustes
                </router-link>
                <div class="h-[1px] bg-gray-100 my-2"></div>
                <button @click="handleLogout" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-[10px] font-black text-red-500 uppercase tracking-widest transition-colors">
                  <i class="fas fa-sign-out-alt"></i> Finalizar Sesión
                </button>
             </div>
          </div>
        </transition>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@shared/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

defineEmits(['toggle-sidebar'])

const userMenuOpen = ref(false)
const notificationsOpen = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Panel Principal',
    '/pacientes': 'Base de Pacientes',
    '/profesionales': 'Especialistas',
    '/tratamientos': 'Servicios Clínicos',
    '/agenda': 'Agenda Maestra',
    '/citas': 'Agenda Maestra',
    '/calendario': 'Calendario Global',
    '/facturacion': 'Módulo Financiero',
    '/reportes': 'Inteligencia de Datos',
    '/configuracion': 'Configuración Sistema',
    '/usuarios': 'Seguridad de Acceso'
  }
  return titles[route.path] || 'DentalCloud'
})

const pageSubtitle = computed(() => {
  const subtitles = {
    '/dashboard': 'Snapshot de rendimiento clínico',
    '/pacientes': 'Gestión integral de fichas y registros',
    '/agenda': 'Sincronización de citas y turnos',
    '/citas': 'Sincronización de citas y turnos'
  }
  return subtitles[route.path]
})

const notifications = ref([
  { id: 1, type: 'cita', title: 'Nueva Cita Agendada', message: 'Juan Pérez - Hoy a las 14:00 por Evaluación General', time: 'Hace 5 MIN' },
  { id: 2, type: 'pago', title: 'Abono Recibido', message: 'María González ha registrado un abono de $150.000', time: 'Hace 1 HR' },
  { id: 3, type: 'alert', title: 'Stock Crítico', message: 'Los Guantes de Nitrilo (M) han llegado al límite mínimo', time: 'Hace 2 HRS' }
])

const unreadNotifications = computed(() => notifications.value.length)

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
  notificationsOpen.value = false
}

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value
  userMenuOpen.value = false
}

function markAllAsRead() {
  notifications.value = []
  notificationsOpen.value = false
}

function getNotifIcon(type) {
  return type === 'cita' ? 'fas fa-calendar' : type === 'pago' ? 'fas fa-wallet' : 'fas fa-exclamation-circle'
}

function getNotifBg(type) {
  return type === 'cita' ? 'bg-blue-50 text-blue-600' : type === 'pago' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
}

async function handleLogout() {
  if (confirm('¿Estás seguro que deseas cerrar sesión en el sistema?')) {
    await authStore.logout()
    router.push('/login')
  }
}

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    userMenuOpen.value = false
    notificationsOpen.value = false
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
</style>
