<template>
  <AppLayout>
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <!-- Header (Title in Layout) -->
      <div class="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div class="flex items-center gap-3">
          <button 
            @click="exportCSV"
            class="bg-app-surface border border-app-border text-app-text hover:bg-app-bg font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 text-sm"
          >
            <DownloadIcon :size="16" />
            CSV
          </button>
          <button 
            @click="printReport"
            class="bg-app-surface border border-app-border text-app-text hover:bg-app-bg font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 text-sm"
          >
            <PrinterIcon :size="16" />
            PDF
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-app-surface border border-app-border p-6 rounded-3xl shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Atleta</label>
            <select 
              v-model="selectedAthleteId"
              class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text appearance-none"
            >
              <option :value="null">Todos los atletas</option>
              <option v-for="a in athletes" :key="a.id" :value="a.id">
                {{ a.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Comparar con</label>
            <select 
              v-model="compareAthleteId"
              class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-app-text appearance-none disabled:opacity-50"
              :disabled="!selectedAthleteId"
            >
              <option :value="null">Ninguno</option>
              <option v-for="a in athletes" :key="a.id" :value="a.id" :disabled="a.id === selectedAthleteId">
                {{ a.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Chart Section -->
        <div class="bg-app-surface border border-app-border p-4 md:p-6 rounded-3xl shadow-sm h-[350px] md:h-[450px] flex flex-col">
          <div class="flex items-center justify-between mb-6">
            <h4 class="font-bold flex items-center gap-2">
              <LineChartIcon :size="18" class="text-violet-500" />
              Evolución Temporal
            </h4>
            <div class="flex gap-2">
              <button 
                v-for="period in ['all', '3m', '1m']" 
                :key="period"
                @click="chartPeriod = period"
                :class="[chartPeriod === period ? 'bg-violet-500 text-slate-950 font-bold' : 'text-app-text-muted hover:bg-app-bg']"
                class="text-[10px] px-3 py-1 rounded-full transition-all uppercase tracking-wider"
              >
                {{ period }}
              </button>
            </div>
          </div>
          <div class="flex-1 relative">
            <Line v-if="chartData.labels && chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
            <div v-else class="absolute inset-0 flex items-center justify-center text-app-text-muted italic text-sm">
              Selecciona datos para visualizar la gráfica
            </div>
          </div>
        </div>

        <!-- Spreadsheet Section (Now Sidebar in Grid) -->
        <div class="bg-app-surface border border-app-border rounded-3xl overflow-hidden flex flex-col shadow-sm h-[350px] md:h-[450px]">
          <div class="p-6 border-b border-app-border flex items-center justify-between bg-app-bg/10">
            <h4 class="font-bold flex items-center gap-2">
              <TableIcon :size="18" class="text-blue-500" />
              Historial de Marcas
            </h4>
          </div>
          <div class="flex-1 overflow-auto bg-app-bg/5 custom-scrollbar">
            <table class="w-full text-left border-collapse table-fixed">
              <thead class="sticky top-0 bg-app-surface z-10 shadow-sm">
                <tr class="text-[10px] uppercase tracking-tighter text-app-text-muted font-bold border-b border-app-border">
                  <th class="px-4 py-3 w-28">Fecha</th>
                  <th class="px-4 py-3 w-24">Valor</th>
                  <th class="px-4 py-3 w-20">Unit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-app-border">
                <tr v-for="r in sortedRecords.slice(0, 50)" :key="r.id" class="hover:bg-app-bg transition-colors p-2">
                  <td class="px-4 py-3 text-[10px] font-mono whitespace-nowrap">{{ formatDate(r.timestamp) }}</td>
                  <td class="px-4 py-3 font-mono text-violet-500 font-bold text-sm">
                    {{ (r.recordType === 'PLATAFORMA' ? settings.formatValue(r.value, 'jump') : r.value).toFixed(2) }}
                  </td>
                  <td class="px-4 py-3 text-[10px] text-app-text-muted uppercase">
                    {{ r.recordType === 'PLATAFORMA' ? settings.getUnit('jump') : r.unit }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Comparison & Profiles (NEW) -->
      <div v-if="selectedAthlete" class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-in zoom-in-95 duration-500">
        <!-- Biomechanical Profile (Radar) -->
        <div class="lg:col-span-2 bg-app-surface border border-app-border p-4 md:p-8 rounded-3xl shadow-sm h-[400px] md:h-[500px] flex flex-col">
          <div class="flex items-center justify-between mb-8">
            <h4 class="font-bold flex items-center gap-2">
              <DnaIcon :size="20" class="text-blue-500" />
              Perfil Biomecánico
            </h4>
            <div class="text-[10px] font-bold text-app-text-muted uppercase bg-app-bg px-3 py-1 rounded-full border border-app-border">
              Normalizado vs Media de Grupo
            </div>
          </div>
          <div class="flex-1 min-h-0 flex items-center justify-center p-4">
             <Radar v-if="radarData" :data="radarData" :options="radarOptions" />
          </div>
        </div>

        <!-- Biometria & Stats -->
        <div class="flex flex-col gap-6">
          <div class="bg-app-bg border border-app-border p-6 rounded-3xl flex-1 flex flex-col justify-center">
            <span class="text-[10px] font-black text-violet-500 uppercase tracking-widest block mb-4">Métricas del Atleta</span>
            <div class="space-y-2">
              <label class="text-xs font-bold text-app-text-muted uppercase ml-1">Meta de Rendimiento</label>
              <div class="relative">
                <input 
                  v-model.number="targetValue"
                  type="number"
                  placeholder="Ej: 50.0"
                  class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm text-app-text appearance-none"
                />
                <TargetIcon :size="14" class="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted" />
              </div>
            </div>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-xs text-app-text-muted">IMC (Body Mass Index)</span>
                <span class="text-xl font-black text-app-text">{{ bmi.toFixed(1) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-app-text-muted">Potencia Relativa</span>
                <span class="text-xl font-black text-blue-500">{{ relativePower.toFixed(1) }} <span class="text-[10px]">W/kg</span></span>
              </div>
               <div class="flex items-center justify-between">
                <span class="text-xs text-app-text-muted">Consistencia</span>
                <span class="text-xl font-black text-amber-500">{{ consistency.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
          <!-- Trend Card -->
          <div class="bg-app-bg border border-app-border p-6 rounded-3xl shadow-sm flex flex-col justify-center">
            <div class="flex items-center justify-between mb-2">
              <TargetIcon :size="20" class="text-amber-500" />
              <span class="text-[10px] font-black uppercase tracking-widest text-amber-500">Proyección</span>
            </div>
            <div class="text-2xl font-black text-app-text mb-1">{{ projectionDays }}</div>
            <div class="text-[10px] text-app-text-muted">días para la meta</div>
          </div>
        </div>
      </div>

      <!-- Advanced Correlations / Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-app-bg border border-app-border p-6 rounded-3xl shadow-sm flex flex-col justify-center">
          <div class="flex items-center justify-between mb-2">
            <ZapIcon :size="20" class="text-violet-500" />
            <span class="text-[10px] font-black text-violet-500 uppercase tracking-widest">Promedio ({{ settings.getUnit('jump') }})</span>
          </div>
          <div class="text-3xl font-black text-app-text mb-1">{{ settings.formatValue(avgPerformance, 'jump').toFixed(2) }}</div>
          <div class="text-[10px] text-app-text-muted">Rendimiento medio</div>
        </div>
        
        <div class="bg-app-bg border border-app-border p-6 rounded-3xl shadow-sm flex flex-col justify-center">
          <div class="flex items-center justify-between mb-2">
            <TrophyIcon :size="20" class="text-purple-500" />
            <span class="text-[10px] font-black text-purple-500 uppercase tracking-widest">Pico Máx ({{ settings.getUnit('jump') }})</span>
          </div>
          <div class="text-3xl font-black text-app-text mb-1">{{ settings.formatValue(maxPerformance, 'jump').toFixed(2) }}</div>
          <div class="text-[10px] text-app-text-muted">Mejor marca personal</div>
        </div>

        <div class="bg-app-bg border border-app-border p-6 rounded-3xl shadow-sm flex flex-col justify-center">
          <div class="flex items-center justify-between mb-2">
            <TrendingUpIcon :size="20" :class="trendDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'" />
            <span class="text-[10px] font-black uppercase tracking-widest" :class="trendDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'">Tendencia</span>
          </div>
          <div class="text-2xl font-black text-app-text mb-1">
            {{ trendDelta >= 0 ? '+' : '' }}{{ trendDelta.toFixed(1) }}%
          </div>
          <div class="text-[10px] text-app-text-muted">vs. sesión anterior</div>
        </div>

        <div class="bg-app-bg border border-app-border p-6 rounded-3xl shadow-sm flex flex-col justify-center">
          <div class="flex items-center justify-between mb-2">
            <ActivityIcon :size="20" :class="fatigueLevel === 'Normal' ? 'text-blue-500' : 'text-amber-500'" />
            <span class="text-[10px] font-black uppercase tracking-widest" :class="fatigueLevel === 'Normal' ? 'text-blue-500' : 'text-amber-500'">Estado</span>
          </div>
          <div class="text-2xl font-black text-app-text mb-1">{{ fatigueLevel }}</div>
          <div class="text-[10px] text-app-text-muted">{{ fatigueLevel === 'Normal' ? 'Buen ritmo' : 'Fatiga detectada' }}</div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import { useAthleteStore } from '../stores/athletes';
import { useSettingsStore } from '../stores/settings';
import { db } from '../core/db/LocalDb';
import { liveQuery } from 'dexie';
import { 
  DownloadIcon,
  PrinterIcon, 
  LineChartIcon, 
  TableIcon,
  ZapIcon,
  DnaIcon,
  TrophyIcon,
  TargetIcon,
  TrendingUpIcon,
  ActivityIcon
} from 'lucide-vue-next';
import { Line, Radar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  RadialLinearScale,
  Filler,
  type ChartData,
  type ChartOptions
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  RadialLinearScale,
  Filler
);

// Stores & State
const athleteStore = useAthleteStore();
const settings = useSettingsStore();
const selectedAthleteId = ref<number | null>(null);
const compareAthleteId = ref<number | null>(null);
const targetValue = ref<number | null>(null);
const selectedMetric = ref('VAL_MAIN');
const chartPeriod = ref('all');
const rawRecords = ref<any[]>([]);

const metricOptions = [
  { value: 'VAL_MAIN', label: 'Resultado Principal' },
  { value: 'T_REAC', label: 'Tiempo de Reacción (s)' },
  { value: 'T_VUELO', label: 'Tiempo de Vuelo (s)' },
  { value: 'T_CONTACTO', label: 'Tiempo de Contacto (s)' },
  { value: 'HEIGHT', label: 'Altura Estimada (cm)' }
];

// Subscriptions
onMounted(() => {
  liveQuery(() => db.records.toArray()).subscribe(data => {
    rawRecords.value = data;
  });
});

// Computed
const athletes = computed(() => athleteStore.athletes);
const selectedAthlete = computed(() => 
  athletes.value.find(a => a.id === selectedAthleteId.value)
);

const analysisRecords = computed(() => {
  let filtered = rawRecords.value;
  if (selectedAthleteId.value) {
    filtered = filtered.filter(r => r.athleteId === selectedAthleteId.value);
  }
  return filtered;
});

const sortedRecords = computed(() => {
  return [...analysisRecords.value].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
});

// Advanced Calculations
const bmi = computed(() => {
  if (!selectedAthlete.value || !selectedAthlete.value.height_cm) return 0;
  const h = selectedAthlete.value.height_cm / 100;
  return selectedAthlete.value.weight / (h * h);
});

const relativePower = computed(() => {
  // Simplistic Power calc: P = m * g * h
  // Formula: Power = Weight * 9.81 * sqrt(2 * 9.81 * JumpHeight)
  const jumps = analysisRecords.value.filter(r => r.recordType === 'PLATAFORMA');
  if (jumps.length === 0 || !selectedAthlete.value) return 0;
  const bestJump = Math.max(...jumps.map(j => j.value));
  const gravity = 9.81;
  const absolutePower = selectedAthlete.value.weight * gravity * Math.sqrt(2 * gravity * (bestJump / 100));
  return absolutePower / selectedAthlete.value.weight;
});

const avgPerformance = computed(() => {
  const values = analysisRecords.value.map(r => r.value);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
});

const maxPerformance = computed(() => {
  const values = analysisRecords.value.map(r => r.value);
  return values.length > 0 ? Math.max(...values) : 0;
});

const consistency = computed(() => {
  const avg = avgPerformance.value;
  if (avg === 0) return 0;
  const deviations = analysisRecords.value.map(r => Math.abs(r.value - avg));
  const avgDev = deviations.reduce((a, b) => a + b, 0) / deviations.length;
  // CV based consistency
  return Math.max(0, 100 - (avgDev / avg * 100));
});

const trendDelta = computed(() => {
  const records = [...analysisRecords.value].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  if (records.length < 2) return 0;
  
  // Group by "session day" (simplified)
  const currentVal = records[0].value;
  const prevVal = records[1].value;
  
  if (prevVal === 0) return 0;
  return ((currentVal - prevVal) / prevVal) * 100;
});

const fatigueLevel = computed(() => {
  if (analysisRecords.value.length < 5) return 'Normal';
  const cv = (100 - consistency.value);
  if (cv > 15) return 'Fatiga';
  if (cv > 8) return 'Aviso';
  return 'Normal';
});

const projectionDays = computed(() => {
  if (!targetValue.value || trendDelta.value <= 1) return '--';
  const current = avgPerformance.value;
  const target = targetValue.value;
  if (current >= target) return 'Meta OK';
  
  // Very simplistic projection
  const improvementPerSession = (trendDelta.value / 100) * current;
  const needed = target - current;
  const sessions = Math.ceil(needed / improvementPerSession);
  return `~${sessions * 3}`; // Assuming 3 days per session
});

// Chart Logic (Evolution Line)
const chartData = computed<ChartData<'line'>>(() => {
  const dataset1 = [...analysisRecords.value]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  const datasets: any[] = [{
    label: selectedAthlete.value?.name || metricOptions.find(m => m.value === selectedMetric.value)?.label || '',
    data: dataset1.map(r => r.value),
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 3,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#10b981',
    fill: true
  }];

  if (compareAthleteId.value) {
    const dataset2 = rawRecords.value
      .filter(r => r.athleteId === compareAthleteId.value)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    datasets.push({
      label: athletes.value.find(a => a.id === compareAthleteId.value)?.name || 'Comparativa',
      data: dataset2.map(r => r.value),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
      fill: true
    });
  }

  if (targetValue.value) {
    datasets.push({
      label: 'Meta',
      data: new Array(dataset1.length).fill(targetValue.value),
      borderColor: '#f59e0b',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false
    });
  }
  
  return {
    labels: dataset1.map(r => new Date(r.timestamp).toLocaleDateString()),
    datasets
  };
});

// Radar Calculation Logic (Profiles)
const radarData = computed<ChartData<'radar'> | null>(() => {
  if (!selectedAthleteId.value) return null;

  const calculateAthleteStats = (aId: number) => {
    const aRecords = rawRecords.value.filter(r => r.athleteId === aId);
    
    // Normalization logic (simplified for now: 0-100 score)
    // In a real app, these would compare against group means
    const explosivity = Math.min(100, (Math.max(0, ...aRecords.filter(r => r.recordType === 'PLATAFORMA').map(r => r.value)) / 60) * 100);
    const reaction = Math.min(100, (0.5 / Math.min(1, ...aRecords.filter(r => r.recordType === 'REACCION').map(r => r.value))) * 100);
    const speed = Math.min(100, (4.5 / Math.min(6, ...aRecords.filter(r => r.recordType === 'VELOCIDAD').map(r => r.value))) * 100);
    const power = Math.min(100, (relativePower.value / 40) * 100);
    const consistencyScore = 100 - (100 - consistency.value);

    return [
      explosivity || 20, 
      reaction || 20, 
      speed || 20, 
      power || 20, 
      consistencyScore || 20
    ];
  };

  const mainStats = calculateAthleteStats(selectedAthleteId.value);
  const datasets: any[] = [{
    label: selectedAthlete.value?.name,
    data: mainStats,
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    pointBackgroundColor: '#10b981',
    borderWidth: 2
  }];

  if (compareAthleteId.value) {
    datasets.push({
      label: athletes.value.find(at => at.id === compareAthleteId.value)?.name,
      data: calculateAthleteStats(compareAthleteId.value),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      pointBackgroundColor: '#3b82f6',
      borderWidth: 2
    });
  }

  return {
    labels: ['Explosividad', 'Reacción', 'Velocidad', 'Potencia', 'Consistencia'],
    datasets
  };
});

const radarOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#64748b', font: { family: 'Inter', size: 10 } } }
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      beginAtZero: true,
      grid: { color: 'rgba(51, 65, 85, 0.1)' },
      pointLabels: { color: '#64748b', font: { family: 'Inter', size: 10, weight: 'bold' } },
      angleLines: { color: 'rgba(51, 65, 85, 0.1)' },
      ticks: { display: false }
    }
  }
};

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { family: 'Inter', size: 12, weight: 'bold' },
      bodyFont: { family: 'Inter', size: 12 },
      padding: 12,
      cornerRadius: 12,
      displayColors: false
    }
  },
  scales: {
    y: {
      grid: { color: 'rgba(51, 65, 85, 0.1)' },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } }
    }
  }
};

// Helpers
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('es-ES', { 
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
  });
};

const exportCSV = () => {
  const headers = ['Fecha', 'Atleta', 'Peso', 'Talla', 'Prueba', 'Valor', 'Unidad'];
  const rows = analysisRecords.value.map(r => {
    const a = athletes.value.find(at => at.id === r.athleteId);
    return [
      new Date(r.timestamp).toISOString(),
      a?.name || '',
      a?.weight || '',
      a?.height_cm || '',
      r.recordType,
      r.value,
      r.unit
    ].join(',');
  });
  
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `analisis_biometrico_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
};

const printReport = () => {
  window.print();
};
</script>

<style scoped>
@media print {
  aside, button, .no-print {
    display: none !important;
  }
  .bg-app-bg {
    background: white !important;
  }
  .text-app-text {
    color: black !important;
  }
  .border {
    border-color: #eee !important;
  }
  .shadow-sm {
    shadow: none !important;
  }
}
</style>
