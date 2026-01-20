// modules/clinica/stores/presupuestos.js
import { defineStore } from 'pinia'
import presupuestosService from '../services/presupuestosService'

export const usePresupuestosStore = defineStore('presupuestos', {
  state: () => ({
    presupuestos: [],
    loading: false,
    error: null,
    total: 0,
    filtros: {
      paciente_id: null,
      estado: null,
      fecha_inicio: null,
      fecha_fin: null
    }
  }),

  getters: {
    presupuestosAprobados: (state) => state.presupuestos.filter(p => p.estado === 'aprobado'),
    presupuestosPendientes: (state) => state.presupuestos.filter(p => p.estado === 'pendiente'),
    
    estados: () => [
      { value: 'pendiente', label: 'Pendiente', color: '#f59e0b' },
      { value: 'aprobado', label: 'Aprobado', color: '#10b981' },
      { value: 'rechazado', label: 'Rechazado', color: '#ef4444' },
      { value: 'facturado', label: 'Facturado', color: '#6366f1' },
      { value: 'vencido', label: 'Vencido', color: '#6b7280' }
    ]
  },

  actions: {
    async fetchPresupuestos() {
      this.loading = true
      try {
        const response = await presupuestosService.getAll(this.filtros)
        if (response.success) {
          this.presupuestos = response.data
          this.total = response.total || response.data.length
        }
      } catch (err) {
        this.error = 'Error al cargar presupuestos'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async createPresupuesto(data) {
      this.loading = true
      try {
        const response = await presupuestosService.create(data)
        if (response.success) {
          await this.fetchPresupuestos()
          return { success: true, data: response.data }
        }
        return { success: false, message: response.message }
      } catch (err) {
        return { success: false, message: 'Error de servidor' }
      } finally {
        this.loading = false
      }
    },

    async updateEstado(id, nuevoEstado) {
      try {
        const response = await presupuestosService.update(id, { estado: nuevoEstado })
        if (response.success) {
          const idx = this.presupuestos.findIndex(p => p.id === id)
          if (idx !== -1) this.presupuestos[idx].estado = nuevoEstado
          return { success: true }
        }
        return { success: false }
      } catch (err) {
        return { success: false }
      }
    },

    async convertirACuenta(id) {
      try {
        const response = await presupuestosService.convertirAFactura(id)
        if (response.success) {
          await this.fetchPresupuestos()
          return { success: true }
        }
        return { success: false, message: response.message }
      } catch (err) {
        return { success: false }
      }
    },

    setFiltros(nuevosFiltros) {
      this.filtros = { ...this.filtros, ...nuevosFiltros }
      this.fetchPresupuestos()
    },

    clearFiltros() {
      this.filtros = { paciente_id: null, estado: null, fecha_inicio: null, fecha_fin: null }
      this.fetchPresupuestos()
    }
  }
})
