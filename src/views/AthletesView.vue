<template>
  <AppLayout>
    <div class="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <!-- Search & Filters -->
      <div class="bg-app-surface border border-app-border p-8 rounded-3xl shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div class="relative flex-1 w-full scale-110 origin-left">
          <SearchIcon :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted" />
          <input 
            v-model="searchQuery"
            type="text" 
            class="w-full bg-app-bg border border-app-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-app-text"
            placeholder="Buscar por nombre, categoría o email..."
          />
        </div>
        <div class="flex items-center gap-4 w-full md:w-auto">
          <button 
            @click="openModal()"
            class="flex-1 md:flex-none bg-violet-500 hover:bg-violet-600 text-slate-950 font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-3 group active:scale-95 text-sm uppercase tracking-widest"
          >
            <UserPlusIcon :size="20" class="group-hover:rotate-12 transition-transform" />
            Nuevo Atleta
          </button>
    </div>
  </div>

      <!-- Table / Grid -->
      <div class="bg-app-surface border border-app-border rounded-3xl overflow-hidden shadow-sm min-h-[500px]">
        <div v-if="filteredAthletes.length === 0" class="flex flex-col items-center justify-center h-[400px] text-app-text-muted italic">
          <UsersIcon :size="48" class="mb-4 opacity-10" />
          <p>No se encontraron atletas</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-app-bg/50 text-app-text-muted text-xs uppercase tracking-wider font-semibold">
                <th class="px-6 py-4 cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('name')">
                  Atleta
                  <span v-if="sortKey === 'name'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th class="px-6 py-4 cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('accessCode')">
                  Sinergia ID
                  <span v-if="sortKey === 'accessCode'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th class="px-6 py-4 cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('category')">
                  Categoría
                  <span v-if="sortKey === 'category'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th class="px-6 py-4 cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('weight')">
                  Peso ({{ settings.getUnit('weight') }})
                  <span v-if="sortKey === 'weight'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th class="px-6 py-4 cursor-pointer hover:text-violet-500 transition-colors" @click="toggleSort('height_cm')">
                  Talla ({{ settings.getUnit('height') }})
                  <span v-if="sortKey === 'height_cm'" class="ml-1 text-[8px]">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th class="px-6 py-4">Pierna ({{ settings.getUnit('height') }})</th>
                <th class="px-6 py-4">Env. ({{ settings.getUnit('height') }})</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-app-border">
              <tr 
                v-for="athlete in filteredAthletes" 
                :key="athlete.id"
                class="hover:bg-app-bg/50 transition-colors group"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center text-violet-500 font-bold">
                      {{ athlete.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-medium text-app-text">{{ athlete.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span v-if="athlete.accessCode" class="font-mono text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                    {{ athlete.accessCode }}
                  </span>
                  <span v-else class="text-app-text-muted text-xs italic">No vinculado</span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-app-bg rounded-full text-[10px] font-bold text-app-text-muted uppercase tracking-tighter border border-app-border">
                    {{ athlete.category }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono text-violet-500 font-bold">
                  {{ athlete.weight ? settings.formatValue(Number(athlete.weight), 'weight').toFixed(1) : '0.0' }}
                </td>
                <td class="px-6 py-4 font-mono text-app-text">
                  {{ athlete.height_cm ? settings.formatValue(athlete.height_cm, 'height').toFixed(1) : '-' }}
                </td>
                <td class="px-6 py-4 font-mono text-app-text text-xs">
                  {{ athlete.leg_length_cm ? settings.formatValue(athlete.leg_length_cm, 'height').toFixed(1) : '-' }}
                </td>
                <td class="px-6 py-4 font-mono text-app-text text-xs">
                  {{ athlete.wingspan_cm ? settings.formatValue(athlete.wingspan_cm, 'height').toFixed(1) : '-' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="openModal(athlete)"
                      class="p-2 text-app-text-muted hover:text-violet-500 transition-colors"
                      title="Editar"
                    >
                      <EditIcon :size="18" />
                    </button>
                    <button 
                      @click="triggerDelete(athlete.id!)"
                      class="p-2 text-app-text-muted hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2Icon :size="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Athlete Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="closeModal"></div>
      <div class="bg-app-surface border border-app-border w-full max-w-lg rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
        <div class="p-8">
          <h4 class="text-xl font-bold mb-6 text-app-text">{{ isEditing ? 'Editar Atleta' : 'Nuevo Atleta' }}</h4>
          
          <form @submit.prevent="saveAthlete" class="space-y-4">
            <!-- Sinergia Link Section -->
            <div class="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl mb-6 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
                  <LinkIcon :size="14" />
                  Vincular con Sinergia Suite
                </label>
                <div v-if="syncState === 'loading'" class="flex items-center gap-1.5 text-[10px] text-blue-500 font-bold">
                  <RefreshCwIcon :size="10" class="animate-spin" /> Buscando...
                </div>
              </div>
              <div class="flex gap-2">
                <input 
                  v-model="form.accessCode"
                  type="text" 
                  class="flex-1 bg-app-bg border border-app-border rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm font-mono text-app-text uppercase placeholder:text-app-text-muted/50"
                  placeholder="Ej. ABCD-1234"
                  @keyup.enter="fetchFromSinergia"
                />
                <button 
                  type="button"
                  @click="fetchFromSinergia"
                  :disabled="!form.accessCode || syncState === 'loading'"
                  class="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Importar
                </button>
              </div>
              <p v-if="syncState === 'error'" class="text-[10px] text-red-500 font-medium">No se encontró el alumno o error de conexión.</p>
              <p v-if="syncState === 'success'" class="text-[10px] text-violet-500 font-medium">¡Datos importados con éxito!</p>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-app-text-muted uppercase ml-1">Nombre Completo</label>
              <input 
                v-model="form.name"
                required
                type="text" 
                class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-app-text-muted uppercase ml-1">Categoría</label>
                <select 
                  v-model="form.category"
                  class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none text-app-text"
                >
                  <option value="Senior">Senior</option>
                  <option value="Sub-23">Sub-23</option>
                  <option value="Junior">Junior</option>
                  <option value="Cadete">Cadete</option>
                  <option value="Master">Master</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-app-text-muted uppercase ml-1">Peso ({{ settings.getUnit('weight') }})</label>
                <input 
                  v-model.number="form.weight"
                  required
                  step="0.1"
                  type="number" 
                  class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-app-text-muted uppercase ml-1">Talla ({{ settings.getUnit('height') }})</label>
                <input 
                  v-model.number="form.height_cm"
                  type="number" 
                  class="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-app-text"
                  placeholder="175"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-app-text-muted uppercase ml-1">Pierna ({{ settings.getUnit('height') }})</label>
                <input 
                  v-model.number="form.leg_length_cm"
                  type="number" 
                  class="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-app-text"
                  placeholder="90"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-app-text-muted uppercase ml-1">Env. ({{ settings.getUnit('height') }})</label>
                <input 
                  v-model.number="form.wingspan_cm"
                  type="number" 
                  class="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-app-text"
                  placeholder="180"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-app-text-muted uppercase ml-1">Email de contacto</label>
              <input 
                v-model="form.email"
                required
                type="email" 
                class="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-app-text"
                placeholder="email@ejemplo.com"
              />
            </div>

            <div class="flex gap-4 mt-8">
              <button 
                type="button"
                @click="closeModal"
                class="flex-1 bg-app-bg hover:bg-app-surface text-app-text font-bold py-3 rounded-xl border border-app-border transition-all transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="flex-1 bg-violet-500 hover:bg-violet-600 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-500/20 active:scale-95"
              >
                {{ isEditing ? 'Guardar Cambios' : 'Registrar Atleta' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="isDeleteConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="isDeleteConfirmOpen = false"></div>
      <div class="bg-app-surface border border-app-border w-full max-sm rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 p-8 text-center">
        <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2Icon :size="32" />
        </div>
        <h4 class="text-xl font-bold text-app-text mb-2">¿Eliminar atleta?</h4>
        <p class="text-app-text-muted text-sm mb-8">Esta acción no se puede deshacer. Se borrarán todos sus registros asociados.</p>
        <div class="flex gap-3">
          <button 
            @click="isDeleteConfirmOpen = false"
            class="flex-1 bg-app-bg text-app-text font-bold py-3 rounded-xl border border-app-border transition-all"
          >
            Cancelar
          </button>
          <button 
            @click="confirmDelete"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import { useAthleteStore } from '../stores/athletes';
import { useSettingsStore } from '../stores/settings';
import { FirebaseService } from '../core/services/FirebaseService';
import type { Athlete } from '../core/db/LocalDb';
import { 
  UserPlusIcon, 
  SearchIcon, 
  UsersIcon, 
  EditIcon, 
  Trash2Icon,
  LinkIcon,
  RefreshCwIcon
} from 'lucide-vue-next';

const athleteStore = useAthleteStore();
const settings = useSettingsStore();

// UI State
const searchQuery = ref('');
const isModalOpen = ref(false);

// Sorting
const sortKey = ref('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const isDeleteConfirmOpen = ref(false);
const athleteToDeleteId = ref<number | null>(null);
const syncState = ref<'idle' | 'loading' | 'success' | 'error'>('idle');

const form = reactive({
  name: '',
  category: 'Senior',
  weight: 70,
  email: '',
  accessCode: '',
  colectivoId: '',
  alumnoDocId: '',
  height_cm: undefined as number | undefined,
  leg_length_cm: undefined as number | undefined,
  wingspan_cm: undefined as number | undefined
});

// Computed
const filteredAthletes = computed(() => {
  if (!athleteStore.athletes) return [];
  
  let list = athleteStore.athletes;
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(a => 
      a && (
        a.name.toLowerCase().includes(q) || 
        a.category.toLowerCase().includes(q) || 
        a.email.toLowerCase().includes(q) ||
        (a.accessCode && a.accessCode.toLowerCase().includes(q))
      )
    );
  }

  return [...list].sort((a, b) => {
    let aVal = (a as any)[sortKey.value];
    let bVal = (b as any)[sortKey.value];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase() || '';
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

// Actions
const openModal = (athlete?: Athlete) => {
  syncState.value = 'idle';
  if (athlete) {
    isEditing.value = true;
    editingId.value = athlete.id!;
    form.name = athlete.name || '';
    form.category = athlete.category || 'Senior';
    form.weight = athlete.weight || 70;
    form.email = athlete.email || '';
    form.accessCode = athlete.accessCode || '';
    form.colectivoId = athlete.colectivoId || '';
    form.alumnoDocId = athlete.alumnoDocId || '';
    form.height_cm = athlete.height_cm;
    form.leg_length_cm = athlete.leg_length_cm;
    form.wingspan_cm = athlete.wingspan_cm;
  } else {
    isEditing.value = false;
    editingId.value = null;
    form.name = '';
    form.category = 'Senior';
    form.weight = 70;
    form.email = '';
    form.accessCode = '';
    form.colectivoId = '';
    form.alumnoDocId = '';
    form.height_cm = undefined;
    form.leg_length_cm = undefined;
    form.wingspan_cm = undefined;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const fetchFromSinergia = async () => {
  if (!form.accessCode) return;
  
  syncState.value = 'loading';
  try {
    const student = await FirebaseService.fetchAthleteByCode(form.accessCode);
    if (student) {
      form.name = student.name;
      form.email = student.email;
      form.category = student.category;
      form.weight = student.weight;
      form.colectivoId = student.colectivoId;
      form.alumnoDocId = student.alumnoDocId;
      syncState.value = 'success';
    } else {
      syncState.value = 'error';
    }
  } catch (error) {
    syncState.value = 'error';
    console.error('Fetch Sinergia Error:', error);
  }
};

const saveAthlete = async () => {
  console.log('UI: Save button clicked', form);
  
  // Privacy Logic: If accessCode is present, scrub name
  let finalName = form.name.trim();
  if (form.accessCode) {
    finalName = `SINER_STU_${form.accessCode.trim().toUpperCase()}`;
  }

  const athleteData: Athlete = { 
    name: finalName,
    category: form.category,
    weight: Number(form.weight) || 0,
    email: form.email.trim(),
    accessCode: form.accessCode ? form.accessCode.trim().toUpperCase() : '',
    colectivoId: form.colectivoId,
    alumnoDocId: form.alumnoDocId,
    height_cm: form.height_cm ? Number(form.height_cm) : undefined,
    leg_length_cm: form.leg_length_cm ? Number(form.leg_length_cm) : undefined,
    wingspan_cm: form.wingspan_cm ? Number(form.wingspan_cm) : undefined
  };
  
  try {
    if (isEditing.value && editingId.value !== null) {
      console.log('UI: Updating athlete ID:', editingId.value, 'with data:', athleteData);
      await athleteStore.updateAthlete(editingId.value, athleteData);
    } else {
      console.log('UI: Adding new athlete data:', athleteData);
      await athleteStore.addAthlete(athleteData);
    }
    console.log('UI: Save success. Current Store count:', athleteStore.athletes.length);
    closeModal();
  } catch (error: any) {
    console.error('UI Error in saveAthlete:', error);
    alert('No se pudo guardar: ' + (error.message || 'Error de base de datos'));
  }
};

const triggerDelete = (id: number) => {
  console.log('UI: Trigger delete confirm', id);
  athleteToDeleteId.value = id;
  isDeleteConfirmOpen.value = true;
};

const confirmDelete = async () => {
  if (athleteToDeleteId.value === null) return;
  const id = athleteToDeleteId.value;
  console.log('UI: Confirm delete', id);
  try {
    if (editingId.value === id) {
      closeModal();
    }
    await athleteStore.deleteAthlete(id);
    console.log('UI: Delete success');
    isDeleteConfirmOpen.value = false;
    athleteToDeleteId.value = null;
  } catch (error: any) {
    console.error('UI Error in confirmDelete:', error);
    alert('No se pudo eliminar: ' + (error.message || 'Error de base de datos'));
  }
};
</script>
