<!-- views/superadmin/Planes.vue -->
<template>
  <div class="space-y-8 animate-fade-in-up">

    <!-- Header -->
    <div class="flex items-center justify-between pb-2">
      <div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Modelo de Negocio</h2>
        <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Configuración de suscripciones y límites comerciales</p>
      </div>
      <button
        @click="modalNuevoPlan = true"
        class="px-8 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
      >
        <i class="fas fa-plus mr-2"></i> Nuevo Plan
      </button>
    </div>

    <!-- Planes Grid -->
    <div v-if="planesList.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      
      <div
        v-for="plan in planesOrdenados"
        :key="plan.id"
        class="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none overflow-hidden transition-all hover:scale-[1.02] flex flex-col"
        :class="{ 'opacity-60 grayscale-[0.5]': plan.estado !== 'activo' }"
      >
        
        <!-- Header del Plan (Gradient per target) -->
        <div
          class="p-8 text-white relative overflow-hidden"
          :class="{
            'bg-gradient-to-br from-violet-600 to-violet-800 dark:from-orange-500 dark:to-orange-700': plan.nombre === 'Enterprise' || plan.nombre === 'Profesional',
            'bg-gray-900 dark:bg-white/10 text-white': plan.nombre === 'Básico'
          }"
        >
          <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div class="flex items-start justify-between relative z-10 mb-8">
            <div>
              <h3 class="text-2xl font-black tracking-tight uppercase">{{ plan.nombre }}</h3>
              <p class="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">{{ plan.descripcion }}</p>
            </div>
            <div 
              v-if="plan.estado !== 'activo'"
              class="px-3 py-1 bg-black/20 rounded-full text-[9px] font-black uppercase tracking-widest"
            >
              {{ plan.estado }}
            </div>
          </div>
          
          <div class="relative z-10">
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black tracking-tighter">{{ formatMoney(plan.precio_mensual) }}</span>
              <span class="text-xs font-bold opacity-70">/mes</span>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">
              o {{ formatMoney(plan.precio_anual) }} anualizado
            </p>
          </div>
        </div>

        <!-- Features & Limits -->
        <div class="p-8 space-y-8 flex-1">
          
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                <i class="fas fa-users text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacidad</p>
                <p class="text-sm font-black text-gray-900 dark:text-white">{{ plan.max_pacientes || 'Ilimitado' }} <span class="text-[10px] font-bold opacity-50 uppercase ml-1">Pacientes</span></p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                <i class="fas fa-user-md text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal</p>
                <p class="text-sm font-black text-gray-900 dark:text-white">{{ plan.max_profesionales || 'Ilimitado' }} <span class="text-[10px] font-bold opacity-50 uppercase ml-1">Profesionales</span></p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                <i class="fas fa-hdd text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Almacenamiento</p>
                <p class="text-sm font-black text-gray-900 dark:text-white">{{ plan.max_almacenamiento_gb || '5' }} GB <span class="text-[10px] font-bold opacity-50 uppercase ml-1">Cloud Space</span></p>
              </div>
            </div>
          </div>

          <!-- Módulos Incluidos (Small Pills) -->
          <div class="pt-6 border-t border-gray-50 dark:border-white/5">
             <p class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Ecosistema de Módulos</p>
             <div class="flex flex-wrap gap-2">
               <span 
                v-for="modulo in modulosDisponibles" 
                :key="modulo.key"
                class="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all"
                :class="plan[modulo.key] 
                  ? 'bg-violet-50 dark:bg-orange-500/10 text-violet-600 dark:text-orange-500' 
                  : 'bg-gray-50 dark:bg-white/5 text-gray-300 dark:text-gray-700'"
               >
                 <i :class="[plan[modulo.key] ? 'fas fa-check-circle' : 'fas fa-minus-circle', 'mr-1.5']"></i>
                 {{ modulo.label }}
               </span>
             </div>
          </div>
        </div>

        <!-- Footnote / Usage -->
        <div v-if="plan.clinicas_count" class="px-8 py-4 bg-gray-50 dark:bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center border-t border-gray-100 dark:border-white/5">
          {{ plan.clinicas_count }} Clínicas Activas
        </div>

        <!-- Acciones -->
        <div class="p-8 bg-white dark:bg-[#111111] border-t border-gray-50 dark:border-white/5 flex gap-3">
          <button
            @click="editarPlan(plan)"
            class="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Editar Plan
          </button>
          <button
            @click="confirmarDesactivar(plan)"
            class="w-14 h-14 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-white/5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all"
          >
            <i class="fas fa-pause-circle"></i>
          </button>
        </div>

      </div>

    </div>

    <!-- Modales -->
    <PlanFormModal
      v-if="modalNuevoPlan || modalEditarPlan"
      :plan="planParaEditar"
      @close="cerrarModales"
      @saved="handlePlanSaved"
    />

    <ConfirmModal
      v-if="modalConfirm.show"
      :title="modalConfirm.title"
      :message="modalConfirm.message"
      :type="modalConfirm.type"
      @confirm="modalConfirm.onConfirm"
      @cancel="modalConfirm.show = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdminPlanesStore } from '@superadmin/stores/planes'
import PlanFormModal from '@superadmin/components/PlanFormModal.vue'
import ConfirmModal from '@superadmin/components/ConfirmModal.vue'

const planesStore = useSuperAdminPlanesStore()
const modalNuevoPlan = ref(false)
const modalEditarPlan = ref(false)
const planParaEditar = ref(null)
const modalConfirm = ref({ show: false, title: '', message: '', type: 'danger', onConfirm: null })

const modulosDisponibles = [
  { key: 'mod_agenda', label: 'Calendario' },
  { key: 'mod_historia_clinica', label: 'E-Medical' },
  { key: 'mod_facturacion', label: 'Billing' },
  { key: 'mod_inventario', label: 'Stock' },
  { key: 'mod_reportes_basicos', label: 'BI' },
  { key: 'mod_whatsapp', label: 'Social' }
]

const planesList = computed(() => planesStore.planes)
const planesOrdenados = computed(() => planesStore.planesOrdenados)
const loading = computed(() => planesStore.loading)

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value)
}

function editarPlan(plan) {
  planParaEditar.value = { ...plan }
  modalEditarPlan.value = true
}

function confirmarDesactivar(plan) {
  modalConfirm.value = {
    show: true,
    title: 'Pausar Oferta',
    message: `¿Estás seguro de desactivar el plan y ocultarlo para nuevas clínicas?`,
    type: 'warning',
    onConfirm: async () => {
      await planesStore.desactivarPlan(plan.id)
      modalConfirm.value.show = false
    }
  }
}

function cerrarModales() {
  modalNuevoPlan.value = false
  modalEditarPlan.value = false
  planParaEditar.value = null
}

async function handlePlanSaved() {
  cerrarModales()
  await planesStore.fetchPlanes()
}

onMounted(() => {
  planesStore.fetchPlanes()
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