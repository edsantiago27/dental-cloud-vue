<!-- components/citas/CitasCalendar.vue -->
<!-- VERSIÓN 2.0 - ARQUITECTURA ANTI-LOOP -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    
    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      
      <!-- Navegación -->
      <div class="flex items-center gap-2">
        <button
          @click="handlePrev"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          @click="handleToday"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Hoy
        </button>
        <button
          @click="handleNext"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
        <h2 class="ml-4 text-xl font-bold text-gray-800">
          {{ calendarTitle }}
        </h2>
      </div>

      <!-- Vistas -->
      <div class="flex items-center gap-2">
        <button
          @click="changeView('timeGridDay')"
          :class="[
            'px-3 py-2 rounded-lg transition',
            currentView === 'timeGridDay'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          ]"
        >
          Día
        </button>
        <button
          @click="changeView('timeGridWeek')"
          :class="[
            'px-3 py-2 rounded-lg transition',
            currentView === 'timeGridWeek'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          ]"
        >
          Semana
        </button>
        <button
          @click="changeView('dayGridMonth')"
          :class="[
            'px-3 py-2 rounded-lg transition',
            currentView === 'dayGridMonth'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          ]"
        >
          Mes
        </button>
        <button
          @click="changeView('listWeek')"
          :class="[
            'px-3 py-2 rounded-lg transition',
            currentView === 'listWeek'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          ]"
        >
          Lista
        </button>
      </div>

    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando calendario...</p>
    </div>

    <!-- Calendario -->
    <div v-show="!loading" ref="calendarContainer"></div>

    <!-- Leyenda -->
    <div class="mt-6 pt-4 border-t border-gray-200">
      <p class="text-sm font-medium text-gray-700 mb-3">Estados:</p>
      <div class="flex flex-wrap gap-4">
        <div v-for="estado in citasStore.estados" :key="estado.value" class="flex items-center gap-2">
          <div 
            class="w-4 h-4 rounded"
            :style="{ backgroundColor: estado.color }"
          ></div>
          <span class="text-sm text-gray-700">{{ estado.label }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import { useCitasStore } from '@clinica/stores/citas'

const citasStore = useCitasStore()
const emit = defineEmits(['event-click', 'date-click'])

// State
const calendarContainer = ref(null)
const calendar = ref(null)
const calendarTitle = ref('')
const currentView = ref('timeGridWeek')
const loading = ref(false)

// Control de carga
let isLoadingDates = false
let currentDateRange = { start: null, end: null }
let loadTimeout = null

// ==========================================
// FUNCIONES DE EVENTOS
// ==========================================

function handleEventClick(info) {
  emit('event-click', info.event.extendedProps)
}

function handleDateClick(info) {
  emit('date-click', {
    date: info.dateStr,
    allDay: info.allDay
  })
}

function handleDateSelect(info) {
  const fecha = info.startStr.split('T')[0]
  const hora = info.startStr.split('T')[1]?.substring(0, 5) || '09:00'
  
  emit('date-click', {
    date: fecha,
    time: hora
  })
  
  if (calendar.value) {
    calendar.value.unselect()
  }
}

// ==========================================
// FUNCIÓN CRÍTICA: CARGAR CITAS
// ==========================================

async function handleDatesSet(info) {
  // Prevenir múltiples llamadas simultáneas
  if (isLoadingDates) {
    console.log('⏳ Ya cargando, omitiendo datesSet')
    return
  }

  const start = info.startStr.split('T')[0]
  const end = info.endStr.split('T')[0]

  // Prevenir recarga del mismo rango
  if (currentDateRange.start === start && currentDateRange.end === end) {
    console.log('📅 Mismo rango, omitiendo')
    updateTitle()
    return
  }

  // Debounce: esperar 800ms antes de cargar
  clearTimeout(loadTimeout)
  
  loadTimeout = setTimeout(async () => {
    isLoadingDates = true
    currentDateRange = { start, end }
    
    console.log('📅 Cargando citas:', start, 'hasta', end)
    
    try {
      // Cargar del store
      await citasStore.fetchCitas(start, end)
      
      // Actualizar eventos del calendario
      await updateCalendarEvents()
      
      console.log('✅ Eventos actualizados:', citasStore.citas.length)
    } catch (error) {
      console.error('❌ Error al cargar citas:', error)
    } finally {
      isLoadingDates = false
      updateTitle()
    }
  }, 800)
}

// ==========================================
// ACTUALIZAR EVENTOS DEL CALENDARIO
// ==========================================

async function updateCalendarEvents() {
  if (!calendar.value) return

  // Remover todos los eventos actuales
  const allEvents = calendar.value.getEvents()
  allEvents.forEach(event => event.remove())

  // Agregar nuevos eventos
  const eventos = citasStore.citasParaCalendario
  
  if (eventos && eventos.length > 0) {
    eventos.forEach(evento => {
      calendar.value.addEvent(evento)
    })
  }
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function handlePrev() {
  if (calendar.value) {
    calendar.value.prev()
    updateTitle()
  }
}

function handleNext() {
  if (calendar.value) {
    calendar.value.next()
    updateTitle()
  }
}

function handleToday() {
  if (calendar.value) {
    calendar.value.today()
    updateTitle()
  }
}

function changeView(view) {
  if (calendar.value) {
    calendar.value.changeView(view)
    currentView.value = view
    updateTitle()
  }
}

function updateTitle() {
  if (calendar.value) {
    calendarTitle.value = calendar.value.view.title
  }
}

// ==========================================
// INICIALIZACIÓN DEL CALENDARIO
// ==========================================

async function initCalendar() {
  loading.value = true
  
  await nextTick()
  
  if (!calendarContainer.value) {
    console.error('❌ Container no encontrado')
    loading.value = false
    return
  }

  try {
    // Crear instancia del calendario
    calendar.value = new Calendar(calendarContainer.value, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: currentView.value,
      locale: esLocale,
      headerToolbar: false,
      height: 'auto',
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      slotDuration: '00:15:00',
      slotLabelInterval: '01:00',
      allDaySlot: false,
      nowIndicator: true,
      navLinks: true,
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime: '09:00',
        endTime: '18:00'
      },
      // CRÍTICO: Eventos vacíos al inicio
      events: [],
      // Event handlers
      eventClick: handleEventClick,
      dateClick: handleDateClick,
      select: handleDateSelect,
      datesSet: handleDatesSet,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      // CRÍTICO: Sin refetch automático
      eventSources: [],
      loading: function(isLoading) {
        console.log('📊 FullCalendar loading:', isLoading)
      }
    })

    // Renderizar
    calendar.value.render()
    
    updateTitle()
    
    console.log('✅ Calendario inicializado')
    
    loading.value = false
  } catch (error) {
    console.error('❌ Error al inicializar calendario:', error)
    loading.value = false
  }
}

