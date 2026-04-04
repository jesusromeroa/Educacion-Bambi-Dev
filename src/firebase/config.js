import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from 'firebase/auth'; 
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"; // <-- Comenta esto

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

/* COMENTAMOS ESTO POR AHORA PARA DESARROLLO LOCAL
if (typeof window !== "undefined") {
  initializeAppCheck(FirebaseApp, {
    provider: new ReCaptchaEnterpriseProvider('AQUI_IRA_LA_LLAVE_DE_RECAPTCHA_PUBLICA'),
    isTokenAutoRefreshEnabled: true
  });
}
*/