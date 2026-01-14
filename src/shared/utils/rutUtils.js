// utils/rutUtils.js

/**
 * Limpia el RUT dejando solo números y dígito verificador
 */
export function cleanRut(rut) {
  if (!rut) return ''
  return rut.toString().replace(/[^0-9kK]/g, '').toUpperCase()
}

/**
 * Formatea el RUT con puntos y guión: 12.345.678-9
 */
export function formatRut(rut) {
  if (!rut) return ''
  
  const cleaned = cleanRut(rut)
  
  if (cleaned.length <= 1) return cleaned
  
  // Separar número y dígito verificador
  const dv = cleaned.slice(-1)
  const number = cleaned.slice(0, -1)
  
  // Formatear número con puntos
  const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `${formatted}-${dv}`
}

/**
 * Valida si un RUT chileno es válido
 */
export function validateRut(rut) {
  if (!rut) return false
  
  const cleaned = cleanRut(rut)
  
  if (cleaned.length < 2) return false
  
  const dv = cleaned.slice(-1)
  const number = cleaned.slice(0, -1)
  
  // Calcular dígito verificador
  let sum = 0
  let multiplier = 2
  
  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const expectedDv = 11 - (sum % 11)
  let calculatedDv
  
  if (expectedDv === 11) {
    calculatedDv = '0'
  } else if (expectedDv === 10) {
    calculatedDv = 'K'
  } else {
    calculatedDv = expectedDv.toString()
  }
  
  return dv === calculatedDv
}

/**
 * Directiva de Vue para formatear RUT automáticamente
 */
export const vRutFormat = {
  mounted(el, binding) {
    el.addEventListener('input', (e) => {
      const value = e.target.value
      const formatted = formatRut(value)
      e.target.value = formatted
      
      // Emitir evento para actualizar v-model
      e.target.dispatchEvent(new Event('input'))
    })
  }
}

/**
 * Composable para usar en componentes
 */
export function useRut() {
  return {
    formatRut,
    validateRut,
    cleanRut
  }
}