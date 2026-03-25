<template>
  <AppLayout title="Historial de Récords">
    <div class="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      <!-- Filters -->
      <div class="bg-app-surface border border-app-border p-8 rounded-3xl shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-[10px] font-bold text-app-text-muted uppercase mb-1.5 block ml-1">Atleta</label>
            <select v-model="filterAthlete" class="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-app-text">
              <option :value="null">Todos los atletas</option>
              <option v-for="a in athletes" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-app-text-muted uppercase mb-1.5 block ml-1">Tipo de Prueba</label>
            <select v-model="filterType" class="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-app-text">
              <option value="">Todas las pruebas</option>
              <optgroup label="Core">
                <option value="PLATAFORMA">Plataforma (Salto)</option>
                <option value="PISTA">Pista (Sprint)</option>
                <option value="REACCION">Reacción</option>
              </optgroup>
              <optgroup label="Derivados">
                <option value="JUMP_HEIGHT">Altura de Salto</option>
                <option value="RSI">RSI (Reactividad)</option>
                <option value="PEAK_POWER">Potencia Pico</option>
              </optgroup>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="exportToCSV" class="w-full py-2.5 rounded-xl bg-app-text text-app-surface font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <DownloadIcon :size="16" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-app-surface border border-app-border rounded-3xl shadow-sm overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-app-bg/50 border-b border-app-border">
              <th class="px-6 py-4 text-[10px] font-bold text-app-text-muted uppercase tracking-wider cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('timestamp')">
                Fecha / Hora
                <span v-if="sortKey === 'timestamp'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="px-6 py-4 text-[10px] font-bold text-app-text-muted uppercase tracking-wider cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('athleteId')">
                Atleta
                <span v-if="sortKey === 'athleteId'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="px-6 py-4 text-[10px] font-bold text-app-text-muted uppercase tracking-wider cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('recordType')">
                Prueba
                <span v-if="sortKey === 'recordType'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="px-6 py-4 text-[10px] font-bold text-app-text-muted uppercase tracking-wider text-right cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('value')">
                Marca
                <span v-if="sortKey === 'value'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-app-border">
            <tr v-for="r in filteredRecords" :key="r.id" class="hover:bg-app-bg/30 transition-colors group">
              <td class="px-6 py-4">
                <div class="text-xs font-bold text-app-text">{{ formatDate(r.timestamp) }}</div>
                <div class="text-[10px] text-app-text-muted">{{ formatTime(r.timestamp) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-[10px] text-violet-500 font-bold">
                    {{ getAthleteName(r.athleteId).charAt(0) }}
                  </div>
                  <span class="text-xs font-medium text-app-text">{{ getAthleteName(r.athleteId) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight" :class="getTypeClass(r.recordType)">
                  {{ r.recordType }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-black text-app-text tabular-nums">
                  {{ (r.recordType === 'PLATAFORMA' ? settings.formatValue(r.value, 'jump') : r.value).toFixed(2) }}
                </span>
                <span class="text-[10px] font-bold text-app-text-muted ml-1">
                  {{ r.recordType === 'PLATAFORMA' ? settings.getUnit('jump') : r.unit }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-app-text-muted italic text-sm">
                No hay registros que coincidan con los filtros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import { useSettingsStore } from '../stores/settings';
import { db, type Record, type Athlete } from '../core/db/LocalDb';
import { DownloadIcon } from 'lucide-vue-next';

const records = ref<Record[]>([]);
const athletes = ref<Athlete[]>([]);
const settings = useSettingsStore();
const filterAthlete = ref<number | null>(null);
const filterType = ref('');

// Sorting
const sortKey = ref('timestamp');
const sortOrder = ref<'asc' | 'desc'>('desc');

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

onMounted(async () => {
  records.value = await db.records.orderBy('timestamp').reverse().toArray();
  athletes.value = await db.athletes.toArray();
});

const filteredRecords = computed(() => {
  let list = records.value.filter(r => {
    const matchAthlete = !filterAthlete.value || r.athleteId === filterAthlete.value;
    const matchType = !filterType.value || r.recordType === filterType.value;
    return matchAthlete && matchType;
  });

  return [...list].sort((a, b) => {
    let aVal = (a as any)[sortKey.value];
    let bVal = (b as any)[sortKey.value];

    // Map athleteId to name for sorting if needed
    if (sortKey.value === 'athleteId') {
      aVal = getAthleteName(a.athleteId).toLowerCase();
      bVal = getAthleteName(b.athleteId).toLowerCase();
    }

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const getAthleteName = (id: number) => {
  const a = athletes.value.find(at => at.id === id);
  return a ? a.name : 'Desconocido';
};

const formatDate = (d: Date) => d.toLocaleDateString();
const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const getTypeClass = (type: string) => {
  switch (type) {
    case 'PLATAFORMA': return 'bg-violet-500/10 text-violet-500';
    case 'PISTA': return 'bg-red-500/10 text-red-500';
    case 'REACCION': return 'bg-blue-500/10 text-blue-500';
    case 'JUMP_HEIGHT': return 'bg-violet-500/20 text-violet-600';
    default: return 'bg-app-border text-app-text-muted';
  }
};

const exportToCSV = () => {
  const headers = ['Fecha', 'Hora', 'Atleta', 'Prueba', 'Marca', 'Unidad'];
  const rows = filteredRecords.value.map(r => [
    formatDate(r.timestamp),
    formatTime(r.timestamp),
    getAthleteName(r.athleteId),
    r.recordType,
    r.value,
    r.unit
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `biolab_records_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
