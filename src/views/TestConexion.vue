<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          <i class="fas fa-flask text-blue-600 mr-3"></i>
          Test de Conexión API
        </h1>
        <p class="text-gray-600">Probando conexión entre Vue y Laravel</p>
      </div>

      <!-- FASE 1: Test Ruta Pública -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            Fase 1: Ruta Pública (/api/test)
          </h2>
          <button 
            @click="testPublico" 
            :disabled="loadingPublico"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            <i class="fas fa-play mr-2"></i>
            {{ loadingPublico ? 'Probando...' : 'Probar' }}
          </button>
        </div>

        <!-- Resultado -->
        <div v-if="resultPublico" class="mt-4">
          <div 
            :class="[
              'p-4 rounded-lg border',
              resultPublico.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            ]"
          >
            <div class="flex items-start gap-3">
              <i 
                :class="[
                  'text-2xl mt-1',
                  resultPublico.success 
                    ? 'fas fa-check-circle text-green-600' 
                    : 'fas fa-exclamation-circle text-red-600'
                ]"
              ></i>
              <div class="flex-1">
                <h3 
                  :class="[
                    'font-semibold mb-1',
                    resultPublico.success ? 'text-green-800' : 'text-red-800'
                  ]"
                >
                  {{ resultPublico.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión' }}
                </h3>
                <p 
                  :class="[
                    'text-sm',
                    resultPublico.success ? 'text-green-700' : 'text-red-700'
                  ]"
                >
                  {{ resultPublico.message }}
                </p>
                <pre v-if="resultPublico.data" class="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">{{ JSON.stringify(resultPublico.data, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FASE 2: Login y Obtener Token -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          Fase 2: Login y Token
        </h2>

        <!-- Formulario de Login -->
        <div class="space-y-4">
          <!-- Slug de Clínica -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Slug de Clínica
              <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="loginForm.clinica_slug"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="mi-clinica"
            >
            <p class="text-xs text-gray-500 mt-1">
              <i class="fas fa-info-circle mr-1"></i>
              Ejemplo: "clinica-dental-centro", "dent-pro", etc.
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
              <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="loginForm.email"
              type="email"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@clinica.com"
            >
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password
              <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="loginForm.password"
              type="password"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              @keyup.enter="testLogin"
            >
          </div>

          <button 
            @click="testLogin" 
            :disabled="loadingLogin"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition disabled:opacity-50 font-medium"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>
            {{ loadingLogin ? 'Autenticando...' : 'Login y Obtener Token' }}
          </button>
        </div>

        <!-- Resultado Login -->
        <div v-if="resultLogin" class="mt-4">
          <div 
            :class="[
              'p-4 rounded-lg border',
              resultLogin.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            ]"
          >
            <div class="flex items-start gap-3">
              <i 
                :class="[
                  'text-2xl mt-1',
                  resultLogin.success 
                    ? 'fas fa-check-circle text-green-600' 
                    : 'fas fa-exclamation-circle text-red-600'
                ]"
              ></i>
              <div class="flex-1">
                <h3 
                  :class="[
                    'font-semibold mb-1',
                    resultLogin.success ? 'text-green-800' : 'text-red-800'
                  ]"
                >
                  {{ resultLogin.success ? '✅ Login Exitoso' : '❌ Error de Login' }}
                </h3>
                <p 
                  :class="[
                    'text-sm',
                    resultLogin.success ? 'text-green-700' : 'text-red-700'
                  ]"
                >
                  {{ resultLogin.message }}
                </p>
                
                <!-- Mostrar Token -->
                <div v-if="token" class="mt-3">
                  <p class="text-xs text-gray-600 mb-1">Token obtenido:</p>
                  <div class="bg-gray-800 text-green-400 p-2 rounded text-xs font-mono break-all">
                    {{ token.substring(0, 50) }}...
                  </div>
                </div>

                <!-- Mostrar Usuario y Clínica -->
                <div v-if="user" class="mt-3 space-y-2">
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Usuario autenticado:</p>
                    <div class="bg-white p-2 rounded border text-sm">
                      <p><strong>Nombre:</strong> {{ user.nombre }} {{ user.apellido }}</p>
                      <p><strong>Email:</strong> {{ user.email }}</p>
                      <p><strong>Rol:</strong> <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{{ user.rol }}</span></p>
                    </div>
                  </div>
                  
                  <div v-if="clinica">
                    <p class="text-xs text-gray-600 mb-1">Clínica:</p>
                    <div class="bg-white p-2 rounded border text-sm">
                      <p><strong>Nombre:</strong> {{ clinica.nombre }}</p>
                      <p><strong>Slug:</strong> <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{{ clinica.slug }}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FASE 3: Probar Ruta Protegida -->
      <div 
        class="bg-white rounded-xl shadow-md p-6"
        :class="{ 'opacity-50': !token }"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            Fase 3: Ruta Protegida (/api/pacientes)
          </h2>
          <button 
            @click="testPacientes" 
            :disabled="loadingPacientes || !token"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            <i class="fas fa-users mr-2"></i>
            {{ loadingPacientes ? 'Cargando...' : 'Probar' }}
          </button>
        </div>

        <div v-if="!token" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-800">
            <i class="fas fa-lock mr-2"></i>
            Primero debes hacer login (Fase 2) para obtener un token
          </p>
        </div>

        <!-- Resultado Pacientes -->
        <div v-if="resultPacientes" class="mt-4">
          <div 
            :class="[
              'p-4 rounded-lg border',
              resultPacientes.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            ]"
          >
            <div class="flex items-start gap-3">
              <i 
                :class="[
                  'text-2xl mt-1',
                  resultPacientes.success 
                    ? 'fas fa-check-circle text-green-600' 
                    : 'fas fa-exclamation-circle text-red-600'
                ]"
              ></i>
              <div class="flex-1">
                <h3 
                  :class="[
                    'font-semibold mb-1',
                    resultPacientes.success ? 'text-green-800' : 'text-red-800'
                  ]"
                >
                  {{ resultPacientes.success ? '✅ Datos Obtenidos' : '❌ Error al Obtener Datos' }}
                </h3>
                <p 
                  :class="[
                    'text-sm',
                    resultPacientes.success ? 'text-green-700' : 'text-red-700'
                  ]"
                >
                  {{ resultPacientes.message }}
                </p>

                <!-- Mostrar Pacientes -->
                <div v-if="pacientes.length > 0" class="mt-3 space-y-2">
                  <p class="text-xs text-gray-600">{{ pacientes.length }} pacientes encontrados:</p>
                  <div 
                    v-for="paciente in pacientes.slice(0, 3)" 
                    :key="paciente.id"
                    class="bg-white p-3 rounded border text-sm hover:shadow-md transition"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {{ getInitials(paciente.nombre, paciente.apellido) }}
                      </div>
                      <div class="flex-1">
                        <p class="font-medium">{{ paciente.nombre }} {{ paciente.apellido }}</p>
                        <p class="text-xs text-gray-600">
                          <i class="fas fa-id-card mr-1"></i>{{ paciente.rut }}
                          <span v-if="paciente.email" class="ml-3">
                            <i class="fas fa-envelope mr-1"></i>{{ paciente.email }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <p v-if="pacientes.length > 3" class="text-xs text-gray-500 text-center">
                    ... y {{ pacientes.length - 3 }} más
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Técnica -->
      <div class="bg-gray-800 text-white rounded-xl p-6">
        <h3 class="font-semibold mb-3">
          <i class="fas fa-code mr-2"></i>
          Información Técnica
        </h3>
        <div class="space-y-2 text-sm text-gray-300">
          <div class="flex justify-between">
            <span>API URL:</span>
            <span class="text-gray-100">{{ API_URL }}</span>
          </div>
          <div class="flex justify-between">
            <span>Clínica actual:</span>
            <span :class="clinica ? 'text-purple-400' : 'text-red-400'">
              {{ clinica ? clinica.slug : 'No ✗' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span>Token guardado:</span>
            <span :class="token ? 'text-green-400' : 'text-red-400'">
              {{ token ? 'Sí ✓' : 'No ✗' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span>Usuario autenticado:</span>
            <span :class="user ? 'text-green-400' : 'text-red-400'">
              {{ user ? user.nombre : 'No ✗' }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8001/api'

// Estado
const loadingPublico = ref(false)
const loadingLogin = ref(false)
const loadingPacientes = ref(false)

const resultPublico = ref(null)
const resultLogin = ref(null)
const resultPacientes = ref(null)

const loginForm = ref({
  clinica_slug: '',
  email: '',
  password: ''
})

const token = ref(null)
const user = ref(null)
const clinica = ref(null)
const pacientes = ref([])

// Helper para iniciales
function getInitials(nombre, apellido) {
  const n = nombre?.[0] || ''
  const a = apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
}

// FASE 1: Test Ruta Pública
async function testPublico() {
  loadingPublico.value = true
  resultPublico.value = null

  try {
    console.log('🔄 Probando ruta pública:', API_URL + '/test')
    
    const response = await axios.get(API_URL + '/test')
    
    console.log('✅ Respuesta:', response.data)
    
    resultPublico.value = {
      success: true,
      message: 'La API responde correctamente',
      data: response.data
    }
  } catch (error) {
    console.error('❌ Error:', error)
    
    let message = 'Error desconocido'
    
    if (error.code === 'ERR_NETWORK') {
      message = 'No se puede conectar a Laravel. ¿Está corriendo en puerto 8001?'
    } else if (error.response?.status === 404) {
      message = 'Ruta /api/test no encontrada'
    } else if (error.message.includes('CORS')) {
      message = 'Error de CORS. Configura config/cors.php en Laravel'
    } else {
      message = error.response?.data?.message || error.message
    }
    
    resultPublico.value = {
      success: false,
      message: message
    }
  } finally {
    loadingPublico.value = false
  }
}

// FASE 2: Test Login
async function testLogin() {
  if (!loginForm.value.clinica_slug || !loginForm.value.email || !loginForm.value.password) {
    resultLogin.value = {
      success: false,
      message: 'Por favor completa todos los campos (slug, email y password)'
    }
    return
  }

  loadingLogin.value = true
  resultLogin.value = null

  try {
    console.log('🔄 Intentando login:', {
      clinica_slug: loginForm.value.clinica_slug,
      email: loginForm.value.email
    })
    
    const response = await axios.post(API_URL + '/auth/login/usuario', {
      clinica_slug: loginForm.value.clinica_slug,
      email: loginForm.value.email,
      password: loginForm.value.password
    })
    
    console.log('✅ Login exitoso:', response.data)
    
    // Guardar token, usuario y clínica
    token.value = response.data.data.token
    user.value = response.data.data.user
    clinica.value = response.data.data.clinica
    
    // Guardar en localStorage
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('clinica', JSON.stringify(clinica.value))
    
    resultLogin.value = {
      success: true,
      message: 'Login exitoso. Token obtenido y guardado.'
    }
  } catch (error) {
    console.error('❌ Error login:', error)
    
    let message = 'Error en login'
    
    if (error.response?.status === 401) {
      message = 'Credenciales inválidas'
    } else if (error.response?.status === 404) {
      message = 'Clínica no encontrada o inactiva. Verifica el slug.'
    } else if (error.response?.status === 422) {
      const errors = error.response?.data?.errors
      if (errors) {
        message = Object.values(errors).flat().join(', ')
      } else {
        message = 'Datos de login inválidos'
      }
    } else {
      message = error.response?.data?.message || error.message
    }
    
    resultLogin.value = {
      success: false,
      message: message
    }
  } finally {
    loadingLogin.value = false
  }
}

// FASE 3: Test Ruta Protegida
async function testPacientes() {
  if (!token.value) {
    resultPacientes.value = {
      success: false,
      message: 'No hay token. Primero haz login.'
    }
    return
  }

  loadingPacientes.value = true
  resultPacientes.value = null

  try {
    console.log('🔄 Probando ruta protegida con token')
    
    const response = await axios.get(API_URL + '/pacientes', {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      }
    })
    
    console.log('✅ Respuesta completa:', response)
    console.log('📦 response.data:', response.data)
    console.log('📦 response.data.data:', response.data.data)
    console.log('📦 Tipo de response.data:', typeof response.data)
    console.log('📦 Es array response.data?:', Array.isArray(response.data))
    console.log('📦 Es array response.data.data?:', Array.isArray(response.data.data))
    
    // Intentar múltiples formas de extraer los pacientes
    let datosPacientes = null
    
    if (Array.isArray(response.data.data)) {
      // Laravel paginado: { data: [...] }
      datosPacientes = response.data.data
      console.log('✅ Formato: Laravel paginado')
    } else if (Array.isArray(response.data)) {
      // Array directo
      datosPacientes = response.data
      console.log('✅ Formato: Array directo')
    } else if (response.data.data && Array.isArray(response.data.data.data)) {
      // Doble nested: { data: { data: [...] } }
      datosPacientes = response.data.data.data
      console.log('✅ Formato: Doble nested')
    }
    
    console.log('📊 Pacientes extraídos:', datosPacientes)
    console.log('📊 Total:', datosPacientes?.length || 0)
    
    pacientes.value = datosPacientes || []
    
    resultPacientes.value = {
      success: true,
      message: `Se obtuvieron ${pacientes.value.length} pacientes correctamente`
    }
  } catch (error) {
    console.error('❌ Error al obtener pacientes:', error)
    
    let message = 'Error al obtener pacientes'
    
    if (error.response?.status === 401) {
      message = 'Token inválido o expirado. Haz login nuevamente.'
      // Limpiar token
      token.value = null
      user.value = null
      clinica.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('clinica')
    } else if (error.response?.status === 403) {
      message = 'No tienes permisos para ver pacientes'
    } else {
      message = error.response?.data?.message || error.message
    }
    
    resultPacientes.value = {
      success: false,
      message: message
    }
  } finally {
    loadingPacientes.value = false
  }
}
</script>