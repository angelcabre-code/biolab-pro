<template>
  <AppLayout>
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <!-- Welcome Summary (Title in Header) -->
      <section class="w-full">
        <p class="text-app-text-muted leading-relaxed">Estado del laboratorio: <span class="text-violet-500 font-bold uppercase tracking-widest text-sm">Óptimo</span>. Tienes {{ athleteCount }} atletas registrados y {{ sessionCount }} sesiones este mes.</p>
      </section>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 2xl:gap-10">
        <div v-for="stat in stats" :key="stat.label" class="bg-app-surface border border-app-border p-4 md:p-6 2xl:p-10 rounded-3xl relative overflow-hidden group hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300">
          <div class="absolute top-0 right-0 w-24 h-24 2xl:w-32 2xl:h-32 bg-violet-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-violet-500/10 transition-colors"></div>
          <p class="text-app-text-muted text-[10px] 2xl:text-xs font-bold uppercase tracking-widest">{{ stat.label }}</p>
          <div class="flex items-end justify-between mt-4">
            <p class="text-4xl 2xl:text-6xl font-black text-app-text tracking-tighter tabular-nums">{{ stat.value }}</p>
            <div :class="[stat.color, 'p-3 2xl:p-4 rounded-2xl ring-1 ring-inset ring-white/10']">
              <component :is="stat.icon" :size="24" class="2xl:scale-125" />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity / Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 text-app-text">
        <section class="bg-app-surface border border-app-border rounded-3xl p-4 md:p-8 hover:shadow-xl transition-all duration-300">
          <h4 class="text-xl font-bold mb-8 flex items-center gap-3">
            <div class="p-2 bg-yellow-500/10 rounded-lg">
              <ZapIcon :size="22" class="text-yellow-500" />
            </div>
            Acciones Rápidas
          </h4>
          <div class="grid grid-cols-2 gap-4 md:gap-6">
            <router-link to="/sessions" class="flex flex-col items-center justify-center p-4 md:p-8 2xl:p-12 bg-app-bg/50 hover:bg-app-bg hover:scale-[1.02] active:scale-95 rounded-2xl border border-app-border transition-all group shadow-sm">
              <FlaskConicalIcon :size="28" class="text-violet-500 mb-4 group-hover:scale-110 2xl:scale-150 transition-transform" />
              <span class="text-sm 2xl:text-lg font-bold tracking-tight">Nueva Sesión</span>
            </router-link>
            <router-link to="/athletes" class="flex flex-col items-center justify-center p-4 md:p-8 2xl:p-12 bg-app-bg/50 hover:bg-app-bg hover:scale-[1.02] active:scale-95 rounded-2xl border border-app-border transition-all group shadow-sm">
              <UserPlusIcon :size="28" class="text-blue-500 mb-4 group-hover:scale-110 2xl:scale-150 transition-transform" />
              <span class="text-sm 2xl:text-lg font-bold tracking-tight">Añadir Atleta</span>
            </router-link>
          </div>
        </section>

        <section class="bg-app-surface border border-app-border rounded-3xl p-4 md:p-8 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div class="flex items-center justify-between mb-8">
            <h4 class="text-xl font-bold flex items-center gap-3">
              <div class="p-2 bg-blue-500/10 rounded-lg">
                <HistoryIcon :size="22" class="text-blue-500" />
              </div>
              Últimas Pruebas
            </h4>
            <router-link to="/records" class="text-[10px] font-bold text-violet-500 uppercase tracking-widest hover:underline">Ver Todo</router-link>
          </div>
          
          <div class="space-y-4">
            <div v-for="r in recentRecords" :key="r.id" class="flex items-center justify-between p-4 rounded-2xl hover:bg-app-bg transition-all cursor-pointer border border-transparent hover:border-app-border group">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-app-text-muted group-hover:text-violet-500 transition-colors">
                  <ActivityIcon :size="20" />
                </div>
                <div>
                  <p class="text-sm font-bold leading-none mb-1">{{ r.recordType }}</p>
                  <p class="text-xs text-app-text-muted font-medium">
                    {{ new Date(r.timestamp).toLocaleDateString() }} • Atleta: {{ getAthleteName(r.athleteId) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-black text-app-text">{{ r.value.toFixed(2) }}<span class="text-[10px] ml-1">{{ r.unit }}</span></div>
              </div>
            </div>
            <div v-if="recentRecords.length === 0" class="py-12 text-center text-app-text-muted italic text-sm">
              No hay actividad reciente.
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import { useSettingsStore } from '../stores/settings';
import { db, type Record, type Athlete } from '../core/db/LocalDb';
import { 
  UsersIcon, 
  FlaskConicalIcon, 
  ActivityIcon, 
  ZapIcon, 
  HistoryIcon, 
  UserPlusIcon,
  AwardIcon
} from 'lucide-vue-next';

const settings = useSettingsStore();
const athleteCount = ref(0);
const sessionCount = ref(0);
const recentRecords = ref<Record[]>([]);
const athletes = ref<Athlete[]>([]);
const bestJump = ref(0);

onMounted(async () => {
  athleteCount.value = await db.athletes.count();
  sessionCount.value = await db.sessions.count();
  recentRecords.value = await db.records.orderBy('timestamp').reverse().limit(4).toArray();
  athletes.value = await db.athletes.toArray();
  
  const jumps = await db.records.where('recordType').equals('JUMP_HEIGHT').toArray();
  if (jumps.length > 0) {
    bestJump.value = Math.max(...jumps.map(j => j.value));
  }
});

const getAthleteName = (id: number) => {
  const a = athletes.value.find(at => at.id === id);
  return a ? a.name : '...';
};

const stats = computed(() => [
  { label: 'Total Atletas', value: athleteCount.value.toString(), icon: UsersIcon, color: 'text-violet-500 bg-violet-500/10' },
  { label: 'Sesiones Totales', value: sessionCount.value.toString(), icon: FlaskConicalIcon, color: 'text-blue-500 bg-blue-500/10' },
  { 
    label: `Récord Salto (${settings.getUnit('jump')})`, 
    value: bestJump.value > 0 ? settings.formatValue(bestJump.value, 'jump').toFixed(2) : '--', 
    icon: AwardIcon, 
    color: 'text-yellow-500 bg-yellow-500/10' 
  },
]);
</script>
