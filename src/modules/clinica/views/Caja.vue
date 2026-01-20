<!-- views/admin/Caja.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-emerald-500/20">Módulo Financiero</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Control de Caja Diaria</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Flujo de Efectivo
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Monitoreo de ingresos, gastos y conciliación diaria</p>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="!cajaStore.isAbierta">
            <button
                @click="openModal('apertura')"
                class="flex items-center gap-3 px-8 py-4 bg-emerald-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group border border-emerald-500/20"
            >
                <i class="fas fa-lock-open text-white"></i>
                Abrir Caja Hoy
            </button>
        </template>
        <template v-else>
            <button
                @click="openModal('movimiento')"
                class="flex items-center gap-3 px-8 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
            >
                <i class="fas fa-exchange-alt text-emerald-400"></i>
                Nuevo Movimiento
            </button>
            <button
                @click="openModal('cierre')"
                class="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest hover:scale-105 transition-all shadow-xl group hover:bg-red-50 hover:text-red-500 hover:border-red-100"
            >
                <i class="fas fa-lock text-emerald-600 group-hover:text-red-500"></i>
                Cerrar Caja
            </button>
        </template>
      </div>
    </div>

    <!-- specialized Bento Stats -->
    <div v-if="cajaStore.isAbierta" class="grid grid-cols-1 md:grid-cols-4 gap-6">
       <!-- Main KPI: Real-time Balance -->
       <div class="md:col-span-2 bg-gray-900 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
          <div class="absolute -right-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          <div class="relative z-10 flex flex-col justify-between h-full">
             <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                   <i class="fas fa-wallet text-xl"></i>
                </div>
                <div>
                   <p class="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Saldo Esperado en Caja</p>
                   <h3 class="text-4xl font-black text-white tracking-tighter">${{ formatCurrency(cajaStore.cajaActual.monto_cierre_esperado) }}</h3>
                </div>
             </div>
             <div class="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                <div>
                   <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest">Apertura</p>
                   <p class="text-sm font-bold text-gray-300">${{ formatCurrency(cajaStore.cajaActual.monto_apertura) }}</p>
                </div>
                <div class="text-right">
                   <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest">Responsable</p>
                   <p class="text-sm font-bold text-gray-300">{{ cajaStore.cajaActual.usuario_abre?.nombre }}</p>
                </div>
             </div>
          </div>
       </div>

       <!-- Income/Expense KPIs -->
       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:scale-[1.02] transition-all">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Ingresos Totales</p>
          <div class="flex items-end gap-3 mb-6">
             <h3 class="text-3xl font-black text-gray-900 tracking-tight leading-none">${{ formatCurrency(cajaStore.ingresosTotales) }}</h3>
             <span class="text-[9px] font-black text-emerald-600 mb-1 leading-none"><i class="fas fa-caret-up"></i> HOY</span>
          </div>
          <div class="h-1 bg-gray-50 rounded-full overflow-hidden">
             <div class="h-full bg-emerald-600 w-full animate-progress"></div>
          </div>
       </div>

       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:scale-[1.02] transition-all">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Egresos / Gastos</p>
          <div class="flex items-end gap-3 mb-6">
             <h3 class="text-3xl font-black text-gray-900 tracking-tight leading-none">${{ formatCurrency(cajaStore.egresosTotales) }}</h3>
             <span class="text-[9px] font-black text-red-500 mb-1 leading-none"><i class="fas fa-caret-down"></i> HOY</span>
          </div>
          <div class="h-1 bg-gray-50 rounded-full overflow-hidden">
             <div class="h-full bg-red-500" :style="{ width: `${(cajaStore.egresosTotales / (cajaStore.ingresosTotales || 1)) * 100}%` }"></div>
          </div>
       </div>
    </div>

    <!-- Empty State / Closed Box -->
    <div v-else class="bg-white rounded-[3rem] p-20 border border-gray-100 shadow-sm text-center">
        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
            <i class="fas fa-lock text-4xl"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tight">La caja se encuentra cerrada</h2>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-4 max-w-sm mx-auto leading-relaxed">
            Debe iniciar una nueva sesión de caja para registrar movimientos y pagos de pacientes.
        </p>
        <button 
            @click="openModal('apertura')"
            class="mt-10 px-12 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-2xl"
        >
            Iniciar Jornada de Caja
        </button>
    </div>

    <!-- Movements List -->
    <div v-if="cajaStore.isAbierta" class="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[500px]">
       <div class="flex items-center justify-between mb-12">
            <h3 class="text-md font-black text-gray-900 uppercase tracking-widest">Movimientos del Día</h3>
            <div class="flex items-center gap-4">
                 <button class="px-5 py-2.5 bg-gray-50 rounded-xl text-[8px] font-black uppercase tracking-widest text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                    <i class="fas fa-file-export mr-2"></i> Exportar
                 </button>
            </div>
       </div>

       <div v-if="!cajaStore.cajaActual.movimientos || cajaStore.cajaActual.movimientos.length === 0" class="py-20 text-center">
            <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest">Aún no hay movimientos registrados hoy</p>
       </div>

       <div v-else class="space-y-3">
          <div 
            v-for="mov in cajaStore.cajaActual.movimientos" 
            :key="mov.id"
            class="group bg-gray-50/20 hover:bg-white p-6 rounded-[2rem] border border-transparent hover:border-gray-100 hover:shadow-xl transition-all flex items-center justify-between gap-6"
          >
             <div class="flex items-center gap-6 flex-1">
                <div 
                    class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm"
                    :class="mov.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'"
                >
                    <i :class="mov.tipo === 'ingreso' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
                </div>
                <div>
                    <div class="flex items-center gap-3 mb-1">
                        <span class="text-[8px] font-black uppercase tracking-widest text-gray-400">{{ mov.categoria }}</span>
                        <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span class="text-[8px] font-black uppercase tracking-widest text-gray-400">{{ mov.metodo_pago }}</span>
                    </div>
                    <h4 class="text-sm font-black text-gray-900 uppercase tracking-tight">{{ mov.descripcion }}</h4>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {{ formatTime(mov.created_at) }} • Por: {{ mov.usuario?.nombre }}
                    </p>
                </div>
             </div>
             <div class="text-right">
                <p 
                    class="text-xl font-black tracking-tighter"
                    :class="mov.tipo === 'ingreso' ? 'text-gray-900' : 'text-red-500'"
                >
                    {{ mov.tipo === 'ingreso' ? '+' : '-' }}${{ formatCurrency(mov.monto) }}
                </p>
             </div>
          </div>
       </div>
    </div>

    <!-- Modals (Placeholders for now) -->
    <div v-if="activeModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl">
            <button @click="activeModal = null" class="absolute right-10 top-10 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <i class="fas fa-times text-xl"></i>
            </button>
            <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">{{ modalTitle }}</h2>
            
            <div v-if="activeModal === 'apertura'" class="space-y-6">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Monto Inicial (Base de Caja)</label>
                <div class="relative">
                    <span class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                    <input v-model="form.monto" type="number" class="w-full pl-10 pr-6 py-5 bg-gray-50 rounded-2xl text-xl font-black outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 border border-transparent transition-all">
                </div>
                <button @click="handleAbrir" class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl">Abrir Caja</button>
            </div>

            <div v-if="activeModal === 'movimiento'" class="space-y-6">
                <div class="flex bg-gray-50 p-1 rounded-2xl mb-8">
                    <button 
                        v-for="t in ['ingreso', 'egreso']" 
                        :key="t"
                        @click="form.tipo = t"
                        class="flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                        :class="form.tipo === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'"
                    >
                        {{ t }}
                    </button>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Monto</label>
                        <input v-model="form.monto" type="number" class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Método</label>
                        <select v-model="form.metodo" class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest outline-none border-none">
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                    <input v-model="form.descripcion" type="text" placeholder="Ej: Pago de insumos, Venta de limpieza..." class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest outline-none">
                </div>
                <button @click="handleMovimiento" class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl">Registrar Movimiento</button>
            </div>

            <div v-if="activeModal === 'cierre'" class="space-y-6">
                <div class="p-6 bg-red-50 rounded-2xl border border-red-100 mb-6">
                    <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-relaxed">
                        IMPORTANTE: Al cerrar la caja se consolidarán todos los movimientos del día. Asegúrese de contar el efectivo físico.
                    </p>
                </div>
                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Monto Real en Caja (Conteo Físico)</label>
                    <input v-model="form.monto" type="number" class="w-full px-6 py-5 bg-gray-50 rounded-2xl text-2xl font-black outline-none focus:ring-4 focus:ring-red-500/10 border border-transparent focus:border-red-500 transition-all font-outfit">
                    <p class="text-[8px] font-black text-gray-400 mt-2 uppercase">Monto Esperado: ${{ formatCurrency(cajaStore.cajaActual?.monto_cierre_esperado) }}</p>
                </div>
                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones</label>
                    <textarea v-model="form.descripcion" class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest outline-none resize-none" rows="3"></textarea>
                </div>
                <button @click="handleCerrar" class="w-full py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl">Finalizar Jornada</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCajaStore } from '@clinica/stores/caja'
