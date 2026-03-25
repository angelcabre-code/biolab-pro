import { defineStore } from 'pinia';
import { db, type Athlete } from '../core/db/LocalDb';
import { liveQuery } from 'dexie';
import { ref, onUnmounted } from 'vue';
import { desktopService } from '../core/services/DesktopService';

export const useAthleteStore = defineStore('athletes', () => {
  const athletes = ref<Athlete[]>([]);
  const loading = ref(false);

  // Observable query with Dexie
  const subscription = liveQuery(() => db.athletes.toArray()).subscribe({
    next: (data) => {
      console.log('DB: Athletes updated from liveQuery', data.length);
      athletes.value = data;
    },
    error: (err) => console.error('DB: liveQuery error:', err)
  });

  onUnmounted(() => {
    subscription.unsubscribe();
  });

  const addAthlete = async (athlete: Athlete) => {
    try {
      console.log('DB: Adding athlete:', athlete.name);
      await db.athletes.add(athlete);
      desktopService.syncToVault();
    } catch (error) {
      console.error('DB: Error adding athlete:', error);
      throw error;
    }
  };

  const updateAthlete = async (id: number, athlete: Partial<Athlete>) => {
    try {
      console.log('DB: Updating athlete:', id);
      await db.athletes.update(id, athlete);
      desktopService.syncToVault();
    } catch (error) {
      console.error('DB: Error updating athlete:', error);
      throw error;
    }
  };

  const deleteAthlete = async (id: number) => {
    try {
      console.log('DB: Deleting athlete:', id);
      const deletedCount = await db.athletes.where('id').equals(id).delete();
      desktopService.syncToVault();
      console.log('DB: Deleted count:', deletedCount);
    } catch (error) {
      console.error('DB: Error deleting athlete:', error);
      throw error;
    }
  };

  return { 
    athletes, 
    loading, 
    addAthlete, 
    updateAthlete, 
    deleteAthlete 
  };
});
