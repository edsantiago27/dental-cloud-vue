<!-- components/configuracion/LogoBrandingTab.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Logo de la Clínica -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">
        <i class="fas fa-image text-blue-600 mr-2"></i>
        Logo de la Clínica
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Preview del Logo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Logo Actual
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center bg-gray-50">
            <div v-if="configuracionStore.hasLogo" class="text-center">
              <img 
                :src="configuracionStore.logoUrl" 
                alt="Logo de la clínica"
                class="max-h-32 mx-auto mb-2"
              >
              <p class="text-xs text-gray-500">Logo actual</p>
            </div>
            <div v-else class="text-center text-gray-400">
              <i class="fas fa-image text-4xl mb-2"></i>
              <p class="text-sm">Sin logo configurado</p>
            </div>
          </div>
        </div>

        <!-- Upload de Logo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Subir Nuevo Logo
          </label>
          
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <!-- Preview del nuevo archivo -->
            <div v-if="previewUrl" class="mb-4 text-center">
              <img 
                :src="previewUrl" 
                alt="Preview"
                class="max-h-32 mx-auto mb-2"
              >
              <p class="text-xs text-gray-500">Vista previa</p>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            >
            
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <i class="fas fa-upload mr-2"></i>
              Seleccionar Archivo
            </button>

            <p class="text-xs text-gray-500 mt-2">
              Formatos: JPG, PNG, SVG (máx. 2MB)
            </p>
          </div>

          <!-- Botón Guardar Logo -->
          <button
            v-if="selectedFile"
            @click="handleUploadLogo"
            :disabled="uploadingLogo"
            class="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <i v-if="uploadingLogo" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ uploadingLogo ? 'Subiendo...' : 'Guardar Logo' }}
          </button>
        </div>

      </div>
    </div>

    <!-- Colores de Branding -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">
        <i class="fas fa-palette text-blue-600 mr-2"></i>
        Colores del Sistema
      </h3>

      <form @submit.prevent="handleSubmitBranding">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Color Primario -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Color Primario
            </label>
            <div class="flex gap-3">
              <input
                v-model="formBranding.color_primario"
                type="color"
                class="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
              >
              <input
                v-model="formBranding.color_primario"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#3B82F6"
                pattern="^#[0-9A-Fa-f]{6}$"
              >
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Usado en botones principales, encabezados, etc.
            </p>
          </div>

          <!-- Color Secundario -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario
            </label>
            <div class="flex gap-3">
              <input
                v-model="formBranding.color_secundario"
                type="color"
                class="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
              >
              <input
                v-model="formBranding.color_secundario"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#10B981"
                pattern="^#[0-9A-Fa-f]{6}$"
              >
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Usado para acentos, badges, estados positivos, etc.
            </p>
          </div>

        </div>

        <!-- Preview de Colores -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-700 mb-3">Vista Previa:</p>
          <div class="flex gap-4">
            <button
              type="button"
              :style="{ backgroundColor: formBranding.color_primario }"
              class="px-6 py-2 text-white rounded-lg"
            >
              Botón Primario
            </button>
            <button
              type="button"
              :style="{ backgroundColor: formBranding.color_secundario }"
              class="px-6 py-2 text-white rounded-lg"
            >
              Botón Secundario
            </button>
            <span
              :style="{ 
                backgroundColor: formBranding.color_primario + '20',
                color: formBranding.color_primario
              }"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              Badge
            </span>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleResetBranding"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Restaurar
          </button>
          <button
            type="submit"
            :disabled="loadingBranding"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <i v-if="loadingBranding" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ loadingBranding ? 'Guardando...' : 'Guardar Colores' }}
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfiguracionStore } from '../stores/configuracion'
import { useNotification } from '@/composables/useNotification'

const configuracionStore = useConfiguracionStore()
const notify = useNotification()

const uploadingLogo = ref(false)
const loadingBranding = ref(false)

const selectedFile = ref(null)
const previewUrl = ref(null)

const formBranding = ref({
  color_primario: '#3B82F6',
  color_secundario: '#10B981'
})

// Cargar colores actuales
watch(() => configuracionStore.configuracion, (config) => {
  formBranding.value = {
    color_primario: config.color_primario || '#3B82F6',
    color_secundario: config.color_secundario || '#10B981'
  }
}, { immediate: true })

function handleFileSelect(event) {
  const file = event.target.files[0]
  
  if (!file) return

  // Validar tamaño (2MB)
  if (file.size > 2 * 1024 * 1024) {
    notify.error('El archivo es muy grande. Máximo 2MB.')
    return
  }

  // Validar tipo
  if (!file.type.startsWith('image/')) {
    notify.error('Solo se permiten imágenes.')
    return
  }

  selectedFile.value = file

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

async function handleUploadLogo() {
  if (!selectedFile.value) return

  uploadingLogo.value = true

  try {
    const result = await configuracionStore.updateLogo(selectedFile.value)
    
    if (result.success) {
      notify.success('Logo actualizado correctamente', 'Guardado')
      selectedFile.value = null
      previewUrl.value = null
    } else {
      notify.error(result.message || 'Error al subir logo')
    }

  } catch (error) {
    console.error('Error al subir logo:', error)
    notify.error('Error inesperado al subir logo')
  } finally {
    uploadingLogo.value = false
  }
}

async function handleSubmitBranding() {
  loadingBranding.value = true

  try {
    const result = await configuracionStore.updateBranding(formBranding.value)
    
    if (result.success) {
      notify.success('Colores actualizados correctamente', 'Guardado')
    } else {
      notify.error(result.message || 'Error al actualizar colores')
    }

  } catch (error) {
    console.error('Error al guardar:', error)
    notify.error('Error inesperado al guardar')
  } finally {
    loadingBranding.value = false
  }
}

function handleResetBranding() {
  formBranding.value = {
    color_primario: configuracionStore.configuracion.color_primario || '#3B82F6',
    color_secundario: configuracionStore.configuracion.color_secundario || '#10B981'
  }
}
</script>