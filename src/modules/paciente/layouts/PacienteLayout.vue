<!-- src/layouts/PacienteLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Logo y Nombre Clínica -->
          <div class="flex items-center gap-4">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <i class="fas fa-bars text-xl"></i>
            </button>
            
            <div class="flex items-center gap-3">
              <img
                v-if="authStore.clinica?.logo"
                :src="authStore.clinica.logo"
                :alt="authStore.clinica.nombre"
                class="h-10 w-auto"
              >
              <div>
                <h1 class="text-lg font-semibold text-gray-900">
                  {{ authStore.clinica?.nombre }}
                </h1>
                <p class="text-xs text-gray-500">Portal del Paciente</p>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            
            <!-- Notificaciones -->
            <button class="relative text-gray-600 hover:text-gray-900 p-2">
              <i class="fas fa-bell text-xl"></i>
              <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Dropdown Usuario -->
            <div class="relative">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {{ authStore.iniciales }}
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-900">{{ authStore.nombreCompleto }}</p>
                  <p class="text-xs text-gray-500">{{ authStore.paciente?.email }}</p>
                </div>
                <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
              </button>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="dropdownOpen"
                  v-click-outside="() => dropdownOpen = false"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                >
                  <router-link
                    :to="`/${clinicaSlug}/paciente/perfil`"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="dropdownOpen = false"
                  >
                    <i class="fas fa-user w-5"></i>
                    <span>Mi Perfil</span>
                  </router-link>
                  
                  <router-link
                    :to="`/${clinicaSlug}/paciente/configuracion`"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="dropdownOpen = false"
                  >
                    <i class="fas fa-cog w-5"></i>
                    <span>Configuración</span>
                  </router-link>

                  <div class="border-t border-gray-200 my-1"></div>

                  <button
                    @click="handleLogout"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <i class="fas fa-sign-out-alt w-5"></i>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </transition>
            </div>

          </div>
        </div>
      </div>
    </header>

    <!-- Layout -->
    <div class="flex">
      
      <!-- Sidebar Desktop -->
      <aside class="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
        <nav class="flex-1 px-4 py-6 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="`/${clinicaSlug}${item.path}`"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
            active-class="bg-blue-50 text-blue-600 font-medium"
          >
            <i :class="item.icon" class="w-5 text-lg"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Sidebar Mobile -->
      <transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          @click="sidebarOpen = false"
        >
          <aside
            class="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl"
            @click.stop
          >
            <div class="p-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Menú</h2>
                <button @click="sidebarOpen = false" class="text-gray-500 hover:text-gray-700">
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <nav class="px-4 py-6 space-y-1">
              <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="`/${clinicaSlug}${item.path}`"
                class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                active-class="bg-blue-50 text-blue-600 font-medium"
                @click="sidebarOpen = false"
              >
                <i :class="item.icon" class="w-5 text-lg"></i>
                <span>{{ item.label }}</span>
              </router-link>
            </nav>
          </aside>
        </div>
      </transition>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePacienteAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = usePacienteAuthStore()

// State
const sidebarOpen = ref(false)
const dropdownOpen = ref(false)

// Computed
const clinicaSlug = computed(() => route.params.clinicaSlug || 'demo')

// Menu Items
const menuItems = [
  { path: '/paciente/dashboard', icon: 'fas fa-home', label: 'Inicio' },
  { path: '/paciente/citas', icon: 'fas fa-calendar-alt', label: 'Mis Citas' },
  { path: '/paciente/historia-clinica', icon: 'fas fa-file-medical', label: 'Historia Clínica' },
  { path: '/paciente/documentos', icon: 'fas fa-folder-open', label: 'Documentos' },
  { path: '/paciente/pagos', icon: 'fas fa-credit-card', label: 'Pagos' },
  { path: '/paciente/perfil', icon: 'fas fa-user', label: 'Mi Perfil' },
]

// Methods
async function handleLogout() {
  dropdownOpen.value = false
  
  await authStore.logout()
  
  router.push(`/${clinicaSlug.value}/paciente/login`)
}

// Click Outside Directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>