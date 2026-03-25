<template>
  <div class="flex h-screen bg-app-bg text-app-text font-sans overflow-hidden transition-colors duration-300">
    <!-- Global Loading Overlay -->
    <div v-if="globalLoading" class="fixed inset-0 z-[100] bg-white/5 dark:bg-black/5 backdrop-blur-[6px] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <img src="/animacioncargasinergia.png" alt="Loading" class="w-40 h-40 mb-10 animate-glow-pulse" />
      <div class="flex items-center gap-3 text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none font-display">
        <span class="text-violet-500">Sincronizando</span>
        <span class="text-violet-500 ml-2">Biolab <span class="text-app-text not-italic">Pro</span></span>
      </div>
    </div>
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 bg-app-surface border-r border-app-border flex flex-col transition-all duration-300">
      <div class="px-6 py-10 flex flex-col items-center gap-4 relative flex-shrink-0">
        <div class="absolute inset-0 bg-violet-600/5 blur-3xl rounded-full scale-75 opacity-20"></div>
        <img src="/logo_sinergia.png" alt="Sinergia Logo" class="w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] filter hover:rotate-3 transition-transform duration-500" />
        <div class="text-center relative z-10 w-full px-2">
          <h1 class="text-3xl font-black text-violet-500 uppercase tracking-tighter font-display italic leading-none mb-1">
            Biolab <span class="text-app-text not-italic">Pro</span>
          </h1>
          <p class="text-[9px] font-bold text-app-text-muted uppercase tracking-[0.3em] leading-tight opacity-70">
            Laboratorio de Biomecánica
          </p>
        </div>
      </div>

      <nav class="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar min-h-0">
          <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative border border-transparent"
          :class="[
            $route.name === item.routeName 
              ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/10' 
              : 'text-app-text-muted hover:bg-app-bg hover:text-app-text'
          ]"
        >
          <component :is="item.icon" :size="20" :class="[ $route.name === item.routeName ? 'text-violet-500' : 'text-app-text-muted transition-colors group-hover:text-app-text' ]" />
          <span class="font-bold tracking-tight text-sm">{{ item.label }}</span>
          <div 
            v-if="$route.name === item.routeName"
            class="ml-auto w-1 h-5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"
          ></div>
        </router-link>
      </nav>

      <div class="p-4 border-t border-app-border">
        <div class="bg-app-surface/50 p-4 rounded-xl border border-app-border">
          <p class="text-xs text-app-text-muted mb-1 font-medium italic uppercase tracking-widest text-[10px]">Development</p>
          <p class="text-[10px] text-app-text-muted italic opacity-60">Simulator Active</p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div 
      class="flex-1 min-w-0 h-screen flex flex-col transition-all duration-700 font-sans selection:bg-violet-500/30 selection:text-violet-200"
      :class="isDark ? 'from-slate-900 via-slate-950 to-slate-950 bg-gradient-to-br' : 'from-slate-100 via-slate-50 to-slate-50 bg-gradient-to-br'">
      
      <!-- Legal Modal (Mandatory for Compliance) -->
      <div v-if="showLegalModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
        <div class="bg-app-surface border border-app-border w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-500">
          <!-- Header -->
          <div class="px-10 py-8 border-b border-app-border bg-gradient-to-r from-violet-600/10 to-transparent">
            <h3 class="text-2xl font-black text-app-text tracking-tight uppercase flex items-center gap-3">
              <ShieldCheckIcon class="text-violet-500" :size="28" />
              Términos y Privacidad
            </h3>
            <p class="text-xs text-app-text-muted font-medium mt-1 uppercase tracking-widest">Contrato de Licencia de Usuario Final (EULA)</p>
          </div>

          <!-- Scrollable Content -->
          <div 
            @scroll="handleLegalScroll"
            class="flex-1 overflow-y-auto p-10 custom-scrollbar text-sm text-app-text/90 leading-relaxed font-sans"
          >
            <div class="space-y-6">
              <div v-for="(block, i) in licenseBlocks" :key="i" class="space-y-2">
                <h4 v-if="block.title" class="font-black text-app-text uppercase text-[10px] tracking-wider text-violet-500">{{ block.title }}</h4>
                <p v-html="block.content"></p>
              </div>
            </div>
            <!-- Bottom Indicator -->
            <div id="legal-bottom-marker" class="h-4 w-full"></div>
          </div>

          <!-- Footer -->
          <div class="px-10 py-8 border-t border-app-border bg-app-bg/30 flex flex-col gap-6">
            <div class="flex flex-col gap-4">
              <!-- Horizontal Progress Bar -->
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-app-text-muted mb-1">
                  <span>Progreso de lectura</span>
                  <span class="tabular-nums text-violet-500">{{ Math.round(scrollProgress) }}%</span>
                </div>
                <div class="h-2 w-full bg-app-bg border border-app-border rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.4)]" 
                    :style="{ width: `${scrollProgress}%` }"
                  ></div>
                </div>
              </div>

              <div class="flex items-center justify-between gap-6 mt-2">
                <p class="text-[9px] text-app-text-muted leading-tight max-w-[300px] uppercase font-bold tracking-tighter">
                  <span v-if="hasReadFull" class="text-green-500 flex items-center gap-1">
                    <CheckCircleIcon :size="12" /> Lectura completada. Puede proceder.
                  </span>
                  <span v-else class="animate-pulse flex items-center gap-1">
                    <InfoIcon :size="12" /> Deslice hasta el final para habilitar el botón.
                  </span>
                </p>
              
              <button 
                @click="acceptLegal"
                :disabled="!hasReadFull"
                class="px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group relative overflow-hidden"
                :class="hasReadFull ? 'bg-violet-500 text-slate-950 hover:bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-app-bg border border-app-border text-app-text-muted'"
              >
                Aceptar
              </button>
            </div>

            <!-- Always Show Option -->
            <div class="flex items-center gap-3 px-2">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative w-5 h-5 transition-all">
                  <input 
                    type="checkbox" 
                    v-model="dontShowAgain" 
                    class="peer sr-only"
                  />
                  <div class="w-full h-full rounded-md border-2 border-app-border bg-app-bg peer-checked:bg-violet-500 peer-checked:border-violet-500 transition-all"></div>
                  <CheckIcon :size="14" class="absolute inset-0 m-auto text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span class="text-[10px] uppercase font-black tracking-widest text-app-text-muted group-hover:text-app-text transition-colors">No mostrar este mensaje de nuevo</span>
              </label>
            </div>
          </div>
        </div>
        </div>
      </div>

      <header class="h-16 border-b border-app-border flex items-center justify-between px-8 bg-app-bg/50 backdrop-blur-md sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <h2 class="text-3xl font-black text-violet-500 uppercase tracking-tighter font-display italic leading-none">
            <template v-for="(word, index) in currentTitle.split(' ')" :key="index">
              <span :class="[index >= 1 ? 'text-app-text not-italic ml-2' : (index > 0 ? 'ml-2' : '')]">
                {{ word }}
              </span>
            </template>
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <!-- Social Buttons -->
          <div class="flex items-center gap-1.5 mr-2">
            <a href="https://www.psicologiaysinergia.es/" target="_blank" class="p-2 rounded-lg text-app-text-muted hover:text-violet-500 hover:bg-violet-500/10 transition-all" title="Web Oficial">
              <GlobeIcon :size="18" />
            </a>
            <a href="https://www.instagram.com/psicologiaysinergia/" target="_blank" class="p-2 rounded-lg text-app-text-muted hover:text-pink-500 hover:bg-pink-500/10 transition-all" title="Instagram">
              <InstagramIcon :size="18" />
            </a>
            <a href="mailto:info@psicologiaysinergia.es" class="p-2 rounded-lg text-app-text-muted hover:text-blue-500 hover:bg-blue-500/10 transition-all" title="Email de Soporte">
              <MailIcon :size="18" />
            </a>
          </div>

          <div class="h-6 w-px bg-app-border mx-1"></div>

          <!-- Fullscreen Toggle -->
          <button 
            @click="toggleFullscreen"
            class="p-2.5 rounded-xl border border-app-border hover:bg-app-surface transition-all text-app-text-muted hover:text-app-text"
            title="Pantalla completa"
          >
            <MaximizeIcon v-if="!isFullscreen" :size="18" />
            <MinimizeIcon v-else :size="18" />
          </button>

          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme"
            class="p-2.5 rounded-xl border border-app-border hover:bg-app-surface transition-all group relative overflow-hidden"
            title="Cambiar tema"
          >
            <div class="relative z-10">
              <SunIcon v-if="isDark" :size="18" class="text-yellow-500 group-hover:rotate-45 transition-transform" />
              <MoonIcon v-else :size="18" class="text-slate-600 group-hover:-rotate-12 transition-transform" />
            </div>
            <div class="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors"></div>
          </button>

          <button class="p-2.5 rounded-xl border border-app-border hover:bg-app-surface transition-all text-app-text-muted hover:text-app-text">
            <BellIcon :size="18" />
          </button>
                    <div class="h-8 w-px bg-app-border mx-2"></div>

            <button 
              v-if="isSimulated" 
              @click="esp32Service.toggleSimulator()"
              class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white transition-all animate-pulse"
              title="Click para desactivar simulador"
            >
              <RefreshCwIcon :size="14" />
              <span class="text-[10px] font-black uppercase tracking-widest">Simulador Activo</span>
            </button>

            <div class="flex items-center gap-3 pl-1">
            <div class="text-right hidden sm:block">
              <p class="text-xs font-bold text-app-text leading-tight uppercase tracking-tighter">Pro User</p>
              <p class="text-[10px] text-app-text-muted leading-tight">Elite Plan</p>
            </div>
            <div class="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-500 ring-4 ring-violet-500/5">
              <UserIcon :size="20" />
            </div>
          </div>
        </div>
      </header>
      
      <div class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth bg-app-bg/20">
        <div class="w-full p-6 md:p-10 space-y-8">
          <slot></slot>
        </div>
      </div>

      <!-- Simulator Indicators -->
      <SimulationPanel />
      
      <div v-if="isSimulated" class="fixed top-0 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top duration-500">
        <div class="bg-orange-500 text-white px-8 py-1.5 rounded-b-2xl shadow-lg border-x border-b border-white/20 flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.3em]">Ambiente de Simulación Activo</span>
          <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { esp32Service } from '../core/services/Esp32Service';
