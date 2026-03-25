<template>
  <AppLayout title="Sesión en Vivo">
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      <!-- Connection & Athlete Selection -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Status Card -->
        <div class="bg-app-surface border border-app-border p-4 md:p-6 rounded-3xl shadow-sm">
          <!-- Hardware Status Widget -->
          <div class="bg-app-bg/50 border border-app-border rounded-2xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="[isConnected ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : (isSimulated ? 'bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'), 'w-2 h-2 rounded-full animate-pulse']"></div>
              <span class="text-xs font-bold text-app-text tracking-tight uppercase">
                Hardware: {{ isConnected ? 'Enlazado (Azul)' : (isSimulated ? 'Disponible (Verde)' : 'Desconectado') }}
              </span>
            </div>
            <div v-if="!isConnected" class="flex items-center gap-2">
              <button 
                @click="toggleSimulator" 
                class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                :class="isSimulated ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-app-surface border border-app-border text-app-text-muted hover:border-violet-500 hover:text-violet-500'"
              >
                {{ isSimulated ? 'Simulador ON' : 'Activar Simulador' }}
              </button>
            </div>
          </div>
          <p class="text-[10px] text-app-text-muted italic mt-3">
            {{ isConnected ? 'Recibiendo telemetría en tiempo real...' : 'Asegúrate de estar conectado al AP "Biolab-ESP32".' }}
          </p>
        </div>

        <!-- Athlete Selection -->
        <div class="lg:col-span-2 bg-app-surface border border-app-border p-4 md:p-6 rounded-3xl shadow-sm flex flex-col justify-center">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <div class="flex-1">
              <label class="text-xs font-bold text-app-text-muted uppercase mb-1.5 block ml-1">Atleta en sesión</label>
              <select 
                v-model="sessionStore.selectedAthleteId"
                :disabled="sessionStore.isRecording"
                class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text appearance-none disabled:opacity-50"
              >
                <option :value="null">Selecciona un atleta...</option>
                <option v-for="a in athletesStore.athletes" :key="a.id" :value="a.id">
                  {{ a.name }} {{ a.accessCode ? `(${a.accessCode})` : '' }}
                </option>
              </select>
            </div>
            <div class="flex items-end h-full pt-6 md:pt-0">
              <div v-if="selectedAthlete" class="flex items-center gap-3 bg-app-bg p-2 pr-4 rounded-2xl border border-app-border">
                <div class="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold text-sm">
                  {{ selectedAthlete.name.charAt(0) }}
                </div>
                <div>
                  <div class="text-xs font-bold text-app-text">{{ selectedAthlete.name }}</div>
                  <div class="text-[10px] text-app-text-muted">{{ selectedAthlete.category }} | {{ selectedAthlete.weight }}kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Panel & Live Monitor -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Mode Controls -->
        <div class="bg-app-surface border border-app-border p-4 md:p-8 rounded-3xl shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h4 class="font-bold text-app-text">Configuración de Modo</h4>
            <div v-if="sessionStore.isRecording" class="flex items-center gap-2 text-violet-500 text-xs font-bold animate-pulse">
              <div class="w-2 h-2 rounded-full bg-violet-500"></div>
              GRABANDO
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="grid grid-cols-3 gap-3">
              <button 
                v-for="m in modes" 
                :key="m.id"
                @click="setMode(m.id)"
                :disabled="sessionStore.isRecording"
                class="py-4 px-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group disabled:opacity-50"
                :class="sessionStore.activeMode === m.id ? 'border-violet-500 bg-violet-500/5 text-violet-500' : 'border-app-border bg-app-bg text-app-text-muted hover:border-app-text-muted'"
              >
                <component :is="m.icon" :size="24" :class="sessionStore.activeMode === m.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'" />
                <span class="text-[10px] font-bold uppercase tracking-tight">{{ m.label }}</span>
              </button>
            </div>

            <div v-if="sessionStore.activeMode" class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Submodo</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="s in currentSubmodes" 
                    :key="s.id"
                    @click="sessionStore.activeSubmode = s.id"
                    :disabled="sessionStore.isRecording"
                    :title="s.description"
                    class="px-4 py-2 rounded-xl text-xs font-bold transition-all border disabled:opacity-50"
                    :class="sessionStore.activeSubmode === s.id ? 'bg-app-text text-app-surface border-app-text' : 'bg-app-bg text-app-text-muted border-app-border hover:border-app-text-muted'"
                  >
                    {{ s.label }}
                  </button>
                </div>
              </div>

              <!-- Params for Velocidad (Pista) -->
              <div v-if="sessionStore.activeMode === 'PISTA'" class="space-y-4">
                <div v-if="sessionStore.activeSubmode === 'CLASICA'" class="space-y-1.5">
                  <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Distancia de Carrera (m)</label>
                  <select 
                    v-model.number="sessionStore.distancia"
                    :disabled="sessionStore.isRecording"
                    class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text disabled:opacity-50"
                  >
                    <option :value="5">5 metros</option>
                    <option :value="10">10 metros</option>
                    <option :value="20">20 metros</option>
                    <option :value="30">30 metros (Default)</option>
                    <option :value="40">40 metros</option>
                    <option :value="50">50 metros</option>
                    <option :value="100">100 metros</option>
                  </select>
                </div>

                <div v-if="sessionStore.activeSubmode === 'AGILIDAD'" class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Nº Tramos</label>
                    <input 
                      v-model.number="sessionStore.tramos"
                      type="number" min="1" max="10"
                      :disabled="sessionStore.isRecording"
                      class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text disabled:opacity-50"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Distancia/tramo (m)</label>
                    <input 
                      v-model.number="sessionStore.distanciaTramo"
                      type="number" min="0.1" step="0.1"
                      :disabled="sessionStore.isRecording"
                      class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <!-- Params for Bosco (Multisalto) -->
              <div v-if="sessionStore.activeMode === 'PLATAFORMA' && sessionStore.activeSubmode === 'MULTISALTO'" class="animate-in fade-in slide-in-from-top-2 duration-300">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Duración del Test</label>
                  <div class="flex gap-2">
                    <button 
                      v-for="d in [15, 30, 60]" 
                      :key="d"
                      @click="sessionStore.duracionMultisalto = d"
                      :disabled="sessionStore.isRecording"
                      class="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                      :class="sessionStore.duracionMultisalto === d ? 'bg-violet-500 border-violet-500 text-slate-950' : 'bg-app-bg border-app-border text-app-text-muted'"
                    >
                      {{ d }}s
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button 
                  v-if="!sessionStore.isRecording"
                  @click="startSession"
                  :disabled="!isConnected || !sessionStore.selectedAthleteId"
                  class="flex-1 py-4 rounded-2xl font-bold bg-violet-500 hover:bg-violet-600 text-slate-950 shadow-lg shadow-violet-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale relative group/btn"
                >
                  <span>{{ isConnected ? 'Comenzar Registro' : 'Preparar Hardware & Grabar' }}</span>
                  <!-- Helper Hint -->
                  <div v-if="!sessionStore.selectedAthleteId" class="absolute -bottom-8 left-0 right-0 text-[10px] text-orange-500 font-bold animate-pulse text-center">
                    * SELECCIONA UN ATLETA PARA HABILITAR
                  </div>
                </button>
                <div v-if="!sessionStore.isRecording && !sessionStore.selectedAthleteId" class="mt-2 text-[10px] text-orange-500 font-bold animate-pulse text-center w-full">
                  * Selecciona un atleta para habilitar la grabación
                </div>
                <button 
                  v-else
                  @click="sessionStore.stopSession()"
                  class="flex-1 py-4 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
                >
                  Detener Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Display -->
        <div class="bg-app-surface border border-app-border p-4 md:p-8 rounded-3xl shadow-xl flex flex-col relative overflow-hidden group min-h-[300px] md:min-h-[400px]">
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full"></div>
          
          <div class="flex items-center justify-between mb-8 relative z-10">
            <div class="flex items-center gap-2">
              <ActivityIcon class="text-violet-500" :size="20" />
              <span class="text-xs font-bold uppercase tracking-widest text-violet-500/80">Monitor en Tiempo Real</span>
            </div>
            <div v-if="sessionStore.liveData?.terminado" class="px-3 py-1 bg-violet-500 text-slate-950 text-[10px] font-bold rounded-full uppercase">
              Finalizado
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-center items-center text-center relative z-10">
            <div v-if="sessionStore.liveData" class="space-y-4">
              <div class="text-7xl md:text-8xl font-black tracking-tighter tabular-nums text-violet-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)] leading-none">
                {{ sessionStore.liveData.val_main }}<span class="text-2xl md:text-3xl font-bold text-app-text-muted ml-1">{{ sessionStore.liveData.val_unit }}</span>
              </div>
              <div class="text-lg font-bold text-app-text uppercase tracking-widest">{{ sessionStore.liveData.estado }}</div>
            </div>
            <div v-else class="text-app-text-muted italic flex flex-col items-center gap-4 text-center px-8">
              <RefreshCwIcon :size="48" class="opacity-10 animate-spin-slow" />
              <p>Esperando señal de inicio...</p>
              <p class="text-[10px] not-italic opacity-60">Configura el modo y pulsa "Iniciar" para comenzar la captura.</p>
            </div>
          </div>

          <!-- Secondary Stats -->
          <div class="grid grid-cols-2 gap-4 mt-8 relative z-10">
            <div class="bg-app-bg/50 p-4 rounded-2xl border border-app-border">
              <div class="text-[10px] font-bold text-app-text-muted uppercase mb-1">T. Reacción</div>
              <div class="text-xl font-mono font-bold text-app-text">{{ sessionStore.liveData?.t_reac?.toFixed(3) || '0.000' }}<span class="text-xs text-app-text-muted ml-1">s</span></div>
            </div>
            <div v-if="sessionStore.activeMode === 'PLATAFORMA'" class="bg-app-bg/50 p-4 rounded-2xl border border-app-border">
              <div class="text-[10px] font-bold text-app-text-muted uppercase mb-1">T. Vuelo</div>
              <div class="text-xl font-mono font-bold text-app-text">{{ sessionStore.liveData?.t_vuelo?.toFixed(3) || '0.000' }}<span class="text-xs text-app-text-muted ml-1">s</span></div>
            </div>
            <div v-else class="bg-app-bg/50 p-4 rounded-2xl border border-app-border">
              <div class="text-[10px] font-bold text-app-text-muted uppercase mb-1">Tramos</div>
              <div class="text-xl font-mono font-bold text-app-text">{{ sessionStore.liveData?.tramos || '0' }}</div>
            </div>
          </div>

          <!-- Null Warning -->
          <div 
            v-if="sessionStore.liveData?.nula"
            class="absolute inset-x-0 bottom-0 bg-red-500 text-white py-3 px-8 translate-y-0 group-hover:-translate-y-2 transition-transform font-bold text-center z-20"
          >
            ⚠️ SALIDA NULA: {{ sessionStore.liveData.msg_nula }}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import { useAthleteStore } from '../stores/athletes';
