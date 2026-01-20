<!-- src/modules/demo/views/Pacientes.vue -->
<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Base de Pacientes</h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Gestión integral de fichas y registros</p>
      </div>
      <button 
        @click="showModal = true"
        class="px-8 py-4 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 hover:scale-105 active:scale-95 transition-all"
      >
        <i class="fas fa-user-plus mr-2"></i> Nuevo Paciente
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
      <div class="relative max-w-md">
        <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input 
          v-model="pacientesStore.filters.search"
          type="text" 
          placeholder="BUSCAR POR NOMBRE O RUT..."
          class="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all outline-none"
        >
      </div>
    </div>

    <!-- Lista -->
    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/20 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="text-left border-b border-gray-50">
            <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Paciente</th>
            <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificación</th>
            <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</th>
            <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
            <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr 
            v-for="p in pacientesStore.filteredPacientes" 
            :key="p.id"
            class="group hover:bg-gray-50/50 transition-colors"
          >
            <td class="px-8 py-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-black text-xs">
                  {{ p.nombre.split(' ').map(n => n[0]).join('') }}
                </div>
                <span class="text-xs font-black text-gray-900 uppercase tracking-tight">{{ p.nombre }}</span>
              </div>
            </td>
            <td class="px-8 py-6 text-[10px] font-bold text-gray-500 tracking-widest">{{ p.rut }}</td>
            <td class="px-8 py-6">
              <p class="text-[10px] font-black text-gray-900">{{ p.email }}</p>
              <p class="text-[9px] font-bold text-gray-400">{{ p.telefono }}</p>
            </td>
            <td class="px-8 py-6">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                {{ p.estado }}
              </span>
            </td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:bg-violet-600 hover:text-white transition-all">
                  <i class="fas fa-file-medical text-[10px]"></i>
                </button>
                <button @click="handleDelete(p.id)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white transition-all">
                  <i class="fas fa-trash text-[10px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="pacientesStore.filteredPacientes.length === 0" class="p-20 text-center font-black text-[10px] text-gray-300 uppercase tracking-[0.3em]">
        No se encontraron pacientes
      </div>
    </div>

    <!-- Modal Simplificado para Demo -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-scale-up">
        <div class="p-8 bg-gray-50 border-b border-gray-100">
          <h3 class="text-xl font-black text-gray-900 uppercase tracking-tight">Registro de Paciente</h3>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ingresa los datos del nuevo integrante</p>
        </div>
        <form @submit.prevent="handleSave" class="p-8 space-y-6">
          <div>
            <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nombre Completo</label>
            <input v-model="form.nombre" type="text" required class="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">RUT / ID</label>
              <input v-model="form.rut" type="text" required class="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none">
            </div>
            <div>
              <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email</label>
              <input v-model="form.email" type="email" required class="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none">
            </div>
          </div>
          <div class="flex gap-4 pt-4">
            <button type="button" @click="showModal = false" class="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 hover:scale-105 transition-all">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDemoPacientesStore } from '../stores/demoPacientes'

const pacientesStore = useDemoPacientesStore()
const showModal = ref(false)
const form = ref({ nombre: '', rut: '', email: '', telefono: '+56 9 0000 0000' })

function handleSave() {
  pacientesStore.createPaciente({ ...form.value })
  showModal.value = false
  form.value = { nombre: '', rut: '', email: '', telefono: '+56 9 0000 0000' }
}

function handleDelete(id) {
  if (confirm('¿Eliminar paciente de la demo?')) {
    pacientesStore.deletePaciente(id)
  }
}

onMounted(() => {
  pacientesStore.fetchPacientes()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scale-up {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
.animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
