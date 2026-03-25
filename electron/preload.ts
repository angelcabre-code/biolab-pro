import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
  saveVault: (payload: any) => ipcRenderer.invoke('save-vault', payload),
  loadVault: (payload: any) => ipcRenderer.invoke('load-vault', payload),
  invokeSinergiaLogin: (accessCode: string) => ipcRenderer.invoke('sinergia-invoke-login', accessCode),
});
