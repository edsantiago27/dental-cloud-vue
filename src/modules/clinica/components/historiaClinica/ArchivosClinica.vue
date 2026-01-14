<!-- components/historiaClinica/ArchivosClinica.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-gray-800">
          <i class="fas fa-folder-open text-blue-600 mr-2"></i>
          Archivos y Radiografías
        </h3>
        <p class="text-sm text-gray-600 mt-1">Gestión de documentos del paciente</p>
      </div>
      <button
        @click="openUploadModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        <i class="fas fa-upload mr-2"></i>
        Subir Archivo
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
      <button
        v-for="tipo in tiposArchivo"
        :key="tipo.value"
        @click="filtroActivo = tipo.value"
        class="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition"
        :class="filtroActivo === tipo.value 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        <i :class="tipo.icon"></i>
        <span>{{ tipo.label }}</span>
        <span class="px-2 py-0.5 rounded-full text-xs"
              :class="filtroActivo === tipo.value ? 'bg-white text-blue-600' : 'bg-gray-200'">
          {{ contarPorTipo(tipo.value) }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando archivos...</p>
    </div>

    <!-- Sin Archivos -->
    <div v-else-if="archivosFiltrados.length === 0" class="text-center py-12">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-folder-open text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">
        {{ filtroActivo === 'todos' ? 'No hay archivos' : 'No hay archivos de este tipo' }}
      </h3>
      <p class="text-gray-600 mb-4">Sube el primer archivo para comenzar</p>
      <button
        @click="openUploadModal"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        <i class="fas fa-upload mr-2"></i>
        Subir Archivo
      </button>
    </div>

    <!-- Galería de Archivos -->
    <div v-else>
      
      <!-- Estadísticas -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Total Archivos</p>
          <p class="text-2xl font-bold text-blue-600">{{ archivos.length }}</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Radiografías</p>
          <p class="text-2xl font-bold text-purple-600">{{ contarPorCategoria('radiografia') }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Fotografías</p>
          <p class="text-2xl font-bold text-green-600">{{ contarPorCategoria('fotografia') }}</p>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Documentos</p>
          <p class="text-2xl font-bold text-orange-600">{{ contarPorCategoria('documento') }}</p>
        </div>
      </div>

      <!-- Grid de Archivos -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="archivo in archivosFiltrados"
          :key="archivo.id"
          class="relative group cursor-pointer"
          @click="verArchivo(archivo)"
        >
          
          <!-- Card -->
          <div class="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition bg-white">
            
            <!-- Preview/Thumbnail -->
            <div class="aspect-square bg-gray-100 flex items-center justify-center relative">
              
              <!-- Imagen/Thumbnail -->
              <img
                v-if="esImagen(archivo) && archivo.thumbnail"
                :src="getFileUrl(archivo.thumbnail)"
                :alt="archivo.titulo || archivo.nombre_original"
                class="w-full h-full object-cover"
              >
              
              <!-- Icono para documentos -->
              <div v-else class="text-center">
                <i :class="getIconoPorTipo(archivo.tipo)" class="text-5xl text-gray-400"></i>
                <p class="text-xs text-gray-500 mt-2 px-2">{{ archivo.extension.toUpperCase() }}</p>
              </div>

              <!-- Badge de tipo -->
              <div class="absolute top-2 left-2">
                <span class="px-2 py-1 text-xs font-medium text-white rounded"
                      :class="getBgColorPorCategoria(archivo.categoria)">
                  {{ getCategoriaLabel(archivo.categoria) }}
                </span>
              </div>

              <!-- Acciones (hover) -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  @click.stop="descargarArchivo(archivo)"
                  class="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                  title="Descargar"
                >
                  <i class="fas fa-download text-gray-700"></i>
                </button>
                <button
                  @click.stop="eliminarArchivo(archivo)"
                  class="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                  title="Eliminar"
                >
                  <i class="fas fa-trash text-white"></i>
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="p-3">
              <p class="font-medium text-sm text-gray-900 truncate" :title="archivo.titulo || archivo.nombre_original">
                {{ archivo.titulo || archivo.nombre_original }}
              </p>
              <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{{ formatFecha(archivo.created_at) }}</span>
                <span>{{ formatTamano(archivo.tamano) }}</span>
              </div>
              <p v-if="archivo.descripcion" class="text-xs text-gray-600 mt-2 line-clamp-2">
                {{ archivo.descripcion }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Upload -->
    <ArchivoUploadModal
      v-model="showUploadModal"
      :paciente-id="pacienteId"
      @uploaded="handleUploaded"
    />

    <!-- Modal Ver Archivo -->
    <ArchivoViewModal
      v-model="showViewModal"
      :archivo="archivoSeleccionado"
      @download="descargarArchivo"
      @delete="eliminarArchivo"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHistoriaClinicaStore } from '@clinica/stores/historiaClinica'
import { useNotification } from '@/composables/useNotification'
import ArchivoUploadModal from './ArchivoUploadModal.vue'
import ArchivoViewModal from './ArchivoViewModal.vue'

const props = defineProps({
  pacienteId: {
    type: Number,
    required: true
  }
})

const historiaStore = useHistoriaClinicaStore()
const notify = useNotification()

// State
const loading = ref(false)
const archivos = ref([])
const filtroActivo = ref('todos')
const showUploadModal = ref(false)
const showViewModal = ref(false)
const archivoSeleccionado = ref(null)

// Tipos de archivo
const tiposArchivo = [
  { value: 'todos', label: 'Todos', icon: 'fas fa-folder' },
  { value: 'radiografia_panoramica', label: 'Panorámicas', icon: 'fas fa-x-ray' },
  { value: 'radiografia_periapical', label: 'Periapicales', icon: 'fas fa-tooth' },
  { value: 'radiografia_bitewing', label: 'Bitewing', icon: 'fas fa-x-ray' },
  { value: 'fotografia_intraoral', label: 'Fotos Intraorales', icon: 'fas fa-camera' },
  { value: 'fotografia_extraoral', label: 'Fotos Extraorales', icon: 'fas fa-camera' },
  { value: 'documento', label: 'Documentos', icon: 'fas fa-file-alt' },
  { value: 'otro', label: 'Otros', icon: 'fas fa-file' }
]

// Computed
const archivosFiltrados = computed(() => {
  if (filtroActivo.value === 'todos') {
    return archivos.value
  }
  return archivos.value.filter(a => a.tipo === filtroActivo.value)
})

// Methods
async function fetchArchivos() {
  loading.value = true

  try {
    const response = await historiaStore.fetchArchivos(props.pacienteId)
    
    if (response.success) {
      archivos.value = response.data.data || response.data
    }
  } catch (error) {
    notify.error('Error al cargar archivos')
  } finally {
    loading.value = false
  }
}

function openUploadModal() {
  showUploadModal.value = true
}

function verArchivo(archivo) {
  archivoSeleccionado.value = archivo
  showViewModal.value = true
}

async function descargarArchivo(archivo) {
  try {
    // Implementar descarga
    const url = getFileUrl(archivo.ruta)
    window.open(url, '_blank')
  } catch (error) {
    notify.error('Error al descargar archivo')
  }
}

function eliminarArchivo(archivo) {
  notify.confirm(
    `¿Estás segura de eliminar "${archivo.titulo || archivo.nombre_original}"?`,
    async () => {
      const result = await historiaStore.deleteArchivo(props.pacienteId, archivo.id)
      
      if (result.success) {
        archivos.value = archivos.value.filter(a => a.id !== archivo.id)
        notify.success('Archivo eliminado')
        showViewModal.value = false
      } else {
        notify.error('Error al eliminar archivo')
      }
    }
  )
}

function handleUploaded(nuevoArchivo) {
  archivos.value.unshift(nuevoArchivo)
  notify.success('Archivo subido correctamente', 'Éxito')
}

function contarPorTipo(tipo) {
  if (tipo === 'todos') return archivos.value.length
  return archivos.value.filter(a => a.tipo === tipo).length
}

function contarPorCategoria(categoria) {
  return archivos.value.filter(a => a.categoria === categoria).length
}

function esImagen(archivo) {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(archivo.extension.toLowerCase())
}

function getFileUrl(ruta) {
  // Ajustar según tu configuración
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
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTamano(bytes) {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Lifecycle
onMounted(async () => {
  await fetchArchivos()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>