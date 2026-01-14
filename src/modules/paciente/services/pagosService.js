// src/services/paciente/pagosService.js
// ADAPTADO PARA USAR LAS RUTAS EXISTENTES DEL PacientePagosController
import api from './api'

/**
 * Obtener resumen de cuenta del paciente
 * Ruta: GET /paciente/mis-pagos/resumen
 */
export async function getResumen() {
  const response = await api.get('/paciente/mis-pagos/resumen')
  return response.data
}

/**
 * Listar cuentas/tratamientos del paciente
 * Ruta: GET /paciente/mis-pagos/cuentas
 */
export async function getCuentas(estado = null) {
  const response = await api.get('/paciente/mis-pagos/cuentas', {
    params: estado ? { estado } : {}
  })
  return response.data
}

/**
 * Ver detalle de una cuenta
 * Ruta: GET /paciente/mis-pagos/cuentas/{id}
 */
export async function getDetalleCuenta(id) {
  const response = await api.get(`/paciente/mis-pagos/cuentas/${id}`)
  return response.data
}

/**
 * Obtener historial de pagos
 * Ruta: GET /paciente/mis-pagos/historial
 */
export async function getHistorialPagos() {
  const response = await api.get('/paciente/mis-pagos/historial')
  return response.data
}

/**
 * Descargar comprobante de pago
 * Ruta: GET /paciente/mis-pagos/comprobante/{id}
 */
export async function getComprobante(id) {
  const response = await api.get(`/paciente/mis-pagos/comprobante/${id}`)
  return response.data
}

export default {
  getResumen,
  getCuentas,
  getDetalleCuenta,
  getHistorialPagos,
  getComprobante
}