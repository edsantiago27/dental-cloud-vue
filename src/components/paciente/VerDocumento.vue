<!-- src/components/paciente/VerDocumento.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div class="flex-1">
          <h2 class="text-xl font-bold text-gray-900">{{ documento.nombre }}</h2>
          <p class="text-sm text-gray-600 mt-1">
            <i class="fas fa-calendar mr-2"></i>
            {{ formatFecha(documento.fecha_emision || documento.created_at) }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition ml-4"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6">
        
        <!-- Información del Documento -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label class="text-gray-600 block mb-1">Tipo</label>
              <span class="font-medium text-gray-900">
                {{ getTipoLabel(documento.tipo) }}
              </span>
            </div>
            <div>
              <label class="text-gray-600 block mb-1">Estado</label>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getEstadoClass(documento.estado)]">
                {{ getEstadoLabel(documento.estado) }}
              </span>
            </div>
            <div>
              <label class="text-gray-600 block mb-1">Tamaño</label>
              <span class="font-medium text-gray-900">
                {{ formatTamanio(documento.tamanio) }}
              </span>
            </div>
            <div v-if="documento.profesional" class="col-span-2">
              <label class="text-gray-600 block mb-1">Profesional</label>
              <span class="font-medium text-gray-900">
                {{ documento.profesional.nombre }} {{ documento.profesional.apellido }}
              </span>
            </div>
            <div v-if="documento.numero" class="col-span-1">
              <label class="text-gray-600 block mb-1">N° Documento</label>
              <span class="font-mono text-sm text-gray-900">
                {{ documento.numero }}
              </span>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div v-if="documento.descripcion" class="mb-6">
          <h3 class="font-semibold text-gray-900 mb-2">Descripción</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ documento.descripcion }}</p>
        </div>

        <!-- Vista Previa del Documento -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8">
          
          <!-- PDF Viewer -->
          <div v-if="documento.mime_type === 'application/pdf'" class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-file-pdf text-4xl text-red-600"></i>
            </div>
            <p class="text-gray-900 font-medium mb-2">{{ documento.nombre }}</p>
            <p class="text-sm text-gray-600 mb-6">
              Documento PDF - Haz clic en descargar para ver el contenido completo
            </p>
            
            <!-- Nota: Aquí podrías integrar un visor de PDF como PDF.js -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p class="text-sm text-blue-900">
                <i class="fas fa-info-circle mr-2"></i>
                Para visualizar el documento completo, descárgalo o ábrelo en una nueva pestaña.
              </p>
            </div>
          </div>

          <!-- Image Viewer -->
          <div v-else-if="esImagen(documento.mime_type)" class="text-center">
            <img 
              :src="documento.url || '/placeholder-image.png'" 
              :alt="documento.nombre"
              class="max-w-full h-auto rounded-lg shadow-md mx-auto"
              @error="imagenError"
            >
          </div>

          <!-- Word/Excel/Otros -->
          <div v-else class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i :class="getIconoMimeType(documento.mime_type)" class="text-4xl text-blue-600"></i>
            </div>
            <p class="text-gray-900 font-medium mb-2">{{ documento.nombre }}</p>
            <p class="text-sm text-gray-600 mb-6">
              {{ getMimeTypeLabel(documento.mime_type) }}
            </p>
            <p class="text-sm text-gray-500">
              Descarga el archivo para visualizar su contenido
            </p>
          </div>

        </div>

        <!-- Información Adicional -->
        <div v-if="documento.notas" class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="font-semibold text-yellow-900 mb-2">
            <i class="fas fa-sticky-note mr-2"></i>
            Notas Adicionales
          </h3>
          <p class="text-sm text-yellow-800 whitespace-pre-line">{{ documento.notas }}</p>
        </div>

        <!-- Firma Digital -->
        <div v-if="documento.firmado" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-certificate text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-semibold text-green-900">Documento Firmado</h3>
              <p class="text-sm text-green-800 mt-1">
                Firmado digitalmente el {{ formatFecha(documento.fecha_firma) }}
              </p>
              <p v-if="documento.firmado_por" class="text-xs text-green-700 mt-1">
                Por: {{ documento.firmado_por }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div class="flex gap-3">
          <button
            @click="descargar"
            class="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <i class="fas fa-download mr-2"></i>
            Descargar Documento
          </button>
          <button
            v-if="documento.url"
            @click="abrirNuevaPestaña"
            class="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <i class="fas fa-external-link-alt"></i>
          </button>
          <button
            @click="imprimir"
            class="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <i class="fas fa-print"></i>
          </button>
          <button
            @click="compartir"
            class="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  documento: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Methods
function formatFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatTamanio(bytes) {
  if (!bytes) return 'N/A'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function getTipoLabel(tipo) {
  const labels = {
    'consentimiento': 'Consentimiento Informado',
    'presupuesto': 'Presupuesto',
    'receta': 'Receta Médica',
    'radiografia': 'Radiografía',
    'orden': 'Orden de Examen',
    'otro': 'Otro Documento'
  }
  return labels[tipo] || tipo
}

function getEstadoClass(estado) {
  const classes = {
    'firmado': 'bg-green-100 text-green-700',
    'pendiente': 'bg-yellow-100 text-yellow-700',
    'vencido': 'bg-red-100 text-red-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

function getEstadoLabel(estado) {
  const labels = {
    'firmado': 'Firmado',
    'pendiente': 'Pendiente de Firma',
    'vencido': 'Vencido'
  }
  return labels[estado] || estado
}

function esImagen(mimeType) {
  return mimeType && mimeType.startsWith('image/')
}

function getIconoMimeType(mimeType) {
  if (!mimeType) return 'fas fa-file'
  
  if (mimeType.includes('pdf')) return 'fas fa-file-pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'fas fa-file-word'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'fas fa-file-excel'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'fas fa-file-powerpoint'
  if (mimeType.includes('image')) return 'fas fa-file-image'
  
  return 'fas fa-file'
}

function getMimeTypeLabel(mimeType) {
  if (!mimeType) return 'Documento'
  
  if (mimeType.includes('pdf')) return 'Documento PDF'
  if (mimeType.includes('word')) return 'Documento Word'
  if (mimeType.includes('excel')) return 'Hoja de Cálculo Excel'
  if (mimeType.includes('powerpoint')) return 'Presentación PowerPoint'
  
  return 'Archivo ' + mimeType.split('/').pop().toUpperCase()
}

function imagenError(event) {
  event.target.src = '/placeholder-image.png'
}

function descargar() {
  // Implementar descarga
  if (props.documento.url) {
    window.open(props.documento.url, '_blank')
  } else {
    alert('Descargando: ' + props.documento.nombre)
  }
}

function abrirNuevaPestaña() {
  if (props.documento.url) {
    window.open(props.documento.url, '_blank')
  }
}

function imprimir() {
  if (props.documento.url) {
    const ventana = window.open(props.documento.url, '_blank')
    if (ventana) {
      ventana.onload = () => {
        ventana.print()
      }
    }
  } else {
    alert('Función de impresión en desarrollo')
  }
}

function compartir() {
  if (navigator.share && props.documento.url) {
    navigator.share({
      title: props.documento.nombre,
      text: props.documento.descripcion || 'Documento médico',
      url: props.documento.url
    }).catch(err => console.log('Error sharing:', err))
  } else {
    alert('Función de compartir en desarrollo')
  }
}
</script>