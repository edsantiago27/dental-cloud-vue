<template>
  <div class="space-y-8 animate-fade-in-up">
    
    <!-- Large Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tight">Mi Perfil</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Configuración de cuenta y seguridad</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
          Paciente Verificado
        </span>
      </div>
    </div>

    <!-- Alert Messages -->
    <transition enter-active-class="animate-shake" leave-active-class="opacity-0 transition-opacity">
      <div v-if="successMessage || error" :class="[successMessage ? 'bg-green-50/50 border-green-100 text-green-700' : 'bg-red-50/50 border-red-100 text-red-700', 'p-5 rounded-3xl border backdrop-blur-sm flex items-center gap-4 shadow-sm']">
        <div :class="[successMessage ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600', 'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0']">
          <i :class="successMessage ? 'fas fa-check' : 'fas fa-exclamation-triangle'"></i>
        </div>
        <p class="font-bold text-sm">{{ successMessage || error }}</p>
      </div>
    </transition>

    <!-- Loading -->
    <div v-if="loadingData" class="flex flex-col items-center justify-center py-20 animate-pulse">
      <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
      </div>
      <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando perfil...</p>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Left Sidebar: Profile Summary -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50 text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div class="relative z-10">
            <!-- Avatar -->
            <div class="relative inline-block mb-8">
              <div class="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200 ring-[8px] ring-blue-50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                {{ authStore.userInitials }}
              </div>
              <button class="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-lg transition-all">
                <i class="fas fa-camera text-sm"></i>
              </button>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ authStore.userName }}</h2>
            <p class="text-gray-400 font-medium text-sm mt-1">{{ authStore.user?.email }}</p>
            
            <div class="mt-10 pt-10 border-t border-gray-50 space-y-4">
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-400 font-bold uppercase tracking-tighter">Estado de Citas</span>
                <span class="text-green-600 font-bold">Excelente</span>
              </div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div class="w-[95%] h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
              </div>
              <p class="text-[10px] text-gray-400 font-medium">Has asistido al 95% de tus citas programadas este año.</p>
            </div>
          </div>
        </div>

        <!-- Meta Info Bento -->
        <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-200">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <i class="fas fa-history text-blue-400 text-sm"></i>
            </div>
            <h4 class="font-bold tracking-tight">Actividad Reciente</h4>
          </div>
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
              <div>
                <p class="text-[13px] font-bold">Perfil actualizado</p>
                <p class="text-[10px] text-gray-500 font-medium tracking-wide">HACE 2 DÍAS</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
              <div>
                <p class="text-[13px] font-bold">Cita completada</p>
                <p class="text-[10px] text-gray-500 font-medium tracking-wide">15 DE ENERO, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content: Form Tabs -->
      <div class="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-50">
          <button
            @click="tabActivo = 'informacion'"
            :class="[tabActivo === 'informacion' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'bg-gray-50/30 text-gray-400 hover:text-gray-600', 'flex-1 py-8 px-6 font-black text-xs uppercase tracking-widest transition-all']"
          >
            Información Personal
          </button>
          <button
            @click="tabActivo = 'seguridad'"
            :class="[tabActivo === 'seguridad' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'bg-gray-50/30 text-gray-400 hover:text-gray-600', 'flex-1 py-8 px-6 font-black text-xs uppercase tracking-widest transition-all']"
          >
            Seguridad y Acceso
          </button>
        </div>

        <div class="p-10">
          <!-- Personal Information Tab -->
          <div v-if="tabActivo === 'informacion'" class="animate-fade-in-up">
            <form @submit.prevent="guardarPerfil" class="space-y-10">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <!-- Nombre Group -->
                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
                      <i class="fas fa-user text-sm"></i>
                    </span>
                    <input v-model="form.nombre" type="text" placeholder="Ej: Juan" class="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-300">
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Apellidos</label>
                  <div class="relative group">
                    <input v-model="form.apellido" type="text" placeholder="Ej: Pérez" class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-300">
                  </div>
                </div>

                <!-- Read-only RUT -->
                <div class="space-y-3 opacity-60">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">RUT (No editable)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <i class="fas fa-id-card text-sm"></i>
                    </span>
                    <input :value="authStore.user?.rut" type="text" disabled class="w-full pl-11 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-2xl outline-none text-gray-500 font-bold cursor-not-allowed">
                  </div>
                </div>

                <!-- Phone -->
                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono Movil</label>
                  <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
                      <i class="fas fa-phone text-sm"></i>
                    </span>
                    <input v-model="form.telefono" type="tel" placeholder="+56 9 1234 5678" class="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-300">
                  </div>
                </div>

                <!-- Birthdate -->
                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                  <input v-model="form.fecha_nacimiento" type="date" class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold">
                </div>

                <!-- Gender -->
                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Género</label>
                  <select v-model="form.genero" class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold appearance-none cursor-pointer">
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <!-- Address Section -->
              <div class="space-y-6 pt-10 border-t border-gray-50">
                <h3 class="text-xl font-bold tracking-tight text-gray-900">Ubicación y Domicilio</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div class="md:col-span-2 space-y-3">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Dirección</label>
                    <input v-model="form.direccion" type="text" placeholder="Ej: Av. Providencia 123" class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-300">
                  </div>
                  <div class="space-y-3">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Ciudad</label>
                    <input v-model="form.ciudad" type="text" placeholder="Ej: Santiago" class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-300">
                  </div>
                  <div class="space-y-3">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Comuna</label>
                    <input v-model="form.comuna" type="text" placeholder="Ej: Las Condes" class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold placeholder:text-gray-300">
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="pt-10 flex items-center justify-end gap-4 border-t border-gray-50">
                <button type="button" @click="cargarDatos" class="px-8 py-4 text-gray-400 font-bold hover:text-gray-900 transition-all">Descartar</button>
                <button type="submit" :disabled="loading" class="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-300 flex items-center gap-3">
                  <span v-if="!loading">Guardar Perfil</span>
                  <i v-else class="fas fa-circle-notch fa-spin"></i>
                </button>
              </div>
            </form>
          </div>

          <!-- Security Tab -->
          <div v-else class="animate-fade-in-up">
            <div class="max-w-xl mx-auto space-y-10 py-4">
              <div class="text-center mb-10">
                <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-shield-alt text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold tracking-tight">Cambiar Contraseña</h3>
                <p class="text-gray-500 font-medium">Mantén tu cuenta segura con una contraseña robusta</p>
              </div>

              <form @submit.prevent="cambiarPassword" class="space-y-8">
                <!-- Current Password -->
                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña Actual</label>
                  <div class="relative group">
                    <input v-model="passwordForm.password_actual" :type="showPasswordActual ? 'text' : 'password'" required class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold">
                    <button type="button" @click="showPasswordActual = !showPasswordActual" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                      <i :class="showPasswordActual ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <!-- New Password -->
                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                  <div class="relative group">
                    <input v-model="passwordForm.password" :type="showPasswordNueva ? 'text' : 'password'" required minlength="6" class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold">
                    <button type="button" @click="showPasswordNueva = !showPasswordNueva" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                      <i :class="showPasswordNueva ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Mínimo 6 caracteres</p>
                </div>

                <!-- Confirm Password -->
                <div class="space-y-3">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                  <input v-model="passwordForm.password_confirmation" :type="showPasswordNueva ? 'text' : 'password'" required class="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-gray-900 font-bold">
                </div>

                <div class="pt-6 flex flex-col gap-4">
                  <button type="submit" :disabled="loadingPassword" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-gray-300">
                    Actualizar Contraseña
                  </button>
                  <button type="button" @click="cancelarPassword" class="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-all text-sm">Cancelar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePacienteAuthStore } from '../stores/auth'
