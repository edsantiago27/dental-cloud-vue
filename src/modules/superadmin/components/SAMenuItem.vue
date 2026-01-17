<!-- components/superadmin/SAMenuItem.vue -->
<template>
  <RouterLink
    :to="to"
    v-slot="{ isActive }"
    custom
  >
    <div
      @click="navigate"
      :class="[
        'relative flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg cursor-pointer transition-all duration-200 text-sm',
        isActive
          ? 'bg-slate-50 text-slate-900 shadow-md'
          : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-50'
      ]"
    >
      <!-- Icon -->
      <div
        :class="[
          'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
          isActive ? 'bg-slate-900/5' : 'bg-slate-900/20'
        ]"
      >
        <i :class="[icon, 'text-base']"></i>
      </div>

      <!-- Label (cuando sidebar está abierto) -->
      <div
        v-if="isOpen"
        class="flex-1 flex items-center justify-between min-w-0"
      >
        <span class="font-medium truncate">
          {{ label }}
        </span>

        <!-- Badge principal -->
        <span
          v-if="badge"
          :class="[
            'ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold',
            isActive
              ? 'bg-sky-600 text-white'
              : 'bg-slate-800 text-slate-100'
          ]"
        >
          {{ badge }}
        </span>
      </div>

      <!-- Badge pequeño (sidebar colapsado) -->
      <span
        v-if="!isOpen && badge"
        class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"
      ></span>
    </div>
  </RouterLink>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
  isOpen: { type: Boolean, default: true },
  badge: { type: [Number, String], default: null },
})

const router = useRouter()

function navigate() {
  router.push(props.to)
}
</script>

<style scoped>
/* No usamos .router-link-active porque manejamos isActive via slot */
</style>
