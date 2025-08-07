import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface PremiumFeatureProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const PremiumFeature: React.FC<PremiumFeatureProps> = ({ children, className = '', onClick, title }) => {
  const { isPremium } = useSubscription();

  // Si no es premium, no renderizar nada (ocultar completamente)
  if (!isPremium) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`premium-feature ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default PremiumFeature;