<!-- components/configuracion/HorariosPreferenciasTab.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Horarios de Atención -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">
        <i class="fas fa-clock text-blue-600 mr-2"></i>
        Horarios de Atención General
      </h3>

      <form @submit.prevent="handleSubmitHorarios">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Hora Inicio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hora de Inicio
            </label>
            <input
              v-model="formHorarios.horario_atencion_inicio"
              type="time"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <!-- Hora Fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hora de Cierre
            </label>
            <input
              v-model="formHorarios.horario_atencion_fin"
              type="time"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

        </div>

        <p class="text-sm text-gray-500 mt-4">
          <i class="fas fa-info-circle mr-1"></i>
          Estos horarios se aplicarán por defecto en la agenda de la clínica.
          Puedes configurar horarios específicos por profesional en el módulo de Profesionales.
        </p>

        <!-- Botones -->
        <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="loadingHorarios"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <i v-if="loadingHorarios" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ loadingHorarios ? 'Guardando...' : 'Guardar Horarios' }}
          </button>
        </div>

      </form>
    </div>

    <!-- Preferencias del Sistema -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">
        <i class="fas fa-cog text-blue-600 mr-2"></i>
        Preferencias del Sistema
      </h3>

      <form @submit.prevent="handleSubmitPreferencias">
        
        <div class="space-y-6">
          
          <!-- Duración de Cita por Defecto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Duración de Cita por Defecto (minutos)
            </label>
            <input
              v-model.number="formPreferencias.duracion_cita_default"
              type="number"
              min="10"
              max="240"
              step="5"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <p class="text-xs text-gray-500 mt-1">
              Esta duración se aplicará al crear nuevas citas
            </p>
          </div>

          <!-- Recordatorios -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Recordatorios Automáticos</h4>
                <p class="text-xs text-gray-500">Enviar recordatorios de citas por email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="formPreferencias.recordatorios_activos"
                  type="checkbox"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div v-if="formPreferencias.recordatorios_activos" class="ml-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Enviar recordatorio con anticipación de:
              </label>
              <select
                v-model.number="formPreferencias.recordatorio_horas"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="2">2 horas antes</option>
                <option :value="4">4 horas antes</option>
                <option :value="12">12 horas antes</option>
                <option :value="24">24 horas antes (1 día)</option>
                <option :value="48">48 horas antes (2 días)</option>
                <option :value="72">72 horas antes (3 días)</option>
              </select>
            </div>
          </div>

          <!-- WhatsApp -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Notificaciones por WhatsApp</h4>
                <p class="text-xs text-gray-500">Enviar confirmaciones y recordatorios vía WhatsApp</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="formPreferencias.whatsapp_activo"
                  type="checkbox"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div v-if="formPreferencias.whatsapp_activo" class="ml-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Número de WhatsApp
              </label>
              <input
                v-model="formPreferencias.whatsapp_numero"
                type="tel"
                placeholder="+56 9 1234 5678"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 mt-1">
                Incluir código de país. Ej: +56 9 1234 5678
              </p>
            </div>
          </div>

        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="loadingPreferencias"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <i v-if="loadingPreferencias" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ loadingPreferencias ? 'Guardando...' : 'Guardar Preferencias' }}
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfiguracionStore } from '@clinica/stores/configuracion'
import { useNotification } from '@shared/composables/useNotification'

const configuracionStore = useConfiguracionStore()
const notify = useNotification()

const loadingHorarios = ref(false)
const loadingPreferencias = ref(false)

const formHorarios = ref({
  horario_atencion_inicio: '09:00',
  horario_atencion_fin: '18:00'
})

const formPreferencias = ref({
  duracion_cita_default: 30,
  recordatorios_activos: true,
  recordatorio_horas: 24,
  whatsapp_activo: false,
  whatsapp_numero: ''
})

// Cargar datos actuales
watch(() => configuracionStore.configuracion, (config) => {
  formHorarios.value = {
    horario_atencion_inicio: config.horario_atencion_inicio || '09:00',
    horario_atencion_fin: config.horario_atencion_fin || '18:00'
  }

  formPreferencias.value = {
    duracion_cita_default: config.duracion_cita_default || 30,
    recordatorios_activos: config.recordatorios_activos || false,
    recordatorio_horas: config.recordatorio_horas || 24,
    whatsapp_activo: config.whatsapp_activo || false,
    whatsapp_numero: config.whatsapp_numero || ''
  }
}, { immediate: true })

async function handleSubmitHorarios() {
  loadingHorarios.value = true

  try {
    const result = await configuracionStore.updateHorarios(formHorarios.value)
    
    if (result.success) {
      notify.success('Horarios actualizados correctamente', 'Guardado')
    } else {
      notify.error(result.message || 'Error al actualizar horarios')
    }
  } catch (error) {
    console.error('Error:', error)
    notify.error('Error inesperado al guardar')
  } finally {
    loadingHorarios.value = false
  }
}

async function handleSubmitPreferencias() {
  loadingPreferencias.value = true

  try {
    const result = await configuracionStore.updatePreferencias(formPreferencias.value)
    
    if (result.success) {
      notify.success('Preferencias actualizadas correctamente', 'Guardado')
    } else {
      notify.error(result.message || 'Error al actualizar preferencias')
    }
  } catch (error) {
    console.error('Error:', error)
    notify.error('Error inesperado al guardar')
  } finally {
    loadingPreferencias.value = false
  }
}
</script>