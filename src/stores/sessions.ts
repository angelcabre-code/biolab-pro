import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, type Session, type Record } from '../core/db/LocalDb';
import { PhysicsEngine } from '../core/utils/PhysicsEngine';
import type { Esp32Data } from '../core/services/Esp32Service';
import { desktopService } from '../core/services/DesktopService';
import { SinergiaSyncService } from '../core/services/SinergiaSyncService';

export const useSessionStore = defineStore('sessions', () => {
  const currentSessionId = ref<number | null>(null);
  const isRecording = ref(false);

  // Local state persistence for Live Session view
  const selectedAthleteId = ref<number | null>(null);
  const activeMode = ref<string | null>(null);
  const activeSubmode = ref<string>('');
  const tramos = ref(5);
  const distanciaTramo = ref(5);
  const distancia = ref(30);
  const duracionMultisalto = ref(15);
  const liveData = ref<Esp32Data | null>(null);

  const startSession = async (athleteId: number, sessionType: string) => {
    const session: Session = {
      athleteId,
      date: new Date(),
      sessionType
    };
    currentSessionId.value = (await db.sessions.add(session)) as number;
    isRecording.value = true;
    desktopService.syncToVault();
    console.log('Session: Started session ID', currentSessionId.value);
    return currentSessionId.value;
  };

  const stopSession = () => {
    isRecording.value = false;
    currentSessionId.value = null;
    // We keep liveData and settings until user changes them
  };

  const resetLiveSession = () => {
    liveData.value = null;
    selectedAthleteId.value = null;
    activeMode.value = null;
    activeSubmode.value = '';
    tramos.value = 1;
    distancia.value = 30;
  };

  const ensureActiveSession = async (athleteId: number, type: string) => {
    if (currentSessionId.value) return currentSessionId.value;

    const today = new Date();
    today.setHours(0,0,0,0);
    
    const existing = await db.sessions
      .where('athleteId').equals(athleteId)
      .filter(s => new Date(s.date).getTime() >= today.getTime())
      .first();

    if (existing) {
      currentSessionId.value = existing.id!;
      isRecording.value = true;
      return existing.id!;
    }

    return startSession(athleteId, `AUTO:${type}`);
  };

  const processHardwareEvent = async (athleteId: number, athleteWeight: number, data: Esp32Data) => {
    liveData.value = data; // Persist live data in store
    
    // Auto-Recovery: If no session, try to find or create one
    if (!currentSessionId.value) {
      console.log('Session: No active session, attempting auto-creation...');
      await ensureActiveSession(athleteId, data.tipo);
    }

    if (!currentSessionId.value) return;

    console.log('Session: Processing event for record creation...');

    // 1. Create the main record (Time/Value from ESP32)
    const mainRecord: Record = {
      sessionId: currentSessionId.value,
      athleteId,
      recordType: data.tipo, // PISTA, PLATAFORMA, REACCION
      value: parseFloat(data.val_main),
      unit: data.val_unit,
      timestamp: new Date(),
      synced: false,
      distance_m: data.tipo === 'PISTA' && activeSubmode.value === 'CLASICA' ? distancia.value : undefined,
      segments: data.tipo === 'PISTA' && activeSubmode.value === 'AGILIDAD' ? tramos.value : undefined
    };

    const recordsToSave = [mainRecord];

    // 2. Physics Engine Overrides / Derived Metrics
    if (data.tipo === 'PLATAFORMA') {
      // Calculate Jump Height
      if (data.t_vuelo > 0) {
        const height = PhysicsEngine.calculateJumpHeight(data.t_vuelo);
        recordsToSave.push({
          sessionId: currentSessionId.value,
          athleteId,
          recordType: 'JUMP_HEIGHT',
          value: height,
          unit: 'm',
          timestamp: new Date(),
          synced: false
        });

        const jumpHeightCm = height * 100;
        const peakPower = PhysicsEngine.calculatePeakPower(jumpHeightCm, athleteWeight);
        recordsToSave.push({
          sessionId: currentSessionId.value,
          athleteId,
          recordType: 'PEAK_POWER',
          value: peakPower,
          unit: 'W',
          timestamp: new Date(),
          synced: false
        });
      }

      if (data.t_vuelo > 0 && data.t_contacto > 0) {
        const rsi = PhysicsEngine.calculateRSI(data.t_vuelo, data.t_contacto);
        recordsToSave.push({
          sessionId: currentSessionId.value,
          athleteId,
          recordType: 'RSI',
          value: rsi,
          unit: '',
          timestamp: new Date(),
          synced: false
        });
      }
    }

    // 3. Save to DB
    try {
      await db.records.bulkAdd(recordsToSave);
      desktopService.syncToVault();
      
      // Trigger Sinergia Sync
      SinergiaSyncService.syncNow();
      console.log('Session: Saved', recordsToSave.length, 'records');
    } catch (error) {
      console.error('Session: Error saving records:', error);
    }
  };

  return {
    currentSessionId,
    isRecording,
    selectedAthleteId,
    activeMode,
    activeSubmode,
    tramos,
    distanciaTramo,
    distancia,
    duracionMultisalto,
    liveData,
    startSession,
    stopSession,
    resetLiveSession,
    processHardwareEvent
  };
});
