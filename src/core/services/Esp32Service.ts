/**
 * Esp32Service.ts
 * Maneja la comunicación con el hardware ESP32 mediante WebSocket y HTTP GET.
 * IP del AP ESP32: 192.168.4.1
 */

import { reactive } from 'vue';

export interface Esp32Data {
  tipo: string;
  submodo: string;
  estado: string;
  terminado: boolean;
  nula: boolean;
  msg_nula: string;
  val_main: string;
  val_unit: string;
  t_reac: number;
  t_vuelo: number;
  t_contacto: number;
  tramos: number;
}

type OnDataCallback = (data: Esp32Data) => void;
type OnStatusCallback = (connected: boolean) => void;

class Esp32Service {
  private socket: WebSocket | null = null;
  private onDataCallbacks: OnDataCallback[] = [];
  private onStatusCallbacks: OnStatusCallback[] = [];
  
  public state = reactive({
    isConnected: false,
    isSimulated: false,
    lastMode: 'PLATAFORMA',
    lastSubmodo: 'SALTO_UNICO',
    lastTramos: 0
  });

  private reconnectTimer: any = null;
  private readonly baseUrl = 'http://192.168.4.1';
  private readonly wsUrl = 'ws://192.168.4.1:81';

  constructor() {
    this.connect();
  }

  public toggleSimulator() {
    this.state.isSimulated = !this.state.isSimulated;
    console.log('ESP32: Modo Simulador:', this.state.isSimulated);
    this.notifyStatus(this.state.isConnected || this.state.isSimulated);
    return this.state.isSimulated;
  }

  public get isSimulatorActive() {
    return this.state.isSimulated;
  }

  public connect() {
    if (this.socket) return;
    if (this.state.isSimulated) return;

    console.log('ESP32: Intentando conectar a WebSocket...', this.wsUrl);
    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      console.log('ESP32: Conectado ✅');
      this.state.isConnected = true;
      this.notifyStatus(true);
      if (this.reconnectTimer) clearInterval(this.reconnectTimer);
    };

    this.socket.onmessage = (event) => {
      try {
        const data: Esp32Data = JSON.parse(event.data);
        console.log('ESP32: Recibido:', data);
        this.notifyData(data);
      } catch (e) {
        console.error('ESP32: Error parseando JSON:', e, event.data);
      }
    };

    this.socket.onclose = () => {
      console.log('ESP32: Desconectado ❌');
      this.state.isConnected = false;
      if (!this.state.isSimulated) this.notifyStatus(false);
      this.socket = null;
      this.startReconnecting();
    };

    this.socket.onerror = (err) => {
      console.error('ESP32: Error WebSocket:', err);
      this.socket?.close();
    };
  }

  private startReconnecting() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setInterval(() => {
      if (!this.state.isConnected && !this.state.isSimulated) this.connect();
    }, 5000);
  }

  public async setMode(mode: string, sub: string, options: { tramos?: number, distancia?: number, duracion?: number } = {}) {
    const { tramos = 0, distancia = 0, duracion = 0 } = options;

    if (this.state.isSimulated) {
      console.log('ESP32 SIMULATED: Mode set to', mode, sub, options);
      this.startSimulatedSession(mode, sub, tramos, distancia, duracion);
      return true;
    }

    let url = `${this.baseUrl}/set_mode?mode=${mode}&sub=${sub}`;
    if (tramos > 0) url += `&tramos=${tramos}`;
    if (distancia > 0) url += `&distancia=${distancia}`;
    if (duracion > 0) url += `&duracion=${duracion}`;

    console.log('ESP32: Cambiando modo:', url);
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (e) {
      console.error('ESP32 Error en setMode:', e);
      return false;
    }
  }

  private startSimulatedSession(mode: string, sub: string, tramos: number, distancia: number, duracion: number) {
    this.state.lastMode = mode;
    this.state.lastSubmodo = sub;
    this.state.lastTramos = tramos;
    // We could store distancia and duracion if needed for simulation logic
    console.log(`ESP32 SIM: Sesión preparada: ${mode}/${sub} (Tramos: ${tramos}, Dist: ${distancia}, Dur: ${duracion})`);
  }

  public simulateEvent(overrideData?: Partial<Esp32Data>) {
    if (!this.state.isSimulated) return;

    const t_vuelo = overrideData?.t_vuelo ?? (this.state.lastMode === 'PLATAFORMA' ? 0.350 + Math.random() * 0.3 : 0);
    const sub = this.state.lastSubmodo || '';
    const mode = this.state.lastMode || '';
    const isJump = ['SJ', 'CMJ', 'ABK', 'DJ', 'MULTISALTO'].includes(sub);
    
    let val_main = (Math.random() * 5 + 1).toFixed(3);
    let val_unit = 's';
    let t_reac = 0.150 + Math.random() * 0.1;
    let nula = false;
    let msg_nula = '';

    if (mode === 'PLATAFORMA' && isJump) {
      // Conversión Tiempo de Vuelo -> Altura en cm
      const cmHeight = 122.625 * Math.pow(t_vuelo, 2);
      val_main = cmHeight.toFixed(1);
      val_unit = 'cm';
      t_reac = 0;
    }

    if (mode === 'PISTA') {
      if (sub === 'PURA') {
        t_reac = 0; // Pureza is photocell-to-photocell, no reaction
      } else if (sub === 'CLASICA') {
        // Clásica has a beep. If reaction < 0.2s, it's null
        if (t_reac < 0.2) {
          nula = true;
          msg_nula = 'REACCIÓN < 0.2s';
        }
      }
    }

    if (mode === 'REACCION') {
      t_reac = 0.150 + Math.random() * 0.2;
      val_main = t_reac.toFixed(3);
    }

    const fakeData: Esp32Data = {
      tipo: mode,
      submodo: sub,
      estado: nula ? 'SALIDA NULA' : '¡PRUEBA COMPLETADA! (SIMULADO)',
      terminado: true,
      nula,
      msg_nula,
      val_main,
      val_unit,
      t_reac,
      t_vuelo,
      t_contacto: mode === 'PLATAFORMA' ? 0.200 + Math.random() * 0.1 : 0,
      tramos: this.state.lastTramos,
      ...overrideData
    };

    console.log('ESP32 SIM: Triggering event:', fakeData);
    this.notifyData(fakeData);
  }

  // Event Listeners
  public onData(cb: OnDataCallback) {
    this.onDataCallbacks.push(cb);
    return () => {
      this.onDataCallbacks = this.onDataCallbacks.filter(c => c !== cb);
    };
  }

  public onStatus(cb: OnStatusCallback) {
    this.onStatusCallbacks.push(cb);
    cb(this.state.isConnected || this.state.isSimulated);
    return () => {
      this.onStatusCallbacks = this.onStatusCallbacks.filter(c => c !== cb);
    };
  }

  private notifyData(data: Esp32Data) {
    this.onDataCallbacks.forEach(cb => cb(data));
  }

  private notifyStatus(status: boolean) {
    this.onStatusCallbacks.forEach(cb => cb(status));
  }
}

export const esp32Service = new Esp32Service();
