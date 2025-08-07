import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useTranslations } from '../utils/i18n';

const PremiumModal: React.FC = () => {
  const { showPremiumModal, setShowPremiumModal, upgradeToPremium } = useSubscription();
  const t = useTranslations();

  if (!showPremiumModal) return null;

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal">
        <div className="premium-modal-header">
          <h2>🌟 {t.upgradeToPremium}</h2>
          <button 
            className="close-button"
            onClick={() => setShowPremiumModal(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="premium-modal-content">
          <div className="premium-price">
            <span className="price-amount">$2.490</span>
            <span className="price-currency">CLP</span>
            <span className="price-period">/{t.monthly}</span>
          </div>
          
          <div className="premium-benefits">
            <h3>{t.premiumBenefits}</h3>
            <ul>
              <li>
                <span className="benefit-icon">💰</span>
                {t.fixedExpensesFeature}
              </li>
              <li>
                <span className="benefit-icon">📊</span>
                {t.specialCategoriesFeature}
              </li>
              <li>
                <span className="benefit-icon">📈</span>
                {t.budgetAnalysisFeature}
              </li>
              <li>
                <span className="benefit-icon">💵</span>
                {t.variableBudgetFeature}
              </li>
            </ul>
          </div>
          
          <div className="premium-actions">
            <button 
              className="upgrade-button"
              onClick={upgradeToPremium}
            >
              {t.upgradeNow}
            </button>
            <button 
              className="cancel-button"
              onClick={() => setShowPremiumModal(false)}
            >
              {t.maybeLater}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;