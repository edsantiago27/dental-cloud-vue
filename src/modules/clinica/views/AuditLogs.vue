<!-- modules/clinica/views/AuditLogs.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2 font-outfit">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-gray-900 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg">Cumplimiento Legal</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ fechaActual }}</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            Bitácora de <span class="text-violet-600">Auditoría</span>
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Trazabilidad total de registros clínicos y financieros</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchLogs"
          :disabled="loading"
          class="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50 group"
        >
          <i :class="['fas fa-sync-alt', loading ? 'fa-spin' : 'group-hover:rotate-180 transition-transform duration-500']"></i>
          {{ loading ? 'Sincronizando' : 'Actualizar' }}
        </button>
      </div>
    </div>

    <!-- Bento Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div class="space-y-2">
            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Acción</label>
            <select v-model="filters.action" class="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold outline-none ring-0 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all">
                <option value="">Todas las acciones</option>
                <option value="create">Creación</option>
                <option value="update">Actualización</option>
                <option value="delete">Eliminación</option>
                <option value="login">Inicios de Sesión</option>
            </select>
        </div>
        <div class="space-y-2">
            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Módulo</label>
            <select v-model="filters.model_type" class="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold outline-none ring-0 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all">
                <option value="">Todos los módulos</option>
                <option value="paciente">Pacientes</option>
                <option value="historia">Historia Clínica</option>
                <option value="receta">Recetas</option>
                <option value="presupuesto">Presupuestos</option>
                <option value="caja">Caja</option>
                <option value="producto">Inventario</option>
            </select>
        </div>
        <div class="md:col-span-2 flex items-end gap-3">
            <div class="flex-1 space-y-2">
                 <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Rango de Fechas</label>
                 <div class="flex gap-2">
                    <input type="date" v-model="filters.desde" class="flex-1 bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-violet-100">
                    <input type="date" v-model="filters.hasta" class="flex-1 bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-violet-100">
                 </div>
            </div>
            <button @click="fetchLogs" class="bg-gray-900 text-white p-4 h-[52px] w-[52px] rounded-2xl hover:scale-105 transition-all">
                <i class="fas fa-search"></i>
            </button>
        </div>
    </div>

    <!-- Main Audit List (Timeline) -->
    <div class="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] relative">
        <!-- Floating Active Indicator -->
        <div class="absolute left-12 top-0 bottom-0 w-px bg-gray-100"></div>

        <div v-if="loading" class="flex flex-col items-center justify-center p-20 gap-4">
            <div class="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analizando registros...</p>
        </div>

        <div v-else-if="logs.length === 0" class="p-20 text-center">
            <i class="fas fa-shield-alt text-6xl text-gray-100 mb-6"></i>
            <h3 class="text-xl font-black text-gray-300 uppercase tracking-tighter">Sin actividad registrada</h3>
        </div>

        <div v-else class="relative z-10">
            <div v-for="(log, idx) in logs" :key="log.id" class="group/log border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all p-8 flex gap-8 items-start">
                
                <!-- Time & Indicator -->
                <div class="flex flex-col items-center gap-4 mt-2">
                    <span class="text-[9px] font-black text-gray-400 whitespace-nowrap">{{ formatTime(log.created_at) }}</span>
                    <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xs shadow-lg transition-transform group-hover/log:scale-110', getActionBg(log.action)]">
                        <i :class="getActionIcon(log.action)"></i>
                    </div>
                </div>

                <!-- Content -->
                <div class="space-y-4 flex-1">
                    <div class="flex items-center justify-between">
                        <div>
                             <h4 class="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <span class="text-violet-600">{{ log.user_name }}</span> 
                                <span class="text-gray-400 font-bold uppercase text-[9px] tracking-widest">{{ getActionVerb(log.action) }}</span>
                                <span>{{ log.description }}</span>
                            </h4>
                            <div class="flex items-center gap-3 mt-1">
                                <span class="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-md">{{ log.model_name }} #{{ log.model_id }}</span>
                                <span class="text-[10px] font-medium text-gray-300">{{ log.ip_address }} • {{ getClientBrowser(log.user_agent) }}</span>
                            </div>
                        </div>
                        <button v-if="log.old_values || log.new_values" @click="selectedLog = log" class="p-3 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-sm">
                            Detalles
                        </button>
                    </div>

                    <!-- Change Diff (Snippet) -->
                    <div v-if="log.action === 'update' && log.new_values" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="(val, field) in log.new_values" :key="field" class="bg-gray-50 rounded-xl p-3 border border-gray-100/50">
                            <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">{{ field }}</span>
                            <div class="flex items-center gap-2">
                                <span v-if="log.old_values" class="text-[10px] line-through text-gray-300 font-medium">{{ formatValue(log.old_values[field]) }}</span>
                                <i v-if="log.old_values" class="fas fa-arrow-right text-[8px] text-violet-300"></i>
                                <span class="text-[10px] font-black text-gray-700">{{ formatValue(val) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="p-8 bg-gray-50/50 flex justify-between items-center mt-auto">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
            <div class="flex gap-2">
                <button :disabled="pagination.current_page === 1" @click="changePage(pagination.current_page - 1)" class="p-4 bg-white border border-gray-200 rounded-xl disabled:opacity-50">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button :disabled="pagination.current_page === pagination.last_page" @click="changePage(pagination.current_page + 1)" class="p-4 bg-white border border-gray-200 rounded-xl disabled:opacity-50">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Detail Modal -->
    <transition name="modal">
        <div v-if="selectedLog" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
            <div class="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
                <button @click="selectedLog = null" class="absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all z-10">
                    <i class="fas fa-times"></i>
                </button>

                <div class="p-12">
                    <div class="flex items-start gap-6 mb-8">
                        <div :class="['w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-xl', getActionBg(selectedLog.action)]">
                             <i :class="getActionIcon(selectedLog.action)"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">{{ getActionVerb(selectedLog.action) }} {{ selectedLog.model_name }}</h2>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">ID Registro: #{{ selectedLog.model_id }} • {{ formatDate(selectedLog.created_at) }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-8 py-8 border-y border-gray-50">
                        <div>
                             <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Operador</span>
                             <p class="text-sm font-black text-gray-900 uppercase tracking-tight">{{ selectedLog.user_name }}</p>
                             <span class="text-[10px] font-medium text-violet-500">{{ selectedLog.user_rol }}</span>
                        </div>
                        <div>
                             <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Impacto</span>
                             <span :class="['px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest', selectedLog.action === 'delete' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600']">
                                {{ selectedLog.action === 'delete' ? 'Destructivo' : 'Informativo' }}
                             </span>
                        </div>
                    </div>

                    <div class="mt-8 space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                         <div v-if="selectedLog.new_values">
                            <h5 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Detalle de Valores</h5>
                            <div class="space-y-3">
                                <div v-for="(val, key) in selectedLog.new_values" :key="key" class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-[9px] font-black text-gray-900 uppercase tracking-widest">{{ key }}</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div v-if="selectedLog.old_values && selectedLog.old_values[key] !== undefined" class="flex-1">
                                             <span class="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Anterior</span>
                                             <p class="text-[11px] font-medium text-gray-400 truncate">{{ formatValue(selectedLog.old_values[key]) }}</p>
                                        </div>
                                        <div v-if="selectedLog.old_values && selectedLog.old_values[key] !== undefined" class="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center">
                                            <i class="fas fa-arrow-right text-[10px] text-violet-300"></i>
                                        </div>
                                        <div class="flex-1">
                                             <span class="text-[8px] font-black text-violet-300 uppercase tracking-[0.2em] mb-1">Nuevo</span>
                                             <p class="text-[11px] font-black text-gray-900">{{ formatValue(val) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div class="mt-12 flex gap-4">
                        <button @click="selectedLog = null" class="flex-1 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all">
                            Cerrar Expediente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auditService } from '@clinica/services/auditService'

const logs = ref([])
const loading = ref(false)
const selectedLog = ref(null)
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0
})

const filters = ref({
    action: '',
    model_type: '',
    desde: '',
    hasta: '',
    page: 1
})

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  })
})

