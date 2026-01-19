import api from './api'

export default {
  /**
   * Obtener lista de usuarios
   * @param {Object} params - Filtros y paginación
   */
  getUsuarios(params = {}) {
    return api.get('/usuarios', { params })
  },

  /**
   * Obtener un usuario por ID
   * @param {Number} id 
   */
  getUsuario(id) {
    return api.get(`/usuarios/${id}`)
  },

  /**
   * Crear un nuevo usuario
   * @param {Object} data 
   */
  createUsuario(data) {
    return api.post('/usuarios', data)
  },

  /**
   * Actualizar usuario existente
   * @param {Number} id 
   * @param {Object} data 
   */
  updateUsuario(id, data) {
    return api.put(`/usuarios/${id}`, data)
  },

  /**
   * Eliminar usuario
   * @param {Number} id 
   */
  deleteUsuario(id) {
    return api.delete(`/usuarios/${id}`)
  },

  /**
   * Obtener estadísticas de usuarios
   */
  getEstadisticas() {
    return api.get('/usuarios/estadisticas')
  },

  /**
   * Obtener permisos disponibles
   */
  getPermisos() {
    return api.get('/usuarios/permisos')
  },

  /**
   * Cambiar contraseña de usuario
   */
  cambiarPassword(id, data) {
    return api.post(`/usuarios/${id}/cambiar-password`, data)
  }
}
