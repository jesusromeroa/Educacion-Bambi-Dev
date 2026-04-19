import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from 'firebase/auth'; 
// CORREGIDO: Importamos ReCaptchaV3Provider en lugar de Enterprise
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar la App
const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  // AQUÍ PEGAS LA "CLAVE DE SITIO" (La pública, NO la secreta)
  provider: new ReCaptchaV3Provider('6LcnP7wsAAAAAEwTi9pIIdRIf_kZDc_QMI2fQN5N'),
  
  // Esto es opcional, pero recomendado
  isTokenAutoRefreshEnabled: true
});

// Inicializar servicios
const db = getFirestore(app);
const auth = getAuth(app);

// =========================================================
// EXPORTACIONES DOBLES (Para evitar errores de mayúsculas/minúsculas)
// =========================================================
export const FirebaseApp = app;
export const firebaseApp = app;

export const FirebaseDB = db;
export const firebaseDB = db;

export const FirebaseAuth = auth;
export const firebaseAuth = auth;