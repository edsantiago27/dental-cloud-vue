<!-- components/superadmin/ClinicaFormModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl w-full max-w-2xl transform transition-all border border-gray-100 dark:border-white/5 overflow-hidden">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-8 border-b border-gray-50 dark:border-white/5">
          <div>
            <span class="text-[9px] font-black text-violet-500 dark:text-orange-500 uppercase tracking-[0.2em] mb-1 block">Gestión de Ecosistema</span>
            <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
              {{ isEdit ? 'Editar Clínica' : 'Nueva Clínica' }}
            </h3>
          </div>
          <button
            @click="$emit('close')"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit" class="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Nombre -->
            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Nombre de la Clínica *
              </label>
              <input
                v-model="form.nombre"
                type="text"
                required
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                placeholder="Ej. Clínica Dental Sonrisa"
              >
            </div>

            <!-- Email -->
            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Email *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                placeholder="contacto@clinica.cl"
              >
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Teléfono
              </label>
              <input
                v-model="form.telefono"
                type="text"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                placeholder="+56 9 1234 5678"
              >
            </div>

            <!-- Dirección -->
            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Dirección
              </label>
              <input
                v-model="form.direccion"
                type="text"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                placeholder="Ej. Av. Providencia 123"
              >
            </div>

            <!-- RUT -->
            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                RUT
              </label>
              <input
                v-model="form.rut"
                type="text"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                placeholder="12.345.678-9"
              >
            </div>

            <!-- Plan / Estado -->
            <div v-if="!isEdit">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Plan Inicial *
              </label>
              <select
                v-model="form.plan_id"
                required
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="" disabled>Seleccionar plan...</option>
                <option value="1">Plan Básico</option>
                <option value="2">Plan Profesional</option>
                <option value="3">Plan Enterprise</option>
              </select>
            </div>

            <div v-if="isEdit">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Estado Actual
              </label>
              <select
                v-model="form.estado"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>

            <!-- Credenciales (solo para nueva clínica) -->
            <div v-if="!isEdit" class="md:col-span-2 mt-6 pt-6 border-t border-gray-50 dark:border-white/5">
              <h4 class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">Administrador Maestro</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                    Nombre del Admin *
                  </label>
                  <input
                    v-model="form.admin_nombre"
                    type="text"
                    required
                    class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                  >
                </div>

                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                    Email del Admin *
                  </label>
                  <input
                    v-model="form.admin_email"
                    type="email"
                    required
                    class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                  >
                </div>

                <div class="md:col-span-2">
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                    Contraseña Temporal *
                  </label>
                  <input
                    v-model="form.admin_password"
                    type="password"
                    required
                    minlength="8"
                    class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                    placeholder="Mínimo 8 caracteres"
                  >
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="md:col-span-2 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold">
              <i class="fas fa-exclamation-circle text-lg"></i>
              <span>{{ errorMessage }}</span>
            </div>

          </div>

        </form>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-8 py-6 bg-gray-50 dark:bg-white/5 border-t border-gray-50 dark:border-white/5 rounded-b-xl">
          <button
            type="button"
            @click="$emit('close')"
            class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ isEdit ? 'Guardar Cambios' : 'Crear Clínica' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdminClinicasStore } from '@superadmin/stores/clinicas'

const props = defineProps({
  clinica: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const clinicasStore = useSuperAdminClinicasStore()

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  region: '',
  rut: '',
  razon_social: '',
  plan_id: '',
  estado: 'activa',
  admin_nombre: '',
  admin_apellido: '',
  admin_email: '',
  admin_password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const isEdit = computed(() => !!props.clinica)

onMounted(() => {
  if (props.clinica) {
    form.value = {
      nombre: props.clinica.nombre || '',
      email: props.clinica.email || '',
      telefono: props.clinica.telefono || '',
      direccion: props.clinica.direccion || '',
      ciudad: props.clinica.ciudad || '',
      region: props.clinica.region || '',
      rut: props.clinica.rut || '',
      razon_social: props.clinica.razon_social || '',
      estado: props.clinica.estado || 'activa'
    }
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    let result
    if (isEdit.value) {
      result = await clinicasStore.actualizarClinica(props.clinica.id, form.value)
    } else {
      result = await clinicasStore.crearClinica(form.value)
    }

    if (result.success) {
      emit('saved')
    } else {
      errorMessage.value = result.message || 'Error al guardar clínica'
    }
  } catch (error) {
    errorMessage.value = 'Error al procesar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.05);
}
</style>