import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// En el build CJS, __dirname es nativo y confiable.
const isDev = !!process.env.VITE_DEV_SERVER_URL;

let mainWindow: BrowserWindow | null = null;

// Configuración Sinergia AES-GCM
const CONFIG = {
  algo: 'aes-256-gcm',
  hash: 'sha256',
  iterations: 100000,
  keyLength: 32, // bytes (256 bits)
  saltSize: 16,  // bytes
  ivSize: 12     // bytes
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Biolab Pro | Sinergia',
    // La ruta relativa cambia según si estamos en dev o empaquetados
    icon: isDev 
      ? path.join(process.cwd(), 'public/logo_sinergia.png')
      : path.join(__dirname, '../dist/logo_sinergia.png'),
    webPreferences: {
      // El preload se compila junto al main en dist-electron/
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL!);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC HANDLERS ---

ipcMain.handle('get-machine-id', () => {
  try {
    // Usamos require dinámico para cargar el módulo nativo solo cuando se necesita
    const { machineIdSync } = require('node-machine-id');
    return machineIdSync();
  } catch (e) {
    console.warn('Protección de hardware no disponible:', e);
    return 'fallback-id-' + process.platform;
  }
});

ipcMain.handle('save-vault', async (_, { data, password, aad }) => {
  try {
    const jsonString = JSON.stringify(data);
    const salt = crypto.randomBytes(CONFIG.saltSize);
    const iv = crypto.randomBytes(CONFIG.ivSize);

    // Derivar clave PBKDF2
    const key = crypto.pbkdf2Sync(password, salt, CONFIG.iterations, CONFIG.keyLength, CONFIG.hash);

    const cipher = crypto.createCipheriv(CONFIG.algo, key, iv);
    
    // Set AAD (Authenticated Associated Data) - DRM Lock
    if (aad) {
      cipher.setAAD(Buffer.from(aad));
    }

    const encrypted = Buffer.concat([cipher.update(jsonString, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    // Estructura: [SALT (16)] + [IV (12)] + [TAG (16)] + [CIPHERTEXT]
    const finalBuffer = Buffer.concat([salt, iv, tag, encrypted]);
    
    const appDataPath = app.getPath('userData');
    const vaultPath = path.join(appDataPath, 'local_vault.sin');
    
    fs.writeFileSync(vaultPath, finalBuffer);
    return { success: true, path: vaultPath };
  } catch (error: any) {
    console.error('Encryption Error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-vault', async (_, { password, aad }) => {
  try {
    const appDataPath = app.getPath('userData');
    const vaultPath = path.join(appDataPath, 'local_vault.sin');
    
    if (!fs.existsSync(vaultPath)) return { success: false, error: 'NO_FILE' };

    const buffer = fs.readFileSync(vaultPath);
    
    const salt = buffer.subarray(0, 16);
    const iv = buffer.subarray(16, 28);
    const tag = buffer.subarray(28, 44);
    const ciphertext = buffer.subarray(44);

    const key = crypto.pbkdf2Sync(password, salt, CONFIG.iterations, CONFIG.keyLength, CONFIG.hash);

    const decipher = crypto.createDecipheriv(CONFIG.algo, key, iv);
    decipher.setAuthTag(tag);
    
    if (aad) {
      decipher.setAAD(Buffer.from(aad));
    }

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const result = JSON.parse(decrypted.toString('utf8'));
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Decryption Error:', error);
    return { success: false, error: error.message };
  }
});

// --- SINERGIA CLOUD FUNCTIONS (CORS BYPASS V3 - ROBUST FETCH) ---
ipcMain.handle('sinergia-invoke-login', async (_, { accessCode }) => {
  const regions = ['europe-west1', 'us-central1'];
  const projectId = 'sinergia-deportiva-pro';
  let lastError = null;

  for (const region of regions) {
    try {
      const url = `https://${region}-${projectId}.cloudfunctions.net/loginAlumno`;
      console.log(`[Main] Trying Sinergia Login at ${region}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { accessCode } })
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`[Main] 404 at ${region}, trying next...`);
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const json: any = await response.json();
      console.log(`[Main] Sinergia Success at ${region}:`, json);
      
      return { success: true, data: json.result || json.data || json };
    } catch (error: any) {
      console.warn(`[Main] Failed at ${region}:`, error.message);
      lastError = error;
    }
  }

  return { success: false, error: lastError?.message || 'No se pudo contactar con Sinergia' };
});
