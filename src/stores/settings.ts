import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { esp32Service } from '../core/services/Esp32Service';

export const useSettingsStore = defineStore('settings', () => {
  // Persistence Helper
  const getStored = (key: string, defaultValue: any) => {
    const stored = localStorage.getItem(`biolab_settings_${key}`);
    if (stored === null) return defaultValue;
    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  };

  const saveStored = (key: string, value: any) => {
    localStorage.setItem(`biolab_settings_${key}`, JSON.stringify(value));
  };

  // State
  const trainerName = ref(getStored('trainerName', 'Álvaro'));
  const institution = ref(getStored('institution', 'Sinergia Pro'));
  const unitSystem = ref(getStored('unitSystem', 'metric')); // 'metric' | 'imperial'
  const soundsEnabled = ref(getStored('soundsEnabled', true));
  const sensorSensitivity = ref(getStored('sensorSensitivity', 85));
  const sinergiaSyncEnabled = ref(getStored('sinergiaSyncEnabled', true));
  const isSimulatorActive = ref(esp32Service.isSimulatorActive);

  // Watchers for persistence
  watch(trainerName, (val) => saveStored('trainerName', val));
  watch(institution, (val) => saveStored('institution', val));
  watch(unitSystem, (val) => saveStored('unitSystem', val));
  watch(soundsEnabled, (val) => saveStored('soundsEnabled', val));
  watch(sensorSensitivity, (val) => saveStored('sensorSensitivity', val));
  watch(sinergiaSyncEnabled, (val) => saveStored('sinergiaSyncEnabled', val));
  
  // Sync Simulator with Service
  watch(isSimulatorActive, (val) => {
    if (val !== esp32Service.isSimulatorActive) {
      esp32Service.toggleSimulator();
    }
  });

  // Listen for external changes to simulator
  esp32Service.onStatus(() => {
    isSimulatorActive.value = esp32Service.isSimulatorActive;
  });

  // Unit System Helpers
  const formatValue = (val: number, type: 'height' | 'weight' | 'distance' | 'jump') => {
    if (unitSystem.value === 'metric') return val;
    
    switch (type) {
      case 'height': return val / 2.54; // cm to in
      case 'weight': return val * 2.20462; // kg to lb
      case 'distance': return val * 3.28084; // m to ft
      case 'jump': return val * 39.3701; // m to in
      default: return val;
    }
  };

  const getUnit = (type: 'height' | 'weight' | 'distance' | 'jump' | 'velocity') => {
    if (unitSystem.value === 'metric') {
      switch (type) {
        case 'height': return 'cm';
        case 'weight': return 'kg';
        case 'distance': return 'm';
        case 'jump': return 'm';
        case 'velocity': return 'm/s';
      }
    } else {
      switch (type) {
        case 'height': return 'in';
        case 'weight': return 'lb';
        case 'distance': return 'ft';
        case 'jump': return 'in';
        case 'velocity': return 'ft/s';
      }
    }
    return '';
  };

  return {
    trainerName,
    institution,
    unitSystem,
    soundsEnabled,
    sensorSensitivity,
    sinergiaSyncEnabled,
    isSimulatorActive,
    formatValue,
    getUnit
  };
});
