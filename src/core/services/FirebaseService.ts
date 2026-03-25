import { initializeApp } from "firebase/app";
import { Capacitor } from "@capacitor/core";
import { 
  getFirestore, 
  doc,
  getDoc
} from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// Configuración de Sinergia V2 cuidada
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, 
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export interface SinergiaStudent {
  name: string;
  email: string;
  category: string;
  weight: number;
  colectivoId: string;
  alumnoDocId: string;
}

export const FirebaseService = {
  /**
   * Busca un alumno en Sinergia usando su código de acceso.
   * IMPORTANTE: Usa el IPC de Electron para saltar CORS y obtener un Custom Token.
   */
  async fetchAthleteByCode(code: string): Promise<SinergiaStudent | null> {
    if (!code) return null;
    
    try {
      
      console.log('Firebase: Fetching student...', code);
      let response: any;

      if (Capacitor.isNativePlatform()) {
        // 1a. Direct Fetch for Mobile (Capacitor handles CORS better in its native layer)
        const regions = ['europe-west1', 'us-central1'];
        const projectId = 'sinergia-deportiva-pro';
        let lastError = null;

        for (const region of regions) {
          try {
            const url = `https://${region}-${projectId}.cloudfunctions.net/loginAlumno`;
            const fetchRes = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: { accessCode: code.toUpperCase() } })
            });
            if (fetchRes.ok) {
              const json = await fetchRes.json();
              response = { success: true, data: json.result || json.data || json };
              break;
            }
          } catch (e: any) {
            lastError = e;
          }
        }
        if (!response) response = { success: false, error: lastError?.message };
      } else if ((window as any).electronAPI) {
        // 1b. Electron Bridge (Bypass CORS via Main Process)
        response = await (window as any).electronAPI.invokeSinergiaLogin({ 
          accessCode: code.toUpperCase(),
          config: firebaseConfig 
        });
      } else {
        // 1c. Web Browser (Regular fetch - might fail due to CORS)
        throw new Error('Ambiente no soportado para login externo (CORS)');
      }

      console.log('Firebase: Login Response:', response);
      
      if (!response || !response.success || !response.data) {
        console.warn('Firebase: Student not found or Bridge error', response?.error);
        return null;
      }

      const { token, alumnoId, colectivoId } = response.data;
      console.log('Firebase: Data extracted:', { alumnoId, colectivoId, hasToken: !!token });

      // 2. Autenticarse con el Token Personal del Alumno
      console.log('Firebase: Authenticating with Student Token...');
      await signInWithCustomToken(auth, token);
      console.log('Firebase: Auth Success!');

      // 3. Ya autenticados, obtenemos los datos del alumno
      const studentRef = doc(db, 'colectivos', colectivoId, 'alumnos', alumnoId);
      const docSnap = await getDoc(studentRef);
      
      if (!docSnap.exists()) {
        console.warn('Firebase: Student document does not exist after auth');
        return null;
      }

      const data = docSnap.data();
      console.log('Firebase: Student data restored successfully:', data.nombre || 'No name on server');
      
      return {
        // En Sinergia V2 los nombres son locales, si no hay en servidor usamos un placeholder con el código
        name: data.nombre || data.name || `Atleta (${code})`,
        email: data.email || '',
        category: data.category || data.categoria || 'Senior',
        weight: data.weight || data.peso || 70,
        colectivoId,
        alumnoDocId: alumnoId
      };
    } catch (error) {
      console.error('Firebase Error in fetchAthleteByCode:', error);
      throw error;
    }
  },

  /**
   * Exporta un resultado individual a Sinergia Teacher (V2)
   */
  async exportResultToSinergia(
    colectivoId: string, 
    alumnoDocId: string, 
    testId: string, 
    value: number,
    options: {
      age?: number;
      sexo?: string;
    } = {}
  ): Promise<void> {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const resultsRef = collection(db, 'colectivos', colectivoId, 'alumnos', alumnoDocId, 'resultados_v2');
      
      const payload = {
        testId,
        timestamp: serverTimestamp(),
        age: options.age || null,
        sexo: options.sexo || null,
        source: 'biolab_pro',
        raw_data: { score: value },
        computed: { score: value },
        biolab_export: true
      };

      console.log('Firebase: Exporting result to Sinergia:', payload);
      await addDoc(resultsRef, payload);
    } catch (error) {
      console.error('Firebase: Error exporting result:', error);
      throw error;
    }
  }
};
