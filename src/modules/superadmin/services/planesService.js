// src/services/superadmin/planesService.js
import api from './api'

// Listar planes
export async function getPlanes(params = {}) {
  const response = await api.get('/superadmin/planes', { params })
  return response.data
}

// Obtener un plan
export async function getPlan(id) {
  const response = await api.get(`/superadmin/planes/${id}`)
  return response.data
}

// Crear plan
export async function crearPlan(data) {
  const response = await api.post('/superadmin/planes', data)
  return response.data
}

// Actualizar plan
export async function actualizarPlan(id, data) {
  const response = await api.put(`/superadmin/planes/${id}`, data)
  return response.data
}

// Eliminar plan
export async function eliminarPlan(id) {
  const response = await api.delete(`/superadmin/planes/${id}`)
  return response.data
}

// Activar plan
export async function activarPlan(id) {
  const response = await api.patch(`superadmin/planes/${id}/estado`, { estado: 'activo' });
  return response.data;
}

// Desactivar plan
export async function desactivarPlan(id) {
  const response = await api.patch(`superadmin/planes/${id}/estado`, { estado: 'inactivo' });
  return response.data;
}

export default {
  getPlanes,
  getPlan,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
  activarPlan,
  desactivarPlan
}