// src/stores/superadmin/configuracion.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { configuracionService } from '../services'

export const useSuperAdminConfiguracionStore = defineStore('superadminConfiguracion', () => {
  // State
  const config = ref({
    general: {
      nombre_sistema: 'DentalCloud',
      email_soporte: 'soporte@dentalcloud.cl',
      telefono_soporte: '+56 9 1234 5678',
      logo_url: '',
      favicon_url: ''
    },
    email: {
      smtp_host: '',
      smtp_port: 587,
      smtp_user: '',
      smtp_password: '',
      smtp_encryption: 'tls',
      from_email: '',
      from_name: ''
    },
    facturacion: {
      dias_vencimiento: 15,
      enviar_recordatorios: true,
      dias_antes_recordatorio: 3,
      generar_automatico: true,
      dia_generacion: 1
    },
    notificaciones: {
      email_nuevas_clinicas: true,
      email_pagos_recibidos: true,
      email_facturas_vencidas: true,
      webhook_url: ''
    },
    seguridad: {
      require_2fa: false,
      session_timeout: 120,
      max_login_attempts: 5,
      password_min_length: 8
    }
  })

  const loading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchConfiguracion() {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.getConfiguracion()
      
      if (response.success && response.data) {
        config.value = { ...config.value, ...response.data }
      }

      return { success: true }
    } catch (err) {
      console.error('Error fetching configuracion:', err)
      error.value = err.response?.data?.message || 'Error al cargar configuración'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function actualizarConfiguracion(seccion, data) {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.actualizarConfiguracion(seccion, data)
      
      if (response.success) {
        // Actualizar config local
        if (config.value[seccion]) {
          config.value[seccion] = { ...config.value[seccion], ...data }
        }
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error updating configuracion:', err)
      error.value = err.response?.data?.message || 'Error al actualizar configuración'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function testEmailConfig() {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.testEmail()
      
      if (response.success) {
        return { success: true, message: 'Email de prueba enviado correctamente' }
      }

      return { success: false, message: response.message || 'Error al enviar email de prueba' }
    } catch (err) {
      console.error('Error testing email:', err)
      error.value = err.response?.data?.message || 'Error al enviar email de prueba'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    config,
    loading,
    error,

    // Actions
    fetchConfiguracion,
    actualizarConfiguracion,
    testEmailConfig,
    clearError
  }
})