<!-- components/admin/Header.vue -->
<template>
  <header class="bg-white border-b border-gray-200 h-16">
    <div class="h-full px-4 flex items-center justify-between">
      
      <!-- Left: Menu Toggle + Breadcrumbs -->
      <div class="flex items-center gap-4">
        
        <!-- Menu Toggle (Mobile) -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden text-gray-500 hover:text-gray-700 transition"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>

        <!-- Breadcrumbs / Page Title -->
        <div>
          <h2 class="text-xl font-bold text-gray-800">
            {{ pageTitle }}
          </h2>
          <p class="text-xs text-gray-500" v-if="pageSubtitle">
            {{ pageSubtitle }}
          </p>
        </div>

      </div>

      <!-- Right: Search + Notifications + User -->
      <div class="flex items-center gap-4">
        
        <!-- Search -->
        <div class="hidden md:block">
          <div class="relative">
            <input
              type="text"
              placeholder="Buscar paciente, cita..."
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Notifications -->
        <button
          @click="toggleNotifications"
          class="relative text-gray-500 hover:text-gray-700 transition"
        >
          <i class="fas fa-bell text-xl"></i>
          <span
            v-if="unreadNotifications > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </span>
        </button>

        <!-- Divider -->
        <div class="h-8 w-px bg-gray-300"></div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
          >
            <!-- Avatar -->
            <div class="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {{ authStore.userInitials }}
            </div>

            <!-- User Info -->
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-800">
                {{ authStore.userName }}
              </p>
              <p class="text-xs text-gray-500">
                {{ authStore.user?.rol }}
              </p>
            </div>

            <!-- Dropdown Icon -->
            <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
          </button>

          <!-- User Dropdown -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-800">
                  {{ authStore.userName }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ authStore.user?.email }}
                </p>
              </div>

              <!-- Menu Items -->
              <router-link
                to="/perfil"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                @click="userMenuOpen = false"
              >
                <i class="fas fa-user mr-3 text-gray-400"></i>
                Mi Perfil
              </router-link>

              <router-link
                to="/configuracion"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                @click="userMenuOpen = false"
              >
                <i class="fas fa-cog mr-3 text-gray-400"></i>
                Configuración
              </router-link>

              <div class="border-t border-gray-100 my-2"></div>

              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <i class="fas fa-sign-out-alt mr-3"></i>
                Cerrar Sesión
              </button>
            </div>
          </transition>
        </div>

      </div>

    </div>

    <!-- Notifications Panel -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div
        v-if="notificationsOpen"
        class="absolute right-4 top-16 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-semibold text-gray-800">Notificaciones</h3>
          <button
            @click="markAllAsRead"
            class="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Marcar todas como leídas
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
          >
            <div class="flex gap-3">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                notification.type === 'cita' ? 'bg-blue-100 text-blue-600' :
                notification.type === 'pago' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
              ]">
                <i :class="[
                  notification.type === 'cita' ? 'fas fa-calendar' :
                  notification.type === 'pago' ? 'fas fa-dollar-sign' :
                  'fas fa-bell'
                ]"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-800 font-medium">
                  {{ notification.title }}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ notification.time }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 bg-gray-50 text-center">
          <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </transition>

  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

defineEmits(['toggle-sidebar'])

// State
const userMenuOpen = ref(false)
const notificationsOpen = ref(false)

// Page Title
const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/pacientes': 'Pacientes',
    '/profesionales': 'Profesionales',
    '/tratamientos': 'Tratamientos',
    '/citas': 'Citas',
    '/calendario': 'Calendario',
    '/facturacion': 'Facturación',
    '/pagos': 'Pagos',
    '/reportes': 'Reportes',
    '/configuracion': 'Configuración',
    '/usuarios': 'Usuarios'
  }
  return titles[route.path] || 'DentalCloud'
})

const pageSubtitle = computed(() => {
  // Opcional: Agregar subtítulos específicos
  return null
})

// Notifications (ejemplo)
const notifications = ref([
  {
    id: 1,
    type: 'cita',
    title: 'Nueva cita programada',
    message: 'Juan Pérez - Hoy 14:00',
    time: 'Hace 5 minutos'
  },
  {
    id: 2,
    type: 'pago',
    title: 'Pago recibido',
    message: 'María González - $150.000',
    time: 'Hace 1 hora'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Recordatorio',
    message: 'Revisar stock de materiales',
    time: 'Hace 2 horas'
  }
])

const unreadNotifications = computed(() => notifications.value.length)

// Functions
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

async function handleLogout() {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
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