import api from '@paciente/services/api'

const authStore = usePacienteAuthStore()

// State
const tabActivo = ref('informacion')
const loading = ref(false)
const loadingPassword = ref(false)
const loadingData = ref(false)
const error = ref(null)
const successMessage = ref(null)
const showPasswordActual = ref(false)
const showPasswordNueva = ref(false)

const form = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  fecha_nacimiento: '',
  genero: '',
  direccion: '',
  ciudad: '',
  comuna: '',
  contacto_emergencia_nombre: '',
  contacto_emergencia_telefono: '',
  contacto_emergencia_relacion: ''
})

const passwordForm = ref({
  password_actual: '',
  password: '',
  password_confirmation: ''
})

// Methods
async function cargarDatos() {
  loadingData.value = true
  try {
    const response = await api.get('/paciente/perfil')
    if (response.data.success) {
      const paciente = response.data.data
      form.value = {
        nombre: paciente.nombre || '',
        apellido: paciente.apellido || '',
        telefono: paciente.telefono || '',
        fecha_nacimiento: paciente.fecha_nacimiento || '',
        genero: paciente.genero || '',
        direccion: paciente.direccion || '',
        ciudad: paciente.ciudad || '',
        comuna: paciente.comuna || '',
        contacto_emergencia_nombre: paciente.contacto_emergencia_nombre || '',
        contacto_emergencia_telefono: paciente.contacto_emergencia_telefono || '',
        contacto_emergencia_relacion: paciente.contacto_emergencia_relacion || ''
      }
    }
  } catch (err) {
    console.error('Error al cargar perfil:', err)
  } finally {
    loadingData.value = false
  }
}

async function guardarPerfil() {
  loading.value = true
  error.value = null
  successMessage.value = null

  try {
    const response = await api.put('/paciente/perfil', form.value)
    if (response.data.success) {
      successMessage.value = 'Perfil actualizado correctamente'
      await authStore.fetchPerfil()
      setTimeout(() => { successMessage.value = null }, 3000)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al actualizar el perfil'
  } finally {
    loading.value = false
  }
}

async function cambiarPassword() {
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  loadingPassword.value = true
  error.value = null
  successMessage.value = null

  try {
    const response = await api.put('/paciente/cambiar-password', passwordForm.value)
    if (response.data.success) {
      successMessage.value = 'Contraseña actualizada correctamente'
      cancelarPassword()
      setTimeout(() => { successMessage.value = null }, 3000)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cambiar la contraseña'
  } finally {
    loadingPassword.value = false
  }
}

function cancelarPassword() {
  passwordForm.value = { password_actual: '', password: '', password_confirmation: '' }
  showPasswordActual.value = false
  showPasswordNueva.value = false
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}
</style>
