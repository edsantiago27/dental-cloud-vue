<!-- components/citas/RecetaFormModal.vue -->
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
        
        <!-- Header -->
        <div class="p-8 md:p-12 flex items-center justify-between border-b border-gray-50 relative z-10">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg">Ficha Médica</span>
              <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Emisión de Receta Electrónica</span>
            </div>
            <h2 class="text-3xl font-black text-gray-900 uppercase tracking-tight">Prescribir Medicación</h2>
          </div>
          <button @click="close" class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:rotate-90 transition-all duration-500">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <!-- Sidebar: Patient & Professional -->
            <div class="lg:col-span-4 space-y-8">
              <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Paciente</label>
                <select 
                  v-model="form.paciente_id"
                  class="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-emerald-600/20 focus:ring-4 focus:ring-emerald-600/5 transition-all"
                >
                  <option :value="null">Seleccione paciente...</option>
                  <option v-for="p in pacientesStore.pacientes" :key="p.id" :value="p.id">{{ p.nombre }} {{ p.apellido }}</option>
                </select>
              </div>

              <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Profesional Firmante</label>
                <select 
                  v-model="form.profesional_id"
                  class="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-emerald-600/20 focus:ring-4 focus:ring-emerald-600/5 transition-all"
                >
                  <option :value="null">Seleccione profesional...</option>
                  <option v-for="prof in profesionalesStore.profesionales" :key="prof.id" :value="prof.id">{{ prof.nombre }} {{ prof.apellido }}</option>
                </select>
              </div>

              <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Diagnóstico Clínico</label>
                <textarea 
                  v-model="form.diagnostico"
                  rows="4"
                  class="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-[2rem] text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-emerald-600/20 transition-all resize-none"
                  placeholder="Describa el diagnóstico..."
                ></textarea>
              </div>
            </div>

            <!-- Content: Medications List -->
            <div class="lg:col-span-8 space-y-10">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Medicamentos Recetados</h3>
                <button 
                  @click="addMedicationRow"
                  class="px-6 py-3 bg-gray-50 hover:bg-emerald-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <i class="fas fa-plus"></i> Agregar Fármaco
                </button>
              </div>

              <div class="space-y-4">
                <div 
                  v-for="(row, index) in form.medicamentos" 
                  :key="index"
                  class="group flex flex-col gap-6 p-8 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-[2.5rem] transition-all relative overflow-hidden"
                >
                  <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <!-- Fármaco y Concentración -->
                    <div class="md:col-span-8 space-y-2">
                       <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Nombre del Medicamento</label>
                       <input 
                        v-model="row.medicamento"
                        list="common-drugs"
                        placeholder="Ej: Amoxicilina"
                        class="w-full px-4 py-4 bg-white border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-600/20 transition-all"
                       >
                    </div>
                    <div class="md:col-span-4 space-y-2">
                       <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Concentración</label>
                       <input 
                        v-model="row.concentracion"
                        placeholder="Ej: 500mg"
                        class="w-full px-4 py-4 bg-white border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-600/20 transition-all"
                       >
                    </div>

                    <!-- Posología -->
                    <div class="md:col-span-4 space-y-2">
                       <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Dosis / Posología</label>
                       <input 
                        v-model="row.dosis"
                        placeholder="Ej: 1 comprimido"
                        class="w-full px-4 py-4 bg-white border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-600/20 transition-all"
                       >
                    </div>
                    <div class="md:col-span-4 space-y-2">
                       <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Frecuencia</label>
                       <input 
                        v-model="row.frecuencia"
                        placeholder="Ej: Cada 8 horas"
                        class="w-full px-4 py-4 bg-white border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-600/20 transition-all"
                       >
                    </div>
                    <div class="md:col-span-4 space-y-2">
                       <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Duración</label>
                       <input 
                        v-model="row.duracion"
                        placeholder="Ej: 7 días"
                        class="w-full px-4 py-4 bg-white border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-600/20 transition-all"
                       >
                    </div>

                    <!-- Cantidad e Indicaciones -->
                    <div class="md:col-span-3 space-y-2">
                       <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Cantidad Total</label>
                       <input 
                        v-model="row.cantidad_recetada"
                        placeholder="Ej: 2 cajas"
                        class="w-full px-4 py-4 bg-white border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-600/20 transition-all"
                       >
                    </div>
                    <div class="md:col-span-8 space-y-2">
                       <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Indicaciones Adicionales</label>
                       <input 
                        v-model="row.indicaciones_especiales"
                        placeholder="Ej: Tomar con abundantes líquidos"
                        class="w-full px-4 py-4 bg-white border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-600/20 transition-all"
                       >
                    </div>

                    <!-- Acción -->
                    <div class="md:col-span-1 flex items-end justify-center pb-2">
                      <button 
                        @click="removeRow(index)"
                        class="w-10 h-10 bg-white hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all flex items-center justify-center border border-gray-100"
                      >
                        <i class="fas fa-trash-alt text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Datalist para autocompletado -->
              <datalist id="common-drugs">
                <option v-for="d in recetasStore.medicamentosComunes" :key="d" :value="d" />
              </datalist>

              <div class="space-y-4 pt-8 border-t border-gray-50">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Observaciones Generales</label>
                <textarea 
                  v-model="form.observaciones"
                  rows="3"
                  class="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-[2rem] text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-emerald-600/20 transition-all resize-none"
                  placeholder="Notas adicionales para el paciente..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 md:p-12 border-t border-gray-50 flex items-center justify-between bg-gray-50/30 relative z-10 shrink-0">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Esta receta cuenta con validación digital y registro auditado.</p>
          <div class="flex gap-4">
             <button @click="close" class="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors">Cancelar</button>
             <button 
              @click="save"
              :disabled="loading || !isValid"
              class="px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
             >
               <span v-if="loading"><i class="fas fa-circle-notch animate-spin mr-2"></i> Generando Receta</span>
               <span v-else><i class="fas fa-file-medical text-emerald-400 mr-2"></i> Emitir Documento</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { usePacientesStore } from '@clinica/stores/pacientes'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useRecetasStore } from '@clinica/stores/recetas'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'saved'])

