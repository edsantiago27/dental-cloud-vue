<!-- src/modules/paciente/views/Dashboard.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Header con Saludo -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
      <h1 class="text-3xl font-bold mb-2">
        ¡Hola, {{ authStore.paciente?.nombre }}! 👋
      </h1>
      <p class="text-blue-100">
        Bienvenido a tu portal de paciente de {{ authStore.clinica?.nombre || 'DentalCloud' }}
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
            :to="{ name: 'paciente-citas' }"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todas →
          </router-link>
        </div>

        <div v-if="proximasCitas.length === 0" class="text-center py-8">
          <i class="fas fa-calendar-times text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-600 mb-4">No tienes citas próximas</p>
          <router-link
            :to="{ name: 'paciente-citas' }"
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
              :to="{ name: 'paciente-cita-detalle', params: { id: cita.id } }"
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
              :to="{ name: 'paciente-pagos' }"
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

          <!-- Debug Info -->
          <div v-if="!authStore.clinica" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-blue-600 mb-3"></i>
            <p class="text-sm text-gray-500">Cargando información de la clínica...</p>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-building text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Nombre</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ authStore.clinica.nombre || 'No especificado' }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-map-marker-alt text-blue-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Dirección</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ authStore.clinica.direccion || 'No especificada' }}
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
                  {{ authStore.clinica.telefono || 'No especificado' }}
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
                  {{ authStore.clinica.email || 'No especificado' }}
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
                  {{ authStore.clinica.horario_atencion || 'Lunes a Viernes 9:00 - 18:00' }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Accesos Rápidos -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          :to="{ name: 'paciente-citas' }"
          class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <i class="fas fa-calendar-plus text-2xl text-blue-600"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Agendar Cita</h3>
        </router-link>

        <router-link
          :to="{ name: 'paciente-historia-clinica' }"
          class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <i class="fas fa-file-medical text-2xl text-green-600"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Mi Historia</h3>
        </router-link>

        <router-link
          :to="{ name: 'paciente-pagos' }"
          class="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <i class="fas fa-credit-card text-2xl text-yellow-600"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Mis Pagos</h3>
        </router-link>

        <router-link
          :to="{ name: 'paciente-documentos' }"
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
import { usePacienteAuthStore } from '@paciente/stores/auth'
import { usePacienteCitasStore } from '@paciente/stores/citas' // ✅ Importar store de citas
import { pagosService } from '../services'

const authStore = usePacienteAuthStore()
const citasStore = usePacienteCitasStore() // ✅ Inicializar store

// State
const resumenPagos = ref({
  total_pendiente: 0,
  total_pagado: 0,
  cuentas_pendientes: 0
})
const cuentasPendientes = ref([])

// Computed
// ✅ Usar getters del store en lugar de lógica local
const proximasCitas = computed(() => citasStore.citasProximas)
const proximaCita = computed(() => citasStore.proximaCita)
const citas = computed(() => citasStore.citas)
const loading = computed(() => citasStore.loading) // Ojo: esto solo cubre carga de citas, si quieres global puedes combinarlo

const ultimaCita = computed(() => citasStore.citasPasadas[0] || null)

const totalCitasCompletadas = computed(() => {
  return citas.value.filter(c => c.estado === 'completada').length
})

// Methods
function formatMonto(monto) {
  if (!monto && monto !== 0) return '0'
  return new Intl.NumberFormat('es-CL').format(monto)
}

function formatFechaCorta(fecha) {
  if (!fecha) return 'N/A'
  try {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  } catch (e) {
    return 'N/A'
  }
}

function formatDia(fecha) {
  if (!fecha) return ''
  return new Date(fecha).getDate()
}

function formatMes(fecha) {
  if (!fecha) return ''
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return meses[new Date(fecha).getMonth()]
}

function diasHastaCita(fecha) {
  if (!fecha) return ''
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
  try {
    console.log('🔄 Cargando datos del dashboard...')
    
    // ✅ Cargar citas usando el store
    await citasStore.fetchCitas()
    
    // Cargar resumen de pagos
    try {
      const pagosResponse = await pagosService.getResumen()
      
      if (pagosResponse.success !== false) {
        resumenPagos.value = pagosResponse.data || pagosResponse || resumenPagos.value
      }
    } catch (errPagos) {
      console.warn('⚠️ Error al cargar pagos:', errPagos.message)
    }

    // Cargar cuentas pendientes
    try {
      const cuentasResponse = await pagosService.getCuentas('pendiente')
      
      if (cuentasResponse.success !== false) {
        cuentasPendientes.value = cuentasResponse.data || cuentasResponse || []
      }
    } catch (errCuentas) {
      console.warn('⚠️ Error al cargar cuentas:', errCuentas.message)
    }

  } catch (err) {
    console.error('❌ Error general cargar datos dashboard:', err)
  } finally {
    console.log('✅ Carga de datos completada')
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Dashboard montado')
  
  // Asegurarse de que tenemos los datos del paciente
  if (!authStore.paciente || !authStore.clinica) {
    console.log('🔄 Recargando perfil...')
    await authStore.fetchPerfil()
  }
  
  await cargarDatos()
})
</script>


<style scoped lang="scss">
.paciente-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;

  .bienvenida {
    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .text-muted {
      color: #6c757d;
      font-size: 1rem;
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    padding: 1.25rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: #2c3e50;
    }

    .ver-todas {
      font-size: 0.875rem;
      color: #007bff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .card-body {
    padding: 1.25rem;
  }
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;

  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.sin-datos {
  text-align: center;
  padding: 2rem;
  color: #6c757d;

  p {
    margin-bottom: 1rem;
  }
}

// Estilos específicos de tarjetas
.clinica-info {
  .clinica-logo {
    text-align: center;
    margin-bottom: 1rem;

    img {
      max-width: 120px;
      max-height: 60px;
      object-fit: contain;
    }
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: #495057;
  }
}

.proxima-cita {
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  .cita-fecha {
    text-align: center;
    padding: 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
    min-width: 70px;

    .dia {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }

    .mes {
      font-size: 0.875rem;
      text-transform: uppercase;
      margin-top: 0.25rem;
    }
  }

  .cita-detalles {
    flex: 1;

    > div {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .hora, .profesional, .tratamiento {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .cita-acciones {
    margin-top: 1rem;
  }
}

.citas-lista {
  .cita-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-bottom: 1px solid #e9ecef;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .cita-fecha-mini {
      text-align: center;
      min-width: 60px;

      .dia {
        font-size: 1.25rem;
        font-weight: 700;
        color: #007bff;
        display: block;
      }

      .mes-hora {
        font-size: 0.75rem;
        color: #6c757d;
      }
    }

    .cita-info {
      flex: 1;

      .profesional {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .tratamiento {
        font-size: 0.875rem;
        color: #6c757d;
      }
    }
  }
}

.estado-cuenta {
  text-align: center;

  .monto-pendiente {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .label {
      font-size: 0.875rem;
      color: #6c757d;
    }

    .monto {
      font-size: 2rem;
      font-weight: 700;
      color: #28a745;
    }
  }
}

.acciones-rapidas {
  margin-top: 3rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  .acciones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;

    .accion-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      text-decoration: none;
      color: #2c3e50;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: #007bff;
      }

      i {
        font-size: 2rem;
      }

      span {
        font-weight: 500;
        text-align: center;
      }
    }
  }
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;

  &.badge-success {
    background: #d4edda;
    color: #155724;
  }

  &.badge-warning {
    background: #fff3cd;
    color: #856404;
  }

  &.badge-danger {
    background: #f8d7da;
    color: #721c24;
  }

  &.badge-secondary {
    background: #e9ecef;
    color: #495057;
  }
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.2s;

  &.btn-primary {
    background: #007bff;
    color: white;
    border: none;

    &:hover {
      background: #0056b3;
    }
  }

  &.btn-outline-primary {
    background: transparent;
    color: #007bff;
    border: 1px solid #007bff;

    &:hover {
      background: #007bff;
      color: white;
    }
  }

  &.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
