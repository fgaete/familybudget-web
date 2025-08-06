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
    return isMobileUserAgent || isMobileViewport;
  };

  const signInWithGoogle = async () => {
    try {
      if (isMobileDevice()) {
        // Usar redirect para dispositivos móviles
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Usar popup para desktop
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
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
    // Manejar el resultado del redirect al cargar la página
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Autenticación por redirect exitosa:', result.user.uid);
        }
      } catch (error) {
        console.error('❌ Error en autenticación por redirect:', error);
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
        }
      }
      
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