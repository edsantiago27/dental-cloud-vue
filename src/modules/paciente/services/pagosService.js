// src/modules/paciente/services/pagosService.js
import api from './api'

/**
 * Obtener resumen de pagos del paciente
 * Ruta: GET /paciente/mis-pagos/resumen
 */
export async function getResumen() {
  try {
    const response = await api.get('/paciente/mis-pagos/resumen')
    return response.data
  } catch (error) {
    console.error('Error al obtener resumen de pagos:', error)
    return {
      success: false,
      data: {
        total_pendiente: 0,
        total_pagado: 0,
        cuentas_pendientes: 0
      }
    }
  }
}

/**
 * Obtener cuentas del paciente
 * Ruta: GET /paciente/mis-pagos/cuentas
 */
export async function getCuentas(estado = null) {
  try {
    const response = await api.get('/paciente/mis-pagos/cuentas', {
      params: estado ? { estado } : {}
    })
    return response.data
  } catch (error) {
    console.error('Error al obtener cuentas:', error)
    return {
      success: false,
      data: []
    }
  }
}

/**
 * Ver detalle de una cuenta
 * Ruta: GET /paciente/mis-pagos/cuentas/{id}
 */
export async function getDetalleCuenta(id) {
  try {
    const response = await api.get(`/paciente/mis-pagos/cuentas/${id}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener detalle de cuenta:', error)
    return { success: false }
  }
}

/**
 * Obtener historial de pagos
 * Ruta: GET /paciente/mis-pagos/historial
 */
export async function getHistorialPagos(filtros = {}) {
  try {
    const response = await api.get('/paciente/mis-pagos/historial', {
      params: filtros
    })
    return response.data
  } catch (error) {
    console.error('Error al obtener historial:', error)
    return {
      success: false,
      data: []
    }
  }
}

/**
 * Descargar comprobante de pago
 * Ruta: GET /paciente/mis-pagos/comprobante/{id}
 */
export async function descargarComprobante(id) {
  try {
    const response = await api.get(`/paciente/mis-pagos/comprobante/${id}`, {
      responseType: 'blob'
    })
    return response
  } catch (error) {
    console.error('Error al descargar comprobante:', error)
    throw error
  }
}

export default {
  getResumen,
  getCuentas,
  getDetalleCuenta,
  getHistorialPagos,
  descargarComprobante
}
