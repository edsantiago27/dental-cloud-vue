<!-- views/superadmin/Configuracion.vue -->
<template>
  <div class="space-y-8 animate-fade-in-up">

    <!-- Header & Tabs -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-4 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
      <nav class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="tabActual = tab.id"
          class="flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="tabActual === tab.id
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
          "
        >
          <i :class="[tab.icon, 'text-xs']"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Contenido Tabs -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none min-h-[500px]">
      
      <!-- Tab: General -->
      <div v-if="tabActual === 'general'" class="space-y-8">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Información General</h3>
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Configuración básica de la marca y soporte</p>
        </div>
        
        <form @submit.prevent="guardarGeneral" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Nombre del Sistema</label>
              <input
                v-model="formGeneral.nombre_sistema"
                type="text"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Email de Soporte</label>
              <input
                v-model="formGeneral.email_soporte"
                type="email"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Teléfono de Soporte</label>
              <input
                v-model="formGeneral.telefono_soporte"
                type="text"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-50 dark:border-white/5">
            <button
              type="submit"
              class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="fas fa-save mr-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Email -->
      <div v-if="tabActual === 'email'" class="space-y-8">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Pasarela de Correo (SMTP)</h3>
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Configuración técnica para el envío de notificaciones</p>
        </div>
        
        <form @submit.prevent="guardarEmail" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">SMTP Host</label>
              <input
                v-model="formEmail.smtp_host"
                type="text"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                placeholder="smtp.gmail.com"
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Puerto</label>
              <input
                v-model.number="formEmail.smtp_port"
                type="number"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Usuario SMTP</label>
              <input
                v-model="formEmail.smtp_user"
                type="text"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Contraseña SMTP</label>
              <input
                v-model="formEmail.smtp_password"
                type="password"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Remitente (Email)</label>
              <input
                v-model="formEmail.from_email"
                type="email"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-50 dark:border-white/5">
            <button
              type="button"
              @click="probarEmail"
              class="px-8 py-4 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all font-black"
            >
              <i class="fas fa-paper-plane mr-2 text-xs"></i> Probar Conexión
            </button>
            <button
              type="submit"
              class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="fas fa-save mr-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Pagos -->
      <div v-if="tabActual === 'pagos'" class="space-y-8">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Pasarelas de Pago</h3>
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Configura cómo reciben pagos las clínicas</p>
        </div>
        
        <form @submit.prevent="guardarPagos" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Pasarela Activa</label>
              <select
                v-model="formPagos.pasarela"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
                <option value="none">Ninguna (Solo Efectivo/Manual)</option>
                <option value="stripe">Stripe</option>
                <option value="transbank">Transbank (Webpay Plus)</option>
                <option value="mercadopago">MercadoPago</option>
                <option value="flow">Flow</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Moneda Base</label>
              <select
                v-model="formPagos.moneda"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
              >
                <option value="CLP">CLP (Peso Chileno)</option>
                <option value="USD">USD (Dólar Americano)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="UF">UF (Unidad de Fomento)</option>
              </select>
            </div>
          </div>

          <!-- Stripe Config -->
          <div v-if="formPagos.pasarela === 'stripe'" class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5 space-y-4">
             <div class="flex items-center gap-3 mb-2">
                <i class="fab fa-stripe text-3xl text-[#635BFF]"></i>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">Credenciales Stripe</h4>
             </div>
             <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Public Key (PK)</label>
                  <input v-model="formPagos.stripe_public_key" type="text" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Secret Key (SK)</label>
                  <input v-model="formPagos.stripe_secret_key" type="password" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
             </div>
          </div>

          <!-- Transbank Config -->
          <div v-if="formPagos.pasarela === 'transbank'" class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5 space-y-4">
             <div class="flex items-center gap-3 mb-2">
                <i class="fas fa-credit-card text-2xl text-[#d9006c]"></i>
                <h4 class="text-sm font-black text-gray-900 dark:text-white">Credenciales Transbank</h4>
             </div>
             <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Código de Comercio</label>
                  <input v-model="formPagos.transbank_commerce_code" type="text" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">API Key Secret</label>
                  <input v-model="formPagos.transbank_api_key" type="password" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
             </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-50 dark:border-white/5">
            <button
              type="submit"
              class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="fas fa-save mr-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Integraciones -->
      <div v-if="tabActual === 'integraciones'" class="space-y-8">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Integraciones Externas</h3>
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Conecta con servicios de terceros</p>
        </div>
        
        <form @submit.prevent="guardarIntegraciones" class="space-y-6">
          
          <!-- WhatsApp -->
          <div class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5 space-y-4">
             <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                    <i class="fab fa-whatsapp text-3xl text-[#25D366]"></i>
                    <div>
                        <h4 class="text-sm font-black text-gray-900 dark:text-white">WhatsApp Business API</h4>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by Meta</p>
                    </div>
                </div>
                <div 
                  @click="formIntegraciones.whatsapp_enabled = !formIntegraciones.whatsapp_enabled"
                  class="w-12 h-6 bg-gray-200 dark:bg-white/10 rounded-full relative transition-colors cursor-pointer" 
                  :class="{ 'bg-[#25D366]': formIntegraciones.whatsapp_enabled }"
                >
                  <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" :class="formIntegraciones.whatsapp_enabled ? 'left-7' : 'left-1'"></div>
                </div>
             </div>
             
             <div v-if="formIntegraciones.whatsapp_enabled" class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-white/10 animate-fade-in-up">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Phone Number ID</label>
                  <input v-model="formIntegraciones.whatsapp_phone_number_id" type="text" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Permanent Access Token</label>
                  <input v-model="formIntegraciones.whatsapp_token" type="password" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
             </div>
          </div>

          <!-- Google Calendar -->
          <div 
             class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5 space-y-4 transition-all"
             :class="{ 'opacity-50 grayscale': !formIntegraciones.google_calendar_enabled, 'opacity-100': formIntegraciones.google_calendar_enabled }"
          >
             <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                    <i class="fab fa-google text-2xl text-gray-900 dark:text-white"></i>
                    <div>
                        <h4 class="text-sm font-black text-gray-900 dark:text-white">Google Calendar</h4>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sincronización bidireccional</p>
                    </div>
                </div>
                <div 
                  @click="formIntegraciones.google_calendar_enabled = !formIntegraciones.google_calendar_enabled"
                  class="w-12 h-6 bg-gray-200 dark:bg-white/10 rounded-full relative transition-colors cursor-pointer" 
                  :class="{ 'bg-violet-600 dark:bg-orange-500': formIntegraciones.google_calendar_enabled }"
                >
                  <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" :class="formIntegraciones.google_calendar_enabled ? 'left-7' : 'left-1'"></div>
                </div>
             </div>
             
             <div v-if="formIntegraciones.google_calendar_enabled" class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-white/10 animate-fade-in-up">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Client ID</label>
                  <input v-model="formIntegraciones.google_client_id" type="text" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Client Secret</label>
                  <input v-model="formIntegraciones.google_client_secret" type="password" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>
             </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-50 dark:border-white/5">
            <button
              type="submit"
              class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="fas fa-save mr-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Facturación -->
      <div v-if="tabActual === 'facturacion'" class="space-y-8">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Ciclos de Facturación</h3>
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Reglas de negocio para cobros y vencimientos</p>
        </div>
        
        <form @submit.prevent="guardarFacturacion" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Días de Vencimiento</label>
              <div class="flex items-center gap-4">
                <input
                  v-model.number="formFacturacion.dias_vencimiento"
                  type="number"
                  min="1"
                  class="w-20 px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-xl text-center text-sm font-black text-gray-900 dark:text-white outline-none"
                >
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Días tras emisión</span>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Recordatorio Preventivo</label>
              <div class="flex items-center gap-4">
                <input
                  v-model.number="formFacturacion.dias_antes_recordatorio"
                  type="number"
                  min="1"
                  class="w-20 px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-xl text-center text-sm font-black text-gray-900 dark:text-white outline-none"
                >
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Días antes</span>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5">
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Día de Generación</label>
              <div class="flex items-center gap-4">
                <input
                  v-model.number="formFacturacion.dia_generacion"
                  type="number"
                  min="1"
                  max="28"
                  class="w-20 px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-xl text-center text-sm font-black text-gray-900 dark:text-white outline-none"
                >
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Día del mes</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div 
              @click="formFacturacion.enviar_recordatorios = !formFacturacion.enviar_recordatorios"
              class="flex items-center gap-5 p-6 bg-white dark:bg-white/5 border-2 rounded-3xl cursor-pointer transition-all"
              :class="formFacturacion.enviar_recordatorios ? 'border-violet-600/50 dark:border-orange-500/50 bg-violet-50/10 dark:bg-orange-500/5' : 'border-gray-50 dark:border-white/5'"
            >
              <div class="w-12 h-12 flex items-center justify-center rounded-2xl" :class="formFacturacion.enviar_recordatorios ? 'bg-violet-600 dark:bg-orange-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'">
                <i class="fas fa-bell"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Recordatorios Automáticos</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Notificar pagos pendientes</p>
              </div>
              <div class="w-12 h-6 bg-gray-200 dark:bg-white/10 rounded-full relative transition-colors" :class="{ 'bg-violet-600 dark:bg-orange-500': formFacturacion.enviar_recordatorios }">
                <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" :class="formFacturacion.enviar_recordatorios ? 'left-7' : 'left-1'"></div>
              </div>
            </div>

            <div 
              @click="formFacturacion.generar_automatico = !formFacturacion.generar_automatico"
              class="flex items-center gap-5 p-6 bg-white dark:bg-white/5 border-2 rounded-3xl cursor-pointer transition-all"
              :class="formFacturacion.generar_automatico ? 'border-violet-600/50 dark:border-orange-500/50 bg-violet-50/10 dark:bg-orange-500/5' : 'border-gray-50 dark:border-white/5'"
            >
              <div class="w-12 h-12 flex items-center justify-center rounded-2xl" :class="formFacturacion.generar_automatico ? 'bg-violet-600 dark:bg-orange-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'">
                <i class="fas fa-magic"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Generación Proactiva</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Emisión masiva recurrente</p>
              </div>
              <div class="w-12 h-6 bg-gray-200 dark:bg-white/10 rounded-full relative transition-colors" :class="{ 'bg-violet-600 dark:bg-orange-500': formFacturacion.generar_automatico }">
                <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" :class="formFacturacion.generar_automatico ? 'left-7' : 'left-1'"></div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-50 dark:border-white/5">
            <button
              type="submit"
              class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="fas fa-save mr-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Notificaciones -->
      <div v-if="tabActual === 'notificaciones'" class="space-y-8">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Eventos del Sistema</h3>
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Alertas internas para el equipo administrativo</p>
        </div>
        
        <form @submit.prevent="guardarNotificaciones" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              @click="formNotificaciones.email_nuevas_clinicas = !formNotificaciones.email_nuevas_clinicas"
              class="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center"
              :class="formNotificaciones.email_nuevas_clinicas ? 'border-violet-600/50 dark:border-orange-500/50' : 'border-transparent'"
            >
              <div class="flex items-center gap-4 text-gray-900 dark:text-white">
                <i class="fas fa-hospital-user text-xl opacity-40"></i>
                <div>
                  <p class="text-xs font-black uppercase tracking-tight">Registro de Clínicas</p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Alertar sobre nuevos partners</p>
                </div>
              </div>
              <div class="w-6 h-6 rounded-lg flex items-center justify-center transition-colors" :class="formNotificaciones.email_nuevas_clinicas ? 'bg-violet-600 dark:bg-orange-500 text-white' : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10'">
                <i v-if="formNotificaciones.email_nuevas_clinicas" class="fas fa-check text-[10px]"></i>
              </div>
            </div>

            <div 
              @click="formNotificaciones.email_pagos_recibidos = !formNotificaciones.email_pagos_recibidos"
              class="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center"
              :class="formNotificaciones.email_pagos_recibidos ? 'border-violet-600/50 dark:border-orange-500/50' : 'border-transparent'"
            >
              <div class="flex items-center gap-4 text-gray-900 dark:text-white">
                <i class="fas fa-coins text-xl opacity-40"></i>
                <div>
                  <p class="text-xs font-black uppercase tracking-tight">Ingresos de Caja</p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Notificar pagos aceptados</p>
                </div>
              </div>
              <div class="w-6 h-6 rounded-lg flex items-center justify-center transition-colors" :class="formNotificaciones.email_pagos_recibidos ? 'bg-violet-600 dark:bg-orange-500 text-white' : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10'">
                <i v-if="formNotificaciones.email_pagos_recibidos" class="fas fa-check text-[10px]"></i>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-1">Webhook URL (Integraciones externas)</label>
            <div class="relative group">
              <i class="fas fa-link absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 group-focus-within:text-violet-600 dark:group-focus-within:text-orange-500 transition-colors"></i>
              <input
                v-model="formNotificaciones.webhook_url"
                type="url"
                class="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
                placeholder="https://tu-servidor.com/webhook"
              >
            </div>
            <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-3 px-1">Endpoint para sincronizar eventos con herramientas de terceros (Zapier, Slack, etc)</p>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-50 dark:border-white/5">
            <button
              type="submit"
              class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="fas fa-save mr-2"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Facturación SII (DTE) -->
      <div v-if="tabActual === 'sii'" class="space-y-8">
        <div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Facturación Electrónica (SimpleAPI)</h3>
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Configuración para emisión de DTEs ante el SII</p>
        </div>
        
        <form @submit.prevent="guardarSii" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             <!-- Credenciales API -->
             <div class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5 space-y-4">
                 <h4 class="text-sm font-black text-gray-900 dark:text-white uppercase">Credenciales SimpleAPI</h4>
                 
                 <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Ambiente</label>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="formSii.simpleapi_env" value="0" class="text-violet-600 focus:ring-violet-500">
                        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Certificación / Pruebas</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="formSii.simpleapi_env" value="1" class="text-violet-600 focus:ring-violet-500">
                        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Producción</span>
                    </label>
                  </div>
                 </div>

                 <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">API Key</label>
                  <input v-model="formSii.simpleapi_key" type="password" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white" placeholder="Token de SimpleAPI">
                 </div>

                 <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">RUT Emisor (Empresa SaaS)</label>
                  <input v-model="formSii.simpleapi_rut_emisor" type="text" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white" placeholder="76.xxx.xxx-x">
                 </div>
             </div>

             <!-- Certificados -->
             <div class="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-transparent dark:border-white/5 space-y-4">
                <h4 class="text-sm font-black text-gray-900 dark:text-white uppercase">Certificados Digitales</h4>
                
                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Archivo PFX (Firma Digital)</label>
                  <input type="file" ref="filePfx" accept=".pfx,.p12" class="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm">
                  <p class="text-[10px] text-gray-400 mt-1">Sube solo si deseas actualizarlo.</p>
                </div>

                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Contraseña PFX</label>
                  <input v-model="formSii.simpleapi_cert_password" type="password" class="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none text-gray-900 dark:text-white">
                </div>

                <hr class="border-gray-200 dark:border-white/10">

                <div>
                  <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">Archivo CAF (Folios SII)</label>
                  <input type="file" ref="fileCaf" accept=".xml" class="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl text-sm">
                  <p class="text-[10px] text-gray-400 mt-1">Archivo XML de folios descargado del SII.</p>
                </div>
             </div>

          </div>

          <div class="flex justify-end pt-6 border-t border-gray-50 dark:border-white/5">
            <button
              type="submit"
              class="px-10 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="fas fa-save mr-2"></i> Guardar Credenciales
            </button>
          </div>
        </form>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdminConfiguracionStore } from '@superadmin/stores/configuracion'

