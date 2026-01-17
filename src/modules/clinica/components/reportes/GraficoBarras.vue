<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <i class="fas fa-chart-bar text-green-600"></i>
      {{ title }}
    </h3>
    
    <div v-if="hasData" class="relative h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    
    <div v-else class="h-64 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <i class="fas fa-chart-bar text-4xl mb-2"></i>
        <p>No hay datos disponibles</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Gráfico de Barras'
  },
  data: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      citas: []
    })
  },
  color: {
    type: String,
    default: '#10B981' // green-600
  }
})

// Computed
const hasData = computed(() => {
  return props.data.labels?.length > 0 && props.data.citas?.length > 0
})

const chartData = computed(() => {
  return {
    labels: props.data.labels || [],
    datasets: [
      {
        label: 'Cantidad de Citas',
        data: props.data.citas || [],
        backgroundColor: `${props.color}80`, // 50% opacity
        borderColor: props.color,
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 40
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
            return `Citas: ${context.parsed.y}`
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
    }
  }
})
</script>