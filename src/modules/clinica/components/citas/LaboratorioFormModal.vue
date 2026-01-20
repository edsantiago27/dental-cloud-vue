<!-- components/citas/LaboratorioFormModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md animate-fade-in shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
    <div class="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative group ring-1 ring-gray-100">
      
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute right-8 top-8 z-20 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all hover:rotate-90 duration-500"
      >
        <i class="fas fa-times text-xl"></i>
      </button>

      <!-- Sidebar Info (Dark Style) -->
      <div class="w-full md:w-80 bg-gray-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-10">
            <div class="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <i class="fas fa-microscope text-sm"></i>
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Lab Workflow</span>
          </div>

          <h2 class="text-3xl font-black tracking-tighter uppercase leading-none mb-6">Emisión de Orden</h2>
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-10">
            Genere el requerimiento técnico para el laboratorio dental externo con especificaciones clínicas precisas.
          </p>

          <div class="space-y-6">
            <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <p class="text-[8px] font-black text-violet-400 uppercase tracking-widest mb-2">Resumen Operativo</p>
              <div class="flex items-end justify-between">
                <span class="text-xs font-bold text-gray-300">Costo Estimado</span>
                <span class="text-xl font-black text-white">${{ form.costo || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="relative z-10 pt-12">
            <div class="flex items-center gap-4 text-gray-500">
                <i class="fas fa-shield-alt text-violet-500"></i>
                <span class="text-[8px] font-black uppercase tracking-widest">Protocolo de Bioseguridad Dental</span>
            </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="flex-1 p-12 overflow-y-auto max-h-[85vh] bg-gray-50/50">
        <form @submit.prevent="handleSubmit" class="space-y-10">
          
          <!-- Sec. 1: Identificación -->
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">01</span>
              <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest">Paciente y Profesional</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Paciente</label>
                <select 
                  v-model="form.paciente_id" 
                  required
                  class="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all"
                >
                  <option value="" disabled>Seleccionar Paciente</option>
                  <option v-for="p in pacientesStore.pacientes" :key="p.id" :value="p.id">
                    {{ p.nombre }} {{ p.apellido }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Profesional a Cargo</label>
                <select 
                  v-model="form.profesional_id" 
                  required
                  class="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all"
                >
                  <option value="" disabled>Seleccionar Dr.</option>
                  <option v-for="prof in profesionalesStore.profesionales" :key="prof.id" :value="prof.id">
                    {{ prof.nombre }} {{ prof.apellido }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Sec. 2: Especificaciones Técnicas -->
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">02</span>
              <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest">Detalles del Trabajo</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2 space-y-2">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Laboratorio Destino</label>
                <div class="flex gap-2">
                    <select 
                        v-model="form.laboratorio_id" 
                        required
                        class="flex-1 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all"
                    >
                        <option value="" disabled>Seleccionar Laboratorio</option>
                        <option v-for="lab in labStore.laboratorios" :key="lab.id" :value="lab.id">
                            {{ lab.nombre }}
                        </option>
                    </select>
                    <button type="button" @click="showAddLab = true" class="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-violet-600 transition-colors">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Trabajo</label>
                <select 
                  v-model="form.trabajo_tipo" 
                  required
                  class="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all"
                >
                  <option value="" disabled>Seleccionar...</option>
                  <option v-for="tipo in tiposTrabajo" :key="tipo" :value="tipo">{{ tipo }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Color (Guía VITA)</label>
                    <input 
                    v-model="form.color" 
                    type="text" 
                    placeholder="Ej: A2, B1..."
                    class="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all"
                    >
                </div>
                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha Entrega Esperada</label>
                    <input 
                    v-model="form.fecha_entrega_prevista" 
                    type="date" 
                    required
                    class="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all"
                    >
                </div>
                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Presupuesto Estimado</label>
                    <input 
                    v-model="form.costo" 
                    type="number" 
                    class="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black tracking-widest outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all"
                    >
                </div>
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Especificaciones Técnicas / Observaciones</label>
              <textarea 
                v-model="form.descripcion" 
                required
                rows="4"
                placeholder="Detalla materiales, piezas involucradas, anatomía requerida..."
                class="w-full px-8 py-6 bg-white border border-gray-100 rounded-[2rem] text-sm font-medium outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-6 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              @click="$emit('close')"
              class="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-all"
            >
              Descartar
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="flex items-center gap-4 px-12 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-gray-200"
            >
              <i v-if="loading" class="fas fa-circle-notch animate-spin"></i>
              Emitir Orden de Lab
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Sub-modal for new lab -->
    <div v-if="showAddLab" class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl space-y-8">
            <h4 class="text-xl font-black text-gray-900 uppercase tracking-tight">Nuevo Lab Proveedor</h4>
            <div class="space-y-4">
                <input v-model="newLab.nombre" placeholder="Nombre Comercial" class="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-violet-600 text-xs font-bold uppercase tracking-widest">
                <input v-model="newLab.telefono" placeholder="Teléfono" class="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-violet-600 text-xs font-bold uppercase tracking-widest">
            </div>
            <div class="flex gap-4">
                <button @click="showAddLab = false" class="flex-1 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Cancelar</button>
                <button @click="saveNewLab" class="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest">Guardar Lab</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLaboratorioStore } from '@clinica/stores/laboratorio'
import { usePacientesStore } from '@clinica/stores/pacientes'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({
    pacienteId: { type: Number, default: null },
    profesionalId: { type: Number, default: null }
})

const emit = defineEmits(['close', 'success'])

const labStore = useLaboratorioStore()
const pacientesStore = usePacientesStore()
const profesionalesStore = useProfesionalesStore()
const notify = useNotification()

const loading = ref(false)
const showAddLab = ref(false)

const form = ref({
    paciente_id: props.pacienteId || '',
    profesional_id: props.profesionalId || '',
    laboratorio_id: '',
    trabajo_tipo: '',
    descripcion: '',
    color: '',
    fecha_entrega_prevista: '',
    costo: 0
})

const newLab = ref({ nombre: '', telefono: '' })

const tiposTrabajo = [
    'Corona (Circonio/Cerámica)',
    'Puente Dental',
    'Prótesis Total Removible',
    'Prótesis Parcial (Acrílico)',
    'Prótesis Flexible',
    'Carillas de Porcelana',
    'Pernos Muñones',
    'Aparato de Ortodoncia',
    'Plano de Relajación',
    'Férula Quirúrgica',
    'Otro'
]

async function handleSubmit() {
    loading.value = true
    try {
        const res = await labStore.createOrden(form.value)
        if (res.success) {
            notify.success('Orden de laboratorio emitida con éxito')
            emit('success')
            emit('close')
        } else {
            notify.error(res.message || 'Error al crear la orden')
        }
    } catch (err) {
        notify.error('Error de conexión con el servidor')
    } finally {
        loading.value = false
    }
}

async function saveNewLab() {
    if (!newLab.value.nombre) return notify.warning('El nombre es obligatorio')
    try {
        const res = await labStore.createLaboratorio(newLab.value)
        if (res.success) {
            notify.success('Laboratorio registrado')
            showAddLab.value = false
            form.value.laboratorio_id = res.data.id
            newLab.value = { nombre: '', telefono: '' }
        }
    } catch (err) {
        notify.error('Error al registrar laboratorio')
    }
}

onMounted(() => {
    if (pacientesStore.pacientes.length === 0) pacientesStore.fetchPacientes()
    if (profesionalesStore.profesionales.length === 0) profesionalesStore.fetchProfesionales()
    labStore.fetchLaboratorios()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
