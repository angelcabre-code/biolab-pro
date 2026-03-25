<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { desktopService } from './core/services/DesktopService';
import { SinergiaSyncService } from './core/services/SinergiaSyncService';
 
onMounted(async () => {
  // Initialize Electron Desktop integration if available
  await desktopService.init();
  
  // Initialize Sinergia Sync Service
  SinergiaSyncService.init();
});
</script>
