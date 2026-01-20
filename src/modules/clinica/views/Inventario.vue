<!-- views/admin/Inventario.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-amber-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-amber-500/20">Módulo Logístico</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Control de Stock Crítico</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Almacén Central
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Gestión de insumos, materiales y suministros clínicos</p>
      </div>

      <div class="flex items-center gap-3">
        <button
            @click="openModal('producto')"
            class="flex items-center gap-3 px-8 py-4 bg-gray-900 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group border border-gray-800"
        >
            <i class="fas fa-plus-circle text-amber-400"></i>
            Nuevo Insumo
        </button>
      </div>
    </div>

    <!-- Inventory KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
       <!-- Stock Alert KPI -->
       <div class="bg-amber-500 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-amber-200">
          <div class="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          <div class="relative z-10 flex flex-col justify-between h-full text-white">
             <div>
                <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-10">Alertas de Reposición</p>
                <h3 class="text-6xl font-black tracking-tighter">{{ inventarioStore.stockBajoCount }}</h3>
                <p class="text-[10px] font-bold uppercase tracking-widest mt-2">Insumos bajo el mínimo</p>
             </div>
             <div class="mt-8 pt-8 border-t border-white/20">
                <button @click="toggleStockBajoFiler" class="text-[8px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all">Ver Críticos</button>
             </div>
          </div>
       </div>

       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:scale-[1.02] transition-all">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Productos</p>
          <div class="flex items-end gap-3 mb-6">
             <h3 class="text-4xl font-black text-gray-900 tracking-tight leading-none">{{ inventarioStore.pagination.total }}</h3>
          </div>
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Catalogados en sistema</p>
       </div>

       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:scale-[1.02] transition-all">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Valor de Almacén</p>
          <div class="flex items-end gap-3 mb-6">
             <h3 class="text-3xl font-black text-gray-900 tracking-tight leading-none">$---</h3>
          </div>
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Estimación por precio compra</p>
       </div>

       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:scale-[1.02] transition-all">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Último Movimiento</p>
          <div class="flex items-end gap-3 mb-2">
             <h3 class="text-xl font-black text-gray-900 tracking-tight leading-none">Hoy</h3>
          </div>
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-4">Hace 2 horas</p>
       </div>
    </div>

    <!-- Inventory Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <div 
        v-for="item in inventarioStore.productos" 
        :key="item.id"
        class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all border-b-4"
        :class="item.stock_actual <= item.stock_minimo ? 'border-b-amber-500' : 'border-b-transparent'"
       >
          <div class="flex items-center justify-between mb-6">
             <span class="px-3 py-1 bg-gray-50 text-[8px] font-black text-gray-500 uppercase tracking-widest rounded-lg">
                {{ item.categoria || 'Sin Categoría' }}
             </span>
             <button @click="openModal('ajuste', item)" class="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                <i class="fas fa-exchange-alt text-[10px]"></i>
             </button>
          </div>

          <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight mb-8 line-clamp-2 min-h-[2.5rem]">{{ item.nombre }}</h3>

          <div class="space-y-6 mt-auto">
             <div class="flex items-center justify-between">
                <div>
                   <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Disponible</p>
                   <p class="text-3xl font-black tracking-tighter" :class="item.stock_actual <= item.stock_minimo ? 'text-amber-600' : 'text-gray-900'">
                    {{ item.stock_actual }} <span class="text-xs text-gray-400 font-bold uppercase ml-1">{{ item.unidad_medida }}</span>
                   </p>
                </div>
                <div class="text-right">
                   <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Mínimo</p>
                   <p class="text-sm font-bold text-gray-500">{{ item.stock_minimo }}</p>
                </div>
             </div>

             <!-- visual stock bar -->
             <div class="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                <div 
                    class="h-full transition-all duration-1000"
                    :class="item.stock_actual <= item.stock_minimo ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg- emerald-500'"
                    :style="{ width: Math.min((item.stock_actual / (item.stock_minimo > 0 ? item.stock_minimo * 3 : 10) * 100), 100) + '%' }"
                ></div>
             </div>
          </div>
       </div>

       <!-- Infinite Empty States -->
       <div v-if="inventarioStore.productos.length === 0" class="col-span-full py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
           <i class="fas fa-boxes text-4xl text-gray-200 mb-6"></i>
           <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest">No hay productos que coincidan con la búsqueda</h4>
           <button @click="openModal('producto')" class="mt-6 text-[9px] font-black text-amber-600 uppercase tracking-[0.3em]">Cargar primer insumo</button>
       </div>
    </div>

    <!-- Modals -->
    <div v-if="activeModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl overflow-hidden">
            <!-- Decorative accent -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <button @click="activeModal = null" class="absolute right-10 top-10 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all z-10 shadow-sm">
                <i class="fas fa-times text-xl"></i>
            </button>

            <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">{{ modalTitle }}</h2>
            
            <!-- Form Producto -->
            <div v-if="activeModal === 'producto'" class="space-y-6">
                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Insumo / Material</label>
                    <input v-model="formProduct.nombre" type="text" placeholder="Ej: Guantes de Látex Talla M" class="w-full px-8 py-5 bg-gray-50 rounded-2xl text-lg font-black outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 border border-transparent transition-all">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                        <select v-model="formProduct.categoria" class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest border-none outline-none">
                            <option value="Consumibles">Consumibles</option>
                            <option value="Instrumental">Instrumental</option>
                            <option value="Limpieza">Limpieza</option>
                            <option value="EPI">EPI (Guantes, Mascarillas)</option>
                            <option value="Materiales Dentales">Materiales Dentales</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Mínimo (Alerta)</label>
                        <input v-model="formProduct.stock_minimo" type="number" class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio Compra</label>
                        <input v-model="formProduct.precio_compra" type="number" class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black outline-none">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Unidad de Medida</label>
                        <input v-model="formProduct.unidad_medida" type="text" placeholder="unidades, cajas, ml..." class="w-full px-6 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none">
                    </div>
                </div>

                <button @click="handleCrearProducto" class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-gray-200">Guardar Producto</button>
            </div>

            <!-- Form Movimiento -->
            <div v-if="activeModal === 'ajuste'" class="space-y-6">
                <div class="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-6 mb-8">
                     <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                        <i class="fas fa-boxes text-xl"></i>
                     </div>
                     <div>
                        <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Producto seleccionado</p>
                        <h4 class="text-sm font-black text-gray-900 uppercase tracking-tight">{{ selectedItem?.nombre }}</h4>
                     </div>
                </div>

                <div class="flex bg-gray-50 p-1.5 rounded-2xl mb-8">
                    <button 
                        v-for="t in ['entrada', 'salida']" 
                        :key="t"
                        @click="formAjuste.tipo = t"
                        class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                        :class="formAjuste.tipo === t ? 'bg-white text-amber-600 shadow-xl' : 'text-gray-400'"
                    >
                        {{ t }} stock
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cantidad</label>
                        <input v-model="formAjuste.cantidad" type="number" class="w-full px-8 py-5 bg-gray-50 rounded-2xl text-2xl font-black outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 border border-transparent transition-all">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Motivo</label>
                        <select v-model="formAjuste.motivo" class="w-full px-6 py-6 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest border-none outline-none">
                            <option value="ajuste">Ajuste de Saldo</option>
                            <option value="compra">Nueva Compra</option>
                            <option value="consumo">Consumo Clínico</option>
                            <option value="devolucion">Devolución</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones (Opcional)</label>
                    <textarea v-model="formAjuste.observaciones" class="w-full px-8 py-5 bg-gray-50 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none border-none resize-none" rows="2"></textarea>
                </div>

                <button @click="handleRegistrarMovimiento" class="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-gray-200">Confirmar Movimiento</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useInventarioStore } from '@clinica/stores/inventario'
