import { defineStore } from 'pinia'
import { ref } from 'vue'
import usuariosService from '../services/usuariosService'

export const useUsuariosStore = defineStore('clinica-usuarios', () => {
  // State
  const usuarios = ref([])
  const estadisticas = ref(null)
  const permisosDisponibles = ref({})
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15
  })

  // Actions
  async function fetchUsuarios(params = {}) {
    loading.value = true
    error.value = null
    
    // Limpiar parámetros vacíos para no filtrar incorrectamente
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    )

    try {
      const { data } = await usuariosService.getUsuarios(cleanParams)
      console.log('📦 Usuarios API Response:', data)

      if (data.success) {
        // Verificar estructura de respuesta (paginada o simple)
        if (data.data && Array.isArray(data.data.data)) {
           console.log('👉 Paginación detectada')
           usuarios.value = data.data.data
           pagination.value = {
            currentPage: data.data.current_page,
            lastPage: data.data.last_page,
            total: data.data.total,
            perPage: data.data.per_page
          }
        } else if (Array.isArray(data.data)) {
           console.log('👉 Array simple detectado')
           usuarios.value = data.data
           pagination.value.total = data.data.length
        } else {
           console.warn('⚠️ Estructura de datos desconocida:', data.data)
        }
      }
    } catch (err) {
      console.error('Error fetching usuarios:', err)
      error.value = err.response?.data?.message || 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }

  async function fetchEstadisticas() {
    try {
      const { data } = await usuariosService.getEstadisticas()
      if (data.success) {
        estadisticas.value = data.data
      }
    } catch (err) {
      console.error('Error fetching estadisticas:', err)
    }
  }

  async function fetchPermisos() {
    if (Object.keys(permisosDisponibles.value).length > 0) return
    try {
      const { data } = await usuariosService.getPermisos()
      if (data.success) {
        permisosDisponibles.value = data.data
      }
    } catch (err) {
      console.error('Error fetching permisos:', err)
    }
  }

  async function createUsuario(usuarioData) {
    loading.value = true
    error.value = null
    try {
      const { data } = await usuariosService.createUsuario(usuarioData)
      if (data.success) {
        await fetchUsuarios() // Recargar lista
        await fetchEstadisticas() // Actualizar stats
        return { success: true, message: data.message }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear usuario'
      return { 
        success: false, 
        message: error.value,
        errors: err.response?.data?.errors 
      }
    } finally {
      loading.value = false
    }
  }

  async function updateUsuario(id, usuarioData) {
    loading.value = true
    error.value = null
    try {
      const { data } = await usuariosService.updateUsuario(id, usuarioData)
      if (data.success) {
        await fetchUsuarios()
        return { success: true, message: data.message }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar usuario'
      return { 
        success: false, 
        message: error.value,
        errors: err.response?.data?.errors 
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteUsuario(id) {
    loading.value = true
    try {
      const { data } = await usuariosService.deleteUsuario(id)
      if (data.success) {
        // Eliminar localmente para feedback inmediato
        usuarios.value = usuarios.value.filter(u => u.id !== id)
        await fetchEstadisticas()
        return { success: true, message: data.message }
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error al eliminar usuario' }
    } finally {
      loading.value = false
    }
  }

  return {
    usuarios,
    estadisticas,
    permisosDisponibles,
    loading,
    error,
    pagination,
    fetchUsuarios,
    fetchEstadisticas,
    fetchPermisos,
    createUsuario,
    updateUsuario,
    deleteUsuario
  }
})
