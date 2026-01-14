<!-- layouts/AdminLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    
    <!-- Sidebar -->
    <Sidebar 
      :is-open="sidebarOpen"
      @toggle="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      
      <!-- Header -->
      <Header @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-view />
        </div>
      </main>

      <!-- Footer (opcional) -->
      <footer class="bg-white border-t border-gray-200 px-4 py-3">
        <div class="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div>
            <span class="font-medium">{{ authStore.clinica?.nombre }}</span>
            <span class="mx-2">•</span>
            <span>DentalCloud © {{ currentYear }}</span>
          </div>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-blue-600 transition">Ayuda</a>
            <a href="#" class="hover:text-blue-600 transition">Soporte</a>
          </div>
        </div>
      </footer>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import Sidebar from '../components/admin/Sidebar.vue'
import Header from '../components/admin/Header.vue'

const authStore = useAuthStore()

// Sidebar state
const sidebarOpen = ref(true)

const currentYear = computed(() => new Date().getFullYear())

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>