<!-- src/views/paciente/Documentos.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Mis Documentos</h1>
      <p class="text-gray-600 mt-1">Accede a tus documentos médicos y administrativos</p>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
      <button
        @click="tabActivo = 'todos'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'todos'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Todos
      </button>
      <button
        @click="tabActivo = 'consentimientos'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'consentimientos'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Consentimientos
      </button>
      <button
        @click="tabActivo = 'presupuestos'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'presupuestos'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Presupuestos
      </button>
      <button
        @click="tabActivo = 'recetas'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'recetas'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Recetas
      </button>
      <button
        @click="tabActivo = 'otros'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'otros'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Otros
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Cargando documentos...</p>
      </div>
    </div>

    <!-- Sin Documentos -->
    <div v-else-if="documentosFiltrados.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        No hay documentos {{ tabActivo !== 'todos' ? 'de este tipo' : '' }}
      </h3>
      <p class="text-gray-600">
        Los documentos generados durante tus consultas aparecerán aquí
      </p>
    </div>

    <!-- Grid de Documentos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div
        v-for="doc in documentosFiltrados"
        :key="doc.id"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
      >
        <!-- Icon Header -->
        <div :class="[
          'h-32 flex items-center justify-center',
          getTipoColor(doc.tipo)
        ]">
          <i :class="getTipoIcon(doc.tipo)" class="text-6xl opacity-80"></i>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-gray-900 line-clamp-2 flex-1">
              {{ doc.nombre }}
            </h3>
            <span :class="[
              'px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0',
              getEstadoClass(doc.estado)
            ]">
              {{ getEstadoLabel(doc.estado) }}
            </span>
          </div>

          <p v-if="doc.descripcion" class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ doc.descripcion }}
          </p>

          <div class="space-y-1 text-xs text-gray-500 mb-4">
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar w-4"></i>
              <span>{{ formatFecha(doc.fecha_emision || doc.created_at) }}</span>
            </div>
            <div v-if="doc.profesional" class="flex items-center gap-2">
              <i class="fas fa-user-md w-4"></i>
              <span>{{ doc.profesional.nombre }} {{ doc.profesional.apellido }}</span>
            </div>
            <div v-if="doc.tamanio" class="flex items-center gap-2">
              <i class="fas fa-file w-4"></i>
              <span>{{ formatTamanio(doc.tamanio) }}</span>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex gap-2">
            <button
              @click="descargarDocumento(doc)"
              class="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <i class="fas fa-download mr-2"></i>
              Descargar
            </button>
            <button
              @click="verDocumento(doc)"
              class="py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Documentos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ documentos.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-file-alt text-2xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Consentimientos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ contarPorTipo('consentimiento') }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-file-signature text-2xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Presupuestos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ contarPorTipo('presupuesto') }}
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-file-invoice-dollar text-2xl text-yellow-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Recetas</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ contarPorTipo('receta') }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-prescription text-2xl text-purple-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Documento -->
    <VerDocumento
      v-if="mostrarModalVer"
      :documento="documentoSeleccionado"
      @close="cerrarModalVer"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VerDocumento from '@paciente/components/VerDocumento.vue'

// State
const documentos = ref([])
const tabActivo = ref('todos')
const loading = ref(false)
const mostrarModalVer = ref(false)
const documentoSeleccionado = ref(null)

// Computed
const documentosFiltrados = computed(() => {
  if (tabActivo.value === 'todos') {
    return documentos.value
  }
  
  const tipoMap = {
    'consentimientos': 'consentimiento',
    'presupuestos': 'presupuesto',
    'recetas': 'receta',
    'otros': 'otro'
  }
  
  const tipo = tipoMap[tabActivo.value]
  return documentos.value.filter(doc => doc.tipo === tipo)
})

// Methods
function formatFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatTamanio(bytes) {
  if (!bytes) return 'N/A'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function getTipoIcon(tipo) {
  const icons = {
    'consentimiento': 'fas fa-file-signature text-white',
    'presupuesto': 'fas fa-file-invoice-dollar text-white',
    'receta': 'fas fa-prescription text-white',
    'radiografia': 'fas fa-x-ray text-white',
    'orden': 'fas fa-file-medical text-white',
    'otro': 'fas fa-file-alt text-white'
  }
  return icons[tipo] || 'fas fa-file text-white'
}

function getTipoColor(tipo) {
  const colors = {
    'consentimiento': 'bg-gradient-to-br from-green-400 to-green-600',
    'presupuesto': 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'receta': 'bg-gradient-to-br from-purple-400 to-purple-600',
    'radiografia': 'bg-gradient-to-br from-blue-400 to-blue-600',
    'orden': 'bg-gradient-to-br from-red-400 to-red-600',
    'otro': 'bg-gradient-to-br from-gray-400 to-gray-600'
  }
  return colors[tipo] || 'bg-gradient-to-br from-gray-400 to-gray-600'
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
    'pendiente': 'Pendiente',
    'vencido': 'Vencido'
  }
  return labels[estado] || estado
}

function contarPorTipo(tipo) {
  return documentos.value.filter(doc => doc.tipo === tipo).length
}

function verDocumento(doc) {
  documentoSeleccionado.value = doc
  mostrarModalVer.value = true
}

function cerrarModalVer() {
  mostrarModalVer.value = false
  documentoSeleccionado.value = null
}

async function descargarDocumento(doc) {
  try {
    // Aquí iría la lógica para descargar el documento
    // Por ahora solo mostramos un alert
    alert(`Descargando: ${doc.nombre}`)
    
    // Ejemplo de implementación:
    // const response = await api.get(`/paciente/documentos/${doc.id}/descargar`, { responseType: 'blob' })
    // const url = window.URL.createObjectURL(new Blob([response.data]))
    // const link = document.createElement('a')
    // link.href = url
    // link.setAttribute('download', doc.nombre)
    // document.body.appendChild(link)
    // link.click()
    // link.remove()
  } catch (err) {
    console.error('Error descargar:', err)
    alert('Error al descargar el documento')
  }
}

async function cargarDocumentos() {
  loading.value = true

  try {
    // Endpoint: GET /paciente/documentos
    // const response = await api.get('/paciente/documentos')
    // if (response.data.success) {
    //   documentos.value = response.data.data
    // }

    // Datos de ejemplo mientras se implementa el endpoint
    documentos.value = [
      {
        id: 1,
        nombre: 'Consentimiento Informado - Extracción',
        tipo: 'consentimiento',
        estado: 'firmado',
        descripcion: 'Consentimiento para extracción de pieza 18',
        fecha_emision: '2025-01-10',
        profesional: { nombre: 'Dr. Juan', apellido: 'Pérez' },
        tamanio: 245000
      },
      {
        id: 2,
        nombre: 'Presupuesto Tratamiento Ortodóncico',
        tipo: 'presupuesto',
        estado: 'pendiente',
        descripcion: 'Presupuesto detallado de tratamiento de ortodoncia',
        fecha_emision: '2025-01-12',
        profesional: { nombre: 'Dra. María', apellido: 'González' },
        tamanio: 180000
      },
      {
        id: 3,
        nombre: 'Receta Antibiótico',
        tipo: 'receta',
        estado: 'firmado',
        descripcion: 'Amoxicilina 500mg',
        fecha_emision: '2025-01-11',
        profesional: { nombre: 'Dr. Juan', apellido: 'Pérez' },
        tamanio: 95000
      }
    ]
  } catch (err) {
    console.error('Error cargar documentos:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  cargarDocumentos()
})
</script>