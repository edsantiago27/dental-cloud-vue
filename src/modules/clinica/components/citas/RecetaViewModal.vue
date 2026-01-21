<!-- components/citas/RecetaViewModal.vue -->
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
        <div class="p-8 md:p-12 flex items-center justify-between bg-emerald-700 text-white relative">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div class="flex items-center gap-3 mb-2 relative z-10">
              <span class="px-3 py-1 bg-white/20 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg backdrop-blur-md">Certificado Médico</span>
              <span class="text-[9px] font-black text-white/60 uppercase tracking-widest">Receta #{{ receta?.numero }}</span>
            </div>
            <h2 class="text-3xl font-black uppercase tracking-tight relative z-10">{{ receta?.paciente?.nombre }} {{ receta?.paciente?.apellido }}</h2>
          </div>
          <button @click="close" class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all relative z-10">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-12 custom-scrollbar bg-gray-50/50">
           <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-12 relative overflow-hidden">
              
              <!-- Background Clinica Watermark (Simulada) -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-15deg] pointer-events-none">
                 <i class="fas fa-file-medical text-[25rem]"></i>
              </div>

              <!-- Top Info -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                 <div>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Fecha Emisión</p>
                    <p class="text-[10px] font-black text-gray-900 uppercase tracking-tight">{{ formatDate(receta?.fecha_emision) }}</p>
                 </div>
                 <div>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Profesional</p>
                    <p class="text-[10px] font-black text-emerald-600 uppercase tracking-tight">DR. {{ receta?.profesional?.nombre }} {{ receta?.profesional?.apellido }}</p>
                 </div>
                 <div>
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Estado</p>
                    <div class="flex items-center gap-2 mt-1">
                       <span class="w-2 h-2 rounded-full" :class="receta?.estado === 'activa' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                       <span class="text-[10px] font-black text-gray-900 uppercase tracking-tight">{{ receta?.estado }}</span>
                    </div>
                 </div>
                 <div class="text-right">
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Folio Interno</p>
                    <p class="text-[10px] font-black text-gray-900 uppercase tracking-tight">#{{ receta?.id }}</p>
                 </div>
              </div>

              <!-- Diagnóstico -->
              <div class="relative z-10">
                 <h3 class="text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <i class="fas fa-stethoscope text-emerald-500"></i> Diagnóstico Médico
                 </h3>
                 <p class="text-xs font-bold text-gray-600 uppercase leading-relaxed p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    {{ receta?.diagnostico }}
                 </p>
              </div>

              <!-- Medicamentos -->
              <div class="space-y-6 relative z-10">
                 <h3 class="text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">Indicaciones Farmacológicas (RP:)</h3>
                 <div class="space-y-6">
                    <div v-for="med in receta?.medicamentos" :key="med.id" class="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                       <div class="flex items-center justify-between mb-4">
                          <h4 class="text-xs font-black text-emerald-700 uppercase tracking-tight">{{ med.medicamento }} {{ med.concentracion }}</h4>
                          <span class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 py-1 bg-gray-50 rounded-lg">{{ med.cantidad_recetada }}</span>
                       </div>
                       <div class="grid grid-cols-3 gap-6">
                          <div>
                             <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Dosis</p>
                             <p class="text-[10px] font-bold text-gray-900 uppercase">{{ med.dosis }}</p>
                          </div>
                          <div>
                             <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Frecuencia</p>
                             <p class="text-[10px] font-bold text-gray-900 uppercase">{{ med.frecuencia }}</p>
                          </div>
                          <div>
                             <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Duración</p>
                             <p class="text-[10px] font-bold text-gray-900 uppercase">{{ med.duracion }}</p>
                          </div>
                       </div>
                       <div v-if="med.indicaciones_especiales" class="mt-4 pt-4 border-t border-dashed border-gray-100">
                          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Indicaciones Especiales</p>
                          <p class="text-[10px] font-bold text-gray-900 uppercase">{{ med.indicaciones_especiales }}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Observaciones -->
              <div v-if="receta?.observaciones" class="relative z-10">
                 <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Observaciones Generales</p>
                 <p class="text-[10px] font-bold text-gray-600 uppercase leading-relaxed">{{ receta?.observaciones }}</p>
              </div>

              <!-- Firma Mock -->
              <div class="pt-12 flex flex-col items-center relative z-10">
                  <div class="w-48 border-t border-gray-200"></div>
                  <p class="text-[9px] font-black text-gray-900 uppercase tracking-widest mt-2">Dr. {{ receta?.profesional?.nombre }} {{ receta?.profesional?.apellido }}</p>
                  <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Firma del Profesional</p>
              </div>
           </div>
        </div>

        <!-- Footer -->
        <div class="p-8 md:p-10 border-t border-gray-50 flex flex-wrap items-center justify-between gap-6 bg-white shrink-0">
           <div class="flex items-center gap-3">
              <button 
                @click="downloadPDF"
                class="px-6 py-4 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
              >
                 <i class="fas fa-file-pdf text-red-400"></i> Descargar Receta
              </button>
              <button 
                @click="sendEmail"
                :disabled="loading"
                class="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[9px] font-black text-gray-600 uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all flex items-center gap-2"
              >
                 <i v-if="!loading" class="fas fa-envelope"></i>
                 <i v-else class="fas fa-circle-notch animate-spin"></i>
                 Enviar por Email
              </button>
           </div>
           
           <div class="flex items-center gap-3">
              <button 
                v-if="receta?.estado === 'activa'"
                @click="anular"
                class="px-8 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
              >
                 <i class="fas fa-ban"></i> Anular Receta
              </button>
           </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRecetasStore } from '@clinica/stores/recetas'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({
  modelValue: Boolean,
  receta: Object
})

const emit = defineEmits(['update:modelValue', 'status-changed'])

const recetasStore = useRecetasStore()
const notify = useNotification()
const loading = ref(false)

function close() { emit('update:modelValue', false) }

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function downloadPDF() {
  notify.info('Descargando PDF...')
  const result = await recetasStore.downloadPdf(props.receta.id)
  if (result.success) {
    notify.success('PDF descargado exitosamente')
  } else {
    notify.error(result.message || 'Error al descargar PDF')
  }
}

async function sendEmail() {
  if (!props.receta?.paciente?.email) {
    notify.error('El paciente no tiene email registrado')
    return
  }
  
  loading.value = true
  try {
    const res = await recetasStore.enviarEmail(props.receta.id)
    if (res.success) notify.success('Receta enviada correctamente')
    else notify.error(res.message || 'Error al enviar email')
  } catch (err) {
    notify.error('Error al intentar enviar el correo')
  } finally {
    loading.value = false
  }
}

async function anular() {
  notify.confirm('¿Está seguro de anular esta receta médica?', async (motivo) => {
    if (!motivo) {
       notify.error('Debe ingresar un motivo')
       return
    }
    const res = await recetasStore.anularReceta(props.receta.id, motivo)
    if (res.success) {
      notify.success('Receta anulada exitosamente')
      emit('status-changed')
      close()
    } else {
      notify.error('Error al anular la receta')
    }
  }, { prompt: true, promptPlaceholder: 'Motivo de anulación...' })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
</style>
