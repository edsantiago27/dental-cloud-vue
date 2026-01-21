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

      <hr class="my-6 border-gray-100">

      <h4 class="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
         <i class="fas fa-bolt text-amber-500"></i> Facturación Electrónica
      </h4>

      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
         
         <!-- Switch Habilitar -->
         <div class="flex items-center gap-4 mb-6">
            <div class="flex items-center">
                <input 
                  id="facturacion_activa" 
                  type="checkbox" 
                  v-model="form.facturacion_electronica.habilitado"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
            </div>
            <label for="facturacion_activa" class="flex-1 cursor-pointer">
                <span class="block text-sm font-bold text-gray-900">Habilitar Facturación Electrónica</span>
                <span class="block text-xs text-gray-500">Permite emitir documentos tributarios DTE directamente desde el sistema.</span>
            </label>
         </div>

         <div v-if="form.facturacion_electronica.habilitado" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
             <!-- Proveedor -->
             <div>
               <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Proveedor Servicios</label>
               <select 
                 v-model="form.facturacion_electronica.proveedor"
                 class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
               >
                  <option value="simpleapi">SimpleAPI (Recomendado)</option>
                  <option value="sii" disabled>SII Gratuito (Próximamente)</option>
                  <option value="libre_dte" disabled>LibreDTE (Próximamente)</option>
               </select>
             </div>

             <!-- Ambiente -->
             <div>
               <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ambiente</label>
               <select 
                 v-model="form.facturacion_electronica.ambiente"
                 class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
               >
                  <option value="certificacion">Certificación / Pruebas</option>
                  <option value="produccion">Producción</option>
               </select>
             </div>

             <!-- API Key -->
             <div class="md:col-span-2">
               <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">API Key / Token</label>
               <div class="relative">
                   <input 
                     v-model="form.facturacion_electronica.api_key"
                     :type="showKey ? 'text' : 'password'"
                     class="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                     placeholder="Ingrese su llave de API entregada por el proveedor"
                   >
                   <button 
                     type="button"
                     @click="showKey = !showKey"
                     class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                      <i class="fas" :class="showKey ? 'fa-eye-slash' : 'fa-eye'"></i>
                   </button>
               </div>
               <p class="text-xs text-gray-500 mt-2">
                 <i class="fas fa-lock mr-1"></i> Esta llave se almacena de forma segura.
               </p>
             </div>

             <!-- Certificado Digital -->
             <div class="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
               <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Certificado Digital (.pfx / .p12)</label>
               
               <div v-if="form.facturacion_electronica.certificado_path" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <i class="fas fa-certificate text-green-600"></i>
                    <div>
                      <span class="block text-xs font-bold text-green-800">Certificado Cargado</span>
                      <span class="block text-[10px] text-green-600">El sistema ya cuenta con un certificado vigente.</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    @click="triggerFileSelect"
                    class="text-[10px] font-black uppercase text-blue-600 hover:underline"
                  >
                    Actualizar
                  </button>
               </div>

               <div v-else class="mb-4">
                  <button 
                    type="button"
                    @click="triggerFileSelect"
                    class="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <i class="fas fa-upload text-2xl text-gray-300 group-hover:text-blue-500 mb-2"></i>
                    <span class="text-xs font-bold text-gray-400 group-hover:text-blue-700">Seleccionar archivo .pfx o .p12</span>
                  </button>
               </div>

               <input 
                 ref="fileInput"
                 type="file" 
                 class="hidden" 
                 accept=".pfx,.p12"
                 @change="handleFileChange"
               >

               <!-- Password Certificado -->
               <div v-if="certFile" class="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 animate-fade-in">
                  <div class="flex items-center gap-2 mb-3">
                    <i class="fas fa-key text-amber-500"></i>
                    <span class="text-xs font-bold text-amber-900">Archivo seleccionado: {{ certFile.name }}</span>
                  </div>
                  <label class="block text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Contraseña del Certificado</label>
                  <div class="flex gap-2">
                    <input 
                      v-model="certPassword"
                      type="password"
                      class="flex-1 px-4 py-2 bg-white border border-amber-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ingrese la contraseña"
                    >
                    <button 
                      type="button"
                      @click="uploadCert"
                      :disabled="loadingCert"
                      class="px-6 py-2 bg-amber-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50"
                    >
                      {{ loadingCert ? 'Subiendo...' : 'Cargar' }}
                    </button>
                  </div>
                  <p class="text-[9px] text-amber-600 mt-2">Es necesaria para que el sistema pueda firmar los documentos.</p>
               </div>
             </div>
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
const loadingCert = ref(false)
const showKey = ref(false)
const fileInput = ref(null)
const certFile = ref(null)
const certPassword = ref('')

const form = ref({
  rut: '',
  razon_social: '',
  facturacion_electronica: {
      habilitado: false,
      proveedor: 'simpleapi',
      ambiente: 'certificacion',
      api_key: '',
      certificado_path: ''
  }
})

function triggerFileSelect() {
  fileInput.value.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    certFile.value = file
  }
}

async function uploadCert() {
  if (!certFile.value) return
  
  loadingCert.value = true
  try {
    const res = await configuracionStore.uploadCertificado(certFile.value, certPassword.value)
    if (res.success) {
      notify.success('Certificado subido correctamente')
      certFile.value = null
      certPassword.value = ''
    } else {
      notify.error(res.message || 'Error al subir certificado')
    }
  } catch (error) {
    notify.error('Error al subir certificado')
  } finally {
    loadingCert.value = false
  }
}

// Cargar datos actuales
watch(() => configuracionStore.configuracion, (config) => {
  form.value = {
    rut: config.rut || '',
    razon_social: config.razon_social || '',
    facturacion_electronica: config.facturacion_electronica ? { ...config.facturacion_electronica } : {
        habilitado: false,
        proveedor: 'simpleapi',
        ambiente: 'certificacion',
        api_key: '',
        certificado_path: ''
    }
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
  const config = configuracionStore.configuracion;
  form.value = {
    rut: config.rut || '',
    razon_social: config.razon_social || '',
    facturacion_electronica: config.facturacion_electronica ? { ...config.facturacion_electronica } : {
        habilitado: false,
        proveedor: 'simpleapi',
        ambiente: 'certificacion',
        api_key: ''
    }
  }
}
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
</style>