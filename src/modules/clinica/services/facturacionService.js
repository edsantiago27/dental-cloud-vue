// services/facturacionService.js
import api from './api'

export default {
  // ==========================================
  // DASHBOARD
  // ==========================================

  /**
   * Obtener dashboard de facturación
   */
  async getDashboard(params = {}) {
    const response = await api.get('/facturacion/dashboard', { params })
    return response.data
  },

  // ==========================================
  // CUENTAS
  // ==========================================

  /**
   * Obtener lista de cuentas
   */
  async getCuentas(params = {}) {
    const response = await api.get('/facturacion/cuentas', { params })
    return response.data
  },

  /**
   * Obtener cuenta específica con detalles
   */
  async getCuenta(id) {
    const response = await api.get(`/facturacion/cuentas/${id}`)
    return response.data
  },

  /**
   * Crear nueva cuenta
   */
  async crearCuenta(data) {
    const response = await api.post('/facturacion/cuentas', data)
    return response.data
  },

  /**
   * Actualizar cuenta
   */
  async actualizarCuenta(id, data) {
    const response = await api.put(`/facturacion/cuentas/${id}`, data)
    return response.data
  },

  /**
   * Anular cuenta
   */
  async anularCuenta(id, motivo) {
    const response = await api.delete(`/facturacion/cuentas/${id}`, {
      data: { motivo }
    })
    return response.data
  },

  /**
   * Exonerar cuenta (descuento total)
   */
  async exonerarCuenta(id, motivo) {
    const response = await api.post(`/facturacion/cuentas/${id}/exonerar`, { motivo })
    return response.data
  },

  /**
   * Quitar exoneración
   */
  async quitarExoneracion(id) {
    const response = await api.post(`/facturacion/cuentas/${id}/quitar-exoneracion`)
    return response.data
  },

  /**
   * Obtener cuenta de un paciente específico
   */
  async getCuentaPaciente(pacienteId) {
    const response = await api.get(`/pacientes/${pacienteId}/cuenta`)
    return response.data
  },

  // ==========================================
  // PAGOS
  // ==========================================

  /**
   * Obtener lista de pagos
   */
  async getPagos(params = {}) {
    const response = await api.get('/facturacion/pagos', { params })
    return response.data
  },

  /**
   * Obtener pagos de hoy
   */
  async getPagosHoy() {
    const response = await api.get('/facturacion/pagos/hoy')
    return response.data
  },

  /**
   * Registrar pago
   */
  async registrarPago(data) {
    const response = await api.post('/facturacion/pagos', data)
    return response.data
  },

  /**
   * Anular pago
   */
  async anularPago(id, motivo) {
    const response = await api.post(`/facturacion/pagos/${id}/anular`, { motivo })
    return response.data
  },

  // ==========================================
  // FINANCIAMIENTOS
  // ==========================================

  /**
   * Obtener lista de financiamientos
   */
  async getFinanciamientos(params = {}) {
    const response = await api.get('/facturacion/financiamientos', { params })
    return response.data
  },

  /**
   * Obtener financiamiento específico
   */
  async getFinanciamiento(id) {
    const response = await api.get(`/facturacion/financiamientos/${id}`)
    return response.data
  },

  /**
   * Crear financiamiento
   */
  async crearFinanciamiento(data) {
    const response = await api.post('/facturacion/financiamientos', data)
    return response.data
  },

  /**
   * Pagar cuota de financiamiento
   */
  async pagarCuota(financiamientoId, cuotaId, data) {
    const response = await api.post(
      `/facturacion/financiamientos/${financiamientoId}/cuotas/${cuotaId}/pagar`,
      data
    )
    return response.data
  },

  // ==========================================
  // INTEGRACIÓN CON CITAS
  // ==========================================

  /**
   * Generar cargo desde cita
   */
  async generarCargoDesdeCita(citaId, data) {
    const response = await api.post(`/citas/${citaId}/generar-cargo`, data)
    return response.data
  },

  // ==========================================
  // REPORTES Y ESTADÍSTICAS
  // ==========================================

  /**
   * Obtener resumen financiero
   */
  async getResumen(params = {}) {
    const response = await api.get('/facturacion/dashboard', { params })
    return response.data
  },

  /**
   * Exportar reporte
   */
  async exportarReporte(tipo, params = {}) {
    const response = await api.get(`/facturacion/exportar/${tipo}`, {
      params,
      responseType: 'blob'
    })
    return response.data
  },

  // ==========================================
  // UTILIDADES
  // ==========================================

  /**
   * Calcular plan de financiamiento
   */
  calcularCuotas(monto, numeroCuotas, tasaInteres = 0) {
    const cuotas = []
    const montoCuota = tasaInteres > 0
      ? monto * (tasaInteres * Math.pow(1 + tasaInteres, numeroCuotas)) /
        (Math.pow(1 + tasaInteres, numeroCuotas) - 1)
      : monto / numeroCuotas

    for (let i = 1; i <= numeroCuotas; i++) {
      cuotas.push({
        numero: i,
        monto: Math.round(montoCuota * 100) / 100,
        fecha_vencimiento: this.calcularFechaVencimiento(i),
        estado: 'pendiente'
      })
    }

    return cuotas
  },

  /**
   * Calcular fecha de vencimiento
   */
  calcularFechaVencimiento(numeroCuota, frecuencia = 'mensual') {
    const hoy = new Date()
    const fecha = new Date(hoy)

    switch (frecuencia) {
      case 'semanal':
        fecha.setDate(fecha.getDate() + numeroCuota * 7)
        break
      case 'quincenal':
        fecha.setDate(fecha.getDate() + numeroCuota * 15)
        break
      case 'mensual':
      default:
        fecha.setMonth(fecha.getMonth() + numeroCuota)
        break
    }

    return fecha.toISOString().split('T')[0]
  },

  /**
   * Formatear monto
   */
  formatearMonto(monto) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto)
  }
}