<!-- src/views/paciente/Dashboard.vue - VERSIÓN CON DATOS REALES -->
<template>
  <div class="space-y-6">
    
    <!-- Header con Saludo -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
      <h1 class="text-3xl font-bold mb-2">
        ¡Hola, {{ authStore.paciente?.nombre }}! 👋
      </h1>
      <p class="text-blue-100">
        Bienvenido a tu portal de paciente de {{ authStore.clinica?.nombre }}
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Cargando información...</p>
      </div>
    </div>

    <!-- Contenido Principal -->
    <template v-else>
      
      <!-- Resumen Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Próxima Cita -->
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-calendar-check text-2xl text-blue-600"></i>
            </div>
            <span v-if="proximaCita" class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {{ diasHastaCita(proximaCita.fecha) }}
            </span>
          </div>
          <h3 class="text-sm text-gray-600 mb-1">Próxima Cita</h3>
          <div v-if="proximaCita">
            <p class="text-xl font-bold text-gray-900">
              {{ formatFechaCorta(proximaCita.fecha) }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              {{ proximaCita.hora?.substring(0, 5) }} - {{ proximaCita.profesional?.nombre }}
            </p>
          </div>
          <p v-else class="text-lg text-gray-400">Sin citas programadas</p>
        </div>

        <!-- Saldo Pendiente -->
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-dollar-sign text-2xl text-red-600"></i>
            </div>
          </div>
          <h3 class="text-sm text-gray-600 mb-1">Saldo Pendiente</h3>
          <p class="text-2xl font-bold text-gray-900">
            ${{ formatMonto(resumenPagos.total_pendiente) }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ resumenPagos.cuentas_pendientes }} {{ resumenPagos.cuentas_pendientes === 1 ? 'cuenta' : 'cuentas' }}
          </p>
        </div>

        <!-- Total Citas -->
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-clipboard-check text-2xl text-green-600"></i>
            </div>
          </div>
          <h3 class="text-sm text-gray-600 mb-1">Citas Realizadas</h3>
          <p class="text-2xl font-bold text-gray-900">{{ totalCitasCompletadas }}</p>
          <p class="text-xs text-gray-500 mt-1">Total histórico</p>
        </div>

        <!-- Última Consulta -->
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-history text-2xl text-purple-600"></i>
            </div>
          </div>
          <h3 class="text-sm text-gray-600 mb-1">Última Consulta</h3>
          <p v-if="ultimaCita" class="text-lg font-bold text-gray-900">
            {{ formatFechaCorta(ultimaCita.fecha) }}
          </p>
          <p v-else class="text-lg text-gray-400">Sin registros</p>
        </div>

      </div>

      <!-- Próximas Citas -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            <i class="fas fa-calendar-alt text-blue-600 mr-2"></i>
            Próximas Citas
          </h2>
          <router-link
            :to="`/${clinicaSlug}/paciente/citas`"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todas →
          </router-link>
        </div>

        <div v-if="proximasCitas.length === 0" class="text-center py-8">
          <i class="fas fa-calendar-times text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-600 mb-4">No tienes citas próximas</p>
          <router-link
            :to="`/${clinicaSlug}/paciente/citas`"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <i class="fas fa-plus"></i>
            Agendar Cita
          </router-link>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="cita in proximasCitas.slice(0, 3)"
            :key="cita.id"
            class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
          >
            <div class="flex-shrink-0 w-16 text-center">
              <div class="bg-blue-100 rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-600">
                  {{ formatDia(cita.fecha) }}
                </div>
                <div class="text-xs text-blue-600 font-medium uppercase">
                  {{ formatMes(cita.fecha) }}
                </div>
              </div>
            </div>

            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">
                {{ cita.tratamiento?.nombre || 'Consulta General' }}
              </h3>
              <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>
                  <i class="fas fa-clock mr-1"></i>
                  {{ cita.hora?.substring(0, 5) }}
                </span>
                <span>
                  <i class="fas fa-user-md mr-1"></i>
                  {{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}
                </span>
              </div>
            </div>

            <router-link
              :to="`/${clinicaSlug}/paciente/citas`"
              class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm"
            >
              Ver detalle
            </router-link>
          </div>
        </div>
      </div>

      <!-- Grid de 2 Columnas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Cuentas Pendientes -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">
              <i class="fas fa-file-invoice-dollar text-blue-600 mr-2"></i>
              Cuentas por Pagar
            </h2>
            <router-link
              :to="`/${clinicaSlug}/paciente/pagos`"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver todas →
            </router-link>
          </div>

          <div v-if="cuentasPendientes.length === 0" class="text-center py-8">
            <i class="fas fa-check-circle text-4xl text-green-300 mb-3"></i>
            <p class="text-gray-600">¡No tienes cuentas pendientes!</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="cuenta in cuentasPendientes.slice(0, 3)"
              :key="cuenta.id"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-900">{{ cuenta.concepto }}</h3>
                <span class="text-lg font-bold text-red-600">
                  ${{ formatMonto(cuenta.saldo_pendiente || cuenta.total) }}
                </span>
              </div>
              <p class="text-xs text-gray-500">
                {{ formatFechaCorta(cuenta.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Información de la Clínica -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            <i class="fas fa-clinic-medical text-blue-600 mr-2"></i>
            Contacto Clínica
          </h2>

          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-map-marker-alt text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Dirección</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ authStore.clinica?.direccion || 'No especificada' }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-phone text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Teléfono</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ authStore.clinica?.telefono || 'No especificado' }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-envelope text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Email</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ authStore.clinica?.email || 'No especificado' }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-clock text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Horario de Atención</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ authStore.clinica?.horario_atencion || 'Lunes a Viernes 9:00 - 18:00' }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Accesos Rápidos -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          :to="`/${clinicaSlug}/paciente/citas`"
          class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <i class="fas fa-calendar-plus text-2xl text-blue-600"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Agendar Cita</h3>
        </router-link>

        <router-link
          :to="`/${clinicaSlug}/paciente/historia-clinica`"
          class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <i class="fas fa-file-medical text-2xl text-green-600"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Mi Historia</h3>
        </router-link>

        <router-link
          :to="`/${clinicaSlug}/paciente/pagos`"
          class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <i class="fas fa-credit-card text-2xl text-yellow-600"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Mis Pagos</h3>
        </router-link>

        <router-link
          :to="`/${clinicaSlug}/paciente/documentos`"
          class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <i class="fas fa-folder-open text-2xl text-purple-600"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Documentos</h3>
        </router-link>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePacienteAuthStore } from '@/stores/paciente/auth'
