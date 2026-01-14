<!-- components/historiaClinica/ArchivoUploadModal.vue -->
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
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
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
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                <i class="fas fa-upload mr-2"></i>
                Subir Archivo
              </h3>
              <button
                @click="handleClose"
                :disabled="uploading"
                class="text-white hover:text-gray-200 transition disabled:opacity-50"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <form @submit.prevent="handleSubmit" class="p-6">
            
            <!-- Drag & Drop Zone -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              class="border-2 border-dashed rounded-lg p-8 text-center transition mb-6"
              :class="isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'"
            >
              <input
                ref="fileInput"
                type="file"
                @change="handleFileSelect"
                accept="image/*,.pdf,.doc,.docx"
                class="hidden"
              >
              
              <div v-if="!selectedFile">
                <i class="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
                <p class="text-lg font-medium text-gray-700 mb-2">
                  Arrastra un archivo aquí
                </p>
                <p class="text-sm text-gray-500 mb-4">
                  o haz click para seleccionar
                </p>
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Seleccionar Archivo
                </button>
                <p class="text-xs text-gray-500 mt-4">
                  Formatos: JPG, PNG, PDF, DOC (Max 10MB)
                </p>
              </div>

              <!-- Preview del archivo seleccionado -->
              <div v-else class="flex items-center gap-4 justify-center">
                <!-- Preview de imagen -->
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="Preview"
                  class="w-24 h-24 object-cover rounded"
                >
                <!-- Icono para otros archivos -->
                <div v-else class="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                  <i class="fas fa-file text-4xl text-gray-400"></i>
                </div>

                <div class="text-left flex-1">
                  <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
                  <p class="text-sm text-gray-500">{{ formatTamano(selectedFile.size) }}</p>
                </div>

                <button
                  type="button"
                  @click="clearFile"
                  class="text-red-600 hover:text-red-700"
                >
                  <i class="fas fa-times-circle text-2xl"></i>
                </button>
              </div>
            </div>

            <!-- Progress Bar (cuando sube) -->
            <div v-if="uploading" class="mb-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-700">Subiendo archivo...</span>
                <span class="text-sm font-medium text-blue-600">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Tipo de Archivo -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Archivo <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.tipo"
                required
                :disabled="uploading"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <optgroup label="Radiografías">
                  <option value="radiografia_periapical">Radiografía Periapical</option>
                  <option value="radiografia_panoramica">Radiografía Panorámica</option>
                  <option value="radiografia_bitewing">Radiografía Bitewing</option>
                  <option value="radiografia_oclusal">Radiografía Oclusal</option>
                  <option value="tomografia">Tomografía</option>
                </optgroup>
                <optgroup label="Fotografías">
                  <option value="fotografia_intraoral">Fotografía Intraoral</option>
                  <option value="fotografia_extraoral">Fotografía Extraoral</option>
                  <option value="fotografia_antes">Fotografía Antes</option>
                  <option value="fotografia_despues">Fotografía Después</option>
                </optgroup>
                <optgroup label="Documentos">
                  <option value="documento">Documento</option>
                  <option value="consentimiento">Consentimiento Informado</option>
                  <option value="receta">Receta</option>
                  <option value="informe">Informe</option>
                </optgroup>
                <option value="otro">Otro</option>
              </select>
            </div>

            <!-- Título -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                v-model="form.titulo"
                type="text"
                :disabled="uploading"
                placeholder="Ej: Radiografía panorámica inicial"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <!-- Descripción -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                v-model="form.descripcion"
                rows="3"
                :disabled="uploading"
                placeholder="Descripción o notas sobre el archivo..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Fecha de Toma (opcional) -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Toma (opcional)
              </label>
              <input
                v-model="form.fecha_toma"
                type="date"
                :disabled="uploading"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                :disabled="uploading"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="!selectedFile || !form.tipo || uploading"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <span v-if="!uploading" class="flex items-center gap-2">
                  <i class="fas fa-upload"></i>
                  <span>Subir Archivo</span>
                </span>
                <span v-else class="flex items-center gap-2">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Subiendo...</span>
                </span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import historiaClinicaService from '../services/historiaClinicaService'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  pacienteId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'uploaded'])

// State
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const isDragging = ref(false)

const selectedFile = ref(null)
const previewUrl = ref(null)
const fileInput = ref(null)

const form = ref({
  tipo: '',
  titulo: '',
  descripcion: '',
  fecha_toma: null
})

// Methods
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

function processFile(file) {
  // Validar tamaño (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'El archivo es demasiado grande. Máximo 10MB.'
    return
  }

  selectedFile.value = file
  errorMessage.value = ''

  // Generar preview si es imagen
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    previewUrl.value = null
  }
}

function clearFile() {
  selectedFile.value = null
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  if (!selectedFile.value || !form.value.tipo) {
    errorMessage.value = 'Debes seleccionar un archivo y un tipo'
    return
  }

  uploading.value = true
  uploadProgress.value = 0
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('archivo', selectedFile.value)
    formData.append('tipo', form.value.tipo)
    
    if (form.value.titulo) {
      formData.append('titulo', form.value.titulo)
    }
    if (form.value.descripcion) {
      formData.append('descripcion', form.value.descripcion)
    }
    if (form.value.fecha_toma) {
      formData.append('fecha_toma', form.value.fecha_toma)
    }

    const response = await historiaClinicaService.uploadArchivo(
      props.pacienteId,
      formData,
      (progress) => {
        uploadProgress.value = progress
      }
    )

    if (response.success) {
      emit('uploaded', response.data)
      handleClose()
    } else {
      errorMessage.value = response.message || 'Error al subir archivo'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al subir archivo'
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

function handleClose() {
  if (!uploading.value) {
    emit('update:modelValue', false)
    resetForm()
  }
}

function resetForm() {
  form.value = {
    tipo: '',
    titulo: '',
    descripcion: '',
    fecha_toma: null
  }
  clearFile()
  errorMessage.value = ''
}

function formatTamano(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Watch
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>