const pacientesStore = usePacientesStore()
const profesionalesStore = useProfesionalesStore()
const recetasStore = useRecetasStore()
const notify = useNotification()

const loading = ref(false)
const form = ref({
  paciente_id: null,
  profesional_id: null,
  diagnostico: '',
  observaciones: '',
  medicamentos: []
})

const isValid = computed(() => {
  return form.value.paciente_id && 
         form.value.profesional_id && 
         form.value.diagnostico && 
         form.value.medicamentos.length > 0 &&
         form.value.medicamentos.every(m => m.medicamento && m.dosis && m.frecuencia)
})

function close() { emit('update:modelValue', false) }

function addMedicationRow() {
  form.value.medicamentos.push({
    medicamento: '',
    concentracion: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    cantidad_recetada: '',
    indicaciones_especiales: ''
  })
}

function removeRow(index) {
  form.value.medicamentos.splice(index, 1)
}

async function save() {
  loading.value = true
  try {
    const res = await recetasStore.createReceta(form.value)
    if (res.success) {
      notify.success('Receta emitida correctamente')
      emit('saved')
      close()
    } else {
       if (res.errors) {
         const firstError = Object.values(res.errors)[0][0]
         notify.error(firstError)
       } else {
         notify.error(res.message || 'Error al emitir receta')
       }
    }
  } catch (err) {
    notify.error('Error crítico al procesar la receta')
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    form.value = { 
      paciente_id: null, 
      profesional_id: null, 
      diagnostico: '', 
      observaciones: '', 
      medicamentos: [] 
    }
    // Initialize with one row
    addMedicationRow()
    
    if (pacientesStore.pacientes.length === 0) pacientesStore.fetchPacientes()
    if (profesionalesStore.profesionales.length === 0) profesionalesStore.fetchProfesionales()
    recetasStore.fetchMedicamentosComunes()
  }
})

onMounted(() => {
  if (pacientesStore.pacientes.length === 0) pacientesStore.fetchPacientes()
  if (profesionalesStore.profesionales.length === 0) profesionalesStore.fetchProfesionales()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
</style>
