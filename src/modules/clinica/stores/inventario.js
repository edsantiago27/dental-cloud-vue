// modules/clinica/stores/inventario.js
import { defineStore } from 'pinia'
import inventarioService from '../services/inventarioService'

export const useInventarioStore = defineStore('inventario', {
  state: () => ({
    productos: [],
    movimientos: [],
    stockBajoCount: 0,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0
    }
  }),

  getters: {
    filtrosActivos: (state) => !!state.error
  },

  actions: {
    async fetchProductos(params = {}) {
      this.loading = true
      try {
        const response = await inventarioService.getProductos(params)
        if (response.success) {
          this.productos = response.data.data
          this.pagination = {
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            total: response.data.total
          }
        }
      } catch (err) {
        this.error = 'Error al cargar inventario'
      } finally {
        this.loading = false
      }
    },

    async fetchStockBajo() {
        try {
            const response = await inventarioService.getStockBajo()
            if (response.success) {
                this.stockBajoCount = response.data.length
            }
        } catch (err) {
            console.error(err)
        }
    },

    async registrarMovimiento(data) {
        try {
            const response = await inventarioService.registrarMovimiento(data)
            if (response.success) {
                await this.fetchProductos()
                await this.fetchStockBajo()
                return { success: true }
            }
            return { success: false, message: response.message }
        } catch (err) {
            return { success: false }
        }
    },

    async crearProducto(data) {
        try {
            const response = await inventarioService.crearProducto(data)
            if (response.success) {
                await this.fetchProductos()
                return { success: true }
            }
            return { success: false, message: response.message }
        } catch (err) {
            return { success: false }
        }
    }
  }
})
