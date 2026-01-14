<!-- components/historiaClinica/ArchivoViewModal.vue -->
<template>
  <!-- Backdrop -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue && archivo"
      class="fixed inset-0 bg-black bg-opacity-75 z-40"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Modal -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="modelValue && archivo"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-1 text-xs font-medium text-white rounded"
                        :class="getBgColorPorCategoria(archivo.categoria)">
                    {{ getCategoriaLabel(archivo.categoria) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ getTipoLabel(archivo.tipo) }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 truncate">
                  {{ archivo.titulo || archivo.nombre_original }}
                </h3>
              </div>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition ml-4"
              >
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>

          <!-- Preview Content -->
          <div class="p-6">
            
            <!-- Preview de Imagen -->
            <div v-if="esImagen(archivo)" class="mb-6 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <img
                :src="getFileUrl(archivo.ruta)"
                :alt="archivo.titulo || archivo.nombre_original"
                class="max-w-full max-h-96 object-contain"
              >
            </div>

            <!-- Icono para no-imágenes -->
            <div v-else class="mb-6 bg-gray-100 rounded-lg p-12 flex flex-col items-center justify-center">
              <i :class="getIconoPorTipo(archivo.tipo)" class="text-7xl text-gray-400 mb-4"></i>
              <p class="text-2xl font-bold text-gray-600 mb-2">{{ archivo.extension.toUpperCase() }}</p>
              <p class="text-gray-500">{{ archivo.mime_type }}</p>
            </div>

            <!-- Información -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <!-- Columna 1 -->
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Nombre Original</p>
                  <p class="text-gray-900">{{ archivo.nombre_original }}</p>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Tamaño</p>
                  <p class="text-gray-900">{{ formatTamano(archivo.tamano) }}</p>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Formato</p>
                  <p class="text-gray-900">{{ archivo.extension.toUpperCase() }}</p>
                </div>
              </div>

              <!-- Columna 2 -->
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Fecha de Subida</p>
                  <p class="text-gray-900">{{ formatFecha(archivo.created_at) }}</p>
                </div>

                <div v-if="archivo.fecha_toma">
                  <p class="text-sm font-medium text-gray-500 mb-1">Fecha de Toma</p>
                  <p class="text-gray-900">{{ formatFecha(archivo.fecha_toma) }}</p>
                </div>

                <div v-if="archivo.subido_por">
                  <p class="text-sm font-medium text-gray-500 mb-1">Subido por</p>
                  <p class="text-gray-900">{{ archivo.subido_por.nombre || 'Sistema' }}</p>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <div v-if="archivo.descripcion" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-500 mb-2">Descripción</p>
              <p class="text-gray-700 whitespace-pre-wrap">{{ archivo.descripcion }}</p>
            </div>

            <!-- Dientes Relacionados -->
            <div v-if="archivo.dientes_relacionados?.length" class="mb-6">
              <p class="text-sm font-medium text-gray-500 mb-2">Dientes Relacionados</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="diente in archivo.dientes_relacionados"
                  :key="diente"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {{ diente }}
                </span>
              </div>
            </div>

          </div>

          <!-- Footer con Actions -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-between">
            <button
              @click="handleDelete"
              class="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <i class="fas fa-trash mr-2"></i>
              Eliminar
            </button>
            <div class="flex items-center gap-3">
              <button
                @click="handleClose"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cerrar
              </button>
              <button
                @click="handleDownload"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <i class="fas fa-download mr-2"></i>
                Descargar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  archivo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'download', 'delete'])

function handleClose() {
  emit('update:modelValue', false)
}

function handleDownload() {
  emit('download', props.archivo)
}

function handleDelete() {
  emit('delete', props.archivo)
}

function esImagen(archivo) {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(archivo.extension.toLowerCase())
}

function getFileUrl(ruta) {
  return `${import.meta.env.VITE_API_URL}/storage/${ruta}`
}

function getIconoPorTipo(tipo) {
  const iconos = {
    radiografia_panoramica: 'fas fa-x-ray',
    radiografia_periapical: 'fas fa-tooth',
    radiografia_bitewing: 'fas fa-x-ray',
    radiografia_oclusal: 'fas fa-x-ray',
    tomografia: 'fas fa-x-ray',
    fotografia_intraoral: 'fas fa-camera',
    fotografia_extraoral: 'fas fa-camera',
    fotografia_antes: 'fas fa-camera',
    fotografia_despues: 'fas fa-camera',
    documento: 'fas fa-file-alt',
    consentimiento: 'fas fa-file-signature',
    receta: 'fas fa-prescription',
    informe: 'fas fa-file-medical',
    otro: 'fas fa-file'
  }
  return iconos[tipo] || 'fas fa-file'
}

function getTipoLabel(tipo) {
  const labels = {
    radiografia_periapical: 'Radiografía Periapical',
    radiografia_panoramica: 'Radiografía Panorámica',
    radiografia_bitewing: 'Radiografía Bitewing',
    radiografia_oclusal: 'Radiografía Oclusal',
    tomografia: 'Tomografía',
    fotografia_intraoral: 'Fotografía Intraoral',
    fotografia_extraoral: 'Fotografía Extraoral',
    fotografia_antes: 'Fotografía Antes',
    fotografia_despues: 'Fotografía Después',
    documento: 'Documento',
    consentimiento: 'Consentimiento Informado',
    receta: 'Receta',
    informe: 'Informe',
    otro: 'Otro'
  }
  return labels[tipo] || tipo
}

function getCategoriaLabel(categoria) {
  const labels = {
    radiografia: 'Radiografía',
    fotografia: 'Fotografía',
    documento: 'Documento',
    otro: 'Otro'
  }
  return labels[categoria] || categoria
}

function getBgColorPorCategoria(categoria) {
  const colors = {
    radiografia: 'bg-purple-600',
    fotografia: 'bg-green-600',
    documento: 'bg-orange-600',
    otro: 'bg-gray-600'
  }
  return colors[categoria] || 'bg-gray-600'
}

function formatFecha(fecha) {
  if (!fecha) return '-'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatTamano(bytes) {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>