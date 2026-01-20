// modules/clinica/stores/caja.js
import { defineStore } from 'pinia'
import cajaService from '../services/cajaService'

export const useCajaStore = defineStore('caja', {
  state: () => ({
    cajaActual: null,
    historial: [],
    loading: false,
    error: null,
    totalHistorial: 0
  }),

  getters: {
    isAbierta: (state) => !!state.cajaActual && state.cajaActual.estado === 'abierta',
    
    ingresosTotales: (state) => {
        if (!state.cajaActual || !state.cajaActual.movimientos) return 0
        return state.cajaActual.movimientos
            .filter(m => m.tipo === 'ingreso')
            .reduce((sum, m) => sum + parseFloat(m.monto), 0)
    },

    egresosTotales: (state) => {
        if (!state.cajaActual || !state.cajaActual.movimientos) return 0
        return state.cajaActual.movimientos
            .filter(m => m.tipo === 'egreso')
            .reduce((sum, m) => sum + parseFloat(m.monto), 0)
    }
  },

  actions: {
    async fetchCajaActual() {
      this.loading = true
      try {
        const response = await cajaService.getCajaActual()
        if (response.success) {
          this.cajaActual = response.data
        }
      } catch (err) {
        this.error = 'Error al cargar estado de caja'
      } finally {
        this.loading = false
      }
    },

    async abrir(monto) {
      this.loading = true
      try {
        const response = await cajaService.abrirCaja(monto)
        if (response.success) {
          this.cajaActual = response.data
          return { success: true }
        }
        return { success: false, message: response.message }
      } finally {
        this.loading = false
      }
    },

    async cerrar(data) {
      this.loading = true
      try {
        const response = await cajaService.cerrarCaja(data)
        if (response.success) {
          this.cajaActual = null
          return { success: true }
        }
        return { success: false, message: response.message }
      } finally {
        this.loading = false
      }
    },

    async registrarMovimiento(data) {
      try {
        const response = await cajaService.registrarMovimiento(data)
        if (response.success) {
          await this.fetchCajaActual() // Refresh data
          return { success: true }
        }
        return { success: false, message: response.message }
      } catch (err) {
        return { success: false }
      }
    },

    async fetchHistorial(page = 1) {
        this.loading = true
        try {
            const response = await cajaService.getHistorial({ page })
            if (response.success) {
                this.historial = response.data.data
                this.totalHistorial = response.data.total
            }
        } finally {
            this.loading = false
        }
    }
  }
})
