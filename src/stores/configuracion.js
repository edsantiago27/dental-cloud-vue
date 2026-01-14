// src/stores/configuracion.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import configuracionService from '@/services/configuracionService'

export const useConfiguracionStore = defineStore('configuracion', () => {
  // State
  const configuracion = ref({
    // Datos Generales
    nombre: '',
    direccion: '',
    ciudad: '',
    region: '',
    telefono: '',
    email: '',
    sitio_web: '',
    
    // Datos Fiscales
    rut: '',
    razon_social: '',
    
    // Branding
    logo: null,
    color_primario: '#3B82F6',
    color_secundario: '#10B981',
    
    // Horarios
    horario_atencion_inicio: '09:00',
    horario_atencion_fin: '18:00',
    
    // Preferencias
    duracion_cita_default: 30,
    recordatorios_activos: true,
    recordatorio_horas: 24,
    whatsapp_activo: false,
    whatsapp_numero: ''
  })

  const loading = ref(false)
  const error = ref(null)

  // Regiones de Chile
  const REGIONES = [
    'Región de Arica y Parinacota',
    'Región de Tarapacá',
    'Región de Antofagasta',
    'Región de Atacama',
    'Región de Coquimbo',
    'Región de Valparaíso',
    'Región Metropolitana',
    'Región del Libertador Gral. Bernardo O\'Higgins',
    'Región del Maule',
    'Región de Ñuble',
    'Región del Biobío',
    'Región de La Araucanía',
    'Región de Los Ríos',
    'Región de Los Lagos',
    'Región de Aysén del Gral. Carlos Ibáñez del Campo',
    'Región de Magallanes y de la Antártica Chilena'
  ]

  // Getters
  const hasLogo = computed(() => !!configuracion.value.logo)
  
  const logoUrl = computed(() => {
    if (!configuracion.value.logo) return null
    // Si es una URL completa, retornarla tal cual
    if (configuracion.value.logo.startsWith('http')) {
      return configuracion.value.logo
    }
    // Si es una ruta relativa, construir URL completa
    return `${import.meta.env.VITE_API_URL}/storage/${configuracion.value.logo}`
  })

  const horarioFormateado = computed(() => {
    const inicio = configuracion.value.horario_atencion_inicio || '09:00'
    const fin = configuracion.value.horario_atencion_fin || '18:00'
    return `${inicio} - ${fin}`
  })

  // Actions

  /**
   * Cargar configuración de la clínica
   */
  async function fetchConfiguracion() {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.getConfiguracion()
      
      console.log('⚙️ Configuración obtenida:', response)

      if (response.success && response.data) {
        // Actualizar configuración
        configuracion.value = {
          ...configuracion.value,
          ...response.data,
          // Convertir valores booleanos si vienen como 0/1
          recordatorios_activos: response.data.recordatorios_activos === 1 || response.data.recordatorios_activos === true,
          whatsapp_activo: response.data.whatsapp_activo === 1 || response.data.whatsapp_activo === true
        }
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Error al obtener configuración:', err)
      error.value = err.response?.data?.message || 'Error al cargar configuración'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar datos generales
   */
  async function updateGeneral(data) {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.updateGeneral(data)
      
      console.log('✅ Datos generales actualizados:', response)

      if (response.success && response.data) {
        // Actualizar solo los campos generales
        configuracion.value = {
          ...configuracion.value,
          nombre: response.data.nombre,
          direccion: response.data.direccion,
          ciudad: response.data.ciudad,
          region: response.data.region,
          telefono: response.data.telefono,
          email: response.data.email,
          sitio_web: response.data.sitio_web
        }
        
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al actualizar datos generales:', err)
      error.value = err.response?.data?.message || 'Error al actualizar datos generales'
      return { 
        success: false, 
        message: error.value,
        errors: err.response?.data?.errors 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar logo
   */
  async function updateLogo(file) {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await configuracionService.updateLogo(formData)
      
      console.log('✅ Logo actualizado:', response)

      if (response.success && response.data) {
        configuracion.value.logo = response.data.logo
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al actualizar logo:', err)
      error.value = err.response?.data?.message || 'Error al actualizar logo'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar branding
   */
  async function updateBranding(data) {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.updateBranding(data)
      
      console.log('✅ Branding actualizado:', response)

      if (response.success && response.data) {
        configuracion.value.color_primario = response.data.color_primario
        configuracion.value.color_secundario = response.data.color_secundario
        
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al actualizar branding:', err)
      error.value = err.response?.data?.message || 'Error al actualizar branding'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar horarios
   */
  async function updateHorarios(data) {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.updateHorarios(data)
      
      console.log('✅ Horarios actualizados:', response)

      if (response.success && response.data) {
        configuracion.value.horario_atencion_inicio = response.data.horario_atencion_inicio
        configuracion.value.horario_atencion_fin = response.data.horario_atencion_fin
        
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al actualizar horarios:', err)
      error.value = err.response?.data?.message || 'Error al actualizar horarios'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar preferencias
   */
  async function updatePreferencias(data) {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.updatePreferencias(data)
      
      console.log('✅ Preferencias actualizadas:', response)

      if (response.success && response.data) {
        configuracion.value.duracion_cita_default = response.data.duracion_cita_default
        configuracion.value.recordatorios_activos = response.data.recordatorios_activos === 1 || response.data.recordatorios_activos === true
        configuracion.value.recordatorio_horas = response.data.recordatorio_horas
        configuracion.value.whatsapp_activo = response.data.whatsapp_activo === 1 || response.data.whatsapp_activo === true
        configuracion.value.whatsapp_numero = response.data.whatsapp_numero
        
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al actualizar preferencias:', err)
      error.value = err.response?.data?.message || 'Error al actualizar preferencias'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar datos fiscales
   */
  async function updateFiscales(data) {
    loading.value = true
    error.value = null

    try {
      const response = await configuracionService.updateFiscales(data)
      
      console.log('✅ Datos fiscales actualizados:', response)

      if (response.success && response.data) {
        configuracion.value.rut = response.data.rut
        configuracion.value.razon_social = response.data.razon_social
        
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al actualizar datos fiscales:', err)
      error.value = err.response?.data?.message || 'Error al actualizar datos fiscales'
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
    configuracion,
    loading,
    error,
    REGIONES,
    
    // Getters
    hasLogo,
    logoUrl,
    horarioFormateado,
    
    // Actions
    fetchConfiguracion,
    updateGeneral,
    updateLogo,
    updateBranding,
    updateHorarios,
    updatePreferencias,
    updateFiscales,
    clearError
  }
})