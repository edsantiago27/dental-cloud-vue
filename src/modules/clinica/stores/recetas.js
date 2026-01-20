// modules/clinica/stores/recetas.js
import { defineStore } from 'pinia'
import recetasService from '../services/recetasService'

export const useRecetasStore = defineStore('recetas', {
  state: () => ({
    recetas: [],
    medicamentosComunes: [],
    loading: false,
    error: null,
    total: 0,
    filtros: {
      paciente_id: null,
      profesional_id: null,
      estado: null,
      fecha_desde: null,
      fecha_hasta: null,
      buscar: ''
    }
  }),

  getters: {
    recetasActivas: (state) => state.recetas.filter(r => r.estado === 'activa'),
    recetasAnuladas: (state) => state.recetas.filter(r => r.estado === 'anulada'),
    
    estados: () => [
      { value: 'activa', label: 'Activa', color: '#10b981' },
      { value: 'anulada', label: 'Anulada', color: '#ef4444' }
    ]
  },

  actions: {
    async fetchRecetas() {
      this.loading = true
      try {
        const response = await recetasService.getAll(this.filtros)
        if (response.success) {
          // Laravel pagination structure
          this.recetas = response.data.data || response.data
          this.total = response.data.total || this.recetas.length
        }
      } catch (err) {
        this.error = 'Error al cargar recetas'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchMedicamentosComunes() {
      try {
        const response = await recetasService.getMedicamentosComunes()
        if (response.success) {
          this.medicamentosComunes = response.data
        }
      } catch (err) {
        console.error('Error fetching common drugs:', err)
      }
    },

    async createReceta(data) {
      this.loading = true
      try {
        const response = await recetasService.create(data)
        if (response.success) {
          await this.fetchRecetas()
          return { success: true, data: response.data }
        }
        return { success: false, message: response.message, errors: response.errors }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Error de servidor' }
      } finally {
        this.loading = false
      }
    },

    async anularReceta(id, motivo) {
      try {
        const response = await recetasService.anular(id, motivo)
        if (response.success) {
          await this.fetchRecetas()
          return { success: true }
        }
        return { success: false, message: response.message }
      } catch (err) {
        return { success: false, message: 'Error al anular receta' }
      }
    },

    setFiltros(nuevosFiltros) {
      this.filtros = { ...this.filtros, ...nuevosFiltros }
      this.fetchRecetas()
    },

    clearFiltros() {
      this.filtros = {
        paciente_id: null,
        profesional_id: null,
        estado: null,
        fecha_desde: null,
        fecha_hasta: null,
        buscar: ''
      }
      this.fetchRecetas()
    }
  }
})
