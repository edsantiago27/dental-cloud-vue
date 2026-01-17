<!-- components/admin/MenuItem.vue -->
<template>
  <router-link
    :to="to"
    v-slot="{ isActive }"
    custom
  >
    <div
      @click="navigate"
      :class="[
        'flex items-center gap-3 px-3 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-200',
        isActive 
          ? 'bg-blue-700 text-white shadow-lg' 
          : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
      ]"
    >
      <!-- Icon -->
      <div 
        :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
          isActive 
            ? 'bg-white/20' 
            : 'bg-transparent'
        ]"
      >
        <i :class="[icon, 'text-lg']"></i>
      </div>

      <!-- Label (solo cuando sidebar está abierto) -->
      <div v-if="isOpen" class="flex-1 flex items-center justify-between">
        <span class="font-medium">{{ label }}</span>
        
        <!-- Badge (opcional) -->
        <span
          v-if="badge"
          :class="[
            'px-2 py-0.5 rounded-full text-xs font-bold',
            isActive 
              ? 'bg-white text-blue-700' 
              : 'bg-blue-600 text-white'
          ]"
        >
          {{ badge }}
        </span>
      </div>

      <!-- Badge small (cuando sidebar está contraído) -->
      <span
        v-if="!isOpen && badge"
        class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-900"
      ></span>
    </div>
  </router-link>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  badge: {
    type: [Number, String],
    default: null
  }
})

const router = useRouter()

function navigate() {
  router.push(props.to)
}
</script>

<style scoped>
.router-link-active {
  /* Estilos adicionales si es necesario */
}
</style>