/**
 * reportesService.js
 * ===================
 * Service para comunicación con endpoints de Reportes
 * Backend: ReporteController.php
 * 
 * IMPORTANTE: Este archivo usa el helper global API (definido en components.js)
 * NO usa axios ni apiClient
 */

import { apiBase } from '@/services/apiBase'

export const reportesService = {
  /**
   * Obtener resumen general con KPIs principales
   * GET /api/reportes/resumen
   * 
   * @param {Object} params - Filtros opcionales
   * @param {string} params.periodo - 'semana', 'mes', 'año'
   * @param {string} params.fecha_inicio - Fecha inicio personalizada
   * @param {string} params.fecha_fin - Fecha fin personalizada
   * @param {number} params.profesional_id - Filtrar por profesional
   * @returns {Promise<Object>} Resumen con estadísticas generales
   */
  async getResumen(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/reportes/resumen?${queryString}` : '/reportes/resumen'
      return await apiBase.get(endpoint)
    } catch (error) {
      console.error('Error al obtener resumen:', error)
      throw error
    }
  },

  /**
   * Obtener rendimiento de profesionales
   * GET /api/reportes/rendimiento-profesionales
   * 
   * @param {Object} params - Filtros opcionales
   * @returns {Promise<Object>} Array con rendimiento de cada profesional
   */
  async getRendimientoProfesionales(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/reportes/rendimiento-profesionales?${queryString}` : '/reportes/rendimiento-profesionales'
      return await apiBase.get(endpoint)
    } catch (error) {
      console.error('Error al obtener rendimiento profesionales:', error)
      throw error
    }
  },

  /**
   * Obtener pacientes nuevos por período
   * GET /api/reportes/pacientes-nuevos
   * 
   * @param {Object} params - Filtros opcionales
   * @returns {Promise<Object>} { labels: [], data: [] }
   */
  async getPacientesNuevos(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/reportes/pacientes-nuevos?${queryString}` : '/reportes/pacientes-nuevos'
      return await apiBase.get(endpoint)
    } catch (error) {
      console.error('Error al obtener pacientes nuevos:', error)
      throw error
    }
  },

  /**
   * Obtener distribución de estados de citas
   * GET /api/reportes/distribucion-estados
   * 
   * @param {Object} params - Filtros opcionales
   * @returns {Promise<Object>} Array con estados y totales
   */
  async getDistribucionEstados(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/reportes/distribucion-estados?${queryString}` : '/reportes/distribucion-estados'
      return await apiBase.get(endpoint)
    } catch (error) {
      console.error('Error al obtener distribución estados:', error)
      throw error
    }
  },

  /**
   * Obtener horarios más solicitados
   * GET /api/reportes/horarios-populares
   * 
   * @param {Object} params - Filtros opcionales
   * @returns {Promise<Object>} { labels: ['08:00', ...], citas: [5, 12, ...] }
   */
  async getHorariosPopulares(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/reportes/horarios-populares?${queryString}` : '/reportes/horarios-populares'
      return await apiBase.get(endpoint)
    } catch (error) {
      console.error('Error al obtener horarios populares:', error)
      throw error
    }
  },

  /**
   * Obtener días más solicitados
   * GET /api/reportes/dias-populares
   * 
   * @param {Object} params - Filtros opcionales
   * @returns {Promise<Object>} { labels: ['Dom', 'Lun', ...], citas: [2, 35, ...] }
   */
  async getDiasPopulares(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/reportes/dias-populares?${queryString}` : '/reportes/dias-populares'
      return await apiBase.get(endpoint)
    } catch (error) {
      console.error('Error al obtener días populares:', error)
      throw error
    }
  }
}