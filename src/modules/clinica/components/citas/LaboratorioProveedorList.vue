<!-- components/citas/LaboratorioProveedorList.vue -->
<template>
  <div class="space-y-6">
    <!-- Quick Stats for Providers -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between">
            <div>
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Asociados</p>
                <h4 class="text-2xl font-black text-gray-900 tracking-tight">{{ labStore.laboratorios.length }} Labs</h4>
            </div>
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-violet-600 shadow-sm">
                <i class="fas fa-microscope text-lg"></i>
            </div>
        </div>
    </div>

    <!-- Provider Grid/Table -->
    <div v-if="labStore.laboratorios.length === 0" class="py-20 text-center bg-gray-50/30 rounded-[2.5rem] border border-dashed border-gray-200">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
            <i class="fas fa-building text-3xl"></i>
        </div>
        <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight">Sin proveedores registrados</h4>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Registra un laboratorio para emitir órdenes de trabajo</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
            v-for="lab in labStore.laboratorios" 
            :key="lab.id"
            class="group bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-violet-200 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
            <div class="relative z-10">
                <div class="flex items-start justify-between mb-6">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-violet-400 shadow-lg group-hover:scale-110 transition-transform">
                            <i class="fas fa-building text-xl"></i>
                        </div>
                        <div>
                            <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{{ lab.nombre }}</h4>
                            <span class="px-2 py-0.5 bg-violet-50 text-violet-600 text-[8px] font-black uppercase rounded-lg">Proveedor Externo</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button 
                            @click="$emit('edit', lab)"
                            class="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all"
                        >
                            <i class="fas fa-edit text-[10px]"></i>
                        </button>
                        <button 
                            @click="handleDelete(lab)"
                            class="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                        >
                            <i class="fas fa-trash-alt text-[10px]"></i>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mt-4">
                    <div>
                        <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Contacto Principal</p>
                        <p class="text-[10px] font-bold text-gray-700 uppercase">{{ lab.contacto_nombre || 'No asignado' }}</p>
                    </div>
                    <div>
                        <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Teléfono</p>
                        <p class="text-[10px] font-bold text-gray-700">{{ lab.telefono || '-' }}</p>
                    </div>
                </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                <div class="flex items-center gap-3">
                    <i class="fas fa-envelope text-[10px] text-violet-400"></i>
                    <span class="text-[9px] font-bold text-gray-500 lowercase tracking-tight">{{ lab.email || 'Sin email registrado' }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :class="lab.estado === 'activo' ? 'bg-emerald-500' : 'bg-gray-300'"></span>
                    <span class="text-[8px] font-black uppercase tracking-widest text-gray-400">{{ lab.estado }}</span>
                </div>
            </div>

            <!-- Background Decoration -->
            <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-violet-50/50 rounded-full blur-3xl group-hover:bg-violet-100/50 transition-colors"></div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useLaboratorioStore } from '@clinica/stores/laboratorio'
import { useNotification } from '@shared/composables/useNotification'

const labStore = useLaboratorioStore()
const notify = useNotification()

defineEmits(['edit'])

async function handleDelete(lab) {
    if (!confirm(`¿Estás seguro de eliminar el laboratorio ${lab.nombre}? Esto solo será posible si no tiene órdenes asociadas.`)) return

    try {
        const res = await labStore.deleteLaboratorio(lab.id)
        if (res.success) {
            notify.success('Laboratorio eliminado correctamente')
        } else {
            notify.error(res.message || 'No se pudo eliminar el laboratorio')
        }
    } catch (err) {
        notify.error('Error al intentar eliminar')
    }
}
</script>