import { 
  HistoryIcon,
  BookOpenIcon,
  LineChartIcon,
  LayoutDashboardIcon,
  UsersIcon,
  FlaskConicalIcon,
  SettingsIcon,
  BellIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  RefreshCwIcon,
  MaximizeIcon,
  MinimizeIcon,
  GlobeIcon,
  InstagramIcon,
  MailIcon,
  ShieldCheckIcon,
  CheckIcon,
  CheckCircleIcon,
  InfoIcon
} from 'lucide-vue-next';
import SimulationPanel from '../components/SimulationPanel.vue';

const route = useRoute();
const isDark = ref(true);
const isSimulated = ref(false);
const globalLoading = ref(true);
const isFullscreen = ref(false);
const dontShowAgain = ref(false);
const scrollProgress = ref(0);
const hasReadFull = computed(() => scrollProgress.value >= 98);

// Ensure modal only shows ONCE per app launch in memory if not accepted permanently
const SESSION_LICENSE_KEY = 'biolab_session_license_shown';
const showLegalModal = ref(false);

const licenseBlocks = [
  { title: "1. PROPIEDAD INTELECTUAL", content: "Biolab Pro es un software científico propiedad de <strong>Ángel Cabrera Ochoa (Psicología y Sinergia)</strong>. Todos los derechos reservados. Queda prohibida la redistribución no autorizada o ingeniería inversa del software." },
  { title: "2. PRIVACIDAD DESDE EL DISEÑO (PRIVACY BY DESIGN)", content: "Biolab Pro ha sido diseñado para operar prioritariamente de forma local y anónima. El software no almacena nombres reales de alumnos en su base de datos persistente local para proteger la intimidad de los menores." },
  { title: "3. TRATAMIENTO DE DATOS DE MENORES", content: "En cumplimiento con el RGPD, la vinculación entre el rendimiento físico y el alumno se realiza únicamente mediante códigos alfanuméricos anónimos gestionados por el docente." },
  { title: "4. SINCRONIZACIÓN EN LA NUBE", content: "Al utilizar la función de sincronización, los datos (tiempos de vuelo, marcas) se enviarán de forma cifrada a los servidores de Sinergia Deportiva, vinculados únicamente al código personal." },
  { title: "5. RESPONSABILIDAD DEL USUARIO", content: "El usuario se compromete a utilizar la herramienta en el marco de la legalidad vigente de su centro educativo o institución deportiva." },
  { title: "6. ACEPTACIÓN DE TÉRMINOS", content: "Al pulsar en 'Aceptar', usted confirma que ha leído y acepta íntegramente estos términos para el uso de Biolab Pro v1.0.6." }
];

const handleLegalScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
  scrollProgress.value = Math.min(progress, 100);
};

const acceptLegal = () => {
  if (dontShowAgain.value) {
    localStorage.setItem('biolab_legal_accepted_v106', 'true');
  }
  sessionStorage.setItem(SESSION_LICENSE_KEY, 'true');
  showLegalModal.value = false;
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const isAccepted = localStorage.getItem('biolab_legal_accepted_v106');
  const wasShownThisSession = sessionStorage.getItem(SESSION_LICENSE_KEY);
  
  if (!isAccepted && !wasShownThisSession) {
    showLegalModal.value = true;
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    isDark.value = false;
    document.documentElement.classList.add('light');
  } else {
    isDark.value = true;
    document.documentElement.classList.remove('light');
  }

  // Simulate initial loading for Sinergia Branding
  setTimeout(() => {
    globalLoading.value = false;
  }, 1500);

  // Escuchar estado del simulador
  esp32Service.onStatus(() => {
    isSimulated.value = esp32Service.isSimulatorActive;
  });
});

const navItems = [
  { name: 'dashboard', label: 'Inicio', path: '/', routeName: 'dashboard', icon: LayoutDashboardIcon },
  { name: 'sessions', label: 'Sesión en Vivo', path: '/sessions', routeName: 'sessions', icon: FlaskConicalIcon },
  { name: 'records', label: 'Historial', path: '/records', routeName: 'records', icon: HistoryIcon },
  { name: 'analysis', label: 'Análisis Avanzado', path: '/analysis', routeName: 'analysis', icon: LineChartIcon },
  { name: 'athletes', label: 'Gestión de Atletas', path: '/athletes', routeName: 'athletes', icon: UsersIcon },
  { name: 'docs', label: 'Documentación', path: '/docs', routeName: 'docs', icon: BookOpenIcon },
  { name: 'settings', label: 'Ajustes', path: '/settings', routeName: 'settings', icon: SettingsIcon },
];

const currentTitle = computed(() => {
  if (route.name === 'dashboard') return 'BIENVENIDO AL LABORATORIO';
  const item = navItems.find(i => i.routeName === route.name);
  return item ? item.label : 'Biolab Pro';
});
</script>

<style scoped>
.scroll-smooth {
  scroll-behavior: smooth;
}
</style>
