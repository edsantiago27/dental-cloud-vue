<template>
  <transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
              <i class="fas fa-file-import"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">Importar {{ title }}</h3>
              <p class="text-xs text-gray-500">Carga masiva vía CSV</p>
            </div>
          </div>
          <button @click="$emit('update:modelValue', false)" class="text-gray-400 hover:text-gray-600 transition">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <!-- Paso 1: Descargar Plantilla -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center">1</span>
              Descargar Planilla de Ejemplo
            </h4>
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <i class="fas fa-file-csv text-2xl text-green-600"></i>
                <span class="text-xs font-medium text-gray-600">plantilla_importacion.csv</span>
              </div>
              <button 
                @click="downloadTemplate"
                class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition shadow-sm"
              >
                <i class="fas fa-download mr-1"></i> Descargar
              </button>
            </div>
          </div>

          <!-- Paso 2: Subir Archivo -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center">2</span>
              Seleccionar Archivo
            </h4>
            
            <div 
              @click="$refs.fileInput.click()"
              class="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
              :class="file ? 'bg-green-50 border-green-200' : ''"
            >
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept=".csv,.txt"
                @change="handleFileChange"
              >
              
              <template v-if="!file">
                <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <i class="fas fa-cloud-upload-alt text-xl"></i>
                </div>
                <p class="text-sm font-bold text-gray-700">Explorar archivos</p>
                <p class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Formato CSV permitido</p>
              </template>
              
              <template v-else>
                <div class="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                  <i class="fas fa-check text-xl"></i>
                </div>
                <p class="text-sm font-bold text-green-800">{{ file.name }}</p>
                <p class="text-[10px] text-green-600 mt-1 uppercase tracking-widest">{{ (file.size / 1024).toFixed(1) }} KB</p>
                <button @click.stop="file = null" class="mt-3 text-[10px] font-bold text-red-500 hover:underline">Cambiar archivo</button>
              </template>
            </div>
          </div>

          <!-- Errores / Info -->
          <div v-if="results" class="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-6">
            <h5 class="text-xs font-bold text-indigo-900 mb-2 uppercase tracking-wider">Resultados de Importación:</h5>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2 bg-white/50 rounded-lg">
                <span class="block text-gray-500">Procesados</span>
                <span class="block font-bold">{{ results.procesados }}</span>
              </div>
              <div class="p-2 bg-white/50 rounded-lg">
                <span class="block text-green-600 font-medium">Creados</span>
                <span class="block font-bold text-green-700">{{ results.creados }}</span>
              </div>
              <div class="p-2 bg-white/50 rounded-lg" v-if="results.duplicados">
                <span class="block text-amber-600 font-medium">Duplicados</span>
                <span class="block font-bold text-amber-700">{{ results.duplicados }}</span>
              </div>
              <div class="p-2 bg-white/50 rounded-lg" v-if="results.errores">
                <span class="block text-rose-600 font-medium">Errores</span>
                <span class="block font-bold text-rose-700">{{ results.errores }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button 
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition"
          >
            Cancelar
          </button>
          <button 
            @click="uploadFile"
            :disabled="!file || loading"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-upload"></i>
            {{ loading ? 'Importando...' : 'Iniciar Importación' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    required: true,
    validator: (val) => ['pacientes', 'tratamientos'].includes(val)
  },
  title: String
})

const emit = defineEmits(['update:modelValue', 'saved'])
const notify = useNotification()

const file = ref(null)
const loading = ref(false)
const results = ref(null)
const fileInput = ref(null)

function handleFileChange(e) {
  const selected = e.target.files[0]
  if (selected) {
    file.value = selected
    results.value = null
  }
}

function downloadTemplate() {
  let csvContent = "\uFEFF" // UTF-8 BOM
  
  if (props.type === 'pacientes') {
    csvContent += "nombre,apellido,rut,email,telefono\n"
    csvContent += "Juan,Perez,12345678-9,juan@ejemplo.com,+56912345678\n"
    csvContent += "Maria,Gonzalez,87654321-0,maria@ejemplo.com,+56987654321"
  } else {
    csvContent += "nombre,precio,categoria\n"
    csvContent += "Limpieza Dental,35000,Prevencion\n"
    csvContent += "Obturacion Simple,45000,Operatoria"
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `plantilla_${props.type}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function uploadFile() {
  if (!file.value) return

  loading.value = true
  const formData = new FormData()
  formData.append('archivo', file.value)

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost/api'
    const endpoint = `${baseUrl}/${props.type}/importar`
    
    // Configurar axios para usar el token de localStorage si existe
    const token = localStorage.getItem('token')
    
    const response = await axios.post(endpoint, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data.success) {
      results.value = response.data.data
      notify.success(response.data.message)
      emit('saved')
      
      if (results.value.errores === 0) {
        setTimeout(() => emit('update:modelValue', false), 2500)
      }
    }
  } catch (error) {
    console.error('Error importando:', error)
    notify.error('Error al importar archivo', error.response?.data?.message || 'Verifique el formato')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.modal-enter-active .transform, .modal-leave-active .transform { transition: all 0.3s ease; }
.modal-enter-from .transform { opacity: 0; transform: scale(0.9) translateY(20px); }
.modal-leave-to .transform { opacity: 0; transform: scale(0.9) translateY(20px); }
</style>
