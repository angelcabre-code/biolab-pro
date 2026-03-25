<template>
  <AppLayout title="Configuración del Sistema">
    <div class="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
      
      <!-- Header Section -->
      <div class="flex flex-col gap-2">
        <h3 class="text-2xl font-black text-app-text uppercase tracking-tighter italic">Centro de Control</h3>
        <p class="text-app-text-muted text-sm uppercase tracking-widest font-bold">Configura tu laboratorio biomecánico</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Trainer Profile Section -->
        <div class="bg-app-surface border border-app-border p-8 rounded-[2rem] shadow-sm space-y-6 hover:border-violet-500/30 transition-all">
          <h3 class="font-black text-app-text flex items-center gap-3 uppercase tracking-widest text-xs">
            <UserCircleIcon :size="20" class="text-violet-500" />
            Perfil Profesional
          </h3>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-app-text-muted uppercase ml-1">Nombre del Entrenador</label>
              <input 
                v-model="settings.trainerName"
                type="text"
                class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-app-text"
                placeholder="Ej: Álvaro"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-app-text-muted uppercase ml-1">Institución / Club</label>
              <input 
                v-model="settings.institution"
                type="text"
                class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-app-text"
                placeholder="Ej: Sinergia Pro Lab"
              />
            </div>
          </div>
        </div>

        <!-- Hardware & Connectivity Section -->
        <div class="bg-app-surface border border-app-border p-8 rounded-[2rem] shadow-sm space-y-6 hover:border-orange-500/30 transition-all">
          <h3 class="font-black text-app-text flex items-center gap-3 uppercase tracking-widest text-xs">
            <CpuIcon :size="20" class="text-orange-500" />
            Hardware & Simulación
          </h3>
          <div class="space-y-5">
            <div class="flex items-center justify-between p-4 bg-app-bg rounded-2xl border border-app-border">
              <div>
                <p class="text-[10px] font-black text-app-text uppercase tracking-widest">Modo Simulador</p>
                <p class="text-[9px] text-app-text-muted">Simular datos del ESP32</p>
              </div>
              <button 
                @click="settings.isSimulatorActive = !settings.isSimulatorActive"
                :class="settings.isSimulatorActive ? 'bg-orange-500 text-white' : 'bg-app-surface text-app-text-muted' "
                class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all border border-app-border"
              >
                {{ settings.isSimulatorActive ? 'Activo' : 'Inactivo' }}
              </button>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center mb-1">
                <label class="text-[10px] font-black text-app-text-muted uppercase ml-1">Sensibilidad de Sensores</label>
                <span class="text-[10px] font-black text-orange-500">{{ settings.sensorSensitivity }}%</span>
              </div>
              <input 
                v-model="settings.sensorSensitivity"
                type="range" min="0" max="100"
                class="w-full h-1.5 bg-app-bg rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </div>

        <!-- System Preferences Section -->
        <div class="bg-app-surface border border-app-border p-8 rounded-[2rem] shadow-sm space-y-6 hover:border-blue-500/30 transition-all">
          <h3 class="font-black text-app-text flex items-center gap-3 uppercase tracking-widest text-xs">
            <SettingsIcon :size="20" class="text-blue-500" />
            Preferencias de Sistema
          </h3>
          <div class="grid grid-cols-2 gap-4">
             <button 
              @click="settings.unitSystem = 'metric'"
              :class="settings.unitSystem === 'metric' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-app-border text-app-text-muted'"
              class="p-4 border rounded-2xl text-center transition-all group"
            >
              <div class="text-[10px] font-black uppercase tracking-widest mb-1">Sistema Métrico</div>
              <div class="text-[9px] opacity-70">m, cm, kg</div>
            </button>
            <button 
              @click="settings.unitSystem = 'imperial'"
              :class="settings.unitSystem === 'imperial' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-app-border text-app-text-muted'"
              class="p-4 border rounded-2xl text-center transition-all group"
            >
              <div class="text-[10px] font-black uppercase tracking-widest mb-1">Sistema Imperial</div>
              <div class="text-[9px] opacity-70">ft, in, lb</div>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 bg-app-bg rounded-2xl border border-app-border">
            <div class="flex items-center gap-3">
              <Volume2Icon v-if="settings.soundsEnabled" :size="18" class="text-blue-500" />
              <VolumeXIcon v-else :size="18" class="text-app-text-muted" />
              <span class="text-[10px] font-black text-app-text uppercase tracking-widest">Sonidos del Sistema</span>
            </div>
            <button 
              @click="settings.soundsEnabled = !settings.soundsEnabled"
              class="w-10 h-5 bg-app-surface rounded-full relative border border-app-border transition-all"
              :class="{ 'bg-blue-500/20': settings.soundsEnabled }"
            >
              <div 
                class="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
                :class="settings.soundsEnabled ? 'right-1 bg-blue-500' : 'left-1 bg-app-text-muted'"
              ></div>
            </button>
          </div>
        </div>

        <!-- Data Lab & Portability -->
        <div class="bg-app-surface border border-app-border p-8 rounded-[2rem] shadow-sm space-y-6 hover:border-emerald-500/30 transition-all">
          <h3 class="font-black text-app-text flex items-center gap-3 uppercase tracking-widest text-xs">
            <DatabaseIcon :size="20" class="text-emerald-500" />
            Laboratorio de Datos
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="exportData"
              class="flex flex-col items-center gap-3 p-4 bg-app-bg border border-app-border rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group"
            >
              <DownloadCloudIcon :size="24" class="text-emerald-500 group-hover:scale-110 transition-transform" />
              <span class="text-[10px] font-black text-app-text uppercase tracking-widest">Exportar Datos</span>
            </button>
            <label class="flex flex-col items-center gap-3 p-4 bg-app-bg border border-app-border rounded-2xl hover:bg-violet-500/10 hover:border-violet-500/50 transition-all group cursor-pointer">
              <UploadCloudIcon :size="24" class="text-violet-500 group-hover:scale-110 transition-transform" />
              <span class="text-[10px] font-black text-app-text uppercase tracking-widest">Importar Datos</span>
              <input type="file" @change="importData" class="hidden" accept=".json" />
            </label>
          </div>
          <button 
            @click="clearDatabase" 
            class="w-full py-4 bg-red-500/5 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Trash2Icon :size="14" />
            Puesta a Cero (Wipe DB)
          </button>
        </div>

        <!-- Sinergia Teacher Sync -->
        <div class="bg-app-surface border border-app-border p-8 rounded-[2rem] shadow-sm space-y-6 hover:border-blue-400/30 transition-all">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-app-text flex items-center gap-3 uppercase tracking-widest text-xs">
              <CloudIcon :size="20" class="text-blue-400" />
              Sinergia Teacher Sync
            </h3>
            <div class="flex items-center gap-2">
              <div :class="isOnline ? 'bg-emerald-500' : 'bg-red-500'" class="w-1.5 h-1.5 rounded-full animate-pulse"></div>
              <span class="text-[8px] font-black uppercase tracking-widest" :class="isOnline ? 'text-emerald-500' : 'text-red-500'">
                {{ isOnline ? 'En línea' : 'Sin Conexión' }}
              </span>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-app-bg rounded-2xl border border-app-border">
              <div>
                <p class="text-[10px] font-black text-app-text uppercase tracking-widest">Sincronización Automática</p>
                <p class="text-[9px] text-app-text-muted">Exportar resultados a la nube</p>
              </div>
              <button 
                @click="settings.sinergiaSyncEnabled = !settings.sinergiaSyncEnabled"
                class="w-10 h-5 bg-app-surface rounded-full relative border border-app-border transition-all"
                :class="{ 'bg-blue-400/20': settings.sinergiaSyncEnabled }"
              >
                <div 
                  class="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
                  :class="settings.sinergiaSyncEnabled ? 'right-1 bg-blue-400' : 'left-1 bg-app-text-muted'"
                ></div>
              </button>
            </div>

            <div v-if="pendingSyncCount > 0" class="flex items-center justify-between p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
              <div class="flex items-center gap-3">
                <RefreshCwIcon :size="16" class="text-orange-500 animate-spin-slow" />
                <span class="text-[10px] font-black text-orange-500 uppercase tracking-widest">Cola de Sincronización</span>
              </div>
              <span class="text-[10px] font-black text-orange-500">{{ pendingSyncCount }} pendientes</span>
            </div>
            <div v-else class="flex items-center justify-center py-4 text-app-text-muted">
               <div class="flex items-center gap-2">
                 <CheckCircleIcon :size="14" class="text-emerald-500" />
                 <span class="text-[9px] font-bold uppercase tracking-widest">Todo sincronizado</span>
               </div>
            </div>
          </div>
        </div>

      </div>

      <div class="pt-10 text-center space-y-2 opacity-50">
        <p class="text-[10px] font-black text-app-text uppercase tracking-[0.4em]">Biolab Pro v1.0.6</p>
        <p class="text-[8px] text-app-text-muted uppercase font-bold tracking-widest">Desarrollado para Élite del Rendimiento Deportivo</p>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue';
