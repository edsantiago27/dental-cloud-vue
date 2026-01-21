// src/services/superadmin/facturacionService.js
import api from './api'

// Listar facturas
export async function getFacturas(params = {}) {
  const response = await api.get('/superadmin/facturacion', { params })
  return response.data
}

// Obtener estadísticas
export async function getEstadisticas() {
  const response = await api.get('/superadmin/facturacion/estadisticas')
  return response.data
}

// Obtener una factura
export async function getFactura(id) {
  const response = await api.get(`/superadmin/facturacion/${id}`)
  return response.data
}

// Generar factura
export async function generar(data) {
  const response = await api.post('/superadmin/facturacion/generar', data)
  return response.data
}

// Registrar pago
export async function registrarPago(id, data) {
  const response = await api.post(`superadmin/facturacion/${id}/pago`, data);
  return response.data;
}

// Anular factura
export async function anular(id, motivo) {
  const response = await api.post(`superadmin/facturacion/${id}/anular`, { motivo });
  return response.data;
}

// Enviar recordatorio
export async function enviarRecordatorio(id) {
  const response = await api.post(`superadmin/facturacion/${id}/recordatorio`);
  return response.data;
}

// Emitir DTE (Factura Electrónica) con SimpleAPI
export async function emitirDte(id) {
  const response = await api.post(`/superadmin/facturacion/${id}/emitir`)
  return response.data
}

// Generar facturas masivas
export async function generarMasivo() {
  const response = await api.post('/superadmin/facturacion/generar-masivo')
  return response.data
}

// Resumen mensual
export async function resumenMensual(meses = 12) {
  const response = await api.get('/superadmin/facturacion/resumen-mensual', {
    params: { meses }
  })
  return response.data
}

// Exportar facturas
export async function exportar(params = {}) {
  const response = await api.get('/superadmin/facturacion/exportar', {
    params,
    responseType: 'blob'
  })
  return response.data
}

export default {
  getFacturas,
  getEstadisticas,
  getFactura,
  generar,
  registrarPago,
  anular,
  enviarRecordatorio,
  generarMasivo,
  resumenMensual,
  exportar
}