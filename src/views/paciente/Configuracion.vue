<!-- src/views/paciente/Configuracion.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
      <p class="text-gray-600 mt-1">Personaliza tu experiencia en el portal</p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-green-800">
        <i class="fas fa-check-circle"></i>
        <span>{{ successMessage }}</span>
      </div>
    </div>

    <!-- Notificaciones -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        <i class="fas fa-bell text-blue-600 mr-2"></i>
        Notificaciones
      </h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Recordatorios de Citas</h3>
            <p class="text-sm text-gray-600 mt-1">
              Recibe notificaciones antes de tus citas programadas
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="config.notificaciones.citas"
              type="checkbox"
              class="sr-only peer"
              @change="guardarConfiguracion"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Recordatorios de Pagos</h3>
            <p class="text-sm text-gray-600 mt-1">
              Notificaciones sobre facturas y pagos pendientes
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="config.notificaciones.pagos"
              type="checkbox"
              class="sr-only peer"
              @change="guardarConfiguracion"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Novedades y Promociones</h3>
            <p class="text-sm text-gray-600 mt-1">
              Recibe información sobre servicios, promociones y novedades
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="config.notificaciones.promociones"
              type="checkbox"
              class="sr-only peer"
              @change="guardarConfiguracion"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Notificaciones por Email</h3>
            <p class="text-sm text-gray-600 mt-1">
              Recibir notificaciones también por correo electrónico
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="config.notificaciones.email"
              type="checkbox"
              class="sr-only peer"
              @change="guardarConfiguracion"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Privacidad -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        <i class="fas fa-shield-alt text-blue-600 mr-2"></i>
        Privacidad y Seguridad
      </h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Sesiones Activas</h3>
            <p class="text-sm text-gray-600 mt-1">
              Cerrar todas las sesiones en otros dispositivos
            </p>
          </div>
          <button
            @click="cerrarSesiones"
            :disabled="loading"
            class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            Cerrar sesiones
          </button>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Verificación en Dos Pasos</h3>
            <p class="text-sm text-gray-600 mt-1">
              Añade una capa extra de seguridad a tu cuenta
            </p>
            <span class="inline-flex items-center gap-1 text-xs text-gray-500 mt-2">
              <i class="fas fa-info-circle"></i>
              Próximamente disponible
            </span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer opacity-50 cursor-not-allowed">
            <input
              type="checkbox"
              disabled
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Compartir Datos con Otros Profesionales</h3>
            <p class="text-sm text-gray-600 mt-1">
              Permitir que otros profesionales de la salud accedan a mi historia
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="config.privacidad.compartir_datos"
              type="checkbox"
              class="sr-only peer"
              @change="guardarConfiguracion"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Preferencias -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        <i class="fas fa-sliders-h text-blue-600 mr-2"></i>
        Preferencias de la Aplicación
      </h2>

      <div class="space-y-6">
        <!-- Idioma -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Idioma
          </label>
          <select
            v-model="config.preferencias.idioma"
            @change="guardarConfiguracion"
            class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="es">Español</option>
            <option value="en" disabled>English (Próximamente)</option>
          </select>
        </div>

        <!-- Zona Horaria -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Zona Horaria
          </label>
          <select
            v-model="config.preferencias.zona_horaria"
            @change="guardarConfiguracion"
            class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Santiago">Santiago (GMT-3)</option>
            <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
            <option value="America/Lima">Lima (GMT-5)</option>
            <option value="America/Bogota">Bogotá (GMT-5)</option>
            <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
          </select>
        </div>

        <!-- Formato de Fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Formato de Fecha
          </label>
          <select
            v-model="config.preferencias.formato_fecha"
            @change="guardarConfiguracion"
            class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (13/01/2025)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (01/13/2025)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-01-13)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Acerca de -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        <i class="fas fa-info-circle text-blue-600 mr-2"></i>
        Acerca de
      </h2>

      <div class="space-y-3 text-sm">
        <div class="flex justify-between py-2 border-b border-gray-200">
          <span class="text-gray-600">Versión del Portal</span>
          <span class="font-medium text-gray-900">1.0.0</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-200">
          <span class="text-gray-600">Última Actualización</span>
          <span class="font-medium text-gray-900">13 de Enero, 2025</span>
        </div>
        <div class="flex justify-between py-2">
          <span class="text-gray-600">ID de Usuario</span>
          <span class="font-mono text-xs text-gray-900">{{ authStore.paciente?.id }}</span>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex gap-4">
          <a href="#" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            <i class="fas fa-book mr-2"></i>
            Términos de Uso
          </a>
          <a href="#" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            <i class="fas fa-shield-alt mr-2"></i>
            Política de Privacidad
          </a>
          <a href="#" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            <i class="fas fa-question-circle mr-2"></i>
            Ayuda y Soporte
          </a>
        </div>
      </div>
    </div>

    <!-- Zona de Peligro -->
    <div class="bg-red-50 border-2 border-red-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-red-900 mb-4">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        Zona de Peligro
      </h2>

      <div class="space-y-4">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-red-900">Eliminar mi Cuenta</h3>
            <p class="text-sm text-red-800 mt-1">
              Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.
            </p>
          </div>
          <button
            @click="mostrarModalEliminar = true"
            class="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div v-if="mostrarModalEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            ¿Eliminar tu cuenta?
          </h3>
          <p class="text-gray-600">
            Esta acción es permanente y no se puede deshacer.
          </p>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-red-800">
            Se eliminarán permanentemente:
          </p>
          <ul class="text-sm text-red-800 mt-2 space-y-1">
            <li>• Tu perfil e información personal</li>
            <li>• Historial de citas</li>
            <li>• Historia clínica</li>
            <li>• Documentos asociados</li>
          </ul>
        </div>

        <div class="flex gap-3">
          <button
            @click="mostrarModalEliminar = false"
            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            @click="eliminarCuenta"
            class="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePacienteAuthStore } from '@/stores/paciente/auth'

