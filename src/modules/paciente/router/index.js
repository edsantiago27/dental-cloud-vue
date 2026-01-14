// src/router/paciente.js
import PacienteLayout from '../layouts/PacienteLayout.vue'
import { usePacienteAuthStore } from '../stores/auth'

// Middleware de autenticación
function requireAuth(to, from, next) {
  const authStore = usePacienteAuthStore()
  
  if (!authStore.isAuthenticated) {
    // Guardar ruta a la que intentaba acceder
    sessionStorage.setItem('intended_route', to.fullPath)
    
    // Redirigir a login
    const clinicaSlug = to.params.clinicaSlug || 'demo'
    next(`/${clinicaSlug}/paciente/login`)
  } else {
    next()
  }
}

// Middleware para redirigir si ya está autenticado
function redirectIfAuthenticated(to, from, next) {
  const authStore = usePacienteAuthStore()
  
  if (authStore.isAuthenticated) {
    const clinicaSlug = to.params.clinicaSlug || 'demo'
    next(`/${clinicaSlug}/paciente/dashboard`)
  } else {
    next()
  }
}

export default [
  {
    path: '/:clinicaSlug/paciente',
    redirect: (to) => `/${to.params.clinicaSlug}/paciente/login`
  },
  
  // Rutas públicas (sin autenticación)
  {
    path: '/:clinicaSlug/paciente/login',
    name: 'PacienteLogin',
    component: () => import('../views/Login.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: { title: 'Login Paciente' }
  },
  {
    path: '/:clinicaSlug/paciente/registro',
    name: 'PacienteRegistro',
    component: () => import('../views/Registro.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: { title: 'Registro Paciente' }
  },
  {
    path: '/:clinicaSlug/paciente/recuperar-password',
    name: 'PacienteRecuperarPassword',
    component: () => import('../views/RecuperarPassword.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: { title: 'Recuperar Contraseña' }
  },
  
  // Rutas protegidas (requieren autenticación)
  {
    path: '/:clinicaSlug/paciente',
    component: PacienteLayout,
    beforeEnter: requireAuth,
    children: [
      {
        path: 'dashboard',
        name: 'PacienteDashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: 'Dashboard Paciente' }
      },
      {
        path: 'citas',
        name: 'PacienteCitas',
        component: () => import('../views/Citas.vue'),
        meta: { title: 'Mis Citas' }
      },
      {
        path: 'historia-clinica',
        name: 'PacienteHistoriaClinica',
        component: () => import('../views/HistoriaClinica.vue'),
        meta: { title: 'Historia Clínica' }
      },
      {
        path: 'documentos',
        name: 'PacienteDocumentos',
        component: () => import('../views/Documentos.vue'),
        meta: { title: 'Documentos' }
      },
      {
        path: 'pagos',
        name: 'PacientePagos',
        component: () => import('../views/Pagos.vue'),
        meta: { title: 'Pagos' }
      },
      {
        path: 'perfil',
        name: 'PacientePerfil',
        component: () => import('../views/Perfil.vue'),
        meta: { title: 'Mi Perfil' }
      },
      {
        path: 'configuracion',
        name: 'PacienteConfiguracion',
        component: () => import('../views/Configuracion.vue'),
        meta: { title: 'Configuración' }
      }
    ]
  }
]