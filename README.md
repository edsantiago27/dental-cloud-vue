# 🦷 DentalCloud Vue

Sistema integral de gestión odontológica desarrollado con Vue 3, diseñado para optimizar la administración de clínicas dentales mediante una arquitectura modular y escalable.

![Vue 3](https://img.shields.io/badge/Vue-3.5.26-4FC08D?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0.4-FFC107?logo=pinia&logoColor=white)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos](#-módulos)
- [Scripts Disponibles](#-scripts-disponibles)
- [Configuración](#-configuración)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### 🏥 **Módulo Clínica (Administración)**
- **Dashboard** con KPIs y estadísticas en tiempo real
- **Gestión de Pacientes** con historiales completos
- **Historia Clínica Digital** con odontograma interactivo
- **Calendario de Citas** con FullCalendar
- **Gestión de Profesionales** y especialidades
- **Tratamientos** con seguimiento detallado
- **Facturación** y control de cuentas por cobrar
- **Reportes** personalizables y exportables
- **Sistema de Usuarios** con roles y permisos

### 👤 **Portal del Paciente**
- Dashboard personalizado con información relevante
- Visualización de citas programadas
- Acceso a historia clínica personal (solo lectura)
- Gestión de documentos médicos
- Seguimiento de pagos y facturas
- Configuración de perfil y notificaciones

### ⚙️ **Módulo SuperAdmin**
- Gestión multiclínica
- Control de suscripciones y planes
- Facturación global
- Reportes consolidados
- Configuración del sistema

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura modular por features** que permite:

- ✅ **Separación de responsabilidades** clara entre módulos
- ✅ **Escalabilidad** horizontal agregando nuevos módulos
- ✅ **Mantenibilidad** facilitada por organización lógica
- ✅ **Reutilización** de componentes compartidos
- ✅ **Testing** independiente por módulo

```
src/
├── modules/           # Módulos principales
│   ├── clinica/       # Administración de la clínica
│   ├── paciente/      # Portal del paciente
│   └── superadmin/    # Panel de superadministrador
├── shared/            # Recursos compartidos
├── router/            # Configuración de rutas
└── services/          # Servicios globales
```

---

## 🚀 Tecnologías

### **Core**
- **Vue 3** (v3.5.26) - Framework progresivo de JavaScript
- **Vite** (v7.3.0) - Build tool ultrarrápido
- **Vue Router** (v4.6.4) - Enrutamiento oficial
- **Pinia** (v3.0.4) - State management oficial

### **UI/UX**
- **TailwindCSS** (v3.4.1) - Framework CSS utility-first
- **Font Awesome** (v7.1.0) - Librería de iconos
- **Vue Toastification** (v2.0.0-rc.5) - Notificaciones toast

### **Features**
- **FullCalendar** (v6.1.20) - Calendario interactivo
- **Chart.js** (v4.5.1) + **vue-chartjs** (v5.3.3) - Gráficos y visualizaciones
- **Vuelidate** (v2.0.3) - Validación de formularios
- **Axios** (v1.13.2) - Cliente HTTP

### **Dev Tools**
- **Vue DevTools** (v8.0.5) - Herramientas de desarrollo
- **PostCSS** + **Autoprefixer** - Procesamiento CSS

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js**: `^20.19.0` o `>=22.12.0`
- **npm** o **yarn** o **pnpm**

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/edsantiago27/dental-cloud-vue.git
cd dental-cloud-vue
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=DentalCloud
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
dental-cloud-vue/
│
├── public/                 # Archivos públicos estáticos
│
├── src/
│   ├── modules/            # Módulos de la aplicación
│   │   ├── clinica/        # Módulo de administración de clínica
│   │   │   ├── components/ # Componentes específicos
│   │   │   ├── composables/# Hooks reutilizables
│   │   │   ├── layouts/    # Layouts del módulo
│   │   │   ├── router/     # Rutas del módulo
│   │   │   ├── services/   # Servicios API
│   │   │   ├── stores/     # Estado (Pinia stores)
│   │   │   └── views/      # Vistas/páginas
│   │   │
│   │   ├── paciente/       # Portal del paciente
│   │   │   └── (misma estructura)
│   │   │
│   │   └── superadmin/     # Panel de superadministrador
│   │       └── (misma estructura)
│   │
│   ├── shared/             # Recursos compartidos
│   │   ├── assets/         # CSS, imágenes, fuentes
│   │   ├── components/     # Componentes globales
│   │   ├── composables/    # Hooks compartidos
│   │   ├── plugins/        # Plugins de Vue
│   │   ├── stores/         # Estado global
│   │   └── utils/          # Utilidades
│   │
│   ├── router/             # Configuración global de rutas
│   │   ├── index.js        # Router principal
│   │   └── guards.js       # Guardias de navegación
│   │
│   ├── services/           # Servicios globales
│   │   └── api.js          # Cliente HTTP configurado
│   │
│   ├── App.vue             # Componente raíz
│   └── main.js             # Punto de entrada
│
├── .env                    # Variables de entorno
├── index.html              # HTML base
├── package.json            # Dependencias y scripts
├── postcss.config.js       # Configuración PostCSS
├── tailwind.config.js      # Configuración Tailwind
├── vite.config.js          # Configuración Vite
└── README.md               # Este archivo
```

---

## 🎯 Módulos

### **1. Módulo Clínica** (`/src/modules/clinica`)

Módulo principal para la gestión administrativa de la clínica dental.

#### Rutas principales:
- `/dashboard` - Panel de control principal
- `/pacientes` - Gestión de pacientes
- `/pacientes/:id/historia-clinica` - Historia clínica del paciente
- `/profesionales` - Gestión de profesionales
- `/citas` - Lista de citas
- `/calendario` - Calendario de citas
- `/tratamientos` - Catálogo de tratamientos
- `/facturacion` - Dashboard de facturación
- `/reportes` - Generación de reportes
- `/configuracion` - Configuración de la clínica

#### Stores principales:
- `useAuthStore` - Autenticación
- `usePacientesStore` - Gestión de pacientes
- `useCitasStore` - Gestión de citas
- `useProfesionalesStore` - Gestión de profesionales
- `useTratamientosStore` - Catálogo de tratamientos

---

### **2. Portal del Paciente** (`/src/modules/paciente`)

Interfaz dedicada para que los pacientes accedan a su información.

#### Rutas principales:
- `/paciente/login` - Inicio de sesión
- `/paciente/registro` - Registro de nuevo paciente
- `/paciente/portal` - Dashboard del paciente
- `/paciente/citas` - Mis citas
- `/paciente/historia-clinica` - Mi historia clínica
- `/paciente/documentos` - Mis documentos
- `/paciente/pagos` - Mis pagos
- `/paciente/perfil` - Mi perfil

---

### **3. Módulo SuperAdmin** (`/src/modules/superadmin`)

Panel de administración para gestión multiclínica y del sistema.

#### Rutas principales:
- `/superadmin/dashboard` - Panel de control
- `/superadmin/clinicas` - Gestión de clínicas
- `/superadmin/suscripciones` - Control de suscripciones
- `/superadmin/planes` - Gestión de planes
- `/superadmin/facturacion` - Facturación global
- `/superadmin/reportes` - Reportes consolidados

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en http://localhost:5173

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza el build de producción
```

---

## ⚙️ Configuración

### **Alias de rutas** (vite.config.js)

```javascript
{
  '@': './src',
  '@shared': './src/shared',
  '@clinica': './src/modules/clinica',
  '@paciente': './src/modules/paciente',
  '@superadmin': './src/modules/superadmin'
}
```

### **Tailwind CSS**

El proyecto usa Tailwind CSS con configuración personalizada. Para extender la configuración, edita `tailwind.config.js`.

### **Variables de Entorno**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend API | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Nombre de la aplicación | `DentalCloud` |

---

## 🎨 Convenciones de Código

- **Componentes**: PascalCase (ej: `PacientesList.vue`)
- **Vistas**: PascalCase (ej: `Dashboard.vue`)
- **Composables**: camelCase con prefijo `use` (ej: `useNotification.js`)
- **Stores**: camelCase con prefijo `use` y sufijo `Store` (ej: `usePacientesStore.js`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🔐 Autenticación

El sistema utiliza autenticación basada en tokens (Laravel Sanctum):

- **Login**: `POST /api/login`
- **Logout**: `POST /api/logout`
- **Verificación**: Guards en Vue Router

---

## 📱 Responsive Design

La aplicación está completamente optimizada para:

- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1920px+)

---

## 🐛 Reportar Bugs

Si encuentras un bug, por favor crea un [issue](https://github.com/edsantiago27/dental-cloud-vue/issues) con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Screenshots (si aplica)

---

## 📄 Licencia

Este proyecto es privado y está protegido por derechos de autor.

---

## 👥 Autores

- **Estefania Santiago** - [edsantiago27](https://github.com/edsantiago27)

---

## 🙏 Agradecimientos

- Vue.js Team por el excelente framework
- Tailwind Labs por TailwindCSS
- Comunidad de desarrolladores Vue

---

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: [estefaniadsantiago@gmail.com]
- 💬 Issues: [GitHub Issues](https://github.com/edsantiago27/dental-cloud-vue/issues)

---

<div align="center">
  
**Desarrollado con ❤️ usando Vue 3**

</div>
