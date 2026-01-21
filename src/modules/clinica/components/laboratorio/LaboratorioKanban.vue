<template>
  <div class="flex h-full gap-4 overflow-x-auto p-4 bg-gray-50 min-h-[600px]">
    <!-- Columnas del Kanban -->
    <div 
      v-for="etapa in etapas" 
      :key="etapa.id"
      class="flex-shrink-0 w-80 flex flex-col bg-gray-100 rounded-lg shadow-sm"
    >
      <!-- Header Columna -->
      <div 
        class="p-3 font-semibold text-white rounded-t-lg flex justify-between items-center"
        :class="etapa.color"
      >
        <span>{{ etapa.label }}</span>
        <span class="bg-white/20 px-2 py-0.5 rounded text-sm">{{ getOrdenesPorEtapa(etapa.id).length }}</span>
      </div>

      <!-- Cuerpo Columna -->
      <div class="flex-1 p-2 overflow-y-auto min-h-[200px] space-y-3">
        <div 
          v-for="orden in getOrdenesPorEtapa(etapa.id)" 
          :key="orden.id"
          class="bg-white p-3 rounded shadow cursor-pointer hover:shadow-md transition-shadow border-l-4"
          :class="getBordeClase(orden)"
        >
          <!-- Contenido Tarjeta -->
          <div class="flex justify-between items-start mb-2">
            <span class="font-bold text-gray-800">#{{ orden.numero_orden }}</span>
            <span class="text-xs text-gray-500">{{ formatearFecha(orden.created_at) }}</span>
          </div>
          
          <div class="mb-2">
            <div class="font-medium text-gray-900">{{ orden.paciente?.nombre }} {{ orden.paciente?.apellido }}</div>
            <div class="text-sm text-blue-600">{{ orden.trabajo_tipo }}</div>
          </div>

          <!-- Asignación Técnico -->
          <div class="mb-3">
             <label class="text-xs text-gray-400 block mb-1">Técnico:</label>
             <select 
               v-model="orden.tecnico_asignado_id"
               @change="asignarTecnico(orden, $event.target.value)"
               class="w-full text-xs p-1 border rounded bg-gray-50 focus:ring-1 focus:ring-blue-500"
             >
               <option :value="null">-- Sin asignar --</option>
               <option v-for="tec in tecnicos" :key="tec.id" :value="tec.id">{{ tec.nombre }}</option>
             </select>
          </div>

          <!-- Acciones Mover Etapa -->
          <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
             <button 
               v-if="etapa.id !== 'pendiente'"
               @click="moverEtapa(orden, getEtapaAnterior(etapa.id))"
               class="text-gray-400 hover:text-gray-600 text-sm"
               title="Mover atrás"
             >
               <i class="fas fa-chevron-left"></i>
             </button>
             
             <span class="text-xs text-gray-400 font-mono">{{ orden.laboratorio?.nombre }}</span>

             <button 
               v-if="etapa.id !== 'terminado'"
               @click="moverEtapa(orden, getEtapaSiguiente(etapa.id))"
               class="text-blue-500 hover:text-blue-700 text-sm font-bold bg-blue-50 px-2 py-1 rounded"
               title="Mover siguiente"
             >
               Avz <i class="fas fa-chevron-right ml-1"></i>
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  ordenes: {
    type: Array,
    default: () => []
  },
  tecnicos: {
    type: Array,
    default: () => [] // Lista de usuarios con rol/permiso técnico
  }
});

const emit = defineEmits(['update-etapa', 'assign-technician']);

const etapas = [
  { id: 'pendiente', label: 'Cola de Entrada', color: 'bg-gray-500' },
  { id: 'diseno', label: 'En Diseño', color: 'bg-indigo-500' },
  { id: 'produccion', label: 'En Producción (Fresado/Imp)', color: 'bg-blue-600' },
  { id: 'terminado', label: 'Terminado / Control Calidad', color: 'bg-green-600' }
];

const getOrdenesPorEtapa = (etapaId) => {
  // Si no tiene etapa definida, asume pendiente
  return props.ordenes.filter(o => 
    (o.etapa_produccion === etapaId) || (!o.etapa_produccion && etapaId === 'pendiente')
  );
};

const getBordeClase = (orden) => {
   if (!orden.fecha_entrega_prevista) return 'border-gray-200';
   const hoy = new Date();
   const entrega = new Date(orden.fecha_entrega_prevista);
   const diff = (entrega - hoy) / (1000 * 60 * 60 * 24);
   
   if (diff < 0) return 'border-red-500'; // Atrasado
   if (diff <= 2) return 'border-orange-400'; // Urgente
   return 'border-green-400'; // A tiempo
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
};

const getEtapaSiguiente = (actual) => {
  const index = etapas.findIndex(e => e.id === actual);
  if (index >= 0 && index < etapas.length - 1) return etapas[index + 1].id;
  return actual;
};

const getEtapaAnterior = (actual) => {
  const index = etapas.findIndex(e => e.id === actual);
  if (index > 0) return etapas[index - 1].id;
  return actual;
};

const moverEtapa = (orden, nuevaEtapa) => {
  emit('update-etapa', { id: orden.id, etapa: nuevaEtapa });
};

const asignarTecnico = (orden, tecnicoId) => {
  emit('assign-technician', { id: orden.id, tecnicoId: tecnicoId });
};
</script>

<style scoped>
/* Personalización de scrollbar si se desea */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
</style>
