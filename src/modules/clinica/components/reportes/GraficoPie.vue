<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <i class="fas fa-chart-line text-blue-600"></i>
      {{ title }}
    </h3>
    
    <div v-if="hasData" class="relative h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    
    <div v-else class="h-64 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <i class="fas fa-chart-line text-4xl mb-2"></i>
        <p>No hay datos disponibles</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Gráfico de Líneas'
  },
  data: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      data: []
    })
  },
  color: {
    type: String,
    default: '#3B82F6' // blue-600
  }
})

// Computed
const hasData = computed(() => {
  return props.data.labels?.length > 0 && props.data.data?.length > 0
})

const chartData = computed(() => {
  return {
    labels: props.data.labels || [],
    datasets: [
      {
        label: props.title,
        data: props.data.data || [],
        borderColor: props.color,
        backgroundColor: `${props.color}20`, // 20% opacity
        borderWidth: 2,
        tension: 0.4, // Curvatura suave
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: props.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  }
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: props.color,
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return context[0].label
          },
          label: (context) => {
            return `Total: ${context.parsed.y}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        ticks: {
          color: '#6B7280'
        },
        grid: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }
})
</script>