import { defineStore } from 'pinia'
import api from '@clinica/services/api'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notificaciones: [],
    unreadCount: 0,
    loading: false,
    pollingInterval: null
  }),

  actions: {
    async fetchNotificaciones() {
      this.loading = true
      try {
        const response = await api.get('/usuarios/me/notificaciones')
        if (response.data.success) {
          this.notificaciones = response.data.data
          this.unreadCount = response.data.unread_count
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        this.loading = false
      }
    },

    async marcarComoLeida(id) {
      try {
        const response = await api.post(`/usuarios/me/notificaciones/${id}/leer`)
        if (response.data.success) {
          // Actualizar estado localmente para rapidez
          const noti = this.notificaciones.find(n => n.id === id)
          if (noti && !noti.read_at) {
            noti.read_at = new Date().toISOString()
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
        }
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    },

    startPolling() {
      if (this.pollingInterval) return
      
      // Fetch inicial
      this.fetchNotificaciones()
      
      // Polling cada 5 minutos (300000 ms)
      this.pollingInterval = setInterval(() => {
        this.fetchNotificaciones()
      }, 300000)
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    }
  }
})
