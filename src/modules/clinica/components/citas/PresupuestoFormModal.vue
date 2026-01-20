<!-- components/citas/PresupuestoFormModal.vue -->
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
      <div class="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden border border-white/20">
        
        <!-- Background Accents -->
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header -->
        <div class="p-8 md:p-12 flex items-center justify-between border-b border-gray-50 relative z-10">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg">Cotización</span>
              <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Editor de Plan de Tratamiento</span>
            </div>
            <h2 class="text-3xl font-black text-gray-900 uppercase tracking-tight">Construir Presupuesto</h2>
          </div>
          <button @click="close" class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:rotate-90 transition-all duration-500">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <!-- Sidebar: Patient & General Info -->
            <div class="lg:col-span-4 space-y-10">
              <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  <i class="fas fa-user text-violet-600"></i> Seleccionar Paciente
                </label>
                <select 
                  v-model="form.paciente_id"
                  class="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all"
                >
                  <option :value="null">Seleccione un paciente...</option>
                  <option v-for="p in pacientesStore.pacientes" :key="p.id" :value="p.id">{{ p.nombre }} {{ p.apellido }}</option>
                </select>
              </div>

              <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  <i class="fas fa-calendar-alt text-violet-600"></i> Fecha de Vencimiento
                </label>
                <input 
                  v-model="form.fecha_vencimiento"
                  type="date"
                  class="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all"
                >
              </div>

              <div class="p-8 bg-gray-900 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-gray-900/20">
                 <p class="text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">Resumen Estructurado</p>
                 <div class="space-y-4">
                    <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span class="text-gray-400">Subtotal</span>
                       <span>${{ formatAmount(totals.subtotal) }}</span>
                    </div>
                    <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-400">
                       <span>Descuentos</span>
                       <span>-${{ formatAmount(totals.descuento) }}</span>
                    </div>
                    <div class="pt-6 border-t border-white/10 flex justify-between items-end">
                       <div>
                         <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Final</p>
                         <p class="text-3xl font-black tracking-tighter">${{ formatAmount(totals.total) }}</p>
                       </div>
                       <i class="fas fa-file-invoice-dollar text-3xl text-violet-600/30"></i>
                    </div>
                 </div>
              </div>
            </div>

            <!-- Content: Treatments Selection -->
            <div class="lg:col-span-8 space-y-10">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Detalle de Prestaciones</h3>
                <button 
                  @click="addTreatmentRow"
                  class="px-6 py-3 bg-gray-50 hover:bg-violet-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <i class="fas fa-plus"></i> Agregar Fila
                </button>
              </div>

              <div class="space-y-4">
                <div 
                  v-for="(row, index) in form.items" 
                  :key="index"
                  class="group flex flex-col md:flex-row gap-4 p-6 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-[2rem] transition-all animate-slide-in relative"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div class="md:col-span-6 space-y-2">
                      <select 
                        v-model="row.tratamiento_id"
                        @change="onTreatmentChange(index)"
                        class="w-full px-4 py-4 bg-white/50 border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 transition-all cursor-pointer"
                      >
                        <option :value="null">Seleccione tratamiento...</option>
                        <option v-for="t in tratamientosStore.tratamientos" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                      </select>
                    </div>
                    <div class="md:col-span-2 space-y-1">
                      <input 
                        v-model.number="row.cantidad"
                        type="number"
                        placeholder="Cant."
                        class="w-full px-4 py-4 bg-white/50 border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 transition-all text-center"
                      >
                    </div>
                    <div class="md:col-span-4 space-y-1 relative">
                       <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-300">$</span>
                       <input 
                        v-model.number="row.precio"
                        type="number"
                        placeholder="Precio"
                        class="w-full pl-8 pr-4 py-4 bg-white/50 border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 transition-all"
                      >
                    </div>
                  </div>
                  <button 
                    @click="removeRow(index)"
                    class="w-12 h-12 flex-shrink-0 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 transition-all"
                  >
                    <i class="fas fa-trash-alt text-[10px]"></i>
                  </button>
                </div>
              </div>

              <!-- Empty State in Form -->
              <div v-if="form.items.length === 0" class="py-20 text-center border-4 border-dashed border-gray-50 rounded-[2.5rem]">
                 <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                    <i class="fas fa-tooth text-2xl"></i>
                 </div>
                 <p class="text-[9px] font-black text-gray-300 uppercase tracking-widest">No hay prestaciones agregadas aún</p>
              </div>

              <div class="space-y-4 pt-8 border-t border-gray-50">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Notas y Observaciones Clínicas</label>
                <textarea 
                  v-model="form.observaciones"
                  rows="4"
                  class="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-[2rem] text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 transition-all resize-none"
                  placeholder="Detalles específicos sobre el plan de tratamiento..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 md:p-12 border-t border-gray-50 flex items-center justify-between bg-gray-50/30 relative z-10">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Los presupuestos tienen una validez de 15 días tras su emisión.</p>
          <div class="flex gap-4">
             <button @click="close" class="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors">Cancelar</button>
             <button 
              @click="save"
              :disabled="loading || !isValid"
              class="px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
             >
               <span v-if="loading"><i class="fas fa-circle-notch animate-spin mr-2"></i> Procesando</span>
               <span v-else><i class="fas fa-check text-emerald-400 mr-2"></i> Confirmar Cotización</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePacientesStore } from '@clinica/stores/pacientes'
import { useTratamientosStore } from '@clinica/stores/tratamientos'
import { usePresupuestosStore } from '@clinica/stores/presupuestos'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'saved'])

const pacientesStore = usePacientesStore()
const tratamientosStore = useTratamientosStore()
const presupuestosStore = usePresupuestosStore()
const notify = useNotification()

const loading = ref(false)
const form = ref({
  paciente_id: null,
  fecha_vencimiento: '',
  observaciones: '',
  items: []
})

const isValid = computed(() => form.value.paciente_id && form.value.items.length > 0)

const totals = computed(() => {
  const subtotal = form.value.items.reduce((acc, item) => acc + ((item.precio || 0) * (item.cantidad || 1)), 0)
  return {
    subtotal,
    descuento: 0,
    total: subtotal
  }
})

function close() { emit('update:modelValue', false) }

function addTreatmentRow() {
  form.value.items.push({ tratamiento_id: null, cantidad: 1, precio: 0 })
}

function removeRow(index) {
  form.value.items.splice(index, 1)
}

function onTreatmentChange(index) {
  const item = form.value.items[index]
  const tr = tratamientosStore.tratamientos.find(t => t.id === item.tratamiento_id)
  if (tr) item.precio = tr.precio || 0
}

async function save() {
  loading.value = true
  try {
    const res = await presupuestosStore.createPresupuesto({
      ...form.value,
      total: totals.value.total
    })
    if (res.success) {
      notify.success('Presupuesto emitido correctamente')
      emit('saved')
      close()
    } else {
      notify.error(res.message || 'Error al emitir presupuesto')
    }
  } catch (err) {
    notify.error('Error crítico al procesar la cotización')
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    form.value = { paciente_id: null, fecha_vencimiento: '', observaciones: '', items: [] }
    if (pacientesStore.pacientes.length === 0) pacientesStore.fetchPacientes()
    if (tratamientosStore.tratamientos.length === 0) tratamientosStore.fetchTratamientos()
  }
})

function formatAmount(amount) {
  return new Intl.NumberFormat('es-CL').format(amount)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e7eb; }

@keyframes slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.animate-slide-in { animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
