<!-- components/citas/LaboratorioStatusModal.vue -->
<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md animate-fade-in">
    <div class="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative border border-gray-100">
      
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute right-8 top-8 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
        <i class="fas fa-times text-xl"></i>
      </button>

      <div class="p-12">
        <div class="flex items-center gap-3 mb-8">
            <span class="px-3 py-1 bg-gray-900 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg">Update Log</span>
            <h3 class="text-xl font-black text-gray-900 uppercase tracking-tight">Estado de la Orden</h3>
        </div>

        <div class="mb-10 flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem]">
            <div class="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                <span class="text-[7px] font-black text-gray-400 uppercase">Orden</span>
                <span class="text-sm font-black text-gray-900">{{ orden.numero_orden }}</span>
            </div>
            <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paciente</p>
                <h4 class="text-sm font-black text-gray-900 transition-colors uppercase tracking-tight">{{ orden.paciente?.nombre }} {{ orden.paciente?.apellido }}</h4>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <button 
                v-for="e in labStore.estados" 
                :key="e.value"
                @click="nuevoEstado = e.value"
                class="group p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 relative overflow-hidden text-center"
                :class="nuevoEstado === e.value ? 'bg-gray-900 border-transparent shadow-2xl scale-[1.03]' : 'bg-white border-gray-100 hover:border-violet-200'"
            >
                <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    :class="nuevoEstado === e.value ? 'bg-violet-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-600'"
                >
                    <i :class="e.icon" class="text-sm"></i>
                </div>
                <span 
                    class="text-[9px] font-black uppercase tracking-widest"
                    :class="nuevoEstado === e.value ? 'text-white' : 'text-gray-500'"
                >
                    {{ e.label }}
                </span>
                <div v-if="nuevoEstado === e.value" class="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full"></div>
            </button>
        </div>

        <!-- Extra info for received -->
        <div v-if="nuevoEstado === 'recibido' || nuevoEstado === 'completado'" class="mt-8 animate-fade-in">
            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Fecha Real de Recepción</label>
            <input 
                v-model="fechaEntrega" 
                type="date" 
                class="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black tracking-widest outline-none focus:bg-white focus:border-violet-600/20 transition-all font-outfit"
            >
        </div>

        <div class="flex gap-4 mt-12">
            <button 
                @click="$emit('close')"
                class="flex-1 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest"
            >
                Cancelar
            </button>
            <button 
                @click="confirmarCambio"
                :disabled="loading || nuevoEstado === orden.estado"
                class="flex-1 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 disabled:scale-100"
            >
                <i v-if="loading" class="fas fa-circle-notch animate-spin mr-2"></i>
                Confirmar Cambio
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLaboratorioStore } from '@clinica/stores/laboratorio'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({
    orden: { type: Object, required: true }
})

const emit = defineEmits(['close', 'success'])

const labStore = useLaboratorioStore()
const notify = useNotification()

const loading = ref(false)
const nuevoEstado = ref(props.orden.estado)
const fechaEntrega = ref(new Date().toISOString().split('T')[0])

async function confirmarCambio() {
    loading.value = true
    try {
        const res = await labStore.updateEstadoOrden(props.orden.id, nuevoEstado.value)
        if (res.success) {
            notify.success(`Estado de orden ${props.orden.numero_orden} actualizado a ${nuevoEstado.value}`)
            emit('success')
            emit('close')
        }
    } catch (err) {
        notify.error('Error al actualizar estado')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
