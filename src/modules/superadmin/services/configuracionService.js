// src/services/superadmin/configuracionService.js
import api from './api'

// Obtener toda la configuración
export async function getConfiguracion() {
  const response = await api.get('/superadmin/configuracion')
  return response.data
}

// Actualizar sección de configuración (genérico)
export async function actualizarConfiguracion(seccion, data) {
  const response = await api.put(`/superadmin/configuracion/${seccion}`, data)
  return response.data
}

// Guardar configuración general
export async function guardarGeneral(data) {
  const response = await api.post('/superadmin/configuracion/general', data)
  return response.data
}

// Guardar configuración de email
export async function guardarEmail(data) {
  const response = await api.post('/superadmin/configuracion/email', data)
  return response.data
}

// Probar configuración de email
export async function testEmail(emailDestino = null) {
  const response = await api.post('/superadmin/configuracion/email/probar', {
    email_destino: emailDestino
  })
  return response.data
}

// Guardar configuración de pagos/facturación
export async function guardarPagos(data) {
  const response = await api.post('/superadmin/configuracion/pagos', data)
  return response.data
}

// Guardar configuración de facturación electrónica (SimpleAPI)
export async function guardarFacturacion(data) {
  // Nota: data debe ser FormData para subir archivos
  const response = await api.post('/superadmin/configuracion/facturacion', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

// Guardar configuración de integraciones
export async function guardarIntegraciones(data) {
  const response = await api.post('/superadmin/configuracion/integraciones', data)
  return response.data
}

// Guardar configuración de seguridad
export async function guardarSeguridad(data) {
  const response = await api.post('/superadmin/configuracion/seguridad', data)
  return response.data
}

// Listar administradores
export async function listarAdmins() {
  const response = await api.get('/superadmin/configuracion/admins')
  return response.data
}

// Crear administrador
export async function crearAdmin(data) {
  const response = await api.post('/superadmin/configuracion/admins', data)
  return response.data
}

// Actualizar administrador
export async function actualizarAdmin(id, data) {
  const response = await api.put(`/superadmin/configuracion/admins/${id}`, data)
  return response.data
}

// Eliminar administrador
export async function eliminarAdmin(id) {
  const response = await api.delete(`/superadmin/configuracion/admins/${id}`)
  return response.data
}

export default {
  getConfiguracion,
  actualizarConfiguracion,
  guardarGeneral,
  guardarEmail,
  testEmail,
  testEmail,
  guardarPagos,
  guardarFacturacion,
  guardarIntegraciones,
  guardarSeguridad,
  listarAdmins,
  crearAdmin,
  actualizarAdmin,
  eliminarAdmin
}