const configuracionStore = useSuperAdminConfiguracionStore()
const tabActual = ref('general')

const tabs = [
  { id: 'general', label: 'General', icon: 'fas fa-cog' },
  { id: 'email', label: 'Email (SMTP)', icon: 'fas fa-envelope' },
  { id: 'pagos', label: 'Pasarelas de Pago', icon: 'fas fa-credit-card' },
  { id: 'integraciones', label: 'Integraciones (API)', icon: 'fas fa-plug' },
  { id: 'facturacion', label: 'Ciclos Facturación', icon: 'fas fa-calendar-alt' },
  { id: 'sii', label: 'Factura Electrónica', icon: 'fas fa-file-invoice-dollar' },
  { id: 'notificaciones', label: 'Notificaciones', icon: 'fas fa-bell' }
]

const formGeneral = ref({})
const formEmail = ref({})
const formPagos = ref({})
const formIntegraciones = ref({})
const formFacturacion = ref({})
const formSii = ref({ simpleapi_env: '0' })
const formNotificaciones = ref({})

const filePfx = ref(null)
const fileCaf = ref(null)

const config = computed(() => configuracionStore.config)

async function guardarGeneral() {
  const result = await configuracionStore.actualizarConfiguracion('general', formGeneral.value)
  if (result.success) alert('Configuración general guardada exitosamente')
}

