// router/guards.js
import { useAuthStore } from '../modules/clinica/stores/auth'

/**
 * Guard para rutas que requieren autenticación
 */
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  
  // Validar acceso por módulo
  const module = to.meta.module
  const userRole = authStore.user?.role
  
  if (module === 'superadmin' && userRole !== 'superadmin') {
    return next({ name: 'not-found' })
  }
  
  if (module === 'paciente' && userRole !== 'paciente') {
    return next({ name: 'not-found' })
  }
  
  next()
}

/**
 * Guard para rutas de invitados (login, registro, etc.)
 * Si ya está autenticado, redirige al dashboard
 */
export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    return next({ name: 'clinica-dashboard' })
  }
  
  next()
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