async function fetchLogs() {
    loading.ref = true
    try {
        const response = await auditService.getLogs({
            ...filters.value,
            page: pagination.value.current_page
        })
        if (response.success) {
            logs.value = response.data.data
            pagination.value = {
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            }
        }
    } catch (error) {
        console.error('Error fetching logs:', error)
    } finally {
        loading.value = false
    }
}

function changePage(page) {
    pagination.value.current_page = page
    fetchLogs()
}

function getActionBg(action) {
    const map = {
        'create': 'bg-emerald-500 text-white',
        'update': 'bg-violet-600 text-white',
        'delete': 'bg-red-500 text-white',
        'login': 'bg-sky-500 text-white',
        'logout': 'bg-gray-500 text-white',
        'unauthorized': 'bg-amber-500 text-white'
    }
    return map[action] || 'bg-gray-100 text-gray-600'
}

function getActionIcon(action) {
    const map = {
        'create': 'fas fa-plus',
        'update': 'fas fa-pen-fancy',
        'delete': 'fas fa-trash-alt',
        'login': 'fas fa-sign-in-alt',
        'logout': 'fas fa-sign-out-alt',
        'unauthorized': 'fas fa-user-shield'
    }
    return map[action] || 'fas fa-history'
}

function getActionVerb(action) {
    const map = {
        'create': 'Creó',
        'update': 'Actualizó',
        'delete': 'Eliminó',
        'login': 'Ingresó',
        'logout': 'Salió',
        'unauthorized': 'Violación Intentada'
    }
    return map[action] || action
}

function formatValue(val) {
    if (val === null || val === undefined) return '---'
    if (typeof val === 'boolean') return val ? 'SÍ' : 'NO'
    if (typeof val === 'object') return JSON.stringify(val).substring(0, 50) + '...'
    return val
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', { 
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('es-ES', { 
        hour: '2-digit', minute: '2-digit'
    })
}

function getClientBrowser(ua) {
    if (!ua) return 'N/A'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Edge')) return 'Edge'
    return 'Browser'
}

onMounted(() => {
    fetchLogs()
})
</script>

<style scoped>
@keyframes fade-in { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
}
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.modal-enter-active, .modal-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
</style>
