import Dexie, { type Table } from 'dexie';

export interface Athlete {
  id?: number;
  name: string;
  category: string;
  weight: number;
  email: string;
  avatar?: string;
  accessCode?: string; // Sinergia personal code
  colectivoId?: string; // Sinergia colectivo ID
  alumnoDocId?: string; // Sinergia student document ID
  height_cm?: number;
  leg_length_cm?: number;
  wingspan_cm?: number;
}

export interface Session {
  id?: number;
  athleteId: number;
  date: Date;
  sessionType: string;
}

export interface Record {
  id?: number;
  sessionId: number;
  athleteId: number;
  recordType: string;
  value: number;
  unit: string;
  timestamp: Date;
  synced: boolean;
  distance_m?: number;
  segments?: number;
}

export class BiolabDatabase extends Dexie {
  athletes!: Table<Athlete>;
  sessions!: Table<Session>;
  records!: Table<Record>;

  constructor() {
    super('BiolabDB');
    this.version(6).stores({
      athletes: '++id, name, category, weight, &email, accessCode, colectivoId, alumnoDocId, height_cm, leg_length_cm, wingspan_cm',
      sessions: '++id, athleteId, date, sessionType',
      records: '++id, sessionId, athleteId, recordType, timestamp, synced, distance_m, segments'
    });
  }
}

export const db = new BiolabDatabase();
