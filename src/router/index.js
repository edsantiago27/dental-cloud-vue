// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'
import { useAuthStore } from '@/stores/auth'
import { superAdminRoutes } from './superadmin'
import pacienteRoutes from './paciente'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ==========================================
    // RUTAS PÚBLICAS (invitados)
    // ==========================================
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      beforeEnter: guestGuard,
      meta: { 
        title: 'Iniciar Sesión',
        requiresAuth: false 
      }
    },

    // ==========================================
    // RUTAS PROTEGIDAS CON LAYOUT (requieren auth)
    // ==========================================
    {
      path: '/',
      component: () => import('../layouts/AdminLayout.vue'),
      beforeEnter: authGuard,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/admin/Dashboard.vue'),
          meta: { 
            title: 'Dashboard',
            requiresAuth: true 
          }
        },
        {
          path: 'pacientes',
          name: 'pacientes',
          component: () => import('../views/admin/Pacientes.vue'),
          meta: { 
            title: 'Pacientes',
            requiresAuth: true 
          }
        },
        {
          path: '/pacientes/:id/historia-clinica',
          name: 'paciente-historia-clinica',
          component: () => import('@/views/admin/HistoriaClinicaView.vue'),
          meta: { 
            requiresAuth: true, 
            title: 'Historia Clínica',
            breadcrumb: 'Historia Clínica'
          }
        },
        {
          path: '/facturacion',
          name: 'facturacion',
          component: () => import('@/views/admin/FacturacionDashboard.vue'),
          meta: { 
            requiresAuth: true,
            title: 'Facturación'
          }
        },
        {
          path: '/facturacion/cuentas',
          name: 'facturacion-cuentas',
          component: () => import('@/views/admin/CuentasView.vue'),
          meta: { 
            requiresAuth: true,
            title: 'Cuentas por Cobrar'
          }
        },
        {
          path: 'profesionales',
          name: 'profesionales',
          component: () => import('../views/admin/Profesionales.vue'),
          meta: { 
            title: 'Profesionales',
            requiresAuth: true 
          }
        },
        {
          path: 'tratamientos',
          name: 'tratamientos',
          component: () => import('../views/admin/Tratamientos.vue'),
          meta: { 
            title: 'Tratamientos',
            requiresAuth: true 
          }
        },
        {
          path: 'citas',
          name: 'citas-lista',
          component: () => import('../views/admin/CitasLista.vue'),
          meta: { 
            title: 'Lista de Citas',
            requiresAuth: true 
          }
        },
        {
          path: 'calendario',
          name: 'calendario',
          component: () => import('../views/admin/Citas.vue'),
          meta: { 
            title: 'Calendario',
            requiresAuth: true 
          }
        },
        {
          path: 'facturacion',
          name: 'facturacion',
          component: () => import('../views/admin/Facturacion.vue'),
          meta: { 
            title: 'Facturación',
            requiresAuth: true 
          }
        },
        {
          path: 'pagos',
          name: 'pagos',
          component: () => import('../views/admin/Pagos.vue'),
          meta: { 
            title: 'Pagos',
            requiresAuth: true 
          }
        },
        {
          path: 'reportes',
          name: 'reportes',
          component: () => import('../views/admin/Reportes.vue'),
          meta: { 
            title: 'Reportes',
            requiresAuth: true 
          }
        },
        {
          path: 'configuracion',
          name: 'configuracion',
          component: () => import('../views/admin/Configuracion.vue'),
          meta: { 
            title: 'Configuración',
            requiresAuth: true 
          }
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: () => import('../views/admin/Usuarios.vue'),
          meta: { 
            title: 'Usuarios',
            requiresAuth: true,
            adminOnly: true
          }
        },
        {
          path: 'perfil',
          name: 'perfil',
          component: () => import('../views/admin/Perfil.vue'),
          meta: { 
            title: 'Mi Perfil',
            requiresAuth: true 
          }
        }
      ]
    },

    // ==========================================
    // REDIRECCIONES
    // ==========================================
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore()
        return authStore.isAuthenticated ? '/dashboard' : '/login'
      }
    },
      ...superAdminRoutes,
       ...pacienteRoutes,
    // ==========================================
    // 404 - Not Found
    // ==========================================
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { 
        title: 'Página No Encontrada'
      }
    },
    // ==========================================
    // TEST - paginas de prueba
    // ==========================================
     {
       path: '/:pathMatch(.*)*',
      path: '/test',
      name: 'test',
      component: () => import('../views/TestConexion.vue'),
      meta: { 
        title: 'Test'
      }
    },
    {
      path: '/odontograma-prueba',
      name: 'odontograma-prueba',
      component: () => import('@/views/admin/PruebaOdontograma.vue'),
      meta: { requiresAuth: true, title: 'Odontograma' }
    },
    {
      path: '/timeline-prueba',
      name: 'timeline-prueba',
      component: () => import('@/views/admin/PruebaTimeline.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ficha-medica-prueba',
      name: 'ficha-medica-prueba',
      component: () => import('@/views/admin/PruebaFichaMedica.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/archivos-prueba',
      component: () => import('@/views/admin/PruebaArchivos.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/historia-clinica-prueba',
      name: 'historia-clinica-prueba',
      component: () => import('@/views/admin/PruebaHistoriaClinica.vue'),
      meta: { requiresAuth: true, title: 'Historia Clínica' }
    },
    {
      path: '/pacientes/:id/historia-clinica',
      name: 'historia-clinica',
      component: () => import('@/views/admin/HistoriaClinicaView.vue'),
      meta: { requiresAuth: true, title: 'Historia Clínica' }
    }
  ]
})

// ==========================================
// GLOBAL GUARDS
// ==========================================

// Before Each - Se ejecuta antes de cada navegación
router.beforeEach((to, from, next) => {
  console.log('🧭 Navegación:', {
    from: from.path,
    to: to.path
  })

  // Actualizar título de la página
  document.title = to.meta.title 
    ? `${to.meta.title} - DentalCloud` 
    : 'DentalCloud'

  next()
})

// After Each - Se ejecuta después de cada navegación
router.afterEach((to, from) => {
  console.log('✅ Navegación completada:', to.path)
})

export default router