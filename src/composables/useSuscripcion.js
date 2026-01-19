import { ref, computed } from 'vue'
import { suscripcionService } from '@clinica/services/suscripcionService'

export function useSuscripcion() {
  const suscripcion = ref(null)
  const loading = ref(false)
  const upgrading = ref(false)

  // Estado visual de la suscripción
  const estadoBadge = computed(() => {
    if (!suscripcion.value?.suscripcion) return { color: 'gray', text: 'Sin plan' }
    
    const sus = suscripcion.value.suscripcion
    if (sus.es_trial) return { color: 'blue', text: 'Prueba gratis' }
    if (sus.estado === 'activa') return { color: 'green', text: 'Activa' }
    if (sus.estado === 'vencida') return { color: 'red', text: 'Vencida' }
    if (sus.estado === 'porvencer') return { color: 'yellow', text: 'Por vencer' }
    return { color: 'gray', text: sus.estado }
  })

  // Calcular módulos activos
  const modulosActivos = computed(() => {
    if (!suscripcion.value?.plan) return []
    
    const plan = suscripcion.value.plan
    const modulos = []
    
    // CORE
    if (plan.mod_dashboard) modulos.push({ nombre: 'Dashboard', icono: 'fas fa-chart-line', categoria: 'core' })
    if (plan.mod_pacientes) modulos.push({ nombre: 'Pacientes', icono: 'fas fa-users', categoria: 'core' })
    if (plan.mod_profesionales) modulos.push({ nombre: 'Profesionales', icono: 'fas fa-user-md', categoria: 'core' })
    if (plan.mod_agenda) modulos.push({ nombre: 'Agenda', icono: 'fas fa-calendar-alt', categoria: 'core' })
    if (plan.mod_citas) modulos.push({ nombre: 'Citas', icono: 'fas fa-calendar-check', categoria: 'core' })
    if (plan.mod_usuarios) modulos.push({ nombre: 'Usuarios', icono: 'fas fa-user-friends', categoria: 'core' })
    if (plan.mod_tratamientos) modulos.push({ nombre: 'Tratamientos', icono: 'fas fa-tooth', categoria: 'core' })
    if (plan.mod_configuracion) modulos.push({ nombre: 'Configuración', icono: 'fas fa-cog', categoria: 'core' })
    
    // CLÍNICA
    if (plan.mod_historia_clinica) modulos.push({ nombre: 'Historia Clínica', icono: 'fas fa-folder-open', categoria: 'clinica' })
    if (plan.mod_odontograma) modulos.push({ nombre: 'Odontograma', icono: 'fas fa-tooth', categoria: 'clinica' })
    if (plan.mod_archivos_clinicos) modulos.push({ nombre: 'Archivos Clínicos', icono: 'fas fa-file-medical', categoria: 'clinica' })
    if (plan.mod_recetas) modulos.push({ nombre: 'Recetas Médicas', icono: 'fas fa-prescription', categoria: 'clinica' })
    if (plan.mod_consentimientos) modulos.push({ nombre: 'Consentimientos', icono: 'fas fa-file-signature', categoria: 'clinica' })
    if (plan.mod_laboratorio) modulos.push({ nombre: 'Laboratorio Dental', icono: 'fas fa-flask', categoria: 'clinica' })
    
    // FINANZAS
    if (plan.mod_presupuestos) modulos.push({ nombre: 'Presupuestos', icono: 'fas fa-file-invoice-dollar', categoria: 'finanzas' })
    if (plan.mod_facturacion) modulos.push({ nombre: 'Facturación', icono: 'fas fa-receipt', categoria: 'finanzas' })
    if (plan.mod_factura_electronica) modulos.push({ nombre: 'Factura Electrónica SII', icono: 'fas fa-file-invoice', categoria: 'finanzas' })
    if (plan.mod_pagos) modulos.push({ nombre: 'Control de Pagos', icono: 'fas fa-money-check-alt', categoria: 'finanzas' })
    if (plan.mod_caja) modulos.push({ nombre: 'Caja Diaria', icono: 'fas fa-cash-register', categoria: 'finanzas' })
    
    // COMUNICACIÓN
    if (plan.mod_recordatorios_email) modulos.push({ nombre: 'Recordatorios Email', icono: 'fas fa-envelope', categoria: 'comunicacion' })
    if (plan.mod_recordatorios_sms) modulos.push({ nombre: 'Recordatorios SMS', icono: 'fas fa-sms', categoria: 'comunicacion' })
    if (plan.mod_whatsapp) modulos.push({ nombre: 'WhatsApp', icono: 'fab fa-whatsapp', categoria: 'comunicacion' })
    if (plan.mod_email_marketing) modulos.push({ nombre: 'Email Marketing', icono: 'fas fa-bullhorn', categoria: 'comunicacion' })
    
    // REPORTES
    if (plan.mod_reportes_basicos) modulos.push({ nombre: 'Reportes Básicos', icono: 'fas fa-chart-bar', categoria: 'reportes' })
    if (plan.mod_reportes_avanzados) modulos.push({ nombre: 'Reportes Avanzados', icono: 'fas fa-chart-pie', categoria: 'reportes' })
    if (plan.mod_reportes_financieros) modulos.push({ nombre: 'Reportes Financieros', icono: 'fas fa-coins', categoria: 'reportes' })
    if (plan.mod_exportacion) modulos.push({ nombre: 'Exportación de Datos', icono: 'fas fa-download', categoria: 'reportes' })
    
    // INVENTARIO
    if (plan.mod_inventario) modulos.push({ nombre: 'Inventario', icono: 'fas fa-boxes', categoria: 'inventario' })
    if (plan.mod_proveedores) modulos.push({ nombre: 'Proveedores', icono: 'fas fa-truck', categoria: 'inventario' })
    if (plan.mod_ordenes_compra) modulos.push({ nombre: 'Órdenes de Compra', icono: 'fas fa-shopping-cart', categoria: 'inventario' })
    
    // AVANZADO
    if (plan.mod_multi_sucursal) modulos.push({ nombre: 'Multi-Sucursal', icono: 'fas fa-building', categoria: 'avanzado' })
    if (plan.mod_telemedicina) modulos.push({ nombre: 'Telemedicina', icono: 'fas fa-video', categoria: 'avanzado' })
    if (plan.mod_api) modulos.push({ nombre: 'Acceso API', icono: 'fas fa-code', categoria: 'avanzado' })
    if (plan.mod_webhooks) modulos.push({ nombre: 'Webhooks', icono: 'fas fa-exchange-alt', categoria: 'avanzado' })
    
    // PORTAL PACIENTES
    if (plan.portal_activo) {
      const portalModulos = []
      if (plan.portal_perfil) portalModulos.push('Perfil')
      if (plan.portal_citas) portalModulos.push('Mis Citas')
      if (plan.portal_agendar) portalModulos.push('Agendar Citas')
      if (plan.portal_historia) portalModulos.push('Historia Clínica')
      if (plan.portal_pagos) portalModulos.push('Pagos')
      if (plan.portal_documentos) portalModulos.push('Documentos')
      if (plan.portal_recetas) portalModulos.push('Recetas')
      
      if (portalModulos.length > 0) {
        modulos.push({ 
          nombre: `Portal Pacientes (${portalModulos.length})`, 
          icono: 'fas fa-globe', 
          categoria: 'portal',
          submodulos: portalModulos 
        })
      }
    }
    
    return modulos
  })

  // Agrupar módulos por categoría
  const modulosPorCategoria = computed(() => {
    const categorias = {
      core: { nombre: 'Módulos Principales', modulos: [] },
      clinica: { nombre: 'Módulos Clínicos', modulos: [] },
      finanzas: { nombre: 'Módulos Financieros', modulos: [] },
      comunicacion: { nombre: 'Comunicación', modulos: [] },
      reportes: { nombre: 'Reportes y Análisis', modulos: [] },
      inventario: { nombre: 'Inventario y Compras', modulos: [] },
      avanzado: { nombre: 'Funcionalidades Avanzadas', modulos: [] },
      portal: { nombre: 'Portal del Paciente', modulos: [] }
    }
    
    modulosActivos.value.forEach(modulo => {
      if (categorias[modulo.categoria]) {
        categorias[modulo.categoria].modulos.push(modulo)
      }
    })
    
    return Object.entries(categorias)
      .filter(([_, cat]) => cat.modulos.length > 0)
      .map(([key, cat]) => ({ key, ...cat }))
  })

  // Calcular porcentaje de uso
  const calcularPorcentaje = (actual, limite) => {
    if (limite === -1 || limite === 0 || limite === null) return 0
    return Math.min(Math.round((actual / limite) * 100), 100)
  }

  // Determinar color del progress bar
  const getProgressColor = (porcentaje) => {
    if (porcentaje >= 90) return 'danger'
    if (porcentaje >= 75) return 'warning'
    return 'success'
  }

  // Recursos formateados
  const recursos = computed(() => {
    if (!suscripcion.value?.uso || !suscripcion.value?.plan) return []
    
    const { uso, plan } = suscripcion.value
    
    return [
      {
        nombre: 'Usuarios',
        icono: 'fas fa-user-friends',
        actual: uso.usuarios || 0,
        limite: plan.max_usuarios || 0,
        porcentaje: calcularPorcentaje(uso.usuarios || 0, plan.max_usuarios || 0)
      },
      {
        nombre: 'Profesionales',
        icono: 'fas fa-user-md',
        actual: uso.profesionales || 0,
        limite: plan.max_profesionales || 0,
        porcentaje: calcularPorcentaje(uso.profesionales || 0, plan.max_profesionales || 0)
      },
      {
        nombre: 'Pacientes',
        icono: 'fas fa-users',
        actual: uso.pacientes || 0,
        limite: plan.max_pacientes || 0,
        porcentaje: calcularPorcentaje(uso.pacientes || 0, plan.max_pacientes || 0)
      },
      {
        nombre: 'Citas este mes',
        icono: 'fas fa-calendar-check',
        actual: uso.citas_mes || 0,
        limite: plan.max_citas_mes || -1,
        porcentaje: calcularPorcentaje(uso.citas_mes || 0, plan.max_citas_mes || -1)
      },
      {
        nombre: 'Almacenamiento',
        icono: 'fas fa-hdd',
        actual: `${uso.almacenamiento_mb || 0} MB`,
        limite: plan.max_almacenamiento_mb ? `${plan.max_almacenamiento_mb} MB` : 'Ilimitado',
        porcentaje: calcularPorcentaje(uso.almacenamiento_mb || 0, plan.max_almacenamiento_mb || 0)
      }
    ]
  })

  // Planes disponibles para upgrade
  const planesUpgrade = computed(() => {
    if (!suscripcion.value?.planes_disponibles || !suscripcion.value?.plan) return []
    
    return suscripcion.value.planes_disponibles.filter(
      p => parseFloat(p.precio_mensual || 0) > parseFloat(suscripcion.value.plan.precio_mensual || 0)
    )
  })

  // Días restantes calculados
  const diasRestantes = computed(() => {
    if (!suscripcion.value?.suscripcion?.fecha_fin) return 0
    
    const fechaFin = new Date(suscripcion.value.suscripcion.fecha_fin)
    const hoy = new Date()
    const diff = fechaFin - hoy
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })

  // Obtener suscripción
  const obtenerSuscripcion = async () => {
    loading.value = true
    try {
      const data = await suscripcionService.getSuscripcion()
      console.log('📦 Datos de suscripción recibidos:', data)
      suscripcion.value = data
    } catch (error) {
      console.error('❌ Error al obtener suscripción:', error)
      suscripcion.value = null
    } finally {
      loading.value = false
    }
  }

  // Hacer upgrade
  const hacerUpgrade = async (planId) => {
    if (!confirm('¿Estás seguro de que deseas actualizar tu plan?')) return
    
    upgrading.value = true
    try {
      const response = await suscripcionService.upgrade(planId)
      alert(response.message || 'Plan actualizado exitosamente')
      await obtenerSuscripcion()
    } catch (error) {
      console.error('Error al hacer upgrade:', error)
      alert(error.message || 'Error al actualizar el plan')
    } finally {
      upgrading.value = false
    }
  }

  // Formatear fecha
  const formatDate = (fecha) => {
    if (!fecha) return '-'
    try {
      return new Date(fecha).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return '-'
    }
  }

  // Formatear moneda
  const formatCurrency = (valor) => {
    try {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(parseFloat(valor) || 0)
    } catch {
      return '$0'
    }
  }

  return {
    suscripcion,
    loading,
    upgrading,
    estadoBadge,
    modulosActivos,
    modulosPorCategoria,
    recursos,
    planesUpgrade,
    diasRestantes,
    obtenerSuscripcion,
    hacerUpgrade,
    calcularPorcentaje,
    getProgressColor,
    formatDate,
    formatCurrency
  }
}
