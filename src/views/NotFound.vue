<!-- views/NotFound.vue -->
<template>
  <div class="min-h-screen bg-[#fafafa] flex items-center justify-center p-8 animate-fade-in font-outfit">
    <!-- Decorative background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 max-w-xl w-full">
        <!-- Bento Card -->
        <div class="bg-white rounded-[3rem] p-16 shadow-2xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden group">
            <!-- Accent ring -->
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

            <!-- Tooth Icon with specialized effect -->
            <div class="relative mb-12">
                <div class="w-32 h-32 bg-gray-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl transform group-hover:rotate-6 transition-all">
                    <i class="fas fa-tooth text-5xl text-white"></i>
                </div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gray-100 rounded-full animate-ping opacity-20"></div>
            </div>

            <div class="space-y-6">
                <div class="inline-block px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    Error 404 • Página No Encontrada
                </div>
                
                <h1 class="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    Extracción <br> Fallida
                </h1>
                
                <p class="text-sm font-medium text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Parece que la página que buscas ha sido removida o nunca existió. No te preocupes, el resto del sistema está sano.
                </p>
            </div>

            <!-- Action Buttons Bento-style -->
            <div class="mt-16 flex flex-col gap-4">
                <button
                    @click="$router.push('/dashboard')"
                    class="w-full py-6 bg-gray-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 group"
                >
                    <i class="fas fa-home text-violet-400 group-hover:text-white transition-colors"></i>
                    Volver a Consultorio
                </button>
                
                <button
                    @click="$router.back()"
                    class="w-full py-6 bg-white border border-gray-100 text-gray-400 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                    <i class="fas fa-arrow-left"></i>
                    Regresar
                </button>
            </div>
        </div>

        <!-- Utility Links -->
        <div class="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                ¿Problemas técnicos? <a href="#" class="text-gray-900 underline ml-2">Contactar Soporte</a>
            </p>
        </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>