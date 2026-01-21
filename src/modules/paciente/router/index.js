// src/modules/paciente/router/index.js
import { usePacienteAuthStore } from '../stores/auth'

// Middleware de autenticación
function requireAuth(to, from, next) {
  const authStore = usePacienteAuthStore()
  
  // Verificar sesión si no está cargada
  if (!authStore.isAuthenticated) {
    authStore.checkAuth()
  }
  
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem('intended_route', to.fullPath)
    next({ name: 'paciente-login' })
  } else {
    next()
  }
}

// Middleware para redirigir si ya está autenticado
function redirectIfAuthenticated(to, from, next) {
  const authStore = usePacienteAuthStore()
  
  if (!authStore.isAuthenticated) {
    authStore.checkAuth()
  }
  
  if (authStore.isAuthenticated) {
    next({ name: 'paciente-portal' })
  } else {
    next()
  }
}

export const pacienteRoutes = [
  // ============================================
  // 🔓 RUTAS PÚBLICAS DE PACIENTE
  // ============================================
  {
    path: '/paciente/login',
    name: 'paciente-login',
    component: () => import('../views/Login.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: { title: 'Login Paciente', requiresAuth: false }
  },
  {
    path: '/paciente/registro',
    name: 'paciente-registro',
    component: () => import('../views/Registro.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: { title: 'Registro Paciente', requiresAuth: false }
  },
  {
    path: '/paciente/recuperar-password',
    name: 'paciente-recuperar-password',
    component: () => import('../views/RecuperarPassword.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: { title: 'Recuperar Contraseña', requiresAuth: false }
  },
  {
    path: '/:clinicaSlug/reserva-express',
    name: 'paciente-reserva-express',
    component: () => import('../views/GuestAgenda.vue'),
    meta: { title: 'Reserva de Hora', requiresAuth: false }
  },
  
  // ============================================
  // 🔐 RUTAS PROTEGIDAS DE PACIENTE
  // ============================================
  {
    path: '/paciente',
    component: () => import('../layouts/PacienteLayout.vue'),
    beforeEnter: requireAuth,
    meta: { requiresAuth: true, module: 'paciente' },
    children: [
      {
        path: '',
        redirect: '/paciente/portal'
      },
      {
        path: 'portal',
        name: 'paciente-portal',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: 'Portal Paciente' }
      },
      {
        path: 'citas',
        name: 'paciente-citas',
        component: () => import('../views/Citas.vue'),
        meta: { title: 'Mis Citas' }
      },
      {
        path: 'citas/:id',
        name: 'paciente-cita-detalle',
        component: () => import('../views/CitaDetalle.vue'),
        meta: { title: 'Detalle de Cita' },
        props: true
      },
      {
        path: 'historia-clinica',
        name: 'paciente-historia-clinica',
        component: () => import('../views/HistoriaClinica.vue'),
        meta: { title: 'Historia Clínica' }
      },
      {
        path: 'documentos',
        name: 'paciente-documentos',
        component: () => import('../views/Documentos.vue'),
        meta: { title: 'Documentos' }
      },
      {
        path: 'pagos',
        name: 'paciente-pagos',
        component: () => import('../views/Pagos.vue'),
        meta: { title: 'Mis Pagos' }
      },
      {
        path: 'perfil',
        name: 'paciente-perfil',
        component: () => import('../views/Perfil.vue'),
        meta: { title: 'Mi Perfil' }
      },
      {
        path: 'configuracion',
        name: 'paciente-configuracion',
        component: () => import('../views/Configuracion.vue'),
        meta: { title: 'Configuración' }
      }
    ]
  }
]
