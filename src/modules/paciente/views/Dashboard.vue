<!-- src/views/paciente/Dashboard.vue -->
<template>
  <div class="paciente-dashboard">
    <!-- Header de Bienvenida -->
    <header class="dashboard-header">
      <div class="bienvenida">
        <h1>¡Hola, {{ paciente?.nombre }}! 👋</h1>
        <p class="text-muted">Bienvenido a tu portal de paciente</p>
      </div>
    </header>

    <!-- Grid de Tarjetas Principales -->
    <div class="dashboard-grid">
      <!-- CARD 1: Información de Clínica -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
  <h2 class="text-xl font-semibold text-gray-900 mb-6">
    <i class="fas fa-clinic-medical text-blue-600 mr-2"></i>
    Contacto Clínica
  </h2>

  <!-- Debug: Mostrar si hay datos -->
  <div v-if="!authStore.clinica" class="text-center py-4">
    <p class="text-gray-500 text-sm">Cargando información de la clínica...</p>
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

      <!-- CARD 2: Próxima Cita -->
      <div class="card proxima-cita-card">
        <div class="card-header">
          <h2>📅 Próxima Cita</h2>
        </div>
        <div class="card-body">
          <div v-if="cargandoCitas" class="loading">
            <span class="spinner"></span> Cargando...
          </div>
          <div v-else-if="proximaCita" class="proxima-cita">
            <div class="cita-fecha">
              <div class="dia">{{ formatearDia(proximaCita.fecha) }}</div>
              <div class="mes">{{ formatearMes(proximaCita.fecha) }}</div>
            </div>
            <div class="cita-detalles">
              <div class="hora">
                <i class="icon-clock"></i>
                {{ proximaCita.hora }}
              </div>
              <div class="profesional">
                <i class="icon-doctor"></i>
                {{ proximaCita.profesional?.nombre }} {{ proximaCita.profesional?.apellido }}
              </div>
              <div class="tratamiento" v-if="proximaCita.tratamiento">
                <i class="icon-treatment"></i>
                {{ proximaCita.tratamiento.nombre }}
              </div>
              <div class="estado">
                <span :class="`badge badge-${getEstadoClass(proximaCita.estado)}`">
                  {{ formatearEstado(proximaCita.estado) }}
                </span>
              </div>
            </div>
            <div class="cita-acciones">
              <router-link 
                :to="{ name: 'paciente-cita-detalle', params: { id: proximaCita.id }}"
                class="btn btn-sm btn-primary"
              >
                Ver detalles
              </router-link>
            </div>
          </div>
          <div v-else class="sin-datos">
            <p>No tienes citas programadas</p>
            <router-link to="/paciente/agendar" class="btn btn-primary btn-sm">
              Agendar cita
            </router-link>
          </div>
        </div>
      </div>

      <!-- CARD 3: Mis Citas Recientes -->
      <div class="card citas-recientes-card">
        <div class="card-header">
          <h2>🗓️ Mis Citas</h2>
          <router-link to="/paciente/citas" class="ver-todas">
            Ver todas →
          </router-link>
        </div>
        <div class="card-body">
          <div v-if="cargandoCitas" class="loading">
            <span class="spinner"></span> Cargando...
          </div>
          <div v-else-if="citasRecientes.length > 0" class="citas-lista">
            <div 
              v-for="cita in citasRecientes" 
              :key="cita.id"
              class="cita-item"
              @click="verDetalleCita(cita.id)"
            >
              <div class="cita-fecha-mini">
                <span class="dia">{{ formatearDia(cita.fecha) }}</span>
                <span class="mes-hora">{{ formatearMesCorto(cita.fecha) }} - {{ cita.hora }}</span>
              </div>
              <div class="cita-info">
                <div class="profesional">
                  Dr. {{ cita.profesional?.apellido }}
                </div>
                <div class="tratamiento" v-if="cita.tratamiento">
                  {{ cita.tratamiento.nombre }}
                </div>
              </div>
              <div class="cita-estado">
                <span :class="`badge badge-${getEstadoClass(cita.estado)}`">
                  {{ formatearEstado(cita.estado) }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="sin-datos">
            <p>No tienes citas registradas</p>
          </div>
        </div>
      </div>

      <!-- CARD 4: Estado de Cuenta (si está disponible) -->
      <div class="card cuenta-card">
        <div class="card-header">
          <h2>💳 Estado de Cuenta</h2>
        </div>
        <div class="card-body">
          <div v-if="cargandoCuenta" class="loading">
            <span class="spinner"></span> Cargando...
          </div>
          <div v-else-if="estadoCuenta" class="estado-cuenta">
            <div class="monto-pendiente">
              <span class="label">Saldo pendiente:</span>
              <span class="monto">{{ formatearMonto(estadoCuenta.saldo_pendiente) }}</span>
            </div>
            <router-link to="/paciente/pagos" class="btn btn-outline-primary btn-sm">
              Ver detalles
            </router-link>
          </div>
          <div v-else class="sin-datos">
            <p>No hay información de cuenta disponible</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="acciones-rapidas">
      <h2>Acciones Rápidas</h2>
      <div class="acciones-grid">
        <router-link to="/paciente/citas" class="accion-card">
          <i class="icon-calendar-plus"></i>
          <span>Agendar Cita</span>
        </router-link>
        <router-link to="/paciente/citas" class="accion-card">
          <i class="icon-calendar"></i>
          <span>Ver Mis Citas</span>
        </router-link>
        <router-link to="/paciente/perfil" class="accion-card">
          <i class="icon-user"></i>
          <span>Mi Perfil</span>
        </router-link>
        <router-link to="/paciente/historia-clinica" class="accion-card">
          <i class="icon-file-medical"></i>
          <span>Historia Clínica</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getMisCitas } from '@paciente/services/citasService'
