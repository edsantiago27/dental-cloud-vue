<!-- components/configuracion/DatosFiscalesTab.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">
      <i class="fas fa-file-invoice text-blue-600 mr-2"></i>
      Datos Fiscales para Facturación
    </h3>

    <form @submit.prevent="handleSubmit">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- RUT -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            RUT
          </label>
          <input
            v-model="form.rut"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="12.345.678-9"
          >
          <p class="text-xs text-gray-500 mt-1">
            RUT de la empresa o establecimiento
          </p>
        </div>

        <!-- Razón Social -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Razón Social
          </label>
          <input
            v-model="form.razon_social"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Sociedad Dental SpA"
          >
          <p class="text-xs text-gray-500 mt-1">
            Nombre legal de la empresa
          </p>
        </div>

      </div>

      <!-- Info adicional -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <div class="flex gap-3">
          <i class="fas fa-info-circle text-blue-600 mt-1"></i>
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">Información importante:</p>
            <ul class="list-disc list-inside space-y-1 text-xs">
              <li>Estos datos aparecerán en boletas y facturas emitidas</li>
              <li>Asegúrate de que el RUT sea válido</li>
              <li>La razón social debe coincidir con documentos oficiales</li>
            </ul>
          </div>
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
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <i v-else class="fas fa-save mr-2"></i>
          {{ loading ? 'Guardando...' : 'Guardar Datos Fiscales' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfiguracionStore } from '@clinica/stores/configuracion'
import { useNotification } from '@shared/composables/useNotification'

const configuracionStore = useConfiguracionStore()
const notify = useNotification()

const loading = ref(false)

const form = ref({
  rut: '',
  razon_social: ''
})

// Cargar datos actuales
watch(() => configuracionStore.configuracion, (config) => {
  form.value = {
    rut: config.rut || '',
    razon_social: config.razon_social || ''
  }
}, { immediate: true })

async function handleSubmit() {
  loading.value = true

  try {
    const result = await configuracionStore.updateFiscales(form.value)
    
    if (result.success) {
      notify.success('Datos fiscales actualizados correctamente', 'Guardado')
    } else {
      notify.error(result.message || 'Error al actualizar datos fiscales')
    }
  } catch (error) {
    console.error('Error:', error)
    notify.error('Error inesperado al guardar')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  form.value = {
    rut: configuracionStore.configuracion.rut || '',
    razon_social: configuracionStore.configuracion.razon_social || ''
  }
}
</script>