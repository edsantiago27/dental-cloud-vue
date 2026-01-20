<!-- shared/ui/SignaturePad.vue -->
<template>
  <div class="flex flex-col gap-4">
    <div 
        class="relative bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden cursor-crosshair group active:border-violet-400 transition-colors"
        :style="{ height: height + 'px' }"
    >
      <canvas 
        ref="signatureCanvas" 
        class="w-full h-full"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="startDrawingTouch"
        @touchmove="drawTouch"
        @touchend="stopDrawing"
      ></canvas>

      <!-- Overlay hint -->
      <div v-if="isEmpty" class="absolute inset-0 flex flex-center flex-col items-center justify-center pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
          <i class="fas fa-signature text-4xl text-gray-400 mb-2"></i>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Firmar aquí</p>
      </div>

      <!-- Controls float -->
      <div class="absolute bottom-4 right-4 flex gap-2">
          <button 
            type="button"
            @click="clear" 
            class="p-3 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:shadow-lg transition-all"
            title="Limpiar firma"
          >
              <i class="fas fa-eraser text-xs"></i>
          </button>
      </div>
    </div>
    
    <p class="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest">
        Al firmar, el paciente acepta los términos y condiciones del documento expresado arriba.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    height: {
        type: Number,
        default: 200
    },
    color: {
        type: String,
        default: '#1f2937'
    },
    lineWidth: {
        type: Number,
        default: 2.5
    }
})

const emit = defineEmits(['update', 'change'])

const signatureCanvas = ref(null)
const isEmpty = ref(true)
let ctx = null
let drawing = false

onMounted(() => {
    initCanvas()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

function initCanvas() {
    const canvas = signatureCanvas.value
    if (!canvas) return

    // Fix for retina displays
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    
    ctx = canvas.getContext('2d')
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = props.color
    ctx.lineWidth = props.lineWidth
}

function handleResize() {
    // Save current drawing if needed, but for simplicity we just re-init
    // Note: Re-init clears the canvas
    initCanvas()
}

function getPos(e) {
    const rect = signatureCanvas.value.getBoundingClientRect()
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

function getPosTouch(e) {
    const rect = signatureCanvas.value.getBoundingClientRect()
    return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
    }
}

function startDrawing(e) {
    drawing = true
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
}

function startDrawingTouch(e) {
    e.preventDefault()
    drawing = true
    const { x, y } = getPosTouch(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
}

function draw(e) {
    if (!drawing) return
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    isEmpty.value = false
}

function drawTouch(e) {
    e.preventDefault()
    if (!drawing) return
    const { x, y } = getPosTouch(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    isEmpty.value = false
}

function stopDrawing() {
    if (!drawing) return
    drawing = false
    ctx.closePath()
    emitUpdate()
}

function clear() {
    ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
    isEmpty.value = true
    emitUpdate()
}

function emitUpdate() {
    if (isEmpty.value) {
        emit('update', null)
    } else {
        const dataUrl = signatureCanvas.value.toDataURL('image/png')
        emit('update', dataUrl)
    }
}

// Expose methods for parent
defineExpose({
    clear,
    getDataUrl: () => isEmpty.value ? null : signatureCanvas.value.toDataURL('image/png'),
    checkEmpty: () => isEmpty.value
})
</script>

<style scoped>
canvas {
    touch-action: none; /* Prevent scrolling while drawing on mobile */
}
</style>
