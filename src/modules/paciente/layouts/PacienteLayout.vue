<template>
  <div class="min-h-screen bg-[#f8fafc] flex font-sans text-gray-900">
    
    <!-- Sidebar Desktop -->
    <aside class="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 h-screen sticky top-0 transition-all duration-300">
      <!-- Logo Area -->
      <div class="p-8 pb-10">
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-300">
            <i class="fas fa-tooth text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight text-gray-900 leading-none">DentalCloud</h1>
            <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Portal Paciente</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-5 py-4 text-gray-500 rounded-2xl transition-all duration-200 group relative"
          active-class="bg-blue-50/50 text-blue-600 font-bold"
        >
          <div class="w-2 h-0 bg-blue-600 absolute left-0 rounded-r-full group-[.router-link-active]:h-6 transition-all duration-300"></div>
          <i :class="[item.icon, 'text-lg transition-transform group-hover:scale-110']"></i>
          <span class="text-[15px]">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Bottom Profile/Settings -->
      <div class="p-6 border-t border-gray-50">
        <button 
          @click="handleLogout"
          class="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-semibold"
        >
          <i class="fas fa-sign-out-alt text-lg"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Sidebar Mobile Overlay -->
    <transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 lg:hidden" @click="sidebarOpen = false">
        <aside class="w-72 bg-white h-full shadow-2xl animate-slide-in" @click.stop>
          <div class="p-8 flex justify-between items-center border-b border-gray-50">
            <span class="font-bold text-xl">Menú</span>
            <button @click="sidebarOpen = false" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <nav class="p-4 space-y-2">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-4 px-5 py-4 text-gray-500 rounded-2xl transition-all"
              active-class="bg-blue-50 text-blue-600 font-bold"
              @click="sidebarOpen = false"
            >
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </aside>
      </div>
    </transition>

    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header con Glassmorphism -->
      <header class="h-20 lg:h-24 sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-100 px-6 lg:px-10 flex justify-between items-center">
        <!-- Mobile Menu Toggle & Breadcrumbs -->
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = true" class="lg:hidden w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
            <i class="fas fa-bars"></i>
          </button>
          <div class="hidden sm:block">
            <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tu Clínica</h2>
            <div class="flex items-center gap-2">
              <span class="text-base font-bold text-gray-900">{{ authStore.clinica?.nombre || 'DentalCloud' }}</span>
              <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Acciones & Perfil -->
        <div class="flex items-center gap-3 md:gap-6">
          <!-- Notificaciones -->
          <button class="w-11 h-11 md:w-12 md:h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all relative">
            <i class="fas fa-bell"></i>
            <span class="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <!-- Perfil Dropdown -->
          <div class="relative group">
            <button @click.stop="dropdownOpen = !dropdownOpen" class="flex items-center gap-3 p-1.5 md:p-2 pr-4 md:pr-5 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all focus:ring-2 focus:ring-blue-100">
              <div class="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ring-4 ring-white">
                {{ authStore.userInitials }}
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-bold text-gray-900 leading-tight truncate max-w-[120px]">{{ authStore.userName }}</p>
                <p class="text-[11px] font-semibold text-gray-400">Paciente</p>
              </div>
              <i class="fas fa-chevron-down text-[10px] text-gray-400 transition-transform" :class="{'rotate-180': dropdownOpen}"></i>
            </button>

            <!-- Menú Dropdown -->
            <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition duration-100 ease-in" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <div v-if="dropdownOpen" v-click-outside="() => dropdownOpen = false" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-[60]">
                <div class="px-5 py-3 border-b border-gray-50 mb-2">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-tighter">Mi Cuenta</p>
                </div>
                <router-link to="/paciente/perfil" class="flex items-center gap-4 px-5 py-3 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition font-semibold" @click="dropdownOpen = false">
                  <i class="fas fa-user-circle text-lg opacity-50"></i>
                  <span>Ver Mi Perfil</span>
                </router-link>
                <router-link to="/paciente/configuracion" class="flex items-center gap-4 px-5 py-3 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition font-semibold" @click="dropdownOpen = false">
                  <i class="fas fa-cog text-lg opacity-50"></i>
                  <span>Configuración</span>
                </router-link>
                <div class="border-t border-gray-50 my-2"></div>
                <button @click="handleLogout" class="w-full flex items-center gap-4 px-5 py-3 text-[14px] text-red-500 hover:bg-red-50 transition font-bold">
                  <i class="fas fa-sign-out-alt text-lg opacity-50"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Pantalla Dinámica -->
      <main class="flex-1 overflow-y-auto px-6 lg:px-10 py-8 lg:py-12 custom-scrollbar">
        <div class="max-w-[1400px] mx-auto animate-fade-in-up">
          <router-view v-slot="{ Component }">
            <transition mode="out-in" name="page-fade">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePacienteAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = usePacienteAuthStore()

// State
const sidebarOpen = ref(false)
const dropdownOpen = ref(false)

// Menu Items
const menuItems = [
  { path: '/paciente/portal', icon: 'fas fa-th-large', label: 'Dashboard' },
  { path: '/paciente/citas', icon: 'fas fa-calendar-check', label: 'Mis Citas' },
  { path: '/paciente/historia-clinica', icon: 'fas fa-notes-medical', label: 'Historia Clínica' },
  { path: '/paciente/documentos', icon: 'fas fa-folder-open', label: 'Mis Documentos' },
  { path: '/paciente/pagos', icon: 'fas fa-wallet', label: 'Pagos y Facturación' },
  { path: '/paciente/perfil', icon: 'fas fa-user-gear', label: 'Perfil de Usuario' },
]

// Methods
async function handleLogout() {
  dropdownOpen.value = false
  await authStore.logout()
  router.push('/paciente/login')
}

// Click outside directive simulation
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animate-slide-in {
  animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
