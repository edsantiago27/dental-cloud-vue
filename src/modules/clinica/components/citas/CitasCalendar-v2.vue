<!-- components/citas/CitasCalendar.vue -->
<!-- VERSIÓN 2.0 - ARQUITECTURA ANTI-LOOP - BENTO REDESIGN -->
<template>
  <div class="bg-transparent h-full flex flex-col">
    
    <!-- Toolbar Custom Bento -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
      
      <!-- Navegación Premium -->
      <div class="flex items-center gap-2 bg-gray-50 p-1.5 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <button
          @click="handlePrev"
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-500 hover:text-violet-600"
        >
          <i class="fas fa-chevron-left text-[10px]"></i>
        </button>
        <button
          @click="handleToday"
          class="px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:shadow-md transition-all text-gray-900"
        >
          Hoy
        </button>
        <button
          @click="handleNext"
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-500 hover:text-violet-600"
        >
          <i class="fas fa-chevron-right text-[10px]"></i>
        </button>
      </div>

      <!-- Título de Fecha -->
      <h2 class="text-xs font-black text-gray-900 uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-2xl border border-gray-50 shadow-sm">
        {{ calendarTitle }}
      </h2>

      <!-- Vistas Compactas -->
      <div class="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
        <button
          v-for="view in ['timeGridDay', 'timeGridWeek', 'dayGridMonth', 'listWeek']"
          :key="view"
          @click="changeView(view)"
          :class="[
            'px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all',
            currentView === view
              ? 'bg-white text-violet-600 shadow-md translate-y-[-1px]'
              : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
          ]"
        >
          {{ viewLabels[view] }}
        </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-6"></div>
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Agenda...</p>
    </div>

    <!-- Calendario Full -->
    <div v-show="!loading" class="flex-1 relative">
      <div ref="calendarContainer" class="calendar-premium-wrapper"></div>
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
const emit = defineEmits(['event-click', 'date-click', 'event-update'])

const calendarContainer = ref(null)
const calendar = ref(null)
const calendarTitle = ref('')
const currentView = ref('timeGridWeek')
const loading = ref(false)

const viewLabels = {
  timeGridDay: 'Día',
  timeGridWeek: 'Semana',
  dayGridMonth: 'Mes',
  listWeek: 'Lista'
}

let isLoadingDates = false
let currentDateRange = { start: null, end: null }
let loadTimeout = null

function handleEventClick(info) { emit('event-click', info.event.extendedProps) }
function handleDateClick(info) { emit('date-click', { date: info.dateStr, allDay: info.allDay }) }
function handleDateSelect(info) {
  const fecha = info.startStr.split('T')[0]
  const hora = info.startStr.split('T')[1]?.substring(0, 5) || '09:00'
  emit('date-click', { date: fecha, time: hora })
  if (calendar.value) calendar.value.unselect()
}

function handleEventDrop(info) {
  const { event } = info
  const start = event.start
  const end = event.end
  const nuevaFecha = start.toISOString().split('T')[0]
  const nuevaHora = start.toTimeString().substring(0, 5)
  let duracionMinutos = 30
  if (end) duracionMinutos = Math.round((end - start) / (1000 * 60))
  emit('event-update', { id: event.id, fecha: nuevaFecha, hora: nuevaHora, duracion_minutos: duracionMinutos })
}

function handleEventResize(info) {
  const { event } = info
  if (!event.end) return
  const duracionMinutos = Math.round((event.end - event.start) / (1000 * 60))
  emit('event-update', { id: event.id, duracion_minutos: duracionMinutos })
}

async function handleDatesSet(info) {
  if (isLoadingDates) return
  const start = info.startStr.split('T')[0]
  const end = info.endStr.split('T')[0]
  if (currentDateRange.start === start && currentDateRange.end === end) { updateTitle(); return }
  clearTimeout(loadTimeout)
  loadTimeout = setTimeout(async () => {
    isLoadingDates = true
    currentDateRange = { start, end }
    try {
      await citasStore.fetchCitas(start, end)
      await updateCalendarEvents()
    } finally {
      isLoadingDates = false
      updateTitle()
    }
  }, 800)
}

async function updateCalendarEvents() {
  if (!calendar.value) return
  calendar.value.getEvents().forEach(event => event.remove())
  const eventos = citasStore.citasParaCalendario
  if (eventos) eventos.forEach(evento => calendar.value.addEvent(evento))
}

function handlePrev() { if (calendar.value) { calendar.value.prev(); updateTitle() } }
function handleNext() { if (calendar.value) { calendar.value.next(); updateTitle() } }
function handleToday() { if (calendar.value) { calendar.value.today(); updateTitle() } }
function changeView(view) { if (calendar.value) { calendar.value.changeView(view); currentView.value = view; updateTitle() } }
function updateTitle() { if (calendar.value) calendarTitle.value = calendar.value.view.title }

async function initCalendar() {
  loading.value = true
  await nextTick()
  if (!calendarContainer.value) { loading.value = false; return }
  try {
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
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: [],
      eventClick: handleEventClick,
      dateClick: handleDateClick,
      select: handleDateSelect,
      datesSet: handleDatesSet,
      eventDrop: handleEventDrop,
      eventResize: handleEventResize,
      eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
      slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    })
    calendar.value.render()
    updateTitle()
    loading.value = false
  } catch (error) { loading.value = false }
}

async function refetch() {
  if (isLoadingDates) return
  currentDateRange = { start: null, end: null }
  if (calendar.value) {
    const view = calendar.value.view
    await citasStore.fetchCitas(view.currentStart.toISOString().split('T')[0], view.currentEnd.toISOString().split('T')[0])
    await updateCalendarEvents()
  }
}

onMounted(() => { initCalendar() })
onUnmounted(() => { if (calendar.value) calendar.value.destroy(); clearTimeout(loadTimeout) })

defineExpose({ refetch, getCalendar: () => calendar.value })
</script>

<style>
/* Estilos Master Agenda Premium - DentalCloud */
.fc {
  font-family: 'Outfit', sans-serif !important;
  --fc-border-color: #f1f5f9;
  --fc-today-bg-color: #f8fafc;
}

.fc-header-toolbar { display: none !important; }
.fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9 !important; }
.fc-timegrid-slot { height: 4em !important; }

.fc-timegrid-slot-label {
  font-size: 10px !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  color: #94a3b8 !important;
  border: none !important;
}

.fc-col-header-cell {
  background: #f8fafc !important;
  padding: 15px 0 !important;
  border: none !important;
}

.fc-col-header-cell-cushion {
  font-size: 11px !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  color: #1e293b !important;
}

/* Event Styling */
.fc-v-event {
  background-color: white !important;
  border-radius: 1.2rem !important;
  border: 1px solid rgba(0,0,0,0.03) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
  padding: 8px !important;
  overflow: hidden !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.fc-v-event:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
  z-index: 50 !important;
}

.fc-event-main { color: inherit !important; padding: 0 !important; }
.fc-event-time { font-size: 8px !important; font-weight: 900 !important; color: #94a3b8 !important; }
.fc-event-title { font-size: 10px !important; font-weight: 900 !important; text-transform: uppercase !important; color: #1e293b !important; }

/* Now Indicator */
.fc-timegrid-now-indicator-line { border-color: #7c3aed !important; }
.fc-timegrid-now-indicator-arrow { border-color: #7c3aed !important; }

/* List View Tuning */
.fc-list-event { cursor: pointer !important; border-radius: 1rem !important; }
.fc-list-event-title { font-weight: 900!important; text-transform: uppercase !important; font-size: 10px !important; }
</style>