import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para detectar si es un dispositivo móvil
  const isMobileDevice = () => {
    const maxMobileWidth = 768;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );
    const isMobileViewport = window.innerWidth <= maxMobileWidth;
    const isMobile = isMobileUserAgent || isMobileViewport;
    console.log('🔍 Detección de dispositivo:', {
      userAgent: window.navigator.userAgent,
      viewport: window.innerWidth,
      isMobileUserAgent,
      isMobileViewport,
      isMobile
    });
    return isMobile;
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🚀 Iniciando autenticación con Google...');
      
      const isMobile = isMobileDevice();
      
      if (isMobile) {
        console.log('📱 Usando redirect para dispositivo móvil');
        console.log('🔄 Configurando redirect...');
        
        // Configurar el provider con parámetros específicos para móvil
        googleProvider.setCustomParameters({
          prompt: 'select_account',
          display: 'popup' // Intentar popup primero en móvil
        });
        
        try {
          // Intentar popup primero en móvil
          console.log('📱 Intentando popup en móvil...');
          const result = await signInWithPopup(auth, googleProvider);
          console.log('✅ Autenticación con popup exitosa en móvil:', result.user.uid);
          return;
        } catch (popupError: any) {
          console.log('⚠️ Popup falló en móvil, usando redirect:', popupError.code);
          
          // Si el popup falla, usar redirect
          if (popupError.code === 'auth/popup-blocked' || 
              popupError.code === 'auth/popup-closed-by-user' ||
              popupError.code === 'auth/cancelled-popup-request') {
            console.log('🔄 Cambiando a redirect en móvil...');
            await signInWithRedirect(auth, googleProvider);
            return;
          } else {
            throw popupError;
          }
        }
      } else {
        console.log('💻 Usando popup para desktop');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Autenticación con popup exitosa:', result.user.uid);
      }
    } catch (error: any) {
      console.error('❌ Error signing in with Google:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  };



  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Manejar resultado de redirect al cargar la página
  const handleRedirectResult = async () => {
    try {
      console.log('🔄 Verificando resultado de redirect...');
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('✅ Autenticación por redirect exitosa:', result.user.uid);
        console.log('👤 Usuario autenticado:', {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName
        });
      } else {
        console.log('ℹ️ No hay resultado de redirect pendiente');
      }
    } catch (error) {
      console.error('❌ Error en autenticación por redirect:', error);
      console.error('Error code:', (error as any)?.code);
      console.error('Error message:', (error as any)?.message);
    }
  };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Estado de autenticación cambió:', user ? `Usuario: ${user.uid}` : 'No hay usuario');
      
      // Establecer el usuario inmediatamente
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log('👤 Usuario autenticado, verificando/creando en Firestore:', user.uid);
          
          // Verificar si el usuario ya existe en Firestore
          const existingUser = await userService.getUser(user.uid);
          
          if (!existingUser) {
            console.log('🆕 Creando nuevo usuario en Firestore');
            // Crear el usuario en Firestore si no existe
            await userService.createUser({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Usuario',
              photoURL: user.photoURL || undefined
            });
            console.log('✅ Usuario creado exitosamente en Firestore');
          } else {
            console.log('✅ Usuario ya existe en Firestore');
          }
        } catch (error) {
          console.error('❌ Error al crear/verificar usuario en Firestore:', error);
          // No impedir que el usuario continúe aunque falle Firestore
          console.log('⚠️ Continuando con la autenticación a pesar del error en Firestore');
        }
      }
      
      // Siempre establecer loading como false al final
      console.log('✅ Estableciendo loading como false');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};