const router = useRouter()
const authStore = usePacienteAuthStore()

// State
const loading = ref(false)
const successMessage = ref(null)
const mostrarModalEliminar = ref(false)

const config = ref({
  notificaciones: {
    citas: true,
    pagos: true,
    promociones: false,
    email: true
  },
  privacidad: {
    compartir_datos: false
  },
  preferencias: {
    idioma: 'es',
    zona_horaria: 'America/Santiago',
    formato_fecha: 'DD/MM/YYYY'
  }
})

// Methods
async function guardarConfiguracion() {
  successMessage.value = null
  
  try {
    // Guardar en localStorage
    localStorage.setItem('paciente_config', JSON.stringify(config.value))
    
    // TODO: Enviar al backend
    // await api.put('/paciente/configuracion', config.value)
    
    successMessage.value = 'Configuración guardada correctamente'
    
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    console.error('Error guardar configuración:', err)
  }
}

async function cerrarSesiones() {
  if (!confirm('¿Cerrar todas las sesiones en otros dispositivos?')) return
  
  loading.value = true
  
  try {
    // TODO: Llamar al backend
    // await api.post('/paciente/cerrar-sesiones')
    
    alert('Sesiones cerradas correctamente')
  } catch (err) {
    console.error('Error cerrar sesiones:', err)
    alert('Error al cerrar las sesiones')
  } finally {
    loading.value = false
  }
}

async function eliminarCuenta() {
  if (!confirm('Escribe "ELIMINAR" para confirmar')) {
    mostrarModalEliminar.value = false
    return
  }
  
  try {
    // TODO: Llamar al backend
    // await api.delete('/paciente/cuenta')
    
    await authStore.logout()
    router.push('/')
  } catch (err) {
    console.error('Error eliminar cuenta:', err)
    alert('Error al eliminar la cuenta')
  }
}

function cargarConfiguracion() {
  const configGuardada = localStorage.getItem('paciente_config')
  if (configGuardada) {
    try {
      config.value = JSON.parse(configGuardada)
    } catch (e) {
      console.error('Error al cargar configuración:', e)
    }
  }
}

// Lifecycle
onMounted(() => {
  cargarConfiguracion()
})
</script>