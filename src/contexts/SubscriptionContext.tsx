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
  const [isPremium, setIsPremium] = useState(false); // Por defecto gratuito
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const upgradeToPremium = () => {
    // TODO: Implementar lógica de pago real
    // Por ahora, solo cerramos el modal sin actualizar el estado
    setShowPremiumModal(false);
    // setIsPremium(true);
    // localStorage.setItem('isPremium', 'true');
  };

  // Cargar estado de suscripción desde localStorage
  React.useEffect(() => {
    const savedPremiumStatus = localStorage.getItem('isPremium');
    if (savedPremiumStatus === 'true') {
      setIsPremium(true);
    }
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