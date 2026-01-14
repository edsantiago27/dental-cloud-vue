// src/services/dashboardService.js
import api from './api'

export default {
  /**
   * Obtener KPIs principales del dashboard
   */
  async getKPIs() {
    const response = await api.get('/dashboard/kpis')
    return response.data
  },

  /**
   * Obtener datos para gráfico de ingresos
   */
  async getIngresosChart(params = {}) {
    const response = await api.get('/dashboard/ingresos-chart', { params })
    return response.data
  },

  /**
   * Obtener datos para gráfico de citas
   */
  async getCitasChart(params = {}) {
    const response = await api.get('/dashboard/citas-chart', { params })
    return response.data
  },

  /**
   * Obtener próximas citas del día
   */
  async getProximasCitas(params = {}) {
    const response = await api.get('/dashboard/proximas-citas', { params })
    return response.data
  },

  /**
   * Obtener alertas y recordatorios
   */
  async getAlertas() {
    const response = await api.get('/dashboard/alertas')
    return response.data
  },

  /**
   * Obtener actividad reciente
   */
  async getActividadReciente(params = {}) {
    const response = await api.get('/dashboard/actividad', { params })
    return response.data
  },

  /**
   * Obtener resumen financiero
   */
  async getResumenFinanciero() {
    const response = await api.get('/dashboard/resumen-financiero')
    return response.data
  },

  /**
   * Obtener estadísticas generales
   * (Fallback si no hay endpoints específicos)
   */
  async getEstadisticas() {
    try {
      const response = await api.get('/dashboard/estadisticas')
      return response.data
    } catch (error) {
      // Si no existe endpoint, retornar estructura vacía
      return {
        success: true,
        data: {
          pacientes: { total: 0, nuevos_mes: 0, activos: 0 },
          citas: { hoy: 0, semana: 0, mes: 0, pendientes: 0 },
          ingresos: { mes_actual: 0, pendiente: 0, total_ano: 0 },
          tratamientos: { activos: 0, completados_mes: 0 }
        }
      }
    }
  }
}