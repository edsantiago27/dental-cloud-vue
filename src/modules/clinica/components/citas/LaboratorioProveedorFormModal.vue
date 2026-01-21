<!-- components/citas/LaboratorioProveedorFormModal.vue -->
<template>
  <div class="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md animate-fade-in shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
    <div class="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative border border-gray-100">
      
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute right-8 top-8 z-20 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all hover:rotate-90 duration-500"
      >
        <i class="fas fa-times text-xl"></i>
      </button>

      <div class="p-12">
        <div class="flex items-center gap-3 mb-10">
          <div class="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i class="fas fa-building text-sm text-violet-400"></i>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 block mb-1">Catálogo Maestro</span>
            <h2 class="text-2xl font-black tracking-tighter uppercase leading-none text-gray-900">
              {{ laboratorio ? 'Editar Proveedor' : 'Nuevo Laboratorio' }}
            </h2>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
            <input 
              v-model="form.nombre" 
              type="text" 
              required
              class="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all text-gray-900"
              placeholder="Ej: Laboratorio Dental Central"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Persona de Contacto</label>
              <input 
                v-model="form.contacto_nombre" 
                type="text" 
                class="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all text-gray-900"
                placeholder="Nombre del técnico/admin"
              >
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono Directo</label>
              <input 
                v-model="form.telefono" 
                type="text" 
                class="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all text-gray-900"
                placeholder="+56 9..."
              >
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all text-gray-900"
              placeholder="lab@ejemplo.com"
            >
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección Física</label>
            <textarea 
              v-model="form.direccion" 
              rows="2"
              class="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] text-[10px] font-black tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all text-gray-900 resize-none"
              placeholder="Dirección para envíos y retiros..."
            ></textarea>
          </div>

          <!-- Switch Es Interno -->
          <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div class="flex items-center">
                <input 
                  id="es_interno" 
                  type="checkbox" 
                  v-model="form.es_interno"
                  class="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                >
            </div>
            <label for="es_interno" class="flex-1 cursor-pointer">
                <span class="block text-sm font-bold text-gray-900">Laboratorio Interno (In-House)</span>
                <span class="block text-[10px] text-gray-400">Marque esta casilla si este laboratorio es parte de su misma clínica y gestiona la producción internamente.</span>
            </label>
          </div>

          <div class="flex items-center justify-end gap-6 pt-6">
            <button 
              type="button" 
              @click="$emit('close')"
              class="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-all font-outfit"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="flex items-center gap-4 px-12 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
            >
              <i v-if="loading" class="fas fa-circle-notch animate-spin"></i>
              {{ laboratorio ? 'Actualizar' : 'Guardar Lab' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLaboratorioStore } from '@clinica/stores/laboratorio'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({
  laboratorio: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const labStore = useLaboratorioStore()
const notify = useNotification()
const loading = ref(false)

const form = ref({
  nombre: '',
  contacto_nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  es_interno: false,
  estado: 'activo'
})

onMounted(() => {
  if (props.laboratorio) {
    form.value = { ...props.laboratorio }
  }
})

async function handleSubmit() {
  if (!form.value.nombre) return notify.warning('El nombre es obligatorio')
  
  loading.value = true
  try {
    let res
    if (props.laboratorio) {
      res = await labStore.updateLaboratorio(props.laboratorio.id, form.value)
    } else {
      res = await labStore.createLaboratorio(form.value)
    }

    if (res.success) {
      notify.success(props.laboratorio ? 'Laboratorio actualizado' : 'Laboratorio registrado con éxito')
      emit('success')
      emit('close')
    } else {
      notify.error(res.message || 'Error al guardar laboratorio')
    }
  } catch (err) {
    notify.error('Error de comunicación con el servidor')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