// ==========================================
// MÉTODO PÚBLICO: REFETCH
// ==========================================

async function refetch() {
  if (isLoadingDates) {
    console.log('⏳ Ya cargando, omitiendo refetch')
    return
  }

  console.log('🔄 Refetch manual solicitado')
  
  // Forzar recarga del rango actual
  currentDateRange = { start: null, end: null }
  
  if (calendar.value) {
    const view = calendar.value.view
    const start = view.currentStart.toISOString().split('T')[0]
    const end = view.currentEnd.toISOString().split('T')[0]
    
    await citasStore.fetchCitas(start, end)
    await updateCalendarEvents()
  }
}

// ==========================================
// LIFECYCLE
// ==========================================

onMounted(async () => {
  await initCalendar()
})

onUnmounted(() => {
  if (calendar.value) {
    calendar.value.destroy()
  }
  clearTimeout(loadTimeout)
})

// Exponer métodos
defineExpose({
  refetch,
  getCalendar: () => calendar.value
})
</script>

<style>
/* Estilos personalizados para FullCalendar */
.fc {
  font-family: inherit;
}

.fc .fc-button {
  background-color: #3B82F6;
  border-color: #3B82F6;
}

.fc .fc-button:hover {
  background-color: #2563EB;
  border-color: #2563EB;
}

.fc .fc-button-primary:not(:disabled).fc-button-active {
  background-color: #1D4ED8;
  border-color: #1D4ED8;
}

.fc-theme-standard td,
.fc-theme-standard th {
  border-color: #E5E7EB;
}

.fc-theme-standard .fc-scrollgrid {
  border-color: #E5E7EB;
}

.fc .fc-timegrid-slot {
  height: 2.5em;
}

.fc-event {
  cursor: pointer;
  border: none !important;
  padding: 2px 4px;
}

.fc-event:hover {
  opacity: 0.9;
}

.fc-daygrid-event {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc .fc-list-event:hover td {
  background-color: #F3F4F6;
}
</style>