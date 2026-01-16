<!-- components/pacientes/FinanzasPacienteModal.vue -->
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
      v-if="modelValue && paciente"
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Modal -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="modelValue && paciente"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 rounded-t-xl flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <i class="fas fa-dollar-sign text-2xl text-purple-600"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">
                    Finanzas de {{ paciente.nombre }} {{ paciente.apellido }}
                  </h3>
                  <p class="text-purple-100 text-sm mt-1">
                    Estado de cuenta y pagos
                  </p>
                </div>
              </div>
              <button
                @click="handleClose"
                class="text-white hover:text-gray-200 transition"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Resumen Rápido -->
          <div class="px-6 py-4 bg-purple-50 border-b border-purple-100 flex-shrink-0">
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-sm text-purple-700 mb-1">Total Pendiente</p>
                <p class="text-2xl font-bold text-purple-900">{{ formatMonto(totalPendiente) }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-green-700 mb-1">Total Pagado</p>
                <p class="text-2xl font-bold text-green-900">{{ formatMonto(totalPagado) }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-700 mb-1">Total Cuentas</p>
                <p class="text-2xl font-bold text-gray-900">{{ cuentas.length }}</p>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="border-b border-gray-200 flex-shrink-0">
            <div class="px-6">
              <nav class="flex gap-4">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'py-4 px-3 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <i :class="tab.icon" class="mr-2"></i>
                  {{ tab.label }}
                  <span
                    v-if="tab.badge"
                    class="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"
                  >
                    {{ tab.badge }}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Content (scrollable) -->
          <div class="flex-1 overflow-y-auto p-6">
            
            <!-- Tab: Cuentas Pendientes -->
            <div v-if="activeTab === 'cuentas'">
              
              <!-- Loading -->
              <div v-if="loading" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
                <p class="text-gray-600">Cargando cuentas...</p>
              </div>

              <!-- Sin cuentas -->
              <div v-else-if="cuentasPendientes.length === 0" class="text-center py-12">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-check-circle text-4xl text-green-600"></i>
                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-2">¡Todo al día!</h4>
                <p class="text-gray-600">Este paciente no tiene cuentas pendientes</p>
              </div>

              <!-- Lista de cuentas -->
              <div v-else class="space-y-4">
                <div
                  v-for="cuenta in cuentasPendientes"
                  :key="cuenta.id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">
                        {{ cuenta.concepto || cuenta.tratamiento?.nombre || 'Cuenta' }}
                      </h4>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ formatDate(cuenta.fecha_cargo || cuenta.created_at) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-purple-900">
                        {{ formatMonto(cuenta.saldo || cuenta.total) }}
                      </p>
                      <span
                        :class="[
                          'inline-block px-2 py-1 rounded text-xs font-medium mt-1',
                          cuenta.estado === 'pendiente'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ cuenta.estado === 'pendiente' ? 'Pendiente' : 'Parcial' }}
                      </span>
                    </div>
                  </div>

                  <!-- Progreso de pago (si es parcial) -->
                  <div v-if="cuenta.estado === 'parcial' && cuenta.total" class="mb-3">
                    <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Pagado: {{ formatMonto(cuenta.monto_pagado || 0) }}</span>
                      <span>Total: {{ formatMonto(cuenta.total) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all"
                        :style="{ width: calcularPorcentajePago(cuenta) + '%' }"
                      ></div>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="flex gap-2">
                    <button
                      @click="abrirModalPago(cuenta)"
                      class="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition"
                    >
                      <i class="fas fa-credit-card mr-2"></i>
                      Pagar
                    </button>
                    <button
                      @click="abrirModalFinanciamiento(cuenta)"
                      class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                    >
                      <i class="fas fa-calculator mr-2"></i>
                      Financiar
                    </button>
                    <button
                      @click="abrirModalExonerar(cuenta)"
                      class="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition"
                    >
                      <i class="fas fa-hand-holding-usd mr-2"></i>
                      Exonerar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Historial de Pagos -->
            <div v-if="activeTab === 'pagos'">
              
              <!-- Loading -->
              <div v-if="loadingPagos" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
                <p class="text-gray-600">Cargando historial...</p>
              </div>

              <!-- Sin pagos -->
              <div v-else-if="pagos.length === 0" class="text-center py-12">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-receipt text-4xl text-gray-400"></i>
                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-2">Sin pagos registrados</h4>
                <p class="text-gray-600">Aún no hay pagos de este paciente</p>
              </div>

              <!-- Lista de pagos -->
              <div v-else class="space-y-3">
                <div
                  v-for="pago in pagos"
                  :key="pago.id"
                  class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-check text-green-600"></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ formatMonto(pago.monto) }}</p>
                        <p class="text-sm text-gray-600">
                          {{ pago.metodo_pago || 'Efectivo' }} • 
                          {{ formatDate(pago.fecha_pago || pago.created_at) }}
                        </p>
                        <p v-if="pago.referencia" class="text-xs text-gray-500 mt-1">
                          Ref: {{ pago.referencia }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-xs text-gray-500">
                        {{ pago.numero_recibo || `#${pago.id}` }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Financiamientos -->
            <div v-if="activeTab === 'financiamientos'">
              
              <!-- Loading -->
              <div v-if="loadingFinanciamientos" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
                <p class="text-gray-600">Cargando financiamientos...</p>
              </div>

              <!-- Sin financiamientos -->
              <div v-else-if="financiamientos.length === 0" class="text-center py-12">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-credit-card text-4xl text-gray-400"></i>
                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-2">Sin financiamientos</h4>
                <p class="text-gray-600">Este paciente no tiene financiamientos activos</p>
              </div>

              <!-- Lista de financiamientos -->
              <div v-else class="space-y-4">
                <div
                  v-for="fin in financiamientos"
                  :key="fin.id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  @click="verDetalleFinanciamiento(fin)"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 flex items-center gap-2">
                        <i class="fas fa-credit-card text-blue-600"></i>
                        Plan de {{ fin.cuotas_totales || fin.numero_cuotas }} Cuotas
                      </h4>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ fin.cuenta?.concepto || 'Financiamiento' }}
                      </p>
                    </div>
                    <div class="text-right">
                      <span
                        :class="[
                          'inline-block px-3 py-1 rounded-full text-xs font-medium',
                          fin.estado === 'activo' || fin.estado === 'vigente'
                            ? 'bg-green-100 text-green-800'
                            : fin.estado === 'completado'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ fin.estado === 'activo' || fin.estado === 'vigente' ? 'Activo' : fin.estado }}
                      </span>
                    </div>
                  </div>

                  <!-- Progreso de cuotas -->
                  <div class="mb-3">
                    <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Cuotas pagadas: {{ fin.cuotas_pagadas || 0 }} / {{ fin.cuotas_totales || fin.numero_cuotas }}</span>
                      <span>Saldo: {{ formatMonto(fin.saldo_pendiente || 0) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full transition-all"
                        :style="{ width: calcularProgresoCuotas(fin) + '%' }"
                      ></div>
                    </div>
                  </div>

                  <!-- Info adicional -->
                  <div class="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p class="text-gray-600">Monto Cuota</p>
                      <p class="font-medium text-gray-900">{{ formatMonto(fin.monto_cuota || 0) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600">Total</p>
                      <p class="font-medium text-gray-900">{{ formatMonto(fin.monto_total || 0) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600">Próximo Venc.</p>
                      <p class="font-medium text-gray-900">{{ formatDate(fin.proxima_fecha_vencimiento) }}</p>
                    </div>
                  </div>

                  <!-- Click para ver detalle -->
                  <div class="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600 text-center">
                    <i class="fas fa-eye mr-2"></i>
                    Click para ver detalle de cuotas
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Registrar Pago -->
            <div v-if="activeTab === 'nuevo-pago'">
              <div class="max-w-2xl mx-auto">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div class="flex items-start gap-3">
                    <i class="fas fa-info-circle text-blue-600 text-xl mt-0.5"></i>
                    <div>
                      <p class="font-medium text-blue-900">Registrar nuevo pago</p>
                      <p class="text-sm text-blue-700 mt-1">
                        Selecciona una cuenta pendiente para registrar un pago
                      </p>
                    </div>
                  </div>
                </div>

                <form @submit.prevent="handleRegistrarPago" class="space-y-4">
                  
                  <!-- Seleccionar Cuenta -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Cuenta a Pagar *
                    </label>
                    <select
                      v-model="formPago.cuenta_id"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Seleccione una cuenta...</option>
                      <option
                        v-for="cuenta in cuentasPendientes"
                        :key="cuenta.id"
                        :value="cuenta.id"
                      >
                        {{ cuenta.concepto || cuenta.tratamiento?.nombre }} - {{ formatMonto(cuenta.saldo || cuenta.total) }}
                      </option>
                    </select>
                  </div>

                  <!-- Monto -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Monto *
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        v-model.number="formPago.monto"
                        type="number"
                        required
                        min="1"
                        step="1"
                        placeholder="0"
                        class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                    </div>
                    <p v-if="cuentaSeleccionada" class="text-xs text-gray-500 mt-1">
                      Saldo de la cuenta: {{ formatMonto(cuentaSeleccionada.saldo || cuentaSeleccionada.total) }}
                    </p>
                  </div>

                  <!-- Método de Pago -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago *
                    </label>
                    <select
                      v-model="formPago.metodo_pago"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta_debito">Tarjeta de Débito</option>
                      <option value="tarjeta_credito">Tarjeta de Crédito</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>

                  <!-- Referencia -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Referencia / Comprobante
                    </label>
                    <input
                      v-model="formPago.referencia"
                      type="text"
                      placeholder="Número de transacción, cheque, etc."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                  </div>

                  <!-- Notas -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Notas
                    </label>
                    <textarea
                      v-model="formPago.notas"
                      rows="2"
                      placeholder="Información adicional sobre el pago..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    ></textarea>
                  </div>

                  <!-- Botones -->
                  <div class="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      @click="limpiarFormPago"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Limpiar
                    </button>
                    <button
                      type="submit"
                      :disabled="guardandoPago"
                      class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
                    >
                      <i v-if="!guardandoPago" class="fas fa-save mr-2"></i>
                      <i v-else class="fas fa-spinner fa-spin mr-2"></i>
                      {{ guardandoPago ? 'Guardando...' : 'Registrar Pago' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-end flex-shrink-0">
            <button
              @click="handleClose"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition"
            >
              Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>

  <!-- Modal Ver Cuenta -->
  <VerCuentaModal
    v-model="showVerCuentaModal"
    :cuenta-id="cuentaSeleccionadaId"
    @updated="handleCuentaActualizada"
  />

  <!-- Modal Registrar Pago desde Cuenta -->
  <RegistrarPagoModal
    v-model="showPagoModal"
    :cuenta="cuentaParaPago"
    @saved="handlePagoRegistrado"
  />

  <!-- Modal Crear Financiamiento -->
  <CrearFinanciamientoModal
    v-model="showFinanciamientoModal"
    :cuenta="cuentaParaFinanciar"
    @saved="handleFinanciamientoCreado"
  />

  <!-- Modal Ver Financiamiento -->
  <VerFinanciamientoModal
    v-model="showVerFinanciamientoModal"
    :financiamiento="financiamientoSeleccionado"
  />

  <!-- Modal Exonerar -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showExonerarModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
      @click.self="cerrarModalExonerar"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 rounded-t-xl">
          <div class="flex items-center gap-3 text-white">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i class="fas fa-hand-holding-usd text-2xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold">Exonerar Cuenta</h3>
              <p class="text-orange-100 text-sm">Perdonar deuda del paciente</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          
          <!-- Warning -->
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div class="flex items-start gap-3">
              <i class="fas fa-exclamation-triangle text-orange-600 text-xl mt-0.5"></i>
              <div>
                <p class="font-medium text-orange-900">¿Está seguro de exonerar esta cuenta?</p>
                <p class="text-sm text-orange-700 mt-1">
                  Esta acción eliminará la deuda del paciente y no podrá deshacerse.
                </p>
              </div>
            </div>
          </div>

          <!-- Datos de la cuenta -->
          <div v-if="cuentaParaExonerar" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">Cuenta a exonerar:</p>
            <p class="text-lg font-bold text-gray-900 mt-1">
              {{ cuentaParaExonerar.concepto || 'Cuenta' }}
            </p>
            <p class="text-2xl font-bold text-orange-600 mt-2">
              {{ formatMonto(cuentaParaExonerar.saldo || cuentaParaExonerar.total) }}
            </p>
          </div>

          <!-- Motivo -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Motivo de la Exoneración <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="motivoExoneracion"
              rows="3"
              required
              placeholder="Explique el motivo de la exoneración (requerido)..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Este motivo quedará registrado en el historial de la cuenta
            </p>
          </div>

          <!-- Botones -->
          <div class="flex gap-3">
            <button
              type="button"
              @click="cerrarModalExonerar"
              :disabled="exonerando"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              @click="confirmarExoneracion"
              :disabled="exonerando || !motivoExoneracion.trim()"
              class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <i v-if="!exonerando" class="fas fa-check mr-2"></i>
              <i v-else class="fas fa-spinner fa-spin mr-2"></i>
              {{ exonerando ? 'Exonerando...' : 'Confirmar Exoneración' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'
import { useNotification } from '@shared/composables/useNotification'
import VerCuentaModal from '@clinica/components/facturacion/VerCuentaModal.vue'
import RegistrarPagoModal from '@clinica/components/facturacion/RegistrarPagoModal.vue'
import CrearFinanciamientoModal from '@clinica/components/facturacion/CrearFinanciamientoModal.vue'
import VerFinanciamientoModal from '@clinica/components/facturacion/VerFinanciamientoModal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  paciente: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const facturacionStore = useFacturacionStore()
const notify = useNotification()

// State
const activeTab = ref('cuentas')
const loading = ref(false)
const loadingPagos = ref(false)
const loadingFinanciamientos = ref(false)
const cuentas = ref([])
const pagos = ref([])
const financiamientos = ref([])

// Modal de Ver Cuenta
const showVerCuentaModal = ref(false)
const cuentaSeleccionadaId = ref(null)

// Modal de Registrar Pago
const showPagoModal = ref(false)
const cuentaParaPago = ref(null)

// Modal de Financiamiento
const showFinanciamientoModal = ref(false)
const cuentaParaFinanciar = ref(null)
const showVerFinanciamientoModal = ref(false)
const financiamientoSeleccionado = ref(null)

// Modal de Exonerar
const showExonerarModal = ref(false)
const cuentaParaExonerar = ref(null)
const motivoExoneracion = ref('')
const exonerando = ref(false)

// Form de nuevo pago
const guardandoPago = ref(false)
const formPago = ref({
  cuenta_id: '',
  monto: null,
  metodo_pago: 'efectivo',
  referencia: '',
  notas: ''
})

// Tabs
const tabs = computed(() => [
  {
    id: 'cuentas',
    label: 'Cuentas Pendientes',
    icon: 'fas fa-file-invoice-dollar',
    badge: cuentasPendientes.value.length || null
  },
  {
    id: 'pagos',
    label: 'Historial de Pagos',
    icon: 'fas fa-receipt',
    badge: null
  },
  {
    id: 'financiamientos',
    label: 'Financiamientos',
    icon: 'fas fa-credit-card',
    badge: financiamientosActivos.value.length || null
  },
  {
    id: 'nuevo-pago',
    label: 'Registrar Pago',
    icon: 'fas fa-plus-circle',
    badge: null
  }
])

// Computed
const cuentasPendientes = computed(() => {
  return cuentas.value.filter(c => c.estado === 'pendiente' || c.estado === 'parcial')
})

const totalPendiente = computed(() => {
  return cuentasPendientes.value.reduce((total, cuenta) => {
    return total + parseFloat(cuenta.saldo || cuenta.total || 0)
  }, 0)
})

const totalPagado = computed(() => {
  return cuentas.value.reduce((total, cuenta) => {
    return total + parseFloat(cuenta.monto_pagado || 0)
  }, 0)
})

const cuentaSeleccionada = computed(() => {
  if (!formPago.value.cuenta_id) return null
  return cuentasPendientes.value.find(c => c.id === formPago.value.cuenta_id)
})

const financiamientosActivos = computed(() => {
  return financiamientos.value.filter(f => f.estado === 'activo' || f.estado === 'vigente')
})

// Methods
async function loadCuentas() {
  loading.value = true
  try {
    const response = await facturacionStore.fetchCuentas({
      paciente_id: props.paciente.id
    })
    
    if (response.success) {
      cuentas.value = response.data.data || response.data || []
      console.log('💰 Cuentas cargadas:', cuentas.value.length)
    }
  } catch (error) {
    console.error('Error al cargar cuentas:', error)
    notify.error('Error al cargar las cuentas del paciente')
  } finally {
    loading.value = false
  }
}

async function loadPagos() {
  loadingPagos.value = true
  try {
    const response = await facturacionStore.fetchPagos({
      paciente_id: props.paciente.id
    })
    
    if (response.success) {
      pagos.value = response.data.data || response.data || []
      console.log('📝 Pagos cargados:', pagos.value.length)
    }
  } catch (error) {
    console.error('Error al cargar pagos:', error)
  } finally {
    loadingPagos.value = false
  }
}

async function loadFinanciamientos() {
  loadingFinanciamientos.value = true
  try {
    const response = await facturacionStore.fetchFinanciamientos({
      paciente_id: props.paciente.id
    })
    
    if (response.success) {
      financiamientos.value = response.data.data || response.data || []
      console.log('💳 Financiamientos cargados:', financiamientos.value.length)
    }
  } catch (error) {
    console.error('Error al cargar financiamientos:', error)
  } finally {
    loadingFinanciamientos.value = false
  }
}

function abrirModalPago(cuenta) {
  cuentaParaPago.value = cuenta
  showPagoModal.value = true
}

function verDetalleCuenta(cuenta) {
  cuentaSeleccionadaId.value = cuenta.id
  showVerCuentaModal.value = true
}

function abrirModalFinanciamiento(cuenta) {
  cuentaParaFinanciar.value = cuenta
  showFinanciamientoModal.value = true
}

function verDetalleFinanciamiento(financiamiento) {
  financiamientoSeleccionado.value = financiamiento
  showVerFinanciamientoModal.value = true
}

function abrirModalExonerar(cuenta) {
  cuentaParaExonerar.value = cuenta
  motivoExoneracion.value = ''
  showExonerarModal.value = true
}

function cerrarModalExonerar() {
  showExonerarModal.value = false
  cuentaParaExonerar.value = null
  motivoExoneracion.value = ''
}

async function confirmarExoneracion() {
  if (!cuentaParaExonerar.value) return
  
  if (!motivoExoneracion.value.trim()) {
    notify.warning('Debe ingresar un motivo para la exoneración')
    return
  }

  exonerando.value = true

  try {
    const response = await facturacionStore.exonerarCuenta(
      cuentaParaExonerar.value.id,
      motivoExoneracion.value
    )

    if (response.success) {
      notify.success('Cuenta exonerada correctamente', 'Exoneración exitosa')
      cerrarModalExonerar()
      
      // Recargar cuentas
      await loadCuentas()
    } else {
      notify.error(response.message || 'Error al exonerar la cuenta')
    }
  } catch (error) {
    notify.error('Error al exonerar la cuenta')
    console.error('Error:', error)
  } finally {
    exonerando.value = false
  }
}

async function handleRegistrarPago() {
  if (!formPago.value.cuenta_id || !formPago.value.monto) {
    notify.warning('Completa todos los campos requeridos')
    return
  }

  guardandoPago.value = true

  try {
    const response = await facturacionStore.registrarPago(formPago.value)

    if (response.success) {
      notify.success('Pago registrado correctamente', 'Pago registrado')
      limpiarFormPago()
      
      // Recargar datos
      await loadCuentas()
      await loadPagos()
      
      // Volver a tab de cuentas
      activeTab.value = 'cuentas'
    } else {
      notify.error(response.message || 'Error al registrar el pago')
    }
  } catch (error) {
    notify.error('Error al registrar el pago')
    console.error('Error:', error)
  } finally {
    guardandoPago.value = false
  }
}

function handlePagoRegistrado() {
  notify.success('Pago registrado correctamente')
  loadCuentas()
  loadPagos()
}

function handleCuentaActualizada() {
  loadCuentas()
}

function handleFinanciamientoCreado() {
  notify.success('Financiamiento creado correctamente')
  loadCuentas()
  loadFinanciamientos()
}

function limpiarFormPago() {
  formPago.value = {
    cuenta_id: '',
    monto: null,
    metodo_pago: 'efectivo',
    referencia: '',
    notas: ''
  }
}

function handleClose() {
  emit('update:modelValue', false)
}

function calcularPorcentajePago(cuenta) {
  if (!cuenta.total || cuenta.total === 0) return 0
  const pagado = parseFloat(cuenta.monto_pagado || 0)
  const total = parseFloat(cuenta.total)
  return Math.min(Math.round((pagado / total) * 100), 100)
}

function calcularProgresoCuotas(financiamiento) {
  if (!financiamiento.cuotas_totales || financiamiento.cuotas_totales === 0) return 0
  const pagadas = parseFloat(financiamiento.cuotas_pagadas || 0)
  const totales = parseFloat(financiamiento.cuotas_totales || financiamiento.numero_cuotas || 0)
  return Math.min(Math.round((pagadas / totales) * 100), 100)
}

function formatMonto(monto) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(monto || 0)
}

function formatDate(date) {
  if (!date) return '-'
  
  const d = new Date(date)
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return d.toLocaleDateString('es-ES', options)
}

// Watch
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    loadCuentas()
    loadPagos()
    loadFinanciamientos()
  }
})

watch(activeTab, (newTab) => {
  if (newTab === 'pagos' && pagos.value.length === 0) {
    loadPagos()
  }
  if (newTab === 'financiamientos' && financiamientos.value.length === 0) {
    loadFinanciamientos()
  }
})
</script>