async function guardarEmail() {
  const result = await configuracionStore.actualizarConfiguracion('email', formEmail.value)
  if (result.success) alert('Configuración de email guardada exitosamente')
}

async function guardarFacturacion() {
  const result = await configuracionStore.actualizarConfiguracion('facturacion', formFacturacion.value)
  if (result.success) alert('Configuración de ciclos guardada exitosamente')
}

async function guardarPagos() {
  const result = await configuracionStore.actualizarConfiguracion('pagos', formPagos.value)
  if (result.success) alert('Configuración de pagos guardada exitosamente')
}

async function guardarIntegraciones() {
  const result = await configuracionStore.actualizarConfiguracion('integraciones', formIntegraciones.value)
  if (result.success) alert('Configuración de integraciones guardada exitosamente')
}

async function guardarNotificaciones() {
  const result = await configuracionStore.actualizarConfiguracion('notificaciones', formNotificaciones.value)
  if (result.success) alert('Configuración de notificaciones guardada exitosamente')
}

async function guardarSii() {
    const formData = new FormData()
    formData.append('simpleapi_key', formSii.value.simpleapi_key || '')
    formData.append('simpleapi_env', formSii.value.simpleapi_env || '0')
    formData.append('simpleapi_rut_emisor', formSii.value.simpleapi_rut_emisor || '')
    formData.append('simpleapi_cert_password', formSii.value.simpleapi_cert_password || '')
    
    if (filePfx.value && filePfx.value.files[0]) {
        formData.append('file_pfx', filePfx.value.files[0])
    }
    
    if (fileCaf.value && fileCaf.value.files[0]) {
        formData.append('file_caf', fileCaf.value.files[0])
    }

    const result = await configuracionStore.guardarFacturacionElectronica(formData)
    if (result.success) {
        alert('Configuración de Facturación Electrónica guardada exitosamente')
    } else {
        alert('Error: ' + result.message)
    }
}

async function probarEmail() {
  const result = await configuracionStore.testEmailConfig()
  if (result.success) alert('Email de prueba enviado correctamente.')
}

onMounted(async () => {
  await configuracionStore.fetchConfiguracion()
  formGeneral.value = { ...config.value.general }
  formEmail.value = { ...config.value.email }
  formPagos.value = { ...config.value.pagos }
  formIntegraciones.value = { ...config.value.integraciones }
  formFacturacion.value = { ...config.value.facturacion }
  formNotificaciones.value = { ...config.value.notificaciones }
  
  if (config.value.simpleapi) {
      formSii.value = { ...config.value.simpleapi }
  }
})
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>