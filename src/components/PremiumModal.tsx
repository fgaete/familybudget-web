import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
// Removed translations import

const PremiumModal: React.FC = () => {
  const { showPremiumModal, setShowPremiumModal, upgradeToPremium } = useSubscription();
  // Removed translations hook

  if (!showPremiumModal) return null;

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal">
        <div className="premium-modal-header">
          <h2>🌟 Actualizar a Premium</h2>
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
            <span className="price-period">/Mensual</span>
          </div>
          
          <div className="premium-benefits">
            <h3>Beneficios Premium</h3>
            <ul>
              <li>
                <span className="benefit-icon">💰</span>
                Gestión completa de gastos fijos mensuales
              </li>
              <li>
                <span className="benefit-icon">📊</span>
                Categorías especiales y personalizadas
              </li>
              <li>
                <span className="benefit-icon">📈</span>
                Análisis detallado de presupuesto con gráficos
              </li>
              <li>
                <span className="benefit-icon">💵</span>
                Presupuestos variables por categoría
              </li>
            </ul>
          </div>
          
          <div className="premium-actions">
            <button 
              className="upgrade-button"
              onClick={upgradeToPremium}
            >
              Actualizar Ahora
            </button>
            <button 
              className="cancel-button"
              onClick={() => setShowPremiumModal(false)}
            >
              Tal vez más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;