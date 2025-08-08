import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;
  upgradeToPremium: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false); // Siempre gratuito
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const upgradeToPremium = () => {
    // TODO: Implementar lógica de pago real
    // Por ahora, solo cerramos el modal sin actualizar el estado
    setShowPremiumModal(false);
    // Funcionalidad premium deshabilitada
  };

  // Limpiar cualquier estado premium previo y mantener siempre gratuito
  React.useEffect(() => {
    // Eliminar cualquier registro previo de premium
    localStorage.removeItem('isPremium');
    // Asegurar que siempre sea gratuito
    setIsPremium(false);
  }, []);

  const value = {
    isPremium,
    showPremiumModal,
    setShowPremiumModal,
    upgradeToPremium
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};