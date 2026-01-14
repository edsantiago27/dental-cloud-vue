<!-- components/configuracion/DatosGeneralesTab.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">
      <i class="fas fa-building text-blue-600 mr-2"></i>
      Datos Generales de la Clínica
    </h3>

    <form @submit.prevent="handleSubmit">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Nombre de la Clínica -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Clínica *
          </label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Clínica Dental Sonrisa"
          >
        </div>

        <!-- Dirección -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <input
            v-model="form.direccion"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Av. Libertador 1234, Of. 501"
          >
        </div>

        <!-- Ciudad -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ciudad
          </label>
          <input
            v-model="form.ciudad"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Santiago"
          >
        </div>

        <!-- Región -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Región
          </label>
          <select
            v-model="form.region"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar región</option>
            <option
              v-for="region in configuracionStore.REGIONES"
              :key="region"
              :value="region"
            >
              {{ region }}
            </option>
          </select>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            v-model="form.telefono"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: +56 2 1234 5678"
          >
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: contacto@clinica.cl"
          >
        </div>

        <!-- Sitio Web -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Sitio Web
          </label>
          <input
            v-model="form.sitio_web"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: https://www.clinica.cl"
          >
        </div>

      </div>

      <!-- Botones -->
      <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="handleReset"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <i v-else class="fas fa-save mr-2"></i>
          {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfiguracionStore } from '@clinica/stores/configuracion'
import { useNotification } from '@/composables/useNotification'

const configuracionStore = useConfiguracionStore()
const notify = useNotification()

const loading = ref(false)

const form = ref({
  nombre: '',
  direccion: '',
  ciudad: '',
  region: '',
  telefono: '',
  email: '',
  sitio_web: ''
})

// Cargar datos actuales cuando cambia la configuración
watch(() => configuracionStore.configuracion, (config) => {
  form.value = {
    nombre: config.nombre || '',
    direccion: config.direccion || '',
    ciudad: config.ciudad || '',
    region: config.region || '',
    telefono: config.telefono || '',
    email: config.email || '',
    sitio_web: config.sitio_web || ''
  }
}, { immediate: true })

async function handleSubmit() {
  loading.value = true

  try {
    const result = await configuracionStore.updateGeneral(form.value)
    
    if (result.success) {
      notify.success('Datos generales actualizados correctamente', 'Guardado')
    } else {
      notify.error(result.message || 'Error al actualizar datos generales')
    }

    if (result.errors) {
      Object.keys(result.errors).forEach(field => {
        notify.error(result.errors[field][0], `Error en ${field}`)
      })
    }

  } catch (error) {
    console.error('Error al guardar:', error)
    notify.error('Error inesperado al guardar')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  // Recargar datos originales
  form.value = {
    nombre: configuracionStore.configuracion.nombre || '',
    direccion: configuracionStore.configuracion.direccion || '',
    ciudad: configuracionStore.configuracion.ciudad || '',
    region: configuracionStore.configuracion.region || '',
    telefono: configuracionStore.configuracion.telefono || '',
    email: configuracionStore.configuracion.email || '',
    sitio_web: configuracionStore.configuracion.sitio_web || ''
  }
}
</script>