import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface PremiumFeatureProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const PremiumFeature: React.FC<PremiumFeatureProps> = ({ children, className = '', onClick, title }) => {
  const { isPremium, setShowPremiumModal } = useSubscription();

  const handleClick = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`premium-feature ${!isPremium ? 'premium-locked' : ''} ${className}`}
      onClick={handleClick}
    >
      {!isPremium && (
        <div className="premium-overlay">
          <div className="premium-lock-icon">🔒</div>
          <div className="premium-badge">PREMIUM</div>
          {title && <div className="premium-title">{title}</div>}
        </div>
      )}
      <div className={!isPremium ? 'premium-content-blurred' : ''}>
        {children}
      </div>
    </div>
  );
};

export default PremiumFeature;