import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export const useSuperAdminThemeStore = defineStore('superadmin-theme', () => {
  const theme = ref(localStorage.getItem('sa_theme') || 'light')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('sa_theme', theme.value)
    applyTheme()
  }

  function applyTheme() {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
  }

  // Initialize theme on store creation
  applyTheme()

  return {
    theme,
    toggleTheme,
    applyTheme
  }
})
