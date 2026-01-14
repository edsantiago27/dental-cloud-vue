// src/modules/paciente/router/index.js
import { useAuthStore } from '@shared/stores/auth'

// Middleware de autenticación
function requireAuth(to, from, next) {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated || !authStore.isPacienteUser) {
    sessionStorage.setItem('intended_route', to.fullPath)
    next('/paciente/login')
  } else {
    next()
  }
}

// Middleware para redirigir si ya está autenticado
function redirectIfAuthenticated(to, from, next) {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated && authStore.isPacienteUser) {
    next('/paciente/portal')
  } else {
    next()
  }
}

export const pacienteRoutes = [  // ⭐ CAMBIO PRINCIPAL: export const
  // Rutas públicas
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
  
  // Rutas protegidas
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
