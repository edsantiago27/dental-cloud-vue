<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Equipo y Usuarios</h1>
        <p class="text-gray-600 mt-1">Gestiona el personal de la clínica y sus permisos</p>
      </div>
      <button
        @click="abrirModalCrear"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
      >
        <i class="fas fa-plus"></i>
        <span>Nuevo Usuario</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div v-if="usuariosStore.estadisticas" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="text-gray-500 text-sm font-medium mb-1">Total Usuarios</div>
        <div class="text-2xl font-bold text-gray-900">{{ usuariosStore.estadisticas.total_usuarios }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="text-green-600 text-sm font-medium mb-1">Activos</div>
        <div class="text-2xl font-bold text-gray-900">{{ usuariosStore.estadisticas.usuarios_activos }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="text-gray-500 text-sm font-medium mb-1">Recepcionistas</div>
        <div class="text-2xl font-bold text-gray-900">{{ usuariosStore.estadisticas.por_rol?.recepcionista || 0 }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="text-gray-500 text-sm font-medium mb-1">Asistentes</div>
        <div class="text-2xl font-bold text-gray-900">{{ usuariosStore.estadisticas.por_rol?.asistente || 0 }}</div>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="busqueda"
          @input="debouncedSearch"
          type="text"
          placeholder="Buscar por nombre, email o RUT..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
        />
      </div>
      <select
        v-model="filtroRol"
        @change="aplicarFiltros"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white text-gray-600"
      >
        <option value="">Todos los roles</option>
        <option value="admin_clinica">Administrador</option>
        <option value="recepcionista">Recepcionista</option>
        <option value="asistente">Asistente</option>
      </select>
      <select
        v-model="filtroEstado"
        @change="aplicarFiltros"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white text-gray-600"
      >
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="usuariosStore.loading && !usuariosStore.usuarios.length" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i>
        <p class="text-gray-500">Cargando equipo...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
              <th class="p-4 font-semibold">Usuario</th>
              <th class="p-4 font-semibold">Rol</th>
              <th class="p-4 font-semibold">Estado</th>
              <th class="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            <tr v-if="usuariosStore.usuarios.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500">
                No se encontraron usuarios con estos filtros.
              </td>
            </tr>
            <tr v-for="usuario in usuariosStore.usuarios" :key="usuario.id" class="hover:bg-gray-50 transition">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {{ usuario.nombre?.charAt(0) }}{{ usuario.apellido?.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ usuario.nombre }} {{ usuario.apellido }}</div>
                    <div class="text-gray-500 text-xs">{{ usuario.email }}</div>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="getRolClass(usuario.rol)">
                  {{ formatRol(usuario.rol) }}
                </span>
              </td>
              <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="usuario.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ usuario.estado }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <button 
                  @click="abrirModalEditar(usuario)"
                  class="text-gray-400 hover:text-blue-600 transition" 
                  title="Editar"
                >
                  <i class="fas fa-pen"></i>
                </button>
                <button 
                  @click="confirmarEliminar(usuario)"
                  class="text-gray-400 hover:text-red-600 transition" 
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="usuariosStore.pagination.total > usuariosStore.pagination.perPage" class="p-4 border-t border-gray-100 flex justify-between items-center">
        <span class="text-xs text-gray-500">
          Mostrando {{ usuariosStore.pagination.currentPage }} de {{ usuariosStore.pagination.lastPage }} páginas
        </span>
        <div class="flex gap-2">
          <button 
            @click="cambiarPagina(usuariosStore.pagination.currentPage - 1)"
            :disabled="usuariosStore.pagination.currentPage === 1"
            class="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button 
            @click="cambiarPagina(usuariosStore.pagination.currentPage + 1)"
            :disabled="usuariosStore.pagination.currentPage === usuariosStore.pagination.lastPage"
            class="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Formulario -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">
            {{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="guardarUsuario" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input v-model="form.nombre" required type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
              <input v-model="form.apellido" required type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input v-model="form.email" required type="email" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
          </div>

          <!-- Password: Solo requerida al crear -->
          <div v-if="!usuarioEditando">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <input v-model="form.password" required type="password" minlength="6" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
            <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">RUT</label>
              <input v-model="form.rut" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
            </div>
            <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
               <input v-model="form.telefono" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
              <select v-model="form.rol" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                <option value="recepcionista">Recepcionista</option>
                <option value="asistente">Asistente</option>
                <option value="admin_clinica">Administrador</option>
              </select>
            </div>
            <div v-if="usuarioEditando">
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="form.estado" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <!-- Permisos: Demo por ahora -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Permisos adicionales</label>
            <div class="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>
              Los permisos se asignan automáticamente según el rol, pero podrás personalizarlos en futuras versiones.
            </div>
          </div>
          
          <div v-if="usuariosStore.error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {{ usuariosStore.error }}
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" @click="cerrarModal" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm">Cancel</button>
            <button 
              type="submit" 
              :disabled="usuariosStore.loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="usuariosStore.loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ usuarioEditando ? 'Actualizar' : 'Crear Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useUsuariosStore } from '@clinica/stores/usuarios'
import Swal from 'sweetalert2' 

// Implementación simple de debounce
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const usuariosStore = useUsuariosStore()

// State local
const busqueda = ref('')
const filtroRol = ref('')
const filtroEstado = ref('')
const mostrarModal = ref(false)
const usuarioEditando = ref(null)

const form = reactive({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  rut: '',
  telefono: '',
  rol: 'recepcionista',
  estado: 'activo',
  permisos: []
})

// Acciones de carga
const cargarUsuarios = () => {
  usuariosStore.fetchUsuarios({
    buscar: busqueda.value,
    rol: filtroRol.value,
    estado: filtroEstado.value,
    page: usuariosStore.pagination.currentPage
  })
}

// Watchers y Eventos
const debouncedSearch = debounce(() => {
  usuariosStore.pagination.currentPage = 1
  cargarUsuarios()
}, 500)

const aplicarFiltros = () => {
  usuariosStore.pagination.currentPage = 1
  cargarUsuarios()
}

const cambiarPagina = (page) => {
  usuariosStore.pagination.currentPage = page
  cargarUsuarios()
}

// Modal Logic
const resetForm = () => {
  Object.assign(form, {
    nombre: '', apellido: '', email: '', password: '', 
    rut: '', telefono: '', rol: 'recepcionista', estado: 'activo', permisos: []
  })
}

const abrirModalCrear = () => {
  usuarioEditando.value = null
  resetForm()
  mostrarModal.value = true
}

const abrirModalEditar = (usuario) => {
  usuarioEditando.value = usuario
  Object.assign(form, {
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    rut: usuario.rut,
    telefono: usuario.telefono,
    rol: usuario.rol,
    estado: usuario.estado,
    password: '' // No llenar password al editar
  })
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  usuariosStore.error = null
}

const guardarUsuario = async () => {
  let result
  if (usuarioEditando.value) {
    result = await usuariosStore.updateUsuario(usuarioEditando.value.id, form)
  } else {
    result = await usuariosStore.createUsuario(form)
  }

  if (result.success) {
    cerrarModal()
    // Opcional: Toast success
    alert(result.message) // Simplificado, ideal usar toast
  }
}

const confirmarEliminar = async (usuario) => {
  if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
    const result = await usuariosStore.deleteUsuario(usuario.id)
    if (result.success) {
      // Toast success
    } else {
      alert(result.message)
    }
  }
}

// Helpers visuales
const getRolClass = (rol) => {
  switch(rol) {
    case 'admin_clinica': return 'bg-purple-100 text-purple-700'
    case 'recepcionista': return 'bg-blue-100 text-blue-700'
    case 'asistente': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const formatRol = (rol) => {
  switch(rol) {
    case 'admin_clinica': return 'Administrador'
    default: return rol
  }
}

// Lifecycle
onMounted(() => {
  cargarUsuarios()
  usuariosStore.fetchEstadisticas()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>