import { useSessionStore } from '../stores/sessions';
import { esp32Service } from '../core/services/Esp32Service';
import { 
  ActivityIcon, 
  CircleDotIcon, 
  ZapIcon, 
  TimerIcon,
  RefreshCwIcon
} from 'lucide-vue-next';

type ModeType = 'PLATAFORMA' | 'PISTA' | 'REACCION';

const athletesStore = useAthleteStore();
const sessionStore = useSessionStore();

// UI State (Persistent via Store)
const isConnected = ref(false);
const isSimulated = ref(false);

const modes = [
  { 
    id: 'PLATAFORMA' as const, 
    label: 'BOSCO (Salto)', 
    icon: CircleDotIcon, 
    submodes: [
      { id: 'SJ', label: 'SJ', description: 'Squat Jump: Mide la fuerza explosiva desde posición de sentadilla (90°) sin contramovimiento.' },
      { id: 'CMJ', label: 'CMJ', description: 'Countermovement Jump: Evalúa la fuerza explosiva-elástica mediante un salto con contramovimiento rápido.' },
      { id: 'ABK', label: 'ABK', description: 'Abalakov: Similar al CMJ pero utilizando el balanceo de brazos (Salto Vertical Sinergia).' },
      { id: 'DJ', label: 'DJ', description: 'Drop Jump: Mide la fuerza reactiva saltando inmediatamente tras caer desde una altura.' },
      { id: 'MULTISALTO', label: 'Multisaltos', description: 'Evalúan la resistencia a la potencia anaeróbica (15s/30s/60s).' }
    ]
  },
  { 
    id: 'PISTA' as const, 
    label: 'Velocidad', 
    icon: TimerIcon, 
    submodes: [
      { id: 'CLASICA', label: 'V. Clásica', description: 'Salida tras pitido con reacción.' },
      { id: 'AGILIDAD', label: 'Agilidad', description: 'Medición de tiempo entre tramos (fotocélulas).' },
      { id: 'PURA', label: 'V. Pura', description: 'Velocidad máxima entre fotocélulas sin reacción.' }
    ]
  },
  { 
    id: 'REACCION' as const, 
    label: 'Reacción', 
    icon: ZapIcon, 
    submodes: [
      { id: 'ACUSTICO', label: 'Acústico', description: 'Pitido sonoro.' },
      { id: 'VISUAL', label: 'Visual', description: 'Flash visual.' },
      { id: 'MIXTO', label: 'Mixto', description: 'Sonoro y Visual.' }
    ]
  }
];

const currentSubmodes = computed(() => {
  const m = modes.find(m => m.id === sessionStore.activeMode);
  return m ? m.submodes : [];
});

const selectedAthlete = computed(() => {
  return athletesStore.athletes.find(a => a.id === sessionStore.selectedAthleteId);
});

// Watch mode and submode changes to sync with ESP32 service
watch([
  () => sessionStore.activeMode, 
  () => sessionStore.activeSubmode,
  () => sessionStore.tramos,
  () => sessionStore.distanciaTramo,
  () => sessionStore.duracionMultisalto
], ([mode, sub, tramos, dist, dur]) => {
  if (mode && sub && (isConnected.value || isSimulated.value)) {
    console.log('SESSION: Syncing ESP32 mode with options:', mode, sub, tramos, dist, dur);
    esp32Service.setMode(mode, sub, { 
      tramos, 
      distancia: dist, 
      duracion: dur 
    });
  }
}, { immediate: true });

// Watch mode change to reset submode (within store)
watch(() => sessionStore.activeMode, (newMode) => {
  if (newMode && !sessionStore.activeSubmode) {
    const m = modes.find(m => m.id === newMode);
    sessionStore.activeSubmode = m?.submodes[0].id || '';
  }
});

let unbindData: () => void;
let unbindStatus: () => void;

