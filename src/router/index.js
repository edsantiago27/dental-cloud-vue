import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'
import { useAuthStore } from '@shared/stores/auth'

// Importar rutas de módulos (TODOS con named imports)
import { superAdminRoutes } from '@superadmin/router'
import { pacienteRoutes } from '@paciente/router'
// import { clinicaRoutes } from '@clinica/router'  // Cuando lo crees

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      beforeEnter: guestGuard,
      meta: { title: 'Iniciar Sesión', requiresAuth: false }
    },

    // Módulo Clínica (temporal - mientras refactorizamos)
    {
      path: '/',
    component: () => import('@clinica/layouts/ClinicaLayout.vue'),  
    beforeEnter: authGuard,
      meta: { requiresAuth: true, module: 'clinica' },
      children: [
        {
          path: 'dashboard',
          name: 'clinica-dashboard',
          component: () => import('@clinica/views/Dashboard.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'pacientes',
          name: 'clinica-pacientes',
          component: () => import('@clinica/views/Pacientes.vue'),
          meta: { title: 'Pacientes' }
        },
        {
          path: 'profesionales',
          name: 'clinica-profesionales',
          component: () => import('@clinica/views/Profesionales.vue'),
          meta: { title: 'Profesionales' }
        },
        {
          path: 'citas',
          name: 'clinica-citas',
          component: () => import('@clinica/views/CitasLista.vue'),
          meta: { title: 'Citas' }
        },
        {
          path: 'calendario',
          name: 'clinica-calendario',
          component: () => import('@clinica/views/Citas.vue'),
          meta: { title: 'Calendario' }
        },
        {
          path: 'tratamientos',
          name: 'clinica-tratamientos',
          component: () => import('@clinica/views/Tratamientos.vue'),
          meta: { title: 'Tratamientos' }
        },
        {
          path: 'facturacion',
          name: 'clinica-facturacion',
          component: () => import('@clinica/views/FacturacionDashboard.vue'),
          meta: { title: 'Facturación' }
        },
        {
          path: 'configuracion',
          name: 'clinica-configuracion',
          component: () => import('@clinica/views/Configuracion.vue'),
          meta: { title: 'Configuración' }
        }
      ]
    },

    // Módulos
    ...superAdminRoutes,
    ...pacienteRoutes,

    // Redirección raíz
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore()
        
        if (!authStore.isAuthenticated) {
          return '/login'
        }
        
        // Redirigir según tipo de usuario
        if (authStore.isPacienteUser) {
          return '/paciente/portal'
        }
        
        return '/dashboard'
      }
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { title: 'Página No Encontrada' }
    }
  ]
})

// Global guards
router.beforeEach((to, from, next) => {
  document.title = to.meta.title 
    ? `${to.meta.title} - DentalCloud` 
    : 'DentalCloud'
  next()
})

export default router