import { useNotification } from '@shared/composables/useNotification'

const cajaStore = useCajaStore()
const notify = useNotification()

const activeModal = ref(null)
const form = ref({ monto: 0, tipo: 'ingreso', metodo: 'efectivo', descripcion: '' })

const modalTitle = computed(() => {
    if (activeModal.value === 'apertura') return 'Apertura de Caja'
    if (activeModal.value === 'cierre') return 'Cierre de Caja y Arqueo'
    return 'Nuevo Movimiento de Caja'
})

function openModal(type) {
    activeModal.value = type
    form.value = { 
        monto: type === 'apertura' ? 0 : (type === 'cierre' ? cajaStore.cajaActual.monto_cierre_esperado : 0), 
        tipo: 'ingreso', 
        metodo: 'efectivo', 
        descripcion: '' 
    }
}

async function handleAbrir() {
    const res = await cajaStore.abrir(form.value.monto)
    if (res.success) {
        notify.success('Caja abierta correctamente')
        activeModal.value = null
    }
}

async function handleMovimiento() {
    const res = await cajaStore.registrarMovimiento({
        tipo: form.value.tipo,
        monto: form.value.monto,
        metodo_pago: form.value.metodo,
        descripcion: form.value.descripcion,
        categoria: form.value.tipo === 'ingreso' ? 'ingreso_manual' : 'egreso_manual'
    })
    if (res.success) {
        notify.success('Movimiento registrado')
        activeModal.value = null
    }
}

async function handleCerrar() {
    const res = await cajaStore.cerrar({
        monto_cierre_real: form.value.monto,
        observaciones: form.value.descripcion
    })
    if (res.success) {
        notify.success('Caja cerrada con éxito')
        activeModal.value = null
    }
}

function formatCurrency(val) {
  if (!val) return '0'
  return parseFloat(val).toLocaleString('es-CL')
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  cajaStore.fetchCajaActual()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes progress { from { width: 0; } }
.animate-progress { animation: progress 1.5s ease-out forwards; }
</style>