import api from '@paciente/services/api'
import { usePacienteAuthStore } from '@paciente/stores/auth'


const router = useRouter()
const authStore = usePacienteAuthStore()
// Estados
const paciente = ref(null)
const clinica = ref(null)
const proximasCitas = ref([])
const estadoCuenta = ref(null)

const cargandoClinica = ref(false)
const cargandoCitas = ref(false)
const cargandoCuenta = ref(false)

// Computados
const proximaCita = computed(() => {
  return proximasCitas.value[0] || null
})

const citasRecientes = computed(() => {
  return proximasCitas.value.slice(0, 5)
})

// Funciones
onMounted(async () => {
  await cargarDatosPaciente()
  await cargarDatosClinica()
  await cargarProximasCitas()
  await cargarEstadoCuenta()
})

async function cargarDatosPaciente() {
  try {
    const response = await api.get('/paciente/perfil')
    if (response.data.success) {
      paciente.value = response.data.data
    }
  } catch (error) {
    console.error('Error al cargar paciente:', error)
  }
}

async function cargarDatosClinica() {
  try {
    cargandoClinica.value = true
    
    // Obtener el perfil del paciente que incluye clinica_id
    if (!paciente.value) {
      const perfilResponse = await api.get('/paciente/perfil')
      paciente.value = perfilResponse.data.data
    }
    
    // Obtener datos de la clínica usando la ruta pública
    if (paciente.value?.clinica_id) {
      // Primero intentar obtener el slug de la clínica desde el localStorage
      const clinicaSlug = localStorage.getItem('clinica_slug')
      
      if (clinicaSlug) {
        const response = await api.get(`/clinica/${clinicaSlug}`)
        if (response.data.success) {
          clinica.value = response.data.data
        }
      }
    }
  } catch (error) {
    console.error('Error al cargar clínica:', error)
  } finally {
    cargandoClinica.value = false
  }
}

async function cargarProximasCitas() {
  try {
    cargandoCitas.value = true
    
    // Llamar con filtro tipo: 'proximas' 
    const response = await getMisCitas({
      tipo: 'proximas',  // ← CLAVE: Solo citas futuras
      per_page: 5
    })
    
    if (response.success) {
      proximasCitas.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error al cargar próximas citas:', error)
  } finally {
    cargandoCitas.value = false
  }
}

async function cargarEstadoCuenta() {
  try {
    cargandoCuenta.value = true
    const response = await api.get('/paciente/mis-pagos/resumen')
    
    if (response.data.success) {
      estadoCuenta.value = response.data.data
    }
  } catch (error) {
    console.error('Error al cargar estado de cuenta:', error)
    // No es crítico si falla, solo no mostrar la tarjeta
  } finally {
    cargandoCuenta.value = false
  }
}

function verDetalleCita(id) {
  router.push({ name: 'paciente-cita-detalle', params: { id } })
}

// Formateadores
function formatearDia(fecha) {
  return new Date(fecha).getDate().toString().padStart(2, '0')
}

function formatearMes(fecha) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return meses[new Date(fecha).getMonth()]
}

function formatearMesCorto(fecha) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return meses[new Date(fecha).getMonth()]
}

function formatearEstado(estado) {
  const estados = {
    'programada': 'Programada',
    'confirmada': 'Confirmada',
    'completada': 'Completada',
    'cancelada': 'Cancelada',
    'noasistio': 'No asistió'
  }
  return estados[estado] || estado
}

function getEstadoClass(estado) {
  const clases = {
    'programada': 'warning',
    'confirmada': 'success',
    'completada': 'secondary',
    'cancelada': 'danger',
    'noasistio': 'danger'
  }
  return clases[estado] || 'secondary'
}

function formatearMonto(monto) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(monto)
}
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
