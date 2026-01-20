import api from '@/modules/clinica/services/api'

export default {
  /**
   * Obtener URL de autorización de Google
   * @param {string} redirectUri - La URL a la que Google redirigirá (frontend)
   */
  async getAuthUrl(redirectUri) {
    try {
      const response = await api.get('/google/auth-url', {
        params: { redirect_uri: redirectUri }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching auth url:', error)
      throw error
    }
  },

  /**
   * Procesar el callback de Google (intercambiar código por token)
   * @param {string} code - El código devuelto por Google
   * @param {string} redirectUri - La misma URI usada en getAuthUrl
   */
  async handleCallback(code, redirectUri) {
    try {
      const response = await api.post('/google/callback', {
        code,
        redirect_uri: redirectUri
      })
      return response.data
    } catch (error) {
      console.error('Error handling callback:', error)
      throw error
    }
  },

  /**
   * Desconectar cuenta de Google
   */
  async disconnect() {
    try {
      const response = await api.post('/google/disconnect')
      return response.data
    } catch (error) {
      console.error('Error disconnecting:', error)
      throw error
    }
  },

  /**
   * Obtener estado de la conexión
   */
  async getStatus() {
    try {
      const response = await api.get('/google/status')
      return response.data
    } catch (error) {
      console.error('Error fetching status:', error)
      throw error
    }
  }
}
