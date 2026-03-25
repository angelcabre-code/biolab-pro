<template>
  <Teleport to="body">
    <div 
      v-if="shouldShow" 
      ref="panelRef"
      class="fixed z-[200] flex flex-col items-end gap-3 pointer-events-auto"
      :style="{ 
        top: position.y + 'px', 
        left: position.x + 'px',
        width: 'max-content'
      }"
    >
      <!-- Simulation Status Badge (Anchored to panel) -->
      <div 
        class="bg-violet-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce cursor-grab active:cursor-grabbing select-none border-2 border-white/20" 
        @mousedown.stop="startDrag"
      >
        <CpuIcon :size="16" />
        <span class="text-xs font-black uppercase tracking-tighter">Modo Simulación Activo</span>
      </div>

      <!-- Control Panel -->
      <div class="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-72">
        <div 
          class="flex items-center justify-between mb-4 pb-3 border-b border-white/5 cursor-grab active:cursor-grabbing" 
          @mousedown.stop="startDrag"
        >
          <h3 class="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2">
            <RadioIcon :size="14" />
            Hardware Controller
          </h3>
          <div class="flex items-center gap-1.5">
            <button 
              @click="esp32Service.toggleSimulator()"
              class="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
              title="Salir del modo simulación"
            >
              <PowerIcon :size="14" />
            </button>
            <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <!-- Main Trigger: JUMP / CONTACT -->
          <button 
            @click="triggerEvent()"
            class="w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group overflow-hidden relative"
          >
            <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Enviar Resultado</span>
            <div class="flex items-center gap-2 font-display text-lg font-bold">
              <ZapIcon :size="18" class="text-white" />
              {{ actionLabel }}
            </div>
          </button>

          <div class="grid grid-cols-2 gap-3">
            <!-- Simulated Beep / Protocol Start -->
            <button 
              @click="handleStartAction()"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border border-app-border bg-app-bg hover:border-violet-500 hover:bg-violet-500/5 transition-all group relative overflow-hidden"
              :title="submodo === 'PURA' ? 'Simular inicio de carrera' : 'Simular estímulo (Pitido/Flash)'"
            >
              <Volume2Icon v-if="requiresBeep" :size="20" class="text-app-text-muted group-hover:text-violet-500 transition-colors" />
              <ZapIcon v-else-if="requiresFlash" :size="20" class="text-app-text-muted group-hover:text-violet-500 transition-colors" />
              <Volume2Icon v-else :size="20" class="text-app-text-muted group-hover:text-violet-500 transition-colors" />
              
              <span class="text-[10px] font-black uppercase tracking-widest text-app-text-muted group-hover:text-violet-500">
                {{ submodo === 'PURA' ? 'INICIO' : 'ESTÍMULO' }}
              </span>
              
              <!-- Visual Stimulus Indicator (Overlay) -->
              <div v-if="isFlashing" class="absolute inset-0 bg-white shadow-[0_0_50px_white] animate-pulse pointer-events-none z-50"></div>
              <div v-if="requiresBeep || requiresFlash" class="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full animate-ping"></div>
            </button>

            <!-- Simulated Null -->
            <button 
              @click="triggerNull()"
              class="bg-slate-800 hover:bg-slate-700 text-red-400 p-3 rounded-xl flex flex-col items-center gap-1.5 border border-white/5 transition-colors group"
            >
              <XCircleIcon :size="18" />
              <span class="text-[10px] font-bold uppercase text-app-text-muted group-hover:text-red-400">Nula</span>
            </button>
          </div>

          <!-- Parameter Toggles -->
          <div class="bg-black/20 rounded-xl p-3 flex flex-col gap-2 border border-white/5">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-bold text-app-text-muted uppercase tracking-wider">Aleatorizar Datos</span>
              <input type="checkbox" v-model="randomize" class="accent-violet-500" />
            </div>
          </div>

          <p class="text-[8px] text-center text-app-text-muted/40 uppercase font-medium mt-1">
            Draggable Panel • Bio-Sim v1.2
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSessionStore } from '../stores/sessions';
import { esp32Service } from '../core/services/Esp32Service';
import { 
  CpuIcon, 
  RadioIcon, 
  ZapIcon, 
  Volume2Icon, 
  XCircleIcon,
  PowerIcon
} from 'lucide-vue-next';

const sessionStore = useSessionStore();
const route = useRoute();
const randomize = ref(true);

// Only show in Live Session view + Active Simulator
const shouldShow = computed(() => {
  return esp32Service.state.isSimulated && (route.name === 'sessions' || route.path === '/sessions');
});

const submodo = computed(() => sessionStore.activeSubmode || esp32Service.state.lastSubmodo);
const activeMode = computed(() => sessionStore.activeMode || esp32Service.state.lastMode);

// Drag configuration
const position = ref({ x: window.innerWidth - 320, y: window.innerHeight - 500 });
let isDragging = false;
let startOffset = { x: 0, y: 0 };

const startDrag = (e: MouseEvent) => {
  isDragging = true;
  startOffset.x = e.clientX - position.value.x;
  startOffset.y = e.clientY - position.value.y;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging) return;
  
  position.value.x = e.clientX - startOffset.x;
  position.value.y = e.clientY - startOffset.y;
  
  // Constrain to window (safety)
  const margin = 20;
  position.value.x = Math.max(margin, Math.min(position.value.x, window.innerWidth - 300));
  position.value.y = Math.max(margin, Math.min(position.value.y, window.innerHeight - 450));
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// Logic for action-aware simulator
const actionLabel = computed(() => {
  const mode = activeMode.value;
  if (mode === 'PLATAFORMA') return 'SIMULAR SALTO';
  if (mode === 'FOTOCELULA' || mode === 'PISTA') return 'CRUCE META';
  return 'TRIGGER DATA';
});

const requiresBeep = computed(() => {
  const sub = submodo.value || '';
  return sub === 'CLASICA' || sub === 'ACUSTICO' || sub === 'MIXTO';
});

const requiresFlash = computed(() => {
  const sub = submodo.value || '';
  return sub === 'VISUAL' || sub === 'MIXTO' || sub === 'ACUSTICO';
});

const isFlashing = ref(false);

const triggerEvent = () => {
  if (randomize.value) {
    esp32Service.simulateEvent();
  } else {
    esp32Service.simulateEvent({
      val_main: '0.455',
      t_vuelo: 0.455,
      t_contacto: 0.180,
      t_reac: 0.120
    });
  }
};

const triggerNull = () => {
  esp32Service.simulateEvent({
    nula: true,
    msg_nula: 'SALIDA NULA DETECTADA',
    val_main: '0.000'
  });
};

const handleStartAction = () => {
  if (requiresBeep.value) {
    playBeep();
  }
  
  if (requiresFlash.value) {
    isFlashing.value = true;
    setTimeout(() => {
      isFlashing.value = false;
    }, 500);
  }

  console.log('SIMULATOR: Start action triggered for', submodo.value);
};

const playBeep = async () => {
  console.log('SIMULATOR: BEEEP!');
  try {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    const audioCtx = new AudioContextClass();
    
    // Ensure context is running (required by some browsers after user interaction)
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  } catch (e) {
    console.warn('Audio feedback failed', e);
  }
};

onUnmounted(() => {
  stopDrag();
});
</script>
