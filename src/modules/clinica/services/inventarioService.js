// modules/clinica/services/inventarioService.js
import api from './api'

export default {
  /**
   * Listar productos
   */
  async getProductos(params = {}) {
    const response = await api.get('/inventario/productos', { params })
    return response.data
  },

  /**
   * Crear producto
   */
  async crearProducto(data) {
    const response = await api.post('/inventario/productos', data)
    return response.data
  },

  /**
   * Actualizar producto
   */
  async actualizarProducto(id, data) {
    const response = await api.put(`/inventario/productos/${id}`, data)
    return response.data
  },

  /**
   * Registrar movimiento de stock
   */
  async registrarMovimiento(data) {
    const response = await api.post('/inventario/movimientos', data)
    return response.data
  },

  /**
   * Obtener productos con stock bajo
   */
  async getStockBajo() {
    const response = await api.get('/inventario/stock-bajo')
    return response.data
  },

  /**
   * Historial de movimientos
   */
  async getHistorialMovimientos(params = {}) {
    const response = await api.get('/inventario/movimientos', { params })
    return response.data
  }
}
