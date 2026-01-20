// src/modules/demo/stores/demoInventario.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDemoInventarioStore = defineStore('demo-inventario', () => {
  const items = ref([])
  const loading = ref(false)

  function fetchItems() {
    const data = localStorage.getItem('dc_demo_inventario')
    if (data) {
      items.value = JSON.parse(data)
    } else {
      // Por brevedad, lo sacamos directamente de un mock aquí si no existe
      const mock = [
        { id: 1, nombre: 'Guantes de Nitrilo (M)', stock: 50, stock_minimo: 10, categoria: 'Consumibles' },
        { id: 2, nombre: 'Mascarillas Quirúrgicas', stock: 5, stock_minimo: 20, categoria: 'Protección' },
        { id: 3, nombre: 'Anestesia Local 2%', stock: 120, stock_minimo: 50, categoria: 'Farmacia' },
        { id: 4, nombre: 'Eyectores de Saliva', stock: 8, stock_minimo: 15, categoria: 'Consumibles' }
      ]
      items.value = mock
      localStorage.setItem('dc_demo_inventario', JSON.stringify(mock))
    }
  }

  function updateStock(id, cantidad) {
    items.value = items.value.map(i => i.id === id ? { ...i, stock: i.stock + cantidad } : i)
    localStorage.setItem('dc_demo_inventario', JSON.stringify(items.value))
  }

  const stockBajo = computed(() => items.value.filter(i => i.stock <= i.stock_minimo))

  return { items, loading, stockBajo, fetchItems, updateStock }
})