const toggleSimulator = () => {
  isSimulated.value = esp32Service.toggleSimulator();
};

onMounted(() => {
  unbindStatus = esp32Service.onStatus((status) => {
    isConnected.value = status;
    isSimulated.value = esp32Service.isSimulatorActive;
  });
  unbindData = esp32Service.onData(data => {
    if (data.terminado && sessionStore.isRecording && selectedAthlete.value) {
      sessionStore.processHardwareEvent(
        selectedAthlete.value.id!, 
        selectedAthlete.value.weight, 
        data
      );
    } else {
      sessionStore.liveData = data;
    }
  });
});

onUnmounted(() => {
  if (unbindData) unbindData();
  if (unbindStatus) unbindStatus();
  // We NO LONGER stopSession here to allow persistence
});

const setMode = (mode: ModeType) => {
  sessionStore.activeMode = mode;
  sessionStore.activeSubmode = modes.find(m => m.id === mode)?.submodes[0].id || '';
};

const startSession = async () => {
  if (!sessionStore.activeMode || !sessionStore.activeSubmode || !sessionStore.selectedAthleteId) return;
  
  // Best effort hardware sync
  const ok = await esp32Service.setMode(sessionStore.activeMode, sessionStore.activeSubmode, {
    tramos: sessionStore.tramos,
    distancia: sessionStore.distanciaTramo,
    duracion: sessionStore.duracionMultisalto
  });
  
  if (!ok && isConnected.value) {
    console.warn('SESSION: Hardware sync failed but connection is active. Proceeding with recording.');
  } else if (!ok && !isSimulated.value) {
    alert('Aviso: No se pudo sincronizar con el hardware. Verifica la conexión WiFi si el equipo no responde.');
  }

  sessionStore.liveData = null; 
  await sessionStore.startSession(sessionStore.selectedAthleteId, `${sessionStore.activeMode}:${sessionStore.activeSubmode}`);
};
</script>
