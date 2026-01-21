<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        <i class="fas fa-qrcode text-blue-600 mr-2"></i>
        Acceso Rápido para Pacientes
      </h3>
      <p class="text-gray-500 mb-6 text-sm">
        Comparte este enlace o código QR para que tus pacientes puedan agendar horas fácilmente o registrarse en tu portal.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <!-- Enlaces -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Enlace de Reserva Express (Invitados)</label>
             <div class="flex rounded-md shadow-sm">
              <input 
                type="text" 
                readonly 
                :value="guestUrl" 
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
              >
              <button 
                @click="copyToClipboard(guestUrl)"
                class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <i class="fas fa-copy mr-2"></i> Copiar
              </button>
            </div>
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Enlace al Portal (Registro/Login)</label>
             <div class="flex rounded-md shadow-sm">
              <input 
                type="text" 
                readonly 
                :value="portalUrl" 
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
              >
              <button 
                @click="copyToClipboard(portalUrl)"
                class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <i class="fas fa-copy mr-2"></i> Copiar
              </button>
            </div>
          </div>
        </div>

        <!-- QR Code -->
        <div class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
           <img 
             :src="qrCodeUrl" 
             alt="QR para Reserva" 
             class="w-48 h-48 mb-4 border bg-white p-2 rounded shadow-sm"
           />
           <p class="text-sm font-medium text-gray-700">Escanea para reservar</p>
           <a 
             :href="qrCodeUrl" 
             download="qr-clinica.png" 
             target="_blank"
             class="mt-2 text-blue-600 hover:text-blue-500 text-sm"
           >
             Descargar Imagen
           </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConfiguracionStore } from '@clinica/stores/configuracion'
import { useToast } from 'vue-toastification'

const store = useConfiguracionStore()
const toast = useToast()

const baseUrl = window.location.origin

const guestUrl = computed(() => {
  const slug = store.configuracion.slug || 'mi-clinica'
  return `${baseUrl}/${slug}/reserva-express`
})

const portalUrl = computed(() => {
    const slug = store.configuracion.slug || 'mi-clinica'
    // Asumiendo que esta es la ruta de registro/login
    // En las rutas vi: /paciente/login (sin slug en path, pero el usuario usa login?slug=...)
    // PERO, en el cambio anterior vi que el flujo de guest redirige a `/${clinicaSlug}/paciente/login`
    // Revisar rutas.
    // routes/paciente/index.js: no tiene prefijo /:slug para login.
    // Solo Login.vue lee query param? O hay middleware?
    // Las rutas de paciente en api.php son con slug...
    // En frontend, router/index.js tiene rutas /paciente/...
    // Si queremos rutas por clinica, deberiamos usar el parametro.
    // De momento, usemos el guestUrl como principal marketing.
    
    // Pero si uso slug en URL login:
    return `${baseUrl}/paciente/login?slug=${slug}`
})

const qrCodeUrl = computed(() => {
  const data = encodeURIComponent(guestUrl.value)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}&color=3B82F6&bgcolor=FFFFFF`
})

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Enlace copiado al portapapeles', { timeout: 2000 })
  } catch (err) {
    toast.error('No se pudo copiar el enlace')
  }
}
</script>
