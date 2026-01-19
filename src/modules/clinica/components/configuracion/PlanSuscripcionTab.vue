<template>
  <div class="plan-suscripcion-tab">
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando información del plan...</p>
    </div>

    <!-- Content -->
    <div v-else-if="suscripcion" class="space-y-6">
      
      <!-- 📌 Plan Actual -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 class="text-white text-xl font-bold flex items-center">
            <i class="fas fa-crown mr-3"></i>
            Plan Actual
          </h3>
        </div>
        
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="text-3xl font-bold text-gray-900">{{ suscripcion.plan.nombre }}</h4>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold uppercase',
                    estadoBadge.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    estadoBadge.color === 'green' ? 'bg-green-100 text-green-700' :
                    estadoBadge.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    estadoBadge.color === 'red' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ estadoBadge.text }}
                </span>
              </div>
              <p class="text-gray-600">{{ suscripcion.plan.descripcion }}</p>
            </div>
            
            <div class="text-right">
              <div class="text-4xl font-bold text-gray-900">
                {{ formatCurrency(suscripcion.plan.preciomensual) }}
              </div>
              <div class="text-sm text-gray-500">por mes</div>
              <div v-if="suscripcion.plan.precioanual" class="mt-1">
                <span class="text-xs text-green-600 font-semibold">
                  {{ formatCurrency(suscripcion.plan.precioanual) }}/año
                </span>
              </div>
            </div>
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <i class="fas fa-calendar-alt text-blue-600 text-xl"></i>
              <div>
                <div class="text-xs text-gray-500 uppercase">Inicio</div>
                <div class="font-semibold text-gray-900">{{ formatDate(suscripcion.suscripcion.fechainicio) }}</div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <i class="fas fa-calendar-check text-green-600 text-xl"></i>
              <div>
                <div class="text-xs text-gray-500 uppercase">Renovación</div>
                <div class="font-semibold text-gray-900">{{ formatDate(suscripcion.suscripcion.fechafin) }}</div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <i class="fas fa-clock text-yellow-600 text-xl"></i>
              <div>
                <div class="text-xs text-gray-500 uppercase">Días restantes</div>
                <div 
                  :class="[
                    'font-bold',
                    suscripcion.suscripcion.diasrestantes < 7 ? 'text-red-600' : 'text-gray-900'
                  ]"
                >
                  {{ suscripcion.suscripcion.diasrestantes }} días
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <i class="fas fa-credit-card text-purple-600 text-xl"></i>
              <div>
                <div class="text-xs text-gray-500 uppercase">Tipo</div>
                <div class="font-semibold text-gray-900 capitalize">{{ suscripcion.suscripcion.tipo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 📊 Uso de Recursos -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h3 class="text-white text-xl font-bold flex items-center">
            <i class="fas fa-chart-pie mr-3"></i>
            Uso de Recursos
          </h3>
          <p class="text-purple-100 text-sm mt-1">Monitorea el consumo de tu plan</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="recurso in recursos" 
              :key="recurso.nombre"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
            >
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                  <i :class="[recurso.icono, 'text-gray-600']"></i>
                  <span class="font-semibold text-gray-900">{{ recurso.nombre }}</span>
                </div>
                <span class="text-sm font-bold text-gray-700">
                  {{ recurso.actual }} / {{ recurso.limite === -1 ? '∞' : recurso.limite }}
                </span>
              </div>
              
              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  :class="[
                    'h-2 rounded-full transition-all duration-300',
                    getProgressColor(recurso.porcentaje) === 'success' ? 'bg-green-500' :
                    getProgressColor(recurso.porcentaje) === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  ]"
                  :style="{ width: `${recurso.porcentaje}%` }"
                ></div>
              </div>
              
              <div class="flex items-center gap-1 text-xs">
                <i 
                  v-if="recurso.porcentaje >= 90" 
                  class="fas fa-exclamation-triangle text-red-500"
                ></i>
                <i 
                  v-else-if="recurso.porcentaje >= 75" 
                  class="fas fa-info-circle text-yellow-500"
                ></i>
                <i 
                  v-else 
                  class="fas fa-check-circle text-green-500"
                ></i>
                <span 
                  :class="[
                    'font-medium',
                    recurso.porcentaje >= 90 ? 'text-red-600' :
                    recurso.porcentaje >= 75 ? 'text-yellow-600' :
                    'text-gray-600'
                  ]"
                >
                  {{ recurso.porcentaje }}% utilizado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🎯 Módulos Activos -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h3 class="text-white text-xl font-bold flex items-center">
            <i class="fas fa-puzzle-piece mr-3"></i>
            Módulos Activos
          </h3>
          <p class="text-green-100 text-sm mt-1">
            {{ modulosPorCategoria.reduce((acc, cat) => acc + cat.modulos.length, 0) }} módulos disponibles
          </p>
        </div>
        
        <div class="p-6 space-y-6">
          <div 
            v-for="categoria in modulosPorCategoria" 
            :key="categoria.key"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-bold text-gray-900">{{ categoria.nombre }}</h4>
              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                {{ categoria.modulos.length }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="modulo in categoria.modulos" 
                :key="modulo.nombre"
                class="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition"
              >
                <i :class="[modulo.icono, 'text-blue-600 text-lg']"></i>
                <div class="flex-1">
                  <div class="font-medium text-gray-900 text-sm">{{ modulo.nombre }}</div>
                  <div v-if="modulo.submodulos" class="flex flex-wrap gap-1 mt-1">
                    <span 
                      v-for="sub in modulo.submodulos" 
                      :key="sub"
                      class="text-xs bg-white px-2 py-0.5 rounded text-gray-600"
                    >
                      {{ sub }}
                    </span>
                  </div>
                </div>
                <i class="fas fa-check-circle text-green-500"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🚀 Planes de Upgrade -->
      <div v-if="planesUpgrade.length > 0" class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
          <h3 class="text-white text-xl font-bold flex items-center">
            <i class="fas fa-rocket mr-3"></i>
            Mejora tu Plan
          </h3>
          <p class="text-orange-100 text-sm mt-1">Desbloquea más funcionalidades</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="plan in planesUpgrade" 
              :key="plan.id"
              :class="[
                'relative rounded-lg border-2 p-6 transition hover:shadow-xl',
                plan.espopular 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-blue-300'
              ]"
            >
              <!-- Popular Badge -->
              <div 
                v-if="plan.espopular" 
                class="absolute -top-3 left-1/2 transform -translate-x-1/2"
              >
                <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <i class="fas fa-star"></i>
                  Más Popular
                </span>
              </div>
              
              <div class="text-center mb-4">
                <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.nombre }}</h4>
                <p class="text-sm text-gray-600 mb-4 min-h-[40px]">{{ plan.descripcion }}</p>
                
                <div class="mb-4">
                  <div class="text-4xl font-bold text-gray-900">
                    {{ formatCurrency(plan.preciomensual) }}
                  </div>
                  <div class="text-sm text-gray-500">por mes</div>
                </div>
              </div>

              <ul class="space-y-2 mb-6 text-sm">
                <li v-if="plan.maxusuarios !== -1" class="flex items-center gap-2">
                  <i class="fas fa-check text-green-600"></i>
                  <span>{{ plan.maxusuarios }} usuarios</span>
                </li>
                <li v-if="plan.maxprofesionales !== -1" class="flex items-center gap-2">
                  <i class="fas fa-check text-green-600"></i>
                  <span>{{ plan.maxprofesionales }} profesionales</span>
                </li>
                <li v-if="plan.maxpacientes !== -1" class="flex items-center gap-2">
                  <i class="fas fa-check text-green-600"></i>
                  <span>{{ plan.maxpacientes }} pacientes</span>
                </li>
                <li v-if="plan.maxcitasmes" class="flex items-center gap-2">
                  <i class="fas fa-check text-green-600"></i>
                  <span>{{ plan.maxcitasmes }} citas/mes</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="fas fa-check text-green-600"></i>
                  <span>{{ (plan.maxalmacenamientomb / 1024).toFixed(1) }} GB almacenamiento</span>
                </li>
                <li v-if="plan.tiposoporte" class="flex items-center gap-2">
                  <i class="fas fa-check text-green-600"></i>
                  <span>Soporte {{ plan.tiposoporte }}</span>
                </li>
              </ul>

              <button 
                @click="hacerUpgrade(plan.id)"
                :disabled="upgrading"
                :class="[
                  'w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2',
                  plan.espopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-900 text-white',
                  upgrading ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <i v-if="upgrading" class="fas fa-spinner fa-spin"></i>
                <span>{{ upgrading ? 'Procesando...' : 'Actualizar Plan' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ℹ️ Información Adicional -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-start gap-4">
          <i class="fas fa-info-circle text-blue-600 text-2xl"></i>
          <div>
            <h4 class="font-bold text-gray-900 mb-2">¿Necesitas ayuda con tu suscripción?</h4>
            <p class="text-gray-700 text-sm mb-3">
              Nuestro equipo de soporte está disponible para resolver todas tus dudas sobre planes, 
              facturación y funcionalidades.
            </p>
            <a 
              href="mailto:soporte@dentalcloud.cl" 
              class="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2"
            >
              <i class="fas fa-envelope"></i>
              soporte@dentalcloud.cl
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <i class="fas fa-exclamation-circle text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-bold text-gray-700 mb-2">No se pudo cargar la información</h3>
      <p class="text-gray-500 mb-6">Por favor, intenta nuevamente más tarde</p>
      <button 
        @click="obtenerSuscripcion" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        <i class="fas fa-redo mr-2"></i>
        Reintentar
      </button>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSuscripcion } from '@/composables/useSuscripcion'

const {
  suscripcion,
  loading,
  upgrading,
  estadoBadge,
  modulosPorCategoria,
  recursos,
  planesUpgrade,
  obtenerSuscripcion,
  hacerUpgrade,
  getProgressColor,
  formatDate,
  formatCurrency
} = useSuscripcion()

onMounted(() => {
  obtenerSuscripcion()
})
</script>

<style scoped>
.plan-suscripcion-tab {
  /* Estilos adicionales si es necesario */
}
</style>
