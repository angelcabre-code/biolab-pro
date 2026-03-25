import { db } from '../db/LocalDb';
import { FirebaseService } from './FirebaseService';
import { useSettingsStore } from '../../stores/settings';

export const SinergiaSyncService = {
  syncInterval: null as any,
  isSyncing: false,

  /**
   * Inicializa el servicio de sincronización en segundo plano.
   */
  init() {
    if (this.syncInterval) return;
    
    // Ejecutar cada 60 segundos
    this.syncInterval = setInterval(() => {
      this.syncNow();
    }, 60000);

    // Ejecutar inmediatamente al inicio
    this.syncNow();
    
    console.log('SinergiaSyncService: Background sync initialized');
  },

  /**
   * Ejecuta una sincronización manual inmediata de todos los registros pendientes.
   */
  async syncNow() {
    const settings = useSettingsStore();
    if (!settings.sinergiaSyncEnabled) {
      console.log('SinergiaSyncService: Sync disabled in settings');
      return;
    }

    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      if (!navigator.onLine) {
        console.warn('SinergiaSyncService: Offline, skipping sync');
        return;
      }

      // 1. Buscar registros no sincronizados
      const pendingRecords = await db.records
        .where('synced')
        .equals(0) // Dexie stores boolean as 0/1 sometimes, or check both
        .toArray();

      const filteredRecords = pendingRecords.filter(r => !r.synced);

      if (filteredRecords.length === 0) {
        return;
      }

      console.log(`SinergiaSyncService: Found ${filteredRecords.length} pending records`);

      for (const record of filteredRecords) {
        // Obtener el atleta para ver si tiene vinculación con Sinergia
        const athlete = await db.athletes.get(record.athleteId);
        
        if (athlete && athlete.accessCode && athlete.colectivoId && athlete.alumnoDocId) {
          try {
            // Mapear el tipo de prueba de Biolab a Sinergia
            // Abalakov -> high-jump (En Biolab es JUMP_HEIGHT)
            // 30m Speed -> thirty-meters (En Biolab es PISTA con distancia 30)
            let sinergiaTestId = '';
            if (record.recordType === 'JUMP_HEIGHT') {
              sinergiaTestId = 'high-jump';
            } else if (record.recordType === 'PISTA' && record.distance_m === 30) {
              sinergiaTestId = 'thirty-meters';
            }

            if (sinergiaTestId) {
              await FirebaseService.exportResultToSinergia(
                athlete.colectivoId,
                athlete.alumnoDocId,
                sinergiaTestId,
                record.value,
                {
                   // Podríamos añadir edad/sexo si estuvieran en el registro o atleta
                }
              );
              
              // Marcar como sincronizado
              await db.records.update(record.id!, { synced: true });
              console.log(`SinergiaSyncService: Record ${record.id} synced successfully`);
            } else {
              // Si no es una prueba exportable, la marcamos como synced: true 
              // para no volver a procesarla, o simplemente la ignoramos?
              // El usuario dijo solo Salto Vertical (Abalakov) y 30m.
              console.log(`SinergiaSyncService: Record ${record.id} is not exportable to Sinergia`);
            }
          } catch (error) {
            console.error(`SinergiaSyncService: Error syncing record ${record.id}:`, error);
          }
        } else {
            // Si el atleta no está vinculado, marcamos como synced para no re-intentar?
            // De hecho, synced significa "sincronizado con Sinergia" en este contexto.
            // Si no tiene código, nunca se sincronizará.
            // Para evitar llenar la cola, lo marcamos como true pero sabemos que no fue a Sinergia.
            await db.records.update(record.id!, { synced: true });
        }
      }
    } catch (error) {
      console.error('SinergiaSyncService: Critical error during sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }
};
