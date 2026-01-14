// src/services/superadmin/index.js

// Importar servicios
import api from './api'
import * as authService from './authService'
import * as dashboardService from './dashboardService'
import * as clinicasService from './clinicasService'
import * as suscripcionesService from './suscripcionesService'
import * as planesService from './planesService'
import * as facturacionService from './facturacionService'
import * as reportesService from './reportesService'
import * as configuracionService from './configuracionService'

// Exportar todo
export {
  api,
  authService,
  dashboardService,
  clinicasService,
  suscripcionesService,
  planesService,
  facturacionService,
  reportesService,
  configuracionService
}

// Export default para compatibilidad
export default {
  api,
  authService,
  dashboardService,
  clinicasService,
  suscripcionesService,
  planesService,
  facturacionService,
  reportesService,
  configuracionService
}