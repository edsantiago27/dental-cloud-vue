<template>
  <div class="min-h-screen bg-black text-white selection:bg-violet-500/30 font-display transition-all duration-700 overflow-x-hidden landing-root" style="background-color: #020202 !important;">
    
    <!-- Luces de Fondo Refinadas (Mesh Gradients) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-violet-600/15 rounded-full blur-[140px] animate-pulse-slow"></div>
      <div class="absolute top-[10%] -right-[20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-float"></div>
      <div class="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <!-- Luz central sutil -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-900/5 blur-[160px]"></div>
    </div>

    <!-- Navbar Premium (Reforzada) -->
    <nav 
      :class="[
        'fixed top-0 inset-x-0 z-50 transition-all duration-500 py-6 px-10 flex items-center justify-between',
        scrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10 py-4 shadow-2xl' : ''
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-4 group cursor-pointer" @click="router.push('/')">
        <div class="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform ring-1 ring-white/10">
          <i class="fas fa-tooth text-white text-xl"></i>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-sm font-black uppercase tracking-[0.3em] leading-none text-white">DentalCloud</span>
          <span class="text-[8px] font-black text-violet-400 uppercase tracking-widest mt-1">SaaS Intelligence</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="hidden lg:flex items-center gap-12">
        <a href="#modulos" class="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">Módulos</a>
        <a href="#premium" class="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors text-violet-400">Premium ✨</a>
        <a href="#planes" class="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">Planes</a>
        <a href="#contacto" class="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors text-white/30">Ayuda</a>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-4">
        <button 
          @click="openDemo"
          class="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white/15 hover:border-white/20 transition-all text-white"
        >
          <i class="fas fa-play text-violet-500 text-[10px]"></i>
          Ver Demo
        </button>
        <button 
          @click="handleClientAccess"
          class="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl shadow-violet-600/30 hover:-translate-y-1 transition-all active:scale-95 ring-1 ring-violet-400/50"
        >
          {{ authStore.isAuthenticated ? 'Ir al Panel' : 'Acceso Doctores' }}
        </button>
      </div>
    </nav>

    <!-- Hero Section (High Contrast) -->
    <section class="relative min-h-screen flex items-center pt-32 pb-20 px-10 z-10 overflow-hidden">
      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <!-- Text Content -->
        <div class="space-y-12 relative z-20">
          <div class="inline-flex items-center gap-3 px-6 py-2.5 bg-violet-600/10 border border-violet-500/20 rounded-full">
            <span class="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span class="text-[10px] font-black uppercase tracking-widest text-violet-400">Plataforma SaaS Odontológica Premium</span>
          </div>
          <h1 class="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-white">
            Evoluciona <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-500 to-blue-500 animate-gradient-x">Tu Práctica</span> <br>
            Dental.
          </h1>
          <p class="text-xl text-white/50 max-w-lg leading-relaxed font-bold uppercase tracking-tight">
            Gestión integral de alto rendimiento. <span class="text-white">Facturación Electrónica (DTE)</span>, Odontogramas 3D y Analítica Avanzada en un solo ecosistema.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 pt-6 text-left items-start md:items-center">
            <button @click="handleClientAccess" class="px-12 py-5 bg-white text-black rounded-[2rem] font-black uppercase text-[12px] tracking-widest hover:bg-violet-50 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Probar 30 Días Gratis
            </button>
            <div class="flex items-center gap-5 px-6">
              <div class="flex -space-x-3">
                 <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full border-2 border-[#020202] bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white/50 ring-1 ring-white/5">
                   D{{i}}
                 </div>
              </div>
              <div class="flex flex-col text-left">
                <span class="text-[10px] font-black text-white uppercase tracking-widest">Confianza Global</span>
                <span class="text-[9px] font-bold text-white/30 uppercase tracking-widest">Utilizado por 250+ clínicas</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Hero (3D Interactive feel) -->
        <div class="relative flex items-center justify-center lg:h-full">
          <!-- Orbital Core -->
          <div class="w-[500px] h-[500px] rounded-full border border-white/5 flex items-center justify-center relative animate-spin-slow">
             <!-- Satelite Icons -->
             <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-125 hover:border-violet-500 transition-all cursor-pointer group">
                <i class="fas fa-file-invoice-dollar text-violet-500 text-2xl group-hover:rotate-12 transition-transform"></i>
             </div>
             <div class="absolute top-1/2 -right-10 -translate-y-1/2 w-20 h-20 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-125 hover:border-indigo-500 transition-all cursor-pointer group">
                <i class="fas fa-calendar-alt text-indigo-500 text-2xl group-hover:rotate-12 transition-transform"></i>
             </div>
             <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-125 hover:border-blue-500 transition-all cursor-pointer group">
                <i class="fas fa-chart-line text-blue-500 text-2xl group-hover:rotate-12 transition-transform"></i>
             </div>
             <div class="absolute top-1/2 -left-10 -translate-y-1/2 w-20 h-20 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-125 hover:border-emerald-500 transition-all cursor-pointer group">
                <i class="fas fa-users text-emerald-500 text-2xl group-hover:rotate-12 transition-transform"></i>
             </div>
             
             <!-- Central Glow -->
             <div class="w-64 h-64 bg-gradient-to-br from-violet-600/30 to-indigo-800/30 rounded-[4rem] border border-white/10 backdrop-blur-3xl flex items-center justify-center shadow-[0_0_80px_rgba(139,92,246,0.15)] animate-pulse-slow">
                <i class="fas fa-tooth text-white text-8xl opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"></i>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Grid Modulos (High Detail) -->
    <section id="modulos" class="py-40 px-10 relative bg-[#020202]">
      <div class="max-w-7xl mx-auto space-y-20">
        <div class="flex flex-col items-center text-center space-y-6">
          <span class="text-[11px] font-black text-violet-500 uppercase tracking-[0.6em]">Premium Ecosystem</span>
          <h2 class="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white">Potencia tu <br> éxito clínico</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[300px]">
          <!-- DTE Premium (6 col) -->
          <div class="md:col-span-8 bg-zinc-900/30 border border-white/5 rounded-[4rem] p-16 overflow-hidden relative group hover:border-violet-500/40 transition-all duration-500">
             <div class="relative z-10 max-w-lg space-y-6 text-left">
                <div class="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center border border-violet-500/20">
                  <i class="fas fa-bolt text-violet-500 text-2xl"></i>
                </div>
                <h3 class="text-4xl font-black uppercase tracking-tighter text-white">Facturación <br> Electrónica Real</h3>
                <p class="text-[12px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                  Integración oficial con el SII (Chile). Emisión de boletas/facturas, libros de venta y firmas digitales en un flujo automatizado 100%.
                </p>
                <div class="flex items-center gap-4 pt-4">
                   <span class="px-5 py-2 bg-violet-600/10 border border-violet-500/20 rounded-full text-[9px] font-black text-violet-400 uppercase tracking-widest">SII Chile Ready</span>
                   <span class="px-5 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">Certificado Digital</span>
                </div>
             </div>
             <!-- Mock UI dynamic decoration -->
             <div class="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-violet-600/5 to-transparent pointer-events-none"></div>
             <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] group-hover:bg-violet-600/40 transition-all duration-700"></div>
          </div>

          <!-- Smart Agenda (4 col) -->
          <div class="md:col-span-4 bg-[#080808] border border-white/5 rounded-[4rem] p-12 hover:border-indigo-500/40 transition-all group">
             <div class="h-full flex flex-col justify-between text-left">
                <i class="fas fa-calendar-alt text-indigo-500 text-4xl group-hover:scale-110 transition-transform origin-left"></i>
                <div class="space-y-4">
                   <h3 class="text-2xl font-black uppercase tracking-tight text-white">Agenda Maestra</h3>
                   <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                     Control absoluto de citas con recordatorios inteligentes vía WhatsApp y sistema de avisos próximo.
                   </p>
                </div>
             </div>
          </div>

          <!-- Analitics Card (4 col) -->
          <div class="md:col-span-4 bg-zinc-900/30 border border-white/5 rounded-[4rem] p-12 group hover:border-blue-500/40 transition-all overflow-hidden relative">
             <div class="relative z-10 flex flex-col h-full justify-between text-left">
                <i class="fas fa-chart-pie text-blue-500 text-4xl"></i>
                <div>
                  <h3 class="text-2xl font-black uppercase tracking-tight text-white">Dashboard Pro</h3>
                  <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                    KPIs en tiempo real. Ingresos, deuda de pacientes y productividad por profesional.
                  </p>
                </div>
             </div>
             <!-- Decoración de gráfico sutil -->
             <div class="absolute -right-10 bottom-0 opacity-10">
                <i class="fas fa-chart-area text-9xl text-blue-500"></i>
             </div>
          </div>

          <!-- Historia Clinica (8 col) -->
          <div class="md:col-span-8 bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-[4rem] p-16 group hover:border-emerald-500/40 transition-all relative overflow-hidden">
             <div class="flex flex-col md:flex-row gap-16 items-center h-full relative z-10 text-left">
                <div class="flex-1 space-y-6">
                   <h3 class="text-4xl font-black uppercase tracking-tighter text-white leading-none">Historia Clínica <br> Odontograma 360°</h3>
                   <p class="text-[12px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                     Diagramas técnicos, evolución de piezas dentales y firmas digitales de consentimientos integradas legalmente.
                   </p>
                   <button class="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Ver Más</button>
                </div>
                <div class="w-full md:w-80 h-48 bg-black/50 rounded-3xl border border-white/5 p-8 flex flex-col justify-center gap-4 relative">
                   <div class="h-2 w-3/4 bg-emerald-500/20 rounded-full"></div>
                   <div class="h-2 w-full bg-emerald-500/40 rounded-full"></div>
                   <div class="h-2 w-1/2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <i class="fas fa-fingerprint absolute right-8 top-8 text-emerald-500/20 text-4xl"></i>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seccion Premium Showcases -->
    <section id="premium" class="py-40 px-10 relative overflow-hidden">
       <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div class="relative order-2 lg:order-1">
             <div class="w-full aspect-video bg-zinc-900 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative group">
                <!-- Capa de brillo superior -->
                <div class="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-white/5"></div>
                <!-- Mockup de interfaz (Abstracto) -->
                <div class="p-10 space-y-8">
                   <div class="flex justify-between items-center border-b border-white/5 pb-6">
                      <div class="flex gap-4">
                         <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                         <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                         <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                      </div>
                      <div class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Panel de Control Premium</div>
                   </div>
                   <div class="grid grid-cols-3 gap-6">
                      <div v-for="i in 3" :key="i" class="h-24 bg-white/5 rounded-2xl border border-white/5 flex flex-col p-4 justify-between">
                         <div class="w-1/2 h-1 bg-white/10 rounded-full"></div>
                         <div class="w-full h-3 bg-white/5 rounded-lg"></div>
                      </div>
                   </div>
                   <div class="h-40 bg-violet-600/5 rounded-[2rem] border border-violet-500/10 p-8 flex items-end gap-2 group-hover:bg-violet-600/10 transition-all">
                      <div v-for="h in [0.4, 0.7, 0.5, 0.9, 0.6, 0.8]" :key="h" :style="{ height: (h * 100) + '%' }" class="flex-1 bg-violet-500/40 rounded-lg group-hover:bg-violet-500 transition-all duration-700"></div>
                   </div>
                </div>
             </div>
             <!-- Badge flotante -->
             <div class="absolute -top-10 -right-10 px-8 py-6 bg-white text-black rounded-[2.5rem] shadow-2xl font-black text-xs uppercase tracking-widest hidden md:block">
                Soporte Priority 24/7
             </div>
          </div>
          <div class="space-y-10 order-1 lg:order-2 text-left">
             <span class="text-[11px] font-black text-violet-500 uppercase tracking-[0.5em]">Enterprise Evolution</span>
             <h2 class="text-6xl font-black tracking-tighter uppercase leading-[0.9] text-white text-left">Gestiona el <br> futuro dental.</h2>
             <p class="text-lg text-white/50 leading-relaxed font-bold uppercase tracking-tight text-left">
               Nuestros planes avanzados permiten centralizar múltiples sucursales, automatizar stocks y auditoría de seguridad bancaria.
             </p>
             <ul class="space-y-6">
                <li v-for="item in ['Auditoría de Logs (Security Center)', 'Laboratorio Interno Digital', 'Automatización de Inventario Pro', 'WhatsApp API Business Integrado']" :key="item" class="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/80 group">
                   <div class="w-6 h-6 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                      <i class="fas fa-check text-[10px]"></i>
                   </div>
                   {{item}}
                </li>
             </ul>
          </div>
       </div>
    </section>

    <!-- Planes de Precios (REAL DATA) -->
    <section id="planes" class="py-40 px-10 bg-[#020202]">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-6 mb-32">
          <span class="text-[11px] font-black text-violet-500 uppercase tracking-[0.6em]">Planes y Suscripciones</span>
          <h2 class="text-6xl font-black tracking-tighter uppercase leading-none text-white">Escala tu éxito</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          
          <!-- Plan Básico -->
          <div class="bg-zinc-900/40 border border-white/5 rounded-[4rem] p-16 hover:bg-zinc-900/60 transition-all group backdrop-blur-sm text-left flex flex-col justify-between">
            <div>
              <h4 class="text-xs font-black uppercase text-white/40 tracking-[0.3em] mb-4">Plan Básico</h4>
              <p class="text-4xl font-black text-white tracking-tighter mb-10 leading-none">Gestión <br> Profesional</p>
              <div class="h-[1px] bg-white/5 w-full mb-10"></div>
              <ul class="space-y-6 mb-12">
                <li v-for="feat in ['Hasta 2 Profesionales', 'Presupuestos & Pagos', 'Recetas Digitales', 'Sala de Espera']" :key="feat" class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">
                  <i class="fas fa-check text-violet-500"></i> {{feat}}
                </li>
              </ul>
            </div>
            <button @click="handleClientAccess" class="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white text-black transition-all">Consultar Plan</button>
          </div>

          <!-- Plan Profesional (Popular) -->
          <div class="bg-violet-600 border border-violet-400 rounded-[4.5rem] p-16 shadow-[0_30px_100px_rgba(124,58,237,0.25)] relative overflow-hidden group text-left flex flex-col justify-between">
            <div class="absolute top-0 right-0 p-10">
               <span class="px-6 py-2 bg-white text-violet-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">Más Popular</span>
            </div>
            <div>
              <h4 class="text-xs font-black uppercase text-white/80 tracking-[0.3em] mb-4">Plan Profesional</h4>
              <p class="text-5xl font-black text-white tracking-tighter mb-10 leading-none">Potencia <br> & DTE (SII)</p>
              <div class="h-[1px] bg-white/20 w-full mb-10"></div>
              <ul class="space-y-6 mb-14">
                <li v-for="feat in ['Facturación Electrónica', 'Módulo Laboratorio', 'WhatsApp & SMS', 'Consentimientos Digitales']" :key="feat" class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white">
                  <i class="fas fa-star text-yellow-300"></i> {{feat}}
                </li>
              </ul>
            </div>
            <button @click="handleClientAccess" class="w-full py-6 bg-white text-violet-600 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 ring-2 ring-white/10">Solicitar Demo</button>
          </div>

          <!-- Plan Enterprise -->
          <div class="bg-zinc-900/40 border border-white/5 rounded-[4rem] p-16 hover:bg-zinc-900/60 transition-all group backdrop-blur-sm text-left flex flex-col justify-between">
            <div>
              <h4 class="text-xs font-black uppercase text-white/40 tracking-[0.3em] mb-4">Plan Enterprise</h4>
              <p class="text-4xl font-black text-white tracking-tighter mb-10 leading-none">Control <br> Total 360°</p>
              <div class="h-[1px] bg-white/5 w-full mb-10"></div>
              <ul class="space-y-6 mb-12">
                <li v-for="feat in ['Recetas Digitales', 'Gestión de Inventario', 'Control de Caja', 'Flujo de Caja Avanzado']" :key="feat" class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">
                  <i class="fas fa-microchip text-violet-600"></i> {{feat}}
                </li>
              </ul>
            </div>
            <button @click="handleClientAccess" class="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-white transition-all">Hablar con Ventas</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Clean -->
    <footer id="contacto" class="py-32 px-10 border-t border-white/10 bg-black relative z-10">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-24">
        <div class="space-y-8 max-w-sm text-left">
           <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <i class="fas fa-tooth text-black text-xl"></i>
              </div>
              <span class="text-xl font-black uppercase tracking-[0.4em] text-white">DentalCloud</span>
           </div>
           <p class="text-[11px] font-bold text-white/20 uppercase tracking-[0.4em] leading-loose">
             Transformando clínicas tradicionales en potencias digitales. Ingeniería dental de clase mundial diseñada para dentistas modernos.
           </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-24 text-left">
          <div class="space-y-6">
             <span class="text-[10px] font-black text-white uppercase tracking-widest">Plataforma</span>
             <div class="flex flex-col gap-4">
                <a href="#modulos" class="text-[9px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Módulos</a>
                <a href="#premium" class="text-[9px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Enterprise</a>
             </div>
          </div>
          <div class="space-y-6">
             <span class="text-[10px] font-black text-white uppercase tracking-widest">Empresa</span>
             <div class="flex flex-col gap-4">
                <a href="#" class="text-[9px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Nosotros</a>
                <a href="#" class="text-[9px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Privacidad</a>
             </div>
          </div>
          <div class="space-y-6 hidden md:block">
             <span class="text-[10px] font-black text-white uppercase tracking-widest">Ayuda</span>
             <div class="flex flex-col gap-4">
                <a href="#" class="text-[9px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Soporte Chat</a>
                <a href="#" class="text-[9px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Documentación</a>
             </div>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto pt-40 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 mt-20">
         <p class="text-[9px] font-black text-white/10 uppercase tracking-[0.6em]">© 2026 DentalCloud Intelligent Systems. All Rights Reserved.</p>
         <div class="flex gap-8">
            <i class="fab fa-twitter text-white/10 hover:text-white cursor-pointer transition-colors"></i>
            <i class="fab fa-linkedin text-white/10 hover:text-white cursor-pointer transition-colors"></i>
            <i class="fab fa-instagram text-white/10 hover:text-white cursor-pointer transition-colors"></i>
         </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@shared/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const scrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50
  })
  // Forzar fondo negro en el body para evitar el problema de visualización blanca
  document.documentElement.style.backgroundColor = '#020202'
  document.body.style.backgroundColor = '#020202'
})

import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.documentElement.style.backgroundColor = ''
  document.body.style.backgroundColor = ''
})

function handleClientAccess() {
  if (authStore.isAuthenticated) {
    if (authStore.isSuperAdmin) {
      router.push('/superadmin/dashboard')
    } else if (authStore.isPacienteUser) {
      router.push('/paciente/portal')
    } else {
      router.push('/dashboard')
    }
  } else {
    router.push('/login')
  }
}

function openDemo() {
  alert('Iniciando entorno de demostración interactiva...')
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');

.font-display {
  font-family: 'Outfit', sans-serif;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 40s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 12s ease-in-out infinite;
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 15s ease infinite;
}

/* Reverse rotation for sub-elements to keep icons upright */
.animate-spin-slow > div {
  animation: spin-slow 40s linear infinite reverse;
}

/* Custom scrollbar for premium dark feel */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #020202;
}
::-webkit-scrollbar-thumb {
  background: #1a1a1a;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2a2a2a;
}

/* Forzado de fondo para evitar el problema de visualización blanca */
:global(body), :global(html) {
  background-color: #020202 !important;
  color: white !important;
}

.landing-root {
  background-color: #020202 !important;
}
</style>