import { useNotification } from '@shared/composables/useNotification'

const inventarioStore = useInventarioStore()
const notify = useNotification()

const activeModal = ref(null)
const selectedItem = ref(null)
const stockBajoFilter = ref(false)

const formProduct = ref({
    nombre: '',
    categoria: 'Consumibles',
    stock_minimo: 5,
    precio_compra: 0,
    unidad_medida: 'unidades'
})

const formAjuste = ref({
    tipo: 'entrada',
    cantidad: 1,
    motivo: 'compra',
    observaciones: ''
})

const modalTitle = computed(() => {
    return activeModal.value === 'producto' ? 'Registrar Nuevo Insumo' : 'Ajuste de Inventario'
})

function openModal(type, item = null) {
    activeModal.value = type
    selectedItem.value = item
    if (type === 'producto') {
        formProduct.value = { nombre: '', categoria: 'Consumibles', stock_minimo: 5, precio_compra: 0, unidad_medida: 'unidades' }
    } else {
        formAjuste.value = { tipo: 'entrada', cantidad: 1, motivo: 'compra', observaciones: '' }
    }
}

async function handleCrearProducto() {
    const res = await inventarioStore.crearProducto(formProduct.value)
    if (res.success) {
        notify.success('Producto creado exitosamente')
        activeModal.value = null
    }
}

async function handleRegistrarMovimiento() {
    const res = await inventarioStore.registrarMovimiento({
        producto_id: selectedItem.value.id,
        ...formAjuste.value
    })
    if (res.success) {
        notify.success('Stock actualizado correctamente')
        activeModal.value = null
    }
}

function toggleStockBajoFiler() {
    stockBajoFilter.value = !stockBajoFilter.value
    inventarioStore.fetchProductos({ stock_bajo: stockBajoFilter.value ? 1 : undefined })
}

onMounted(() => {
  inventarioStore.fetchProductos()
  inventarioStore.fetchStockBajo()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
