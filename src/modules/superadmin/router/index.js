// src/modules/superadmin/router/index.js
import { useSuperAdminAuthStore } from '@superadmin/stores/auth'

function requireAuth(to, from, next) {
  const authStore = useSuperAdminAuthStore()

  if (!authStore.isAuthenticated) {
    const ok = authStore.checkAuth()
    if (!ok) {
      return next('/superadmin/login')
    }
  }

  next()
}

function redirectIfAuthenticated(to, from, next) {
  const authStore = useSuperAdminAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.checkAuth()
  }

  if (authStore.isAuthenticated) {
    return next('/superadmin/dashboard')
  }

  next()
}

export const superAdminRoutes = [  // ✅ Ya tiene export const correcto
  {
    path: '/superadmin/login',
    name: 'superadmin-login',
    component: () => import('../views/Login.vue'),
    beforeEnter: redirectIfAuthenticated,
    meta: { title: 'SuperAdmin - Login', requiresAuth: false }
  },
  {
    path: '/superadmin',
    component: () => import('../layouts/SuperAdminLayout.vue'),
    beforeEnter: requireAuth,
    meta: { requiresAuth: true, module: 'superadmin' },
    children: [
      {
        path: '',
        redirect: '/superadmin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'superadmin-dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'clinicas',
        name: 'superadmin-clinicas',
        component: () => import('../views/Clinicas.vue'),
        meta: { title: 'Clínicas' }
      },
      {
        path: 'clinicas/:id',
        name: 'superadmin-clinica-detalle',
        component: () => import('../views/ClinicaDetalle.vue'),
        meta: { title: 'Detalle de Clínica' }
      },
      {
        path: 'suscripciones',
        name: 'superadmin-suscripciones',
        component: () => import('../views/Suscripciones.vue'),
        meta: { title: 'Suscripciones' }
      },
      {
        path: 'planes',
        name: 'superadmin-planes',
        component: () => import('../views/Planes.vue'),
        meta: { title: 'Planes' }
      },
      {
        path: 'facturacion',
        name: 'superadmin-facturacion',
        component: () => import('../views/Facturacion.vue'),
        meta: { title: 'Facturación' }
      },
      {
        path: 'reportes',
        name: 'superadmin-reportes',
        component: () => import('../views/Reportes.vue'),
        meta: { title: 'Reportes' }
      },
      {
        path: 'configuracion',
        name: 'superadmin-configuracion',
        component: () => import('../views/Configuracion.vue'),
        meta: { title: 'Configuración del Sistema' }
      }
    ]
  }
]
