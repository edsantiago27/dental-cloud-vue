// src/modules/demo/router/index.js
import { useDemoAuthStore } from '../stores/demoAuth'

export const demoRoutes = [
  {
    path: '/demo-tour/login',
    name: 'demo-login',
    component: () => import('../views/DemoLogin.vue'),
    meta: { title: 'Acceso Demo' }
  },
  {
    path: '/demo-tour',
    component: () => import('../layouts/DemoLayout.vue'),
    beforeEnter: (to, from, next) => {
      const authStore = useDemoAuthStore()
      if (!authStore.isAuthenticated && to.name !== 'demo-login') {
        next({ name: 'demo-login' })
      } else {
        next()
      }
    },
    children: [
      {
        path: 'dashboard',
        name: 'demo-dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: 'Dashboard Demo' }
      },
      {
        path: 'pacientes',
        name: 'demo-pacientes',
        component: () => import('../views/Pacientes.vue'),
        meta: { title: 'Pacientes Demo' }
      },
      {
        path: 'agenda',
        name: 'demo-agenda',
        component: () => import('../views/Agenda.vue'),
        meta: { title: 'Agenda Demo' }
      },
      {
        path: 'inventario',
        name: 'demo-inventario',
        component: () => import('../views/Inventario.vue'),
        meta: { title: 'Inventario Demo' }
      }
    ]
  }
]
