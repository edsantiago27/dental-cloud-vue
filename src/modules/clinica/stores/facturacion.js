// stores/facturacion.js
import { defineStore } from 'pinia'
import facturacionService from '../services/facturacionService'

export const useFacturacionStore = defineStore('facturacion', {
  state: () => ({
    // Dashboard
    dashboard: {
      ingresos_mes: 0,
      cobrado_mes: 0,
      pendiente_mes: 0,
      total_cuentas: 0,
      cuentas_pendientes: 0,
      cuentas_vencidas: 0,
      pagos_hoy: 0,
      financiamientos_activos: 0,
      cuotas_vencidas: 0,
      exoneraciones: 0
    },

    // Cuentas
    cuentas: [],
    cuentaActual: null,
    totalCuentas: 0,
    cuentasPaginacion: {
      current_page: 1,
      per_page: 15,
      total: 0
    },

    // Pagos
    pagos: [],
    pagosHoy: [],
    totalPagos: 0,

    // Financiamientos
    financiamientos: [],
    financiamientoActual: null,

    // Estados
    loading: false,
    error: null
  }),

  getters: {
    // Dashboard
    resumenDashboard: (state) => state.dashboard,

    // Cuentas por estado
    cuentasPendientes: (state) => state.cuentas.filter(c => c.estado === 'pendiente'),
    cuentasPagadas: (state) => state.cuentas.filter(c => c.estado === 'pagado'),
    cuentasVencidas: (state) => {
      const hoy = new Date()
      return state.cuentas.filter(c => {
        if (c.estado !== 'pendiente') return false
        if (!c.fecha_vencimiento) return false
        return new Date(c.fecha_vencimiento) < hoy
      })
    },

    // Totales
    totalPendiente: (state) => {
      return state.cuentas
        .filter(c => c.estado === 'pendiente')
        .reduce((sum, c) => sum + parseFloat(c.saldo || 0), 0)
    },

    totalCobrado: (state) => {
      return state.pagos.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0)
    },

    // Financiamientos activos
    financiamientosActivos: (state) => {
      return state.financiamientos.filter(f => f.estado === 'activo')
    }
  },

  actions: {
    // ==========================================
    // DASHBOARD
    // ==========================================

    async fetchDashboard(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await facturacionService.getDashboard(params)

        if (response.success && response.data) {
          // El backend retorna: data.resumen con los totales
          const resumen = response.data.resumen || {}
          
          this.dashboard = {
            ingresos_mes: resumen.total_facturado || 0,
            cobrado_mes: resumen.total_cobrado || 0,
            pendiente_mes: resumen.total_pendiente || 0,
            total_cuentas: resumen.total_cuentas || 0,
            cuentas_pendientes: resumen.cuentas_pendientes || 0,
            cuentas_vencidas: resumen.cuentas_vencidas || 0,
            pagos_hoy: resumen.pagos_hoy || 0,
            financiamientos_activos: resumen.financiamientos_activos || 0,
            cuotas_vencidas: resumen.cuotas_vencidas || 0,
            exoneraciones: resumen.exoneraciones || 0
          }
          
          console.log('📊 Dashboard cargado:', this.dashboard)
        }

        return response
      } catch (error) {
        this.error = error.message
        console.error('Error al obtener dashboard:', error)
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    // ==========================================
    // CUENTAS
    // ==========================================

    async fetchCuentas(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await facturacionService.getCuentas(params)

        if (response.success) {
          this.cuentas = response.data.data || response.data
          this.totalCuentas = response.data.total || this.cuentas.length

          if (response.data.current_page) {
            this.cuentasPaginacion = {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total
            }
          }
        }

        return response
      } catch (error) {
        this.error = error.message
        console.error('Error al obtener cuentas:', error)
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    async fetchCuenta(id) {
      this.loading = true
      this.error = null

      try {
        const response = await facturacionService.getCuenta(id)

        if (response.success) {
          this.cuentaActual = response.data
        }

        return response
      } catch (error) {
        this.error = error.message
        console.error('Error al obtener cuenta:', error)
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    async crearCuenta(data) {
      try {
        const response = await facturacionService.crearCuenta(data)

        if (response.success) {
          this.cuentas.unshift(response.data)
          this.totalCuentas++
        }

        return response
      } catch (error) {
        console.group('❌ ERROR AL CREAR CUENTA (STORE)')
        console.error('Error completo:', error)
        console.error('Response:', error.response)
        console.error('Response data:', error.response?.data)
        console.error('Response errors:', error.response?.data?.errors)
        console.groupEnd()
        
        // Retornar estructura consistente con los errores del backend
        return { 
          success: false, 
          message: error.response?.data?.message || error.message,
          errors: error.response?.data?.errors || null
        }
      }
    },

    async actualizarCuenta(id, data) {
      try {
        const response = await facturacionService.actualizarCuenta(id, data)

        if (response.success) {
          const index = this.cuentas.findIndex(c => c.id === id)
          if (index !== -1) {
            this.cuentas[index] = response.data
          }
        }

        return response
      } catch (error) {
        console.error('Error al actualizar cuenta:', error)
        return { success: false, message: error.message }
      }
    },

    async anularCuenta(id, motivo) {
      try {
        const response = await facturacionService.anularCuenta(id, motivo)

        if (response.success) {
          const index = this.cuentas.findIndex(c => c.id === id)
          if (index !== -1) {
            this.cuentas[index].estado = 'anulado'
          }
        }

        return response
      } catch (error) {
        console.error('Error al anular cuenta:', error)
        return { success: false, message: error.message }
      }
    },

    async exonerarCuenta(id, motivo) {
      try {
        const response = await facturacionService.exonerarCuenta(id, motivo)

        if (response.success) {
          const index = this.cuentas.findIndex(c => c.id === id)
          if (index !== -1) {
            this.cuentas[index] = response.data
          }
        }

        return response
      } catch (error) {
        console.error('Error al exonerar cuenta:', error)
        return { success: false, message: error.message }
      }
    },

    // ==========================================
    // PAGOS
    // ==========================================

    async fetchPagos(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await facturacionService.getPagos(params)

        if (response.success) {
          this.pagos = response.data.data || response.data
          this.totalPagos = response.data.total || this.pagos.length
        }

        return response
      } catch (error) {
        this.error = error.message
        console.error('Error al obtener pagos:', error)
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    async fetchPagosHoy() {
      try {
        const response = await facturacionService.getPagosHoy()

        if (response.success) {
          // Asegurar que siempre sea un array
          if (Array.isArray(response.data)) {
            this.pagosHoy = response.data
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            this.pagosHoy = response.data.data
          } else {
            this.pagosHoy = []
          }
        }

        return response
      } catch (error) {
        console.error('Error al obtener pagos de hoy:', error)
        this.pagosHoy = []
        return { success: false, message: error.message }
      }
    },

    async registrarPago(data) {
      try {
        const response = await facturacionService.registrarPago(data)

        if (response.success) {
          // Asegurar que pagos y pagosHoy sean arrays
          if (!Array.isArray(this.pagos)) {
            this.pagos = []
          }
          if (!Array.isArray(this.pagosHoy)) {
            this.pagosHoy = []
          }

          this.pagos.unshift(response.data)
          this.pagosHoy.unshift(response.data)

          // Actualizar cuenta asociada
          const cuenta = this.cuentas.find(c => c.id === data.cuenta_id)
          if (cuenta) {
            const saldoAnterior = parseFloat(cuenta.saldo || cuenta.total || 0)
            const montoPago = parseFloat(data.monto || 0)
            
            cuenta.saldo = saldoAnterior - montoPago
            cuenta.monto_pagado = parseFloat(cuenta.monto_pagado || 0) + montoPago
            
            if (cuenta.saldo <= 0) {
              cuenta.estado = 'pagado'
              cuenta.saldo = 0
            } else if (cuenta.monto_pagado > 0) {
              cuenta.estado = 'parcial'
            }
          }
        }

        return response
      } catch (error) {
        console.error('Error al registrar pago:', error)
        return { success: false, message: error.message }
      }
    },

    async anularPago(id, motivo) {
      try {
        const response = await facturacionService.anularPago(id, motivo)

        if (response.success) {
          const index = this.pagos.findIndex(p => p.id === id)
          if (index !== -1) {
            this.pagos[index].estado = 'anulado'
          }
        }

        return response
      } catch (error) {
        console.error('Error al anular pago:', error)
        return { success: false, message: error.message }
      }
    },

    // ==========================================
    // FINANCIAMIENTOS
    // ==========================================

    async fetchFinanciamientos(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await facturacionService.getFinanciamientos(params)

        if (response.success) {
          this.financiamientos = response.data.data || response.data
        }

        return response
      } catch (error) {
        this.error = error.message
        console.error('Error al obtener financiamientos:', error)
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    async fetchFinanciamiento(id) {
      try {
        const response = await facturacionService.getFinanciamiento(id)

        if (response.success) {
          this.financiamientoActual = response.data
        }

        return response
      } catch (error) {
        console.error('Error al obtener financiamiento:', error)
        return { success: false, message: error.message }
      }
    },

    async crearFinanciamiento(data) {
      try {
        const response = await facturacionService.crearFinanciamiento(data)

        if (response.success) {
          this.financiamientos.unshift(response.data)
        }

        return response
      } catch (error) {
        console.error('Error al crear financiamiento:', error)
        return { success: false, message: error.message }
      }
    },

    async pagarCuota(financiamientoId, numeroCuota, data) {
      try {
        const response = await facturacionService.pagarCuota(
          financiamientoId,
          numeroCuota,
          data
        )

        if (response.success) {
          // Actualizar financiamiento local
          const financiamiento = this.financiamientos.find(
            f => f.id === financiamientoId
          )
          if (financiamiento && financiamiento.cuotas) {
            const cuota = financiamiento.cuotas.find(c => c.numero_cuota === numeroCuota)
            if (cuota) {
              cuota.estado = 'pagada'
              cuota.fecha_pago = new Date().toISOString()
            }
          }
        }

        return response
      } catch (error) {
        console.error('Error al pagar cuota:', error)
        return { success: false, message: error.message }
      }
    },

    // ==========================================
    // UTILIDADES
    // ==========================================

    clearError() {
      this.error = null
    },

    resetCuentaActual() {
      this.cuentaActual = null
    },

    resetFinanciamientoActual() {
      this.financiamientoActual = null
    }
  }
})