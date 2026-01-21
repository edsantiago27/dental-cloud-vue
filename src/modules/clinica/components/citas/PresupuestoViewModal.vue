<!-- components/citas/PresupuestoViewModal.vue -->
<template>
  <transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="modelValue" class="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-4xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden border border-white/20">
        
        <!-- Header -->
        <div class="p-8 md:p-12 flex items-center justify-between bg-gray-900 text-white relative">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg">Detalle de Cotización</span>
              <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">Folio #{{ presupuesto?.id }}</span>
            </div>
            <h2 class="text-3xl font-black uppercase tracking-tight">{{ presupuesto?.paciente?.nombre }} {{ presupuesto?.paciente?.apellido }}</h2>
          </div>
          <button @click="close" class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Body: The Document Appearance -->
        <div class="flex-1 overflow-y-auto p-12 custom-scrollbar bg-gray-50/50">
           <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-12">
              
              <!-- Info Rows -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Fecha Emisión</p>
                    <p class="text-[10px] font-black text-gray-900 uppercase tracking-tight">{{ formatDate(presupuesto?.fecha) }}</p>
                 </div>
                 <div>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Validez Hasta</p>
                    <p class="text-[10px] font-black text-violet-600 uppercase tracking-tight">{{ formatDate(presupuesto?.fecha_vencimiento) }}</p>
                 </div>
                 <div>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Estado</p>
                    <div class="flex items-center gap-2 mt-1">
                       <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: getEstadoColor(presupuesto?.estado) }"></span>
                       <span class="text-[10px] font-black text-gray-900 uppercase tracking-tight">{{ presupuesto?.estado }}</span>
                    </div>
                 </div>
                 <div>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Emitido Por</p>
                    <p class="text-[10px] font-black text-gray-900 uppercase tracking-tight">{{ presupuesto?.emitido_por || 'DentalCloud System' }}</p>
                 </div>
              </div>

              <!-- Treatments List -->
              <div class="space-y-4">
                 <h3 class="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">Detalle de Prestaciones</h3>
                 <div class="divide-y divide-gray-50">
                    <div v-for="item in presupuesto?.items" :key="item.id" class="py-4 flex items-center justify-between group">
                       <div class="flex items-center gap-4">
                          <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                             {{ item.cantidad }}x
                          </div>
                          <div>
                             <p class="text-[10px] font-black text-gray-900 uppercase tracking-tight">{{ item.tratamiento?.nombre || 'Tratamiento Dental' }}</p>
                             <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{{ item.categoria || 'Consulta' }}</p>
                          </div>
                       </div>
                       <p class="text-[11px] font-black text-gray-900 tracking-tighter">${{ formatAmount(item.precio * item.cantidad) }}</p>
                    </div>
                 </div>
              </div>

              <!-- Observation -->
              <div v-if="presupuesto?.observaciones" class="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                 <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Observaciones</p>
                 <p class="text-[10px] font-bold text-gray-600 uppercase leading-relaxed">{{ presupuesto?.observaciones }}</p>
              </div>

              <!-- Totals -->
              <div class="flex flex-col items-end space-y-2 pt-6 border-t border-gray-100">
                 <div class="flex justify-between w-48 text-[10px] font-black text-gray-400 uppercase">
                    <span>Subtotal</span>
                    <span>${{ formatAmount(presupuesto?.total) }}</span>
                 </div>
                 <div class="flex justify-between w-48 text-[10px] font-black text-emerald-500 uppercase">
                    <span>Descuentos</span>
                    <span>-$0</span>
                 </div>
                 <div class="flex justify-between w-48 pt-4">
                    <span class="text-[10px] font-black text-gray-900 uppercase">Total Final</span>
                    <span class="text-xl font-black text-gray-900 tracking-tighter">${{ formatAmount(presupuesto?.total) }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Footer: Actions -->
        <div class="p-8 md:p-10 border-t border-gray-50 flex flex-wrap items-center justify-between gap-6 bg-white shrink-0">
           <div class="flex items-center gap-3">
              <button 
                @click="downloadPDF"
                class="px-6 py-4 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
              >
                 <i class="fas fa-file-pdf text-red-400"></i> Descargar PDF
              </button>
              <button 
                @click="sendEmail"
                class="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[9px] font-black text-gray-600 uppercase tracking-widest hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100 transition-all flex items-center gap-2"
              >
                 <i class="fas fa-envelope"></i> Enviar Email
              </button>
           </div>
           
           <div class="flex items-center gap-3">
              <button 
                v-if="presupuesto?.estado === 'pendiente'"
                @click="convertirAFactura"
                :disabled="loading"
                class="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                 <i class="fas fa-check-circle"></i> Aprobar y Generar Cargo
              </button>
              <button 
                v-if="presupuesto?.estado === 'pendiente'"
                @click="rechazar"
                class="px-6 py-4 text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
              >
                 Rechazar
              </button>
           </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { usePresupuestosStore } from '@clinica/stores/presupuestos'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({
  modelValue: Boolean,
  presupuesto: Object
})

const emit = defineEmits(['update:modelValue', 'status-changed'])

const presupuestosStore = usePresupuestosStore()
const notify = useNotification()
const loading = ref(false)

function close() { emit('update:modelValue', false) }

function getEstadoColor(estado) {
  return (presupuestosStore.estados.find(e => e.value === estado) || { color: '#6B7280' }).color
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatAmount(amount) {
  return new Intl.NumberFormat('es-CL').format(amount || 0)
}

async function downloadPDF() {
  notify.info('Descargando PDF...')
  const result = await presupuestosStore.downloadPdf(props.presupuesto.id)
  if (result.success) {
    notify.success('PDF descargado exitosamente')
  } else {
    notify.error(result.message || 'Error al descargar PDF')
  }
}

async function sendEmail() {
  notify.info('Enviando presupuesto por correo...')
  const res = await presupuestosStore.enviarEmail(props.presupuesto.id)
  if (res.success) notify.success('Correo enviado exitosamente')
  else notify.error('Error al enviar el correo')
}

async function convertirAFactura() {
  notify.confirm('¿Seguro que desea aprobar este presupuesto? Esto generará un cargo en la cuenta del paciente.', async () => {
    loading.value = true
    const res = await presupuestosStore.convertirACuenta(props.presupuesto.id)
    if (res.success) {
      notify.success('Presupuesto aprobado y facturado')
      emit('status-changed')
      close()
    } else {
      notify.error(res.message || 'Error al procesar aprobación')
    }
    loading.value = false
  })
}

async function rechazar() {
  notify.confirm('¿Marcar este presupuesto como rechazado?', async () => {
    const res = await presupuestosStore.updateEstado(props.presupuesto.id, 'rechazado')
    if (res.success) {
      notify.success('Estado actualizado')
      emit('status-changed')
      close()
    }
  })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
</style>
