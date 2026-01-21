// modules/clinica/stores/laboratorio.js
import { defineStore } from 'pinia'
import laboratorioService from '../services/laboratorioService'

export const useLaboratorioStore = defineStore('laboratorio', {
  state: () => ({
    ordenes: [],
    laboratorios: [],
    loading: false,
    error: null,
    total: 0,
    filtros: {
      estado: '',
      laboratorio_id: null,
      paciente_id: null,
      buscar: ''
    }
  }),

  getters: {
    ordenesPendientes: (state) => state.ordenes.filter(o => o.estado === 'pendiente' || o.estado === 'en_proceso'),
    ordenesUrgentes: (state) => state.ordenes.filter(o => {
        if (!o.fecha_entrega_prevista) return false;
        const fecha = new Date(o.fecha_entrega_prevista);
        const hoy = new Date();
        const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 2;
    }),
    
    estados: () => [
      { value: 'pendiente', label: 'Pendiente', color: '#6b7280', icon: 'fas fa-clock' },
      { value: 'en_proceso', label: 'En Proceso', color: '#3b82f6', icon: 'fas fa-tools' },
      { value: 'enviado', label: 'Enviado a Lab', color: '#f59e0b', icon: 'fas fa-shipping-fast' },
      { value: 'recibido', label: 'Recibido en Clínica', color: '#10b981', icon: 'fas fa-box-open' },
      { value: 'completado', label: 'Finalizado/Entregado', color: '#6366f1', icon: 'fas fa-check-double' },
      { value: 'anulado', label: 'Anulado', color: '#ef4444', icon: 'fas fa-times-circle' }
    ]
  },

  actions: {
    async fetchOrdenes() {
      this.loading = true
      try {
        const response = await laboratorioService.getOrdenes(this.filtros)
        if (response.success) {
          // Si es paginado, los datos están en response.data.data
          const data = response.data.data || response.data
          this.ordenes = Array.isArray(data) ? data : []
          this.total = response.data.total || this.ordenes.length
          // Actualizar lista de laboratorios si viene en la respuesta
          if (response.laboratorios) this.laboratorios = response.laboratorios
        }
      } catch (err) {
        this.error = 'Error al cargar órdenes de laboratorio'
      } finally {
        this.loading = false
      }
    },

    async fetchLaboratorios() {
      try {
        const response = await laboratorioService.getLaboratorios()
        if (response.success) this.laboratorios = response.data
      } catch (err) {
        console.error(err)
      }
    },

    async createLaboratorio(data) {
      try {
        const response = await laboratorioService.createLaboratorio(data)
        if (response.success) {
          await this.fetchLaboratorios()
          return { success: true, data: response.data }
        }
        return { success: false, message: response.message }
      } catch (err) {
        return { success: false, message: 'Error al registrar laboratorio' }
      }
    },

    async updateLaboratorio(id, data) {
      try {
        const response = await laboratorioService.updateLaboratorio(id, data)
        if (response.success) {
          await this.fetchLaboratorios()
          return { success: true }
        }
        return { success: false }
      } catch (err) {
        return { success: false }
      }
    },

    async deleteLaboratorio(id) {
      try {
        const response = await laboratorioService.deleteLaboratorio(id)
        if (response.success) {
          await this.fetchLaboratorios()
          return { success: true }
        }
        return { success: false }
      } catch (err) {
        return { success: false }
      }
    },

    async createOrden(data) {
      this.loading = true
      try {
        const response = await laboratorioService.createOrden(data)
        if (response.success) {
          await this.fetchOrdenes()
          return { success: true }
        }
        return { success: false, message: response.message }
      } finally {
        this.loading = false
      }
    },

    async updateEstadoOrden(id, estado, fechaEntrega = null) {
      try {
        const response = await laboratorioService.updateEstado(id, estado, fechaEntrega)
        if (response.success) {
          await this.fetchOrdenes()
          return { success: true }
        }
        return { success: false }
      } catch (err) {
        return { success: false }
      }
    },

    setFiltros(filtros) {
        this.filtros = { ...this.filtros, ...filtros }
        this.fetchOrdenes()
    }
  }
})
