<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-4xl">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Reserva tu Hora
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {{ clinica?.nombre || 'Clínica Dental' }}
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
        <!-- Steps Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-center">
            <div v-for="step in steps" :key="step.number" class="flex items-center">
              <div :class="[
                'flex items-center justify-center w-8 h-8 rounded-full',
                currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              ]">
                {{ step.number }}
              </div>
              <div v-if="step.number < steps.length" :class="[
                'w-12 h-1',
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              ]"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-2 px-10">
            <span>Profesional</span>
            <span>Horario</span>
            <span>Mis Datos</span>
            <span>Confirmar</span>
          </div>
        </div>

        <!-- Step 1: Select Professional -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Selecciona un Profesional</h3>
          <div v-if="loading.profesionales" class="text-center py-4">
            <i class="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="prof in profesionales" 
              :key="prof.id"
              @click="seleccionarProfesional(prof)"
              class="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex items-center gap-4"
              :class="{'border-blue-500 bg-blue-50': selectedProfesional?.id === prof.id}"
            >
              <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
                <i class="fas fa-user-md text-gray-500"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ prof.nombre }} {{ prof.apellido }}</p>
                <p class="text-sm text-gray-500">{{ prof.especialidad || 'Odontólogo General' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Date & Time -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Selecciona Fecha y Hora</h3>
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Calendar Input -->
            <div class="md:w-1/2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input 
                type="date" 
                v-model="fechaSeleccionada"
                :min="today"
                @change="fetchHorarios"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            
            <!-- Slots -->
            <div class="md:w-1/2">
               <label class="block text-sm font-medium text-gray-700 mb-2">Horarios Disponibles</label>
               <div v-if="loading.horarios" class="text-center py-4">
                 <i class="fas fa-spinner fa-spin text-blue-600"></i>
               </div>
               <div v-else-if="horarios.length === 0" class="text-gray-500 text-sm italic">
                  No hay horarios disponibles para esta fecha.
               </div>
               <div v-else class="grid grid-cols-3 gap-2">
                 <button
                    v-for="slot in horarios"
                    :key="slot.hora"
                    @click="horaSeleccionada = slot.hora"
                    :class="[
                      'py-2 px-3 text-sm rounded-md border text-center transition',
                      horaSeleccionada === slot.hora
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    ]"
                 >
                   {{ slot.hora }}
                 </button>
               </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Patient Data -->
        <div v-if="currentStep === 3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ingresa tus Datos</h3>
          <form @submit.prevent class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">RUT</label>
              <input v-model="form.rut" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="form.email" type="email" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input v-model="form.nombre" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">Apellido</label>
              <input v-model="form.apellido" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input v-model="form.telefono" type="tel" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
              <input v-model="form.fecha_nacimiento" type="date" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
          </form>
        </div>

        <!-- Step 5: Verification -->
        <div v-if="currentStep === 5">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Verifica tu Identidad</h3>
          <div class="text-center">
            <div class="mb-6">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <i class="fas fa-envelope text-blue-600 text-xl"></i>
              </div>
              <h4 class="text-lg font-medium text-gray-900">Revisa tu correo</h4>
              <p class="text-sm text-gray-500 mt-2">
                Hemos enviado un código de verificación a <strong>{{ form.email }}</strong>
              </p>
            </div>

            <div class="max-w-xs mx-auto mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Código de Verificación</label>
              <input 
                v-model="verificationCode" 
                type="text" 
                maxlength="4"
                placeholder="1234"
                class="block w-full text-center text-2xl tracking-widest border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <p class="text-xs text-gray-500 mb-4">
              ¿No recibiste el código? 
              <button @click="resendCode" class="text-blue-600 hover:text-blue-500 font-medium">Reenviar</button>
            </p>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between">
          <button 
            v-if="currentStep > 1 && currentStep < 5"
            @click="currentStep--"
            class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Atrás
          </button>
          <div v-else></div> <!-- Spacer -->

          <button 
            v-if="currentStep < 5"
            @click="nextStep"
            :disabled="!canProceed || loading.saving"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <span v-if="loading.saving" class="mr-2"><i class="fas fa-spinner fa-spin"></i></span>
            {{ currentStep === 4 ? 'Confirmar Reserva' : 'Siguiente' }}
          </button>

          <button 
            v-if="currentStep === 5"
            @click="submitVerification"
            :disabled="verificationCode.length !== 4 || loading.verifying"
            class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
             <span v-if="loading.verifying" class="mr-2"><i class="fas fa-spinner fa-spin"></i></span>
             Verificar y Finalizar
          </button>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {{ error }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePacienteAuthStore } from '../stores/auth' // Import auth store
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = usePacienteAuthStore()
const clinicaSlug = route.params.clinicaSlug

const steps = [{number: 1}, {number: 2}, {number: 3}, {number: 4}, {number: 5}]
const currentStep = ref(1)
const loading = ref({ profesionales: false, horarios: false, saving: false, verifying: false })
const error = ref(null)

// Data
const clinica = ref(null)
const profesionales = ref([])
const selectedProfesional = ref(null)
const horarios = ref([])
const fechaSeleccionada = ref(new Date().toISOString().split('T')[0])
const horaSeleccionada = ref(null)
const today = new Date().toISOString().split('T')[0]
const verificationCode = ref('')

const form = ref({
  rut: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fecha_nacimiento: ''
})

// Computed
const canProceed = computed(() => {
  if (currentStep.value === 1) return !!selectedProfesional.value
  if (currentStep.value === 2) return !!fechaSeleccionada.value && !!horaSeleccionada.value
  if (currentStep.value === 3) return form.value.rut && form.value.email && form.value.nombre && form.value.apellido && form.value.telefono
  return true
})

// Methods
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'
})

