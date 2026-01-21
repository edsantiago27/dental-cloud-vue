<!-- components/shared/MenuItem.vue -->
<template>
  <router-link
    :to="to"
    v-slot="{ isActive }"
    custom
  >
    <div
      @click="navigate"
      :class="[
        'group flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-500 relative overflow-hidden focus:outline-none',
        locked ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 
        isActive 
          ? 'bg-white/5 text-white shadow-[0px_0px_20px_rgba(255,255,255,0.02)] border border-white/5 ring-1 ring-white/5' 
          : 'text-gray-500 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
      ]"
    >
      <!-- Active Indicator (Sutil) -->
      <div 
        v-if="isActive" 
        class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full shadow-[0px_0px_10px_rgba(124,58,237,0.5)]"
      ></div>

      <!-- Icon Container -->
      <div 
        :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 flex-shrink-0',
          isActive 
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20 scale-110' 
            : 'bg-transparent group-hover:scale-110'
        ]"
      >
        <i :class="[icon, 'text-xs transition-transform']"></i>
      </div>

      <!-- Label -->
      <div v-show="isOpen" class="flex-1 flex items-center justify-between overflow-hidden">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-transform" :class="isActive ? 'translate-x-1' : ''">
          {{ label }}
        </span>
        
        <!-- Badge -->
        <div
          v-if="badge"
          :class="[
            'px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all',
            isActive 
              ? 'bg-violet-500/20 text-violet-400' 
              : 'bg-white/5 text-gray-400 group-hover:text-white'
          ]"
        >
          {{ badge }}
        </div>
      </div>

      <!-- Compact Badge Indicator -->
      <div
        v-if="!isOpen && badge"
        class="absolute top-3 right-3 w-2 h-2 bg-violet-600 rounded-full ring-4 ring-[#0a0a0a]"
      ></div>
    </div>
  </router-link>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
  isOpen: { type: Boolean, default: true },
  badge: { type: [Number, String], default: null },
  locked: { type: Boolean, default: false }
})

const emit = defineEmits(['lock-click'])
const router = useRouter()

function navigate(e) {
  e.preventDefault()
  e.stopPropagation()
  
  if (props.locked) {
    emit('lock-click', props.label)
    return
  }
  router.push(props.to)
}
</script>