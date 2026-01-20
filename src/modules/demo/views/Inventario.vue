<!-- src/modules/demo/views/Inventario.vue -->
<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Control de Stock</h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Gestión de insumos y materiales críticos</p>
      </div>
      <button 
        class="px-8 py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200 hover:scale-105 transition-all"
        @click="alert('Esta función está limitada en la demo')"
      >
        <i class="fas fa-plus-circle mr-2"></i> Nuevo Insumo
      </button>
    </div>

    <!-- Inventory Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="item in inventarioStore.items" 
        :key="item.id"
        class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-xl transition-all"
      >
        <div 
          v-if="item.stock <= item.stock_minimo"
          class="absolute top-4 right-4 text-orange-500 animate-pulse"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </div>

        <span class="text-[8px] font-black text-violet-600 uppercase tracking-widest bg-violet-50 px-2 py-1 rounded-lg w-fit mb-4">
          {{ item.categoria }}
        </span>
        
        <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight mb-6 flex-1">{{ item.nombre }}</h3>
        
        <div class="space-y-4">
          <div class="flex items-end justify-between">
             <div class="flex flex-col">
               <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Disponible</span>
               <span class="text-3xl font-black text-gray-900 tracking-tighter">{{ item.stock }}</span>
             </div>
             <div class="text-right flex flex-col">
               <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mínimo</span>
               <span class="text-xs font-bold text-gray-400 uppercase">{{ item.stock_minimo }}</span>
             </div>
          </div>

          <!-- Progress Bar -->
          <div class="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
             <div 
              class="h-full transition-all duration-1000" 
              :class="item.stock <= item.stock_minimo ? 'bg-orange-500' : 'bg-emerald-500'"
              :style="{ width: Math.min((item.stock / (item.stock_minimo * 3) * 100), 100) + '%' }"
             ></div>
          </div>

          <!-- Quick Actions -->
          <div class="pt-4 flex gap-2">
            <button 
              @click="inventarioStore.updateStock(item.id, 1)"
              class="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              + Ingreso
            </button>
            <button 
              @click="inventarioStore.updateStock(item.id, -1)"
              class="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              - Egreso
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Banner Info -->
    <div class="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative">
      <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>
      <div class="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center text-3xl">
        <i class="fas fa-lightbulb text-violet-400"></i>
      </div>
      <div class="flex-1 text-center md:text-left">
        <h4 class="text-lg font-black uppercase tracking-tight">Potencia tu Inventario</h4>
        <p class="text-xs text-gray-400 leading-relaxed mt-1">
          En el plan real, DentalCloud descuenta insumos automáticamente al registrar procedimientos y te envía alertas por WhatsApp cuando el stock es bajo.
        </p>
      </div>
      <div class="flex flex-col gap-2">
         <div class="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
           <i class="fas fa-check-circle"></i> Alertas Automáticas
         </div>
         <div class="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
           <i class="fas fa-check-circle"></i> Reportes de Consumo
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDemoInventarioStore } from '../stores/demoInventario'

const inventarioStore = useDemoInventarioStore()

onMounted(() => {
  inventarioStore.fetchItems()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
</style>