import { useSettingsStore } from '../stores/settings';
import { db } from '../core/db/LocalDb';
import { liveQuery } from 'dexie';
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  DatabaseIcon, 
  CpuIcon, 
  UserCircleIcon, 
  SettingsIcon, 
  Volume2Icon, 
  VolumeXIcon,
  DownloadCloudIcon,
  UploadCloudIcon,
  Trash2Icon,
  CloudIcon,
  RefreshCwIcon,
  CheckCircleIcon
} from 'lucide-vue-next';

const settings = useSettingsStore();

// Sync Status State
const isOnline = ref(navigator.onLine);
const pendingSyncCount = ref(0);

// Update online status
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

// Monitor pending records
const syncSubscription = liveQuery(() => 
  db.records.where('synced').equals(0).count()
).subscribe({
  next: (count) => {
    pendingSyncCount.value = count;
  }
});

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
  syncSubscription.unsubscribe();
});

const clearDatabase = async () => {
  if (confirm('¿ATENCIÓN CRÍTICA: Estás seguro de que deseas borrar todos los registros y atletas? Esta acción es irreversible.')) {
    // We clear collections instead of deleting DB to maintain schema
    await db.athletes.clear();
    await db.records.clear();
    await db.sessions.clear();
    window.location.reload();
  }
};

const exportData = async () => {
  const data = {
    athletes: await db.athletes.toArray(),
    records: await db.records.toArray(),
    sessions: await db.sessions.toArray(),
    exportDate: new Date().toISOString(),
    version: '1.5.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `biolab_backup_${new Date().getTime()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importData = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      if (confirm('¿Deseas importar datos? Los datos existentes se mantendrán y se añadirán los nuevos.')) {
        if (data.athletes) await db.athletes.bulkPut(data.athletes);
        if (data.records) await db.records.bulkPut(data.records);
        if (data.sessions) await db.sessions.bulkPut(data.sessions);
        alert('Importación completada con éxito.');
        window.location.reload();
      }
    } catch (err) {
      alert('Error: El archivo no es un backup válido de Biolab.');
    }
  };
  reader.readAsText(file);
};
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  cursor: pointer;
}
</style>