import { citasService, pagosService } from '@/services/paciente'

const route = useRoute()
const authStore = usePacienteAuthStore()

// State
const loading = ref(false)
const citas = ref([])
const resumenPagos = ref({
  total_pendiente: 0,
  total_pagado: 0,
  cuentas_pendientes: 0
})
const cuentasPendientes = ref([])

// Computed
const clinicaSlug = computed(() => route.params.clinicaSlug || 'demo')

const proximasCitas = computed(() => {
  return citas.value
    .filter(c => {
      const fechaCita = new Date(c.fecha + ' ' + c.hora)
      return fechaCita >= new Date() && !['cancelada', 'completada'].includes(c.estado)
    })
    .sort((a, b) => new Date(a.fecha + ' ' + a.hora) - new Date(b.fecha + ' ' + b.hora))
})

const proximaCita = computed(() => proximasCitas.value[0] || null)

const ultimaCita = computed(() => {
  const citasPasadas = citas.value
    .filter(c => {
      const fechaCita = new Date(c.fecha + ' ' + c.hora)
      return fechaCita < new Date() && c.estado === 'completada'
    })
    .sort((a, b) => new Date(b.fecha + ' ' + b.hora) - new Date(a.fecha + ' ' + a.hora))
  
  return citasPasadas[0] || null
})

const totalCitasCompletadas = computed(() => {
  return citas.value.filter(c => c.estado === 'completada').length
})

// Methods
function formatMonto(monto) {
  return new Intl.NumberFormat('es-CL').format(monto)
}

function formatFechaCorta(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

function formatDia(fecha) {
  return new Date(fecha).getDate()
}

function formatMes(fecha) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return meses[new Date(fecha).getMonth()]
}

function diasHastaCita(fecha) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaCita = new Date(fecha)
  fechaCita.setHours(0, 0, 0, 0)
  const dias = Math.ceil((fechaCita - hoy) / (1000 * 60 * 60 * 24))
  
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Mañana'
  return `En ${dias} días`
}

async function cargarDatos() {
  loading.value = true

  try {
    // Cargar citas
    const citasResponse = await citasService.getMisCitas()
    if (citasResponse.success) {
      citas.value = citasResponse.data?.data || citasResponse.data || []
    }

    // Cargar resumen de pagos
    const pagosResponse = await pagosService.getResumen()
    if (pagosResponse.success) {
      resumenPagos.value = pagosResponse.data
    }

    // Cargar cuentas pendientes
    const cuentasResponse = await pagosService.getCuentas('pendiente')
    if (cuentasResponse.success) {
      cuentasPendientes.value = cuentasResponse.data
    }
  } catch (err) {
    console.error('Error cargar datos dashboard:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  cargarDatos()
})
</script>