import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
// 1. Importamos App Check
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(FirebaseApp);
export const FirebaseAuth = getAuth(FirebaseApp);

// 2. Inicializamos App Check (Nota: Luego generaremos la llave de reCAPTCHA en la consola)
// Por ahora lo dejamos preparado para que no rompa la app.
if (typeof window !== "undefined") {
  initializeAppCheck(FirebaseApp, {
    provider: new ReCaptchaEnterpriseProvider('AQUI_IRA_LA_LLAVE_DE_RECAPTCHA_PUBLICA'),
    isTokenAutoRefreshEnabled: true
  });
}