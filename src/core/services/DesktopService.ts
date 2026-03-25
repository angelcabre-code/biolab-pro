import { db } from '../db/LocalDb';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';

/**
 * DesktopService handles the integration with the Electron environment.
 * It provides bridge functions for encrypted data persistence (Local Vault)
 * and hardware-linked security features.
 */
export class DesktopService {
  private static instance: DesktopService;
  private machineId: string | null = null;
  private isElectron: boolean = false;
  private isCapacitor: boolean = false;
  private isFallback: boolean = false;

  private constructor() {
    this.isElectron = !!(window as any).electronAPI;
    this.isCapacitor = Capacitor.isNativePlatform();
    this.isFallback = !this.isElectron && !this.isCapacitor;
  }

  static getInstance(): DesktopService {
    if (!DesktopService.instance) {
      DesktopService.instance = new DesktopService();
    }
    return DesktopService.instance;
  }

  /**
   * Initializes the desktop environment connection.
   */
  async init() {
    if (this.isElectron) {
      try {
        this.machineId = await (window as any).electronAPI.getMachineId();
        console.info('🖥️ Desktop Mode Detected. Machine ID:', this.machineId);
      } catch (e) {
        console.error('Failed to initialize Electron DesktopService:', e);
      }
    } else if (this.isCapacitor) {
      try {
        const info = await Device.getId();
        this.machineId = info.identifier;
        console.info('📱 Mobile Mode Detected. Device ID:', this.machineId);
      } catch (e) {
        console.error('Failed to initialize Capacitor DesktopService:', e);
      }
    } else {
      this.machineId = 'web-fallback-' + Math.random().toString(36).substring(7);
      console.info('🌐 Web Mode Detected. Fallback ID:', this.machineId, '(isFallback:', this.isFallback, ')');
    }
  }

  /**
   * Synchronizes the current Dexie database to an encrypted local file (.sin).
   * Uses AES-GCM-AAD with a hardware-linked AAD lock.
   */
  async syncToVault() {
    if (!this.isElectron || !this.machineId) return;

    try {
      // Collect core data for backup
      const athletes = await db.athletes.toArray();
      const sessions = await db.sessions.toArray();
      
      const payload = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: { athletes, sessions }
      };

      // Lock to machine using machineId as AAD
      const response = await (window as any).electronAPI.saveVault({
        data: payload,
        password: 'biolabpro_v1_secure', // Internal derivation key
        aad: this.machineId
      });

      if (response.success) {
        console.log('✅ Cloudless Vault synchronized: local_vault.sin updated.');
      } else {
        console.error('❌ Vault synchronization error:', response.error);
      }
    } catch (e) {
      console.error('Critical error during vault sync:', e);
    }
  }

  /**
   * Loads and restores the database from the encrypted local vault.
   */
  async restoreFromVault() {
    if (!this.isElectron || !this.machineId) return;

    try {
      const response = await (window as any).electronAPI.loadVault({
        password: 'biolabpro_v1_secure',
        aad: this.machineId
      });

      if (response.success && response.data) {
        const { athletes, sessions } = response.data.data;
        
        // Clear and restore
        await db.athletes.clear();
        await db.sessions.clear();
        
        if (athletes) await db.athletes.bulkAdd(athletes);
        if (sessions) await db.sessions.bulkAdd(sessions);
        
        console.log('✅ Database restored from local secure vault.');
        return true;
      }
    } catch (e) {
      console.error('Vault restoration failed:', e);
    }
    return false;
  }

  getIsElectron(): boolean {
    return this.isElectron;
  }

  getIsCapacitor(): boolean {
    return this.isCapacitor;
  }

  getIsNative(): boolean {
    return this.isElectron || this.isCapacitor;
  }
}

export const desktopService = DesktopService.getInstance();
