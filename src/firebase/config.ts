import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1gboESGcpC01Bhm8Ttpme_vvmyB-5u0w",
  authDomain: "family-budget-app-2b857.firebaseapp.com",
  projectId: "family-budget-app-2b857",
  storageBucket: "family-budget-app-2b857.firebasestorage.app",
  messagingSenderId: "516573822621",
  appId: "1:516573822621:web:36092a6768d2746a889e74",
  measurementId: "G-89LY0MMF7S"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Proveedores de autenticación
export const googleProvider = new GoogleAuthProvider();

// Configurar proveedores
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;