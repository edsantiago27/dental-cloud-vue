// router/guards.js
import { useAuthStore } from '@shared/stores/auth'

/**
 * Guard para rutas que requieren autenticación
 */
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  
  // Validar acceso por módulo según userType
  const module = to.meta.module
  const userType = authStore.userType
  
  // SuperAdmin solo puede acceder a rutas superadmin
  if (module === 'superadmin' && userType !== 'superadmin') {
    return next({ name: 'not-found' })
  }
  
  // Paciente solo puede acceder a rutas paciente
  if (module === 'paciente' && userType !== 'paciente') {
    return next({ name: 'not-found' })
  }
  
  // Usuario de clínica solo puede acceder a rutas de clínica
  if (module === 'clinica' && userType !== 'clinica') {
    return next({ name: 'not-found' })
  }
  
  next()
}

/**
 * Guard para rutas de invitados (login, registro, etc.)
 * Si ya está autenticado, redirige según el tipo de usuario
 */
export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    // Redirigir según el tipo de usuario
    switch (authStore.userType) {
      case 'superadmin':
        return next({ name: 'superadmin-dashboard' })
      case 'paciente':
        return next({ name: 'paciente-portal' })
      case 'clinica':
      default:
        return next({ name: 'clinica-dashboard' })
    }
  }
  
  next()
}

/**
 * Guard para rutas que requieren rol específico dentro de una clínica
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
