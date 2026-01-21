<!-- modules/clinica/views/Consentimientos.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2 font-outfit">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-violet-900/10 text-violet-600 text-[8px] font-black uppercase tracking-[0.3em] rounded-lg">Legal</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Documentación Digital</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            Consentimientos <span class="text-violet-600">Informados</span>
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openNewModal"
          class="flex items-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <i class="fas fa-plus group-hover:rotate-90 transition-transform"></i>
          Nuevo Documento
        </button>
      </div>
    </div>

    <!-- Bento Grid / KPI (Resumen) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-violet-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl leading-none -mr-8 -mt-8 group-hover:scale-110 transition-transform">#</div>
            <div class="relative z-10">
                <span class="text-[9px] font-black opacity-60 uppercase tracking-widest block mb-2">Total Documentos</span>
                <div class="text-5xl font-black tracking-tighter mb-1">{{ stats.total }}</div>
                <div class="text-[10px] font-medium opacity-80">Registros legales almacenados</div>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div class="absolute right-6 top-6 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <i class="fas fa-file-signature text-xl"></i>
            </div>
            <div class="mt-auto">
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Firmados</span>
                <div class="text-4xl font-black text-gray-900 tracking-tighter mb-1">{{ stats.firmados }}</div>
                <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Documentos válidos</div>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div class="absolute right-6 top-6 w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <i class="fas fa-clock text-xl"></i>
            </div>
            <div class="mt-auto">
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Pendientes</span>
                <div class="text-4xl font-black text-gray-900 tracking-tighter mb-1">{{ stats.pendientes }}</div>
                <div class="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Requieren firma</div>
            </div>
        </div>
    </div>

    <!-- Main List -->
    <div class="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div class="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
             <div class="flex items-center gap-4 bg-gray-50 px-4 py-3 rounded-2xl w-full md:w-auto">
                <i class="fas fa-search text-gray-400 text-sm"></i>
                <input 
                    v-model="search" 
                    placeholder="Buscar por paciente o documento..." 
                    class="bg-transparent border-none text-xs font-bold text-gray-900 outline-none w-full md:w-64 placeholder-gray-400"
                >
            </div>
            
            <div class="flex gap-2">
                <select v-model="filterEstado" class="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest text-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-100">
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="firmado">Firmados</option>
                </select>
            </div>
        </div>

        <div v-if="loading" class="p-20 flex justify-center">
             <div class="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
        </div>

        <table v-else class="w-full">
            <tbody class="divide-y divide-gray-50">
                <tr v-for="doc in documentosFiltered" :key="doc.id" class="group hover:bg-gray-50/50 transition-colors">
                    <td class="p-6 pl-8">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <i class="fas fa-file-contract"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-black text-gray-900 tracking-tight">{{ doc.titulo }}</h4>
                                <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{{ doc.tipo }}</span>
                            </div>
                        </div>
                    </td>
                    <td class="p-6">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-gray-900">{{ doc.paciente.nombre_completo }}</span>
                            <span class="text-[10px] text-gray-400">{{ doc.paciente.rut }}</span>
                        </div>
                    </td>
                    <td class="p-6">
                        <span :class="['px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2', getStatusClass(doc.estado)]">
                            <i :class="getStatusIcon(doc.estado)"></i>
                            {{ doc.estado }}
                        </span>
                    </td>
                    <td class="p-6">
                        <div class="text-[10px] font-medium text-gray-400 text-right">
                            {{ formatDate(doc.created_at) }}
                        </div>
                    </td>
                    <td class="p-6 pr-8 text-right">
                        <button 
                            @click="viewDocument(doc)"
                            class="p-3 hover:bg-white hover:shadow-lg rounded-xl text-gray-400 hover:text-violet-600 transition-all"
                        >
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </td>
                </tr>
                 <tr v-if="documentosFiltered.length === 0">
                    <td colspan="5" class="p-20 text-center">
                        <i class="fas fa-folder-open text-4xl text-gray-200 mb-4 block"></i>
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">No se encontraron documentos</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal Nuevo/Firma -->
    <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
            <div class="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Header -->
                <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <span class="text-[9px] font-black text-violet-600 uppercase tracking-[0.3em] block mb-1">
                            {{ isViewing ? 'Visualización' : 'Nuevo Documento' }}
                        </span>
                        <h2 class="text-2xl font-black text-gray-900 tracking-tight">Consentimiento Informado</h2>
                    </div>
                    <button @click="closeModal" class="w-10 h-10 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <i class="fas fa-times text-gray-500"></i>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-8">
                     <!-- Formulario de creación -->
                    <div v-if="!isViewing" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Paciente</label>
                                <select v-model="form.paciente_id" class="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-violet-100">
                                    <option value="" disabled>Seleccionar Paciente</option>
                                    <option v-for="p in pacientes" :key="p.id" :value="p.id">{{ p.nombre }} {{ p.apellido }} ({{ p.rut }})</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Procedimiento</label>
                                <select v-model="form.tipo" class="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-violet-100" @change="loadTemplate">
                                    <option value="general">Atención General</option>
                                    <option value="extraccion">Extracción Dental</option>
                                    <option value="endodoncia">Endodoncia</option>
                                    <option value="implante">Implante Dental</option>
                                    <option value="ortodoncia">Ortodoncia</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Título del Documento</label>
                            <input v-model="form.titulo" type="text" class="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-violet-100">
                        </div>

                        <div class="space-y-2">
                            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Contenido Legal</label>
                            <textarea v-model="form.contenido" rows="12" class="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm leading-relaxed text-gray-600 outline-none focus:ring-2 focus:ring-violet-100 font-serif"></textarea>
                        </div>
                    </div>

                    <!-- Vista de Firma/Lectura -->
                    <div v-else class="space-y-8">
                        <!-- El documento -->
                        <div class="bg-gray-50 p-8 rounded-2xl border border-gray-100 font-serif text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                            <h3 class="font-bold text-center text-lg mb-6 uppercase text-gray-900">{{ viewingDoc.titulo }}</h3>
                            {{ viewingDoc.contenido }}
                        </div>

                        <!-- Panel de firma -->
                        <div v-if="viewingDoc.estado === 'pendiente'" class="bg-violet-50 rounded-[2rem] p-8 border border-violet-100">
                            <h4 class="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <i class="fas fa-pen-nib"></i> Firma del Paciente
                            </h4>
                            
                            <!-- Componente SignaturePad -->
                            <SignaturePad 
                                ref="signaturePadRef" 
                                color="#4ade80" 
                                :height="200" 
                                @update="handleSignatureUpdate" 
                            />
                        </div>

                        <!-- Firma ya realizada -->
                        <div v-if="viewingDoc.estado === 'firmado'" class="mt-8 flex flex-col items-center gap-4 p-8 border-2 border-dashed border-emerald-100 rounded-3xl bg-emerald-50/30">
                            <img :src="viewingDoc.firma_path" class="h-32 object-contain" alt="Firma Digital">
                            <div class="text-center">
                                <div class="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 mb-2">
                                    <i class="fas fa-check-circle"></i> Firmado Digitalmente
                                </div>
                                <p class="text-[10px] text-gray-400 font-medium">
                                    {{ formatDate(viewingDoc.firmado_at) }} • IP: {{ viewingDoc.ip_address }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                    <button @click="closeModal" class="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors">
                        Cancelar
                    </button>
                    
                    <button 
                        v-if="!isViewing" 
                        @click="saveDraft" 
                        :disabled="saving"
                        class="px-8 py-4 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                         <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                         {{ saving ? 'Guardando...' : 'Crear Borrador' }}
                    </button>

                     <button 
                        v-if="isViewing && viewingDoc.estado === 'pendiente'" 
                        @click="confirmSignature" 
                        :disabled="!currentSignature || saving"
                        class="px-8 py-4 rounded-xl bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                         {{ saving ? 'Procesando...' : 'Confirmar Firma' }}
                    </button>
                    
                    <button 
                        v-if="isViewing && viewingDoc.estado === 'firmado'"
                        class="px-8 py-4 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2"
                        @click="printDocument"
                    >
                        <i class="fas fa-print"></i> Imprimir
                    </button>
                </div>
            </div>
        </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { consentimientosService } from '@clinica/services/consentimientosService'
import { usePacientesStore } from '@clinica/stores/pacientes' 
import SignaturePad from '@shared/ui/SignaturePad.vue'

// Estado
const documentos = ref([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const search = ref('')
const filterEstado = ref('')
const isViewing = ref(false)
const viewingDoc = ref(null)
const signaturePadRef = ref(null)
const currentSignature = ref(null)

// Stores
const pacientesStore = usePacientesStore()
const pacientes = computed(() => pacientesStore.pacientes)

// Refs Stats
const stats = computed(() => {
    return {
        total: documentos.value.length,
        firmados: documentos.value.filter(d => d.estado === 'firmado').length,
        pendientes: documentos.value.filter(d => d.estado === 'pendiente').length
    }
})

// Formulario
const form = ref({
    paciente_id: '',
    tipo: 'general',
    titulo: 'CONSENTIMIENTO INFORMADO PARA ATENCIÓN ODONTOLÓGICA',
    contenido: ''
})

// Templates básicos
const templates = {
    general: `Yo [Nombre Paciente], RUT [RUT], declaro que he sido informado/a detalladamente sobre mi diagnóstico, pronóstico y las alternativas de tratamiento propuestas.

Comprendo que la odontología no es una ciencia exacta y que, por tanto, no se pueden garantizar resultados.

He tenido la oportunidad de hacer preguntas y todas han sido respondidas a mi satisfacción. Autorizo al profesional tratante y a su equipo a realizar los procedimientos necesarios.`,
    extraccion: `Yo [Nombre Paciente], autorizo la extracción dental de la(s) pieza(s) indicada(s).
    
Entiendo los riesgos comunes como: inflamación, dolor, infección, alveolitis, daño a dientes vecinos, parestesia temporal o permanente.
    
Me comprometo a seguir las indicaciones post-operatorias entregadas por el profesional.`
}

const documentosFiltered = computed(() => {
    return documentos.value.filter(doc => {
        const matchesSearch = doc.titulo.toLowerCase().includes(search.value.toLowerCase()) || 
                              doc.paciente.nombre_completo.toLowerCase().includes(search.value.toLowerCase())
        const matchesEstado = filterEstado.value ? doc.estado === filterEstado.value : true
        return matchesSearch && matchesEstado
    })
})

// Métodos
async function loadData() {
    loading.value = true
    try {
        if (pacientesStore.pacientes.length === 0) await pacientesStore.fetchPacientes()
        const res = await consentimientosService.getConsentimientos()
        // Manejar respuesta paginada de Laravel o array directo
        if (res.success && res.data) {
            // Si es paginado (res.data tiene propiedad data que es array)
            if (res.data.data && Array.isArray(res.data.data)) {
                documentos.value = res.data.data
            } else if (Array.isArray(res.data)) {
                documentos.value = res.data
            } else {
                documentos.value = []
            }
        } else {
            documentos.value = []
        }
    } catch (e) {
        console.error('Error cargando consentimientos:', e)
        documentos.value = []
    } finally {
        loading.value = false
    }
}

function loadTemplate() {
    form.value.titulo = `CONSENTIMIENTO INFORMADO - ${form.value.tipo.toUpperCase()}`
    form.value.contenido = templates[form.value.tipo] || templates['general']
}

function openNewModal() {
    isViewing.value = false
    viewingDoc.value = null
    form.value = {
        paciente_id: '',
        tipo: 'general',
        titulo: 'CONSENTIMIENTO INFORMADO',
        contenido: templates['general']
    }
    showModal.value = true
}

function viewDocument(doc) {
    isViewing.value = true
    viewingDoc.value = doc
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    currentSignature.value = null
}

async function saveDraft() {
    if (!form.value.paciente_id) return alert('Seleccione un paciente')
    
    saving.value = true
    try {
        await consentimientosService.createConsentimiento(form.value)
        await loadData()
        closeModal()
    } catch (e) {
        alert('Error al guardar')
    } finally {
        saving.value = false
    }
}

function handleSignatureUpdate(dataUrl) {
    currentSignature.value = dataUrl
}

async function confirmSignature() {
    if (!currentSignature.value) return
    
    saving.value = true
    try {
        await consentimientosService.firmar(viewingDoc.value.id, currentSignature.value)
        await loadData()
        // Actualizar vista local
        viewingDoc.value.estado = 'firmado'
        viewingDoc.value.firma_path = currentSignature.value
        viewingDoc.value.firmado_at = new Date().toISOString()
    } catch (e) {
        alert('Error al firmar')
    } finally {
        saving.value = false
    }
}

function printDocument() {
    window.print()
}

function getStatusClass(estado) {
    if (estado === 'firmado') return 'bg-emerald-50 text-emerald-600'
    if (estado === 'pendiente') return 'bg-amber-50 text-amber-600'
    return 'bg-gray-100 text-gray-500'
}

function getStatusIcon(estado) {
    if (estado === 'firmado') return 'fas fa-check-circle'
    if (estado === 'pendiente') return 'fas fa-clock'
    return 'fas fa-question'
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })
}

onMounted(() => {
    loadData()
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

@media print {
    body * { visibility: hidden; }
    .modal-enter-active, .modal-leave-active { transition: none; }
    .fixed { position: absolute; inset: 0; background: white; padding: 0; }
    .fixed * { visibility: visible; }
    button { display: none; }
}
</style>
