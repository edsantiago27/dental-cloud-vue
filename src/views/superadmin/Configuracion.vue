<!-- views/superadmin/Configuracion.vue -->
<template>
  <div class="space-y-6">

    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
      <p class="text-sm text-gray-500 mt-1">Ajustes generales y configuraciones avanzadas</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="tabActual = tab.id"
          class="py-4 px-1 border-b-2 font-medium text-sm transition"
          :class="tabActual === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          "
        >
          <i :class="tab.icon" class="mr-2"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Contenido Tabs -->
    <div class="bg-white rounded-lg shadow">
      
      <!-- Tab: General -->
      <div v-show="tabActual === 'general'" class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
        
        <form @submit.prevent="guardarGeneral" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Sistema
              </label>
              <input
                v-model="formGeneral.nombre_sistema"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email de Soporte
              </label>
              <input
                v-model="formGeneral.email_soporte"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Teléfono de Soporte
              </label>
              <input
                v-model="formGeneral.telefono_soporte"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button
              type="submit"
              class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <i class="fas fa-save mr-2"></i>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Email -->
      <div v-show="tabActual === 'email'" class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuración de Email (SMTP)</h3>
        
        <form @submit.prevent="guardarEmail" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                SMTP Host
              </label>
              <input
                v-model="formEmail.smtp_host"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="smtp.gmail.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                v-model.number="formEmail.smtp_port"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="587"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                SMTP User
              </label>
              <input
                v-model="formEmail.smtp_user"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                SMTP Password
              </label>
              <input
                v-model="formEmail.smtp_password"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                From Email
              </label>
              <input
                v-model="formEmail.from_email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                From Name
              </label>
              <input
                v-model="formEmail.from_name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="probarEmail"
              class="px-6 py-2 text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition"
            >
              <i class="fas fa-envelope mr-2"></i>
              Enviar Email de Prueba
            </button>
            <button
              type="submit"
              class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <i class="fas fa-save mr-2"></i>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Facturación -->
      <div v-show="tabActual === 'facturacion'" class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuración de Facturación</h3>
        
        <form @submit.prevent="guardarFacturacion" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Días de Vencimiento
              </label>
              <input
                v-model.number="formFacturacion.dias_vencimiento"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 mt-1">Días desde emisión hasta vencimiento</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Días Antes de Recordatorio
              </label>
              <input
                v-model.number="formFacturacion.dias_antes_recordatorio"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 mt-1">Días antes del vencimiento para enviar recordatorio</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Día de Generación Automática
              </label>
              <input
                v-model.number="formFacturacion.dia_generacion"
                type="number"
                min="1"
                max="28"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <p class="text-xs text-gray-500 mt-1">Día del mes para generar facturas automáticamente</p>
            </div>
          </div>

          <div class="space-y-3 pt-4">
            <label class="flex items-center gap-3">
              <input
                v-model="formFacturacion.enviar_recordatorios"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <span class="text-sm text-gray-700">Enviar recordatorios de pago automáticamente</span>
            </label>

            <label class="flex items-center gap-3">
              <input
                v-model="formFacturacion.generar_automatico"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <span class="text-sm text-gray-700">Generar facturas automáticamente cada mes</span>
            </label>
          </div>

          <div class="flex justify-end pt-4">
            <button
              type="submit"
              class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <i class="fas fa-save mr-2"></i>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Notificaciones -->
      <div v-show="tabActual === 'notificaciones'" class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h3>
        
        <form @submit.prevent="guardarNotificaciones" class="space-y-4">
          <div class="space-y-3">
            <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                v-model="formNotificaciones.email_nuevas_clinicas"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <div>
                <p class="text-sm font-medium text-gray-900">Nuevas Clínicas Registradas</p>
                <p class="text-xs text-gray-500">Recibir email cuando una nueva clínica se registra</p>
              </div>
            </label>

            <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                v-model="formNotificaciones.email_pagos_recibidos"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <div>
                <p class="text-sm font-medium text-gray-900">Pagos Recibidos</p>
                <p class="text-xs text-gray-500">Recibir email cuando se registra un pago</p>
              </div>
            </label>

            <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                v-model="formNotificaciones.email_facturas_vencidas"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              >
              <div>
                <p class="text-sm font-medium text-gray-900">Facturas Vencidas</p>
                <p class="text-xs text-gray-500">Recibir email diario con facturas vencidas</p>
              </div>
            </label>
          </div>

          <div class="pt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL (opcional)
            </label>
            <input
              v-model="formNotificaciones.webhook_url"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://tu-servidor.com/webhook"
            >
            <p class="text-xs text-gray-500 mt-1">URL para recibir notificaciones por webhook</p>
          </div>

          <div class="flex justify-end pt-4">
            <button
              type="submit"
              class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <i class="fas fa-save mr-2"></i>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdminConfiguracionStore } from '@/stores/superadmin/configuracion'

const configuracionStore = useSuperAdminConfiguracionStore()

const tabActual = ref('general')

const tabs = [
  { id: 'general', label: 'General', icon: 'fas fa-cog' },
  { id: 'email', label: 'Email (SMTP)', icon: 'fas fa-envelope' },
  { id: 'facturacion', label: 'Facturación', icon: 'fas fa-file-invoice' },
  { id: 'notificaciones', label: 'Notificaciones', icon: 'fas fa-bell' }
]

// Forms
const formGeneral = ref({})
const formEmail = ref({})
const formFacturacion = ref({})
const formNotificaciones = ref({})

// Computed
const config = computed(() => configuracionStore.config)

// Methods
async function guardarGeneral() {
  const result = await configuracionStore.actualizarConfiguracion('general', formGeneral.value)
  if (result.success) {
    alert('Configuración general guardada exitosamente')
  } else {
    alert(result.message || 'Error al guardar configuración')
  }
}

async function guardarEmail() {
  const result = await configuracionStore.actualizarConfiguracion('email', formEmail.value)
  if (result.success) {
    alert('Configuración de email guardada exitosamente')
  } else {
    alert(result.message || 'Error al guardar configuración')
  }
}

async function guardarFacturacion() {
  const result = await configuracionStore.actualizarConfiguracion('facturacion', formFacturacion.value)
  if (result.success) {
    alert('Configuración de facturación guardada exitosamente')
  } else {
    alert(result.message || 'Error al guardar configuración')
  }
}

async function guardarNotificaciones() {
  const result = await configuracionStore.actualizarConfiguracion('notificaciones', formNotificaciones.value)
  if (result.success) {
    alert('Configuración de notificaciones guardada exitosamente')
  } else {
    alert(result.message || 'Error al guardar configuración')
  }
}

async function probarEmail() {
  const result = await configuracionStore.testEmailConfig()
  if (result.success) {
    alert('Email de prueba enviado correctamente. Revisa tu bandeja de entrada.')
  } else {
    alert(result.message || 'Error al enviar email de prueba')
  }
}

// Lifecycle
onMounted(async () => {
  await configuracionStore.fetchConfiguracion()
  
  // Cargar datos en forms
  formGeneral.value = { ...config.value.general }
  formEmail.value = { ...config.value.email }
  formFacturacion.value = { ...config.value.facturacion }
  formNotificaciones.value = { ...config.value.notificaciones }
})
</script>