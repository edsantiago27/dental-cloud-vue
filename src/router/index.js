import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'
import { useAuthStore } from '@shared/stores/auth'

// Importar rutas de módulos
import { superAdminRoutes } from '@superadmin/router'
import { pacienteRoutes } from '@paciente/router'
import { demoRoutes } from '@demo/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ============================================
    // 🔐 RUTAS PÚBLICAS
    // ============================================
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),  // ← CAMBIAR AQUÍ
      beforeEnter: guestGuard,
      meta: { title: 'Iniciar Sesión', requiresAuth: false }
    },

    // ============================================
    // 🏥 MÓDULO CLÍNICA (ADMIN)
    // ============================================
    {
      path: '/',
      component: () => import('@clinica/layouts/ClinicaLayout.vue'),  
      beforeEnter: authGuard,
      meta: { requiresAuth: true, module: 'clinica' },
      children: [
        // Redirección raíz de clínica
        {
          path: '',
          redirect: '/dashboard'
        },
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
          path: 'pacientes/:pacienteId/historia-clinica',
          name: 'clinica-historia-clinica',
          component: () => import('@clinica/views/HistoriaClinicaView.vue'),
          meta: { title: 'Historia Clínica' },
          props: true
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
          path: 'facturacion/cuentas',
          name: 'clinica-cuentas',
          component: () => import('@clinica/views/CuentasView.vue'),
          meta: { title: 'Cuentas por Cobrar' }
        },
        {
          path: 'facturacion/pagos',
          name: 'clinica-pagos',
          component: () => import('@clinica/views/Pagos.vue'),
          meta: { title: 'Registro de Pagos' }
        },
         // Reportes
        {
          path: 'reportes',
          name: 'clinica-reportes',
          component: () => import('@clinica/views/Reportes.vue'),
          meta: { title: 'Reportes',
            requiresAuth: true,
      roles: ['super_admin', 'admin_clinica']
           }
        },

        // Usuarios y Configuración
        {
          path: 'usuarios',
          name: 'clinica-usuarios',
          component: () => import('@clinica/views/Usuarios.vue'),
          meta: { title: 'Usuarios' }
        },
        {
          path: 'configuracion',
          name: 'clinica-configuracion',
          component: () => import('@clinica/views/Configuracion.vue'),
          meta: { title: 'Configuración' }
        },
        {
          path: 'perfil',
          name: 'clinica-perfil',
          component: () => import('@clinica/views/Perfil.vue'),
          meta: { title: 'Mi Perfil' }
        }
      ]
    },

   // ============================================
    // 👤 MÓDULO PACIENTE (PORTAL)
    // ============================================
    ...pacienteRoutes,

    // ============================================
    // ⚙️ MÓDULO SUPERADMIN
    // ============================================
    ...superAdminRoutes,
    ...demoRoutes,

    // ============================================
    // 🔀 REDIRECCIONES
    // ============================================

    // Redirección raíz
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore()
        
        if (!authStore.isAuthenticated) {
          return '/login'
        }
        
        if (authStore.isPacienteUser) {
          return '/paciente/portal'
        }
        if (authStore.isSuperAdmin) {
          return '/superadmin/dashboard'
        }
        return '/dashboard'
      }
    },

    // ============================================
    // ❌ 404 - PÁGINA NO ENCONTRADA
    // ============================================
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),  // ← CAMBIAR AQUÍ
      meta: { title: 'Página No Encontrada' }
    }
  ]
})

// ============================================
// 🛡️ GLOBAL NAVIGATION GUARDS
// ============================================
router.beforeEach((to, from, next) => {
  document.title = to.meta.title 
    ? `${to.meta.title} - DentalCloud` 
    : 'DentalCloud'
  next()
})

export default router