function formatDate(date) {
    if(!date) return ''
    const [y, m, d] = date.split('-')
    return `${d}/${m}/${y}`
}

async function fetchProfesionales() {
  loading.value.profesionales = true
  try {
    const { data } = await api.get(`/portal/${clinicaSlug}/public/profesionales`)
    if(data.success) profesionales.value = data.data
  } catch (e) {
    error.value = 'Error al cargar profesionales. Verifique que la url sea correcta.'
  } finally {
    loading.value.profesionales = false
  }
}

async function fetchHorarios() {
  if (!selectedProfesional.value || !fechaSeleccionada.value) return
  
  loading.value.horarios = true
  horaSeleccionada.value = null
  try {
    const { data } = await api.get(`/portal/${clinicaSlug}/public/horarios`, {
      params: {
        profesional_id: selectedProfesional.value.id,
        fecha: fechaSeleccionada.value
      }
    })
    horarios.value = data.success ? data.data : []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value.horarios = false
  }
}

function seleccionarProfesional(prof) {
  selectedProfesional.value = prof
  // Auto advance logic could go here
}

async function nextStep() {
  if (currentStep.value === 1) {
    fetchHorarios() // Pre-fetch if date is already set (default today)
  }
  
  if (currentStep.value < 4) {
    currentStep.value++
  } else {
    submitReserva()
  }
}

async function submitReserva() {
  loading.value.saving = true
  error.value = null
  
  try {
    const payload = {
      ...form.value,
      profesional_id: selectedProfesional.value.id,
      fecha: fechaSeleccionada.value,
      hora: horaSeleccionada.value,
    }
    
    const { data } = await api.post(`/portal/${clinicaSlug}/public/reservar`, payload)
    
    if (data.success) {
      if (data.requires_verification) {
        currentStep.value = 5 // Go to verification step
      } else {
        alert('¡Reserva confirmada! Te hemos enviado los detalles a tu correo.')
        router.push(`/${clinicaSlug}/paciente/login`)
      }
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al procesar la reserva.'
  } finally {
    loading.value.saving = false
  }
}

async function submitVerification() {
  loading.value.verifying = true
  error.value = null

  try {
    const { data } = await api.post(`/portal/${clinicaSlug}/public/verificar`, {
      email: form.value.email,
      code: verificationCode.value
    })

    if (data.success) {
       // Login user via store if possible, or just store token
       localStorage.setItem('paciente_token', data.data.token)
       // Refresh auth store state if needed
       // For now, redirect to portal dashboard
       alert('¡Identidad verificada exitosamente!')
       // Force window reload or store update to apply auth
       window.location.href = `/portal/${clinicaSlug}/dashboard` // Route might vary in router
       // Ideally: router.push(`/${clinicaSlug}/paciente/portal`)
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Código incorrecto o expirado.'
  } finally {
    loading.value.verifying = false
  }
}

function resendCode() {
  // Call reserve again to resend code? 
  // It should be idempotent for sending code if not verified.
  submitReserva()
  alert('Se ha reenviado el código.')
}

onMounted(() => {
  fetchProfesionales()
})
</script>
