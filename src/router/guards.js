// router/guards.js
import { useAuthStore } from '@/stores/auth'

/**
 * Guard para rutas que requieren autenticación
 */
export function authGuard(to, from, next) {
  const authStore = useAuthStore()
  
  console.log('🔐 authGuard:', {
    to: to.path,
    from: from.path,
    isAuthenticated: authStore.isAuthenticated
  })

  if (!authStore.isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a /login')
    next({
      path: '/login',
      query: { redirect: to.fullPath } // Guardar ruta destino
    })
  } else {
    console.log('✅ Autenticado, permitir acceso')
    next()
  }
}

/**
 * Guard para rutas de invitados (login, registro, etc.)
 * Si ya está autenticado, redirige al dashboard
 */
export function guestGuard(to, from, next) {
  const authStore = useAuthStore()
  
  console.log('👤 guestGuard:', {
    to: to.path,
    from: from.path,
    isAuthenticated: authStore.isAuthenticated
  })

  if (authStore.isAuthenticated) {
    console.log('✅ Ya autenticado, redirigiendo a /dashboard')
    next('/dashboard')
  } else {
    console.log('👤 No autenticado, permitir acceso a', to.path)
    next()
  }
}

/**
 * Guard para rutas que requieren rol específico
 */
export function roleGuard(allowedRoles) {
  return (to, from, next) => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    const userRole = authStore.user?.rol
    
    if (allowedRoles.includes(userRole)) {
      next()
    } else {
      console.error(`❌ Rol ${userRole} no permitido. Se requiere: ${allowedRoles.join(', ')}`)
      next('/dashboard') // Redirigir a dashboard si no tiene permisos
    }
  }
}