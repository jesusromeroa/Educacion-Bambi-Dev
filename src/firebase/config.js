import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from 'firebase/auth'; 
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

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

// Inicializar App Check (El "Captcha Invisible")
if (typeof window !== "undefined") {
  if (window.location.hostname === "localhost") {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true; 
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_KEY || "TU_CLAVE_PUBLICA_DE_RECAPTCHA"),
    isTokenAutoRefreshEnabled: true
  });
}

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