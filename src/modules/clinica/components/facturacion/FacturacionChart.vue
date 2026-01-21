<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-bold text-gray-800">Evolución de Ingresos</h3>
        <p class="text-xs text-gray-500">Facturado vs Cobrado (Últimos 6 meses)</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-indigo-500"></span>
          <span class="text-xs font-medium text-gray-600">Facturado</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span class="text-xs font-medium text-gray-600">Cobrado</span>
        </div>
      </div>
    </div>

    <div class="h-64">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
        <i class="fas fa-chart-bar text-4xl mb-2 opacity-20"></i>
        <p class="text-sm italic">Cargando datos del gráfico...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      facturado: [1200000, 1500000, 1100000, 1800000, 2100000, 2500000],
      cobrado: [1000000, 1300000, 950000, 1600000, 1900000, 2200000]
    })
  }
})

const chartData = computed(() => {
  if (!props.data || !props.data.labels) return null
  
  return {
    labels: props.data.labels,
    datasets: [
      {
        label: 'Facturado',
        data: props.data.facturado || [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 6,
        barThickness: 12
      },
      {
        label: 'Cobrado',
        data: props.data.cobrado || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6,
        barThickness: 12
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || ''
          if (label) label += ': '
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0,0,0,0.05)',
        drawBorder: false
      },
      ticks: {
        callback: (value) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
          return `$${value}`
        },
        font: { size: 11 },
        color: '#94a3b8'
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { size: 11, weight: '500' },
        color: '#64748b'
      }
    }
  }
}
</script>
