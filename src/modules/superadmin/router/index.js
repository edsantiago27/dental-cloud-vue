// src/router/superadmin.js
import { useSuperAdminAuthStore } from '../stores/auth'

function requireAuth(to, from, next) {
  const authStore = useSuperAdminAuthStore()

  // Intentar restaurar sesión desde localStorage
  if (!authStore.isAuthenticated) {
    const ok = authStore.checkAuth()
    if (!ok) {
      return next('/superadmin/login')
    }
  }

  next()
}

// Middleware para redirigir si ya está autenticado
function redirectIfAuthenticated(to, from, next) {
  const authStore = useSuperAdminAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.checkAuth()
  }

  if (authStore.isAuthenticated) {
    return next('/superadmin/dashboard')
  }

  next()
};

export const superAdminRoutes = [
  {
    path: '/superadmin/login',
    name: 'SuperAdminLogin',
    component: () => import('../views/Login.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: {
      title: 'SuperAdmin - Login'
    }
  },
  {
    path: '/superadmin',
    component: () => import('../layouts/SuperAdminLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      {
        path: '',
        redirect: '/superadmin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'SuperAdminDashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: 'Dashboard'
        }
      },
      {
        path: 'clinicas',
        name: 'SuperAdminClinicas',
        component: () => import('../views/Clinicas.vue'),
        meta: {
          title: 'Clínicas'
        }
      },
      {
        path: 'clinicas/:id',
        name: 'SuperAdminClinicaDetalle',
        component: () => import('../views/ClinicaDetalle.vue'),
        meta: {
          title: 'Detalle de Clínica'
        }
      },
      {
        path: 'suscripciones',
        name: 'SuperAdminSuscripciones',
        component: () => import('../views/Suscripciones.vue'),
        meta: {
          title: 'Suscripciones'
        }
      },
      {
        path: 'planes',
        name: 'SuperAdminPlanes',
        component: () => import('../views/Planes.vue'),
        meta: {
          title: 'Planes'
        }
      },
      {
        path: 'facturacion',
        name: 'SuperAdminFacturacion',
        component: () => import('../views/Facturacion.vue'),
        meta: {
          title: 'Facturación'
        }
      },
      {
        path: 'reportes',
        name: 'SuperAdminReportes',
        component: () => import('../views/Reportes.vue'),
        meta: {
          title: 'Reportes'
        }
      },
      {
        path: 'configuracion',
        name: 'SuperAdminConfiguracion',
        component: () => import('../views/Configuracion.vue'),
        meta: {
          title: 'Configuración del Sistema'
        }
      }
    ]
  }
]