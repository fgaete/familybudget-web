import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { useTranslations } from '../utils/i18n';
import './BudgetSetup.css';

interface BudgetSetupProps {
  onComplete: () => void;
  currentBudget?: number;
}

const BudgetSetup: React.FC<BudgetSetupProps> = ({ onComplete, currentBudget = 0 }) => {
  const { currentUser } = useAuth();
  const t = useTranslations();
  const [budget, setBudget] = useState(currentBudget.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError(t.userNotAuthenticated);
      return;
    }
    
    const budgetAmount = parseFloat(budget.replace(/[^\d]/g, ''));
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError(t.invalidBudgetAmount);
      return;
    }

    if (budgetAmount > 100000000) {
      setError(t.budgetTooHigh);
      return;
    }

    try {
      console.log('🎯 Iniciando handleSubmit en BudgetSetup');
      setLoading(true);
      setError('');
      
      console.log('👤 Usuario autenticado:', currentUser.uid);
      
      // Limpiar y validar el monto
      const cleanBudget = budget.replace(/[^\d]/g, '');
      const budgetAmount = parseInt(cleanBudget);
      console.log('💰 Presupuesto procesado:', { original: budget, clean: cleanBudget, amount: budgetAmount });
      
      if (!budgetAmount || budgetAmount <= 0) {
        console.error('❌', t.invalidAmount + ':', budgetAmount);
        setError(t.invalidBudgetAmount);
        return;
      }
      
      if (budgetAmount > 100000000) {
        console.error('❌', t.amountTooHigh + ':', budgetAmount);
        setError(t.budgetTooHigh);
        return;
      }
      
      console.log('⏰ Configurando timeout de 30 segundos');
      // Agregar timeout más generoso para operaciones de Firebase
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 30000)
      );
      
      console.log('🚀 Ejecutando updateMonthlyBudget con Promise.race');
      await Promise.race([
        userService.updateMonthlyBudget(currentUser.uid, budgetAmount),
        timeoutPromise
      ]);
      
      console.log('✅ Presupuesto actualizado, ejecutando onComplete');
      onComplete();
    } catch (error: any) {
       console.error('Error updating budget:', error);
       if (error.message === 'Timeout') {
         setError(t.operationTimeout);
       } else if (error.code === 'permission-denied') {
         setError(t.noPermissions);
       } else if (error.code === 'unavailable') {
         setError(t.firebaseUnavailable);
       } else if (error.code === 'network-request-failed') {
         setError(t.connectionError);
       } else {
         setError(`${t.errorSavingBudget}: ${error.message || t.unknownError}. ${t.tryAgain}`);
       }
     } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('es-CL').format(parseInt(numericValue) || 0);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setBudget(value);
  };

  const currentMonth = new Date().toLocaleDateString('es-CL', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="budget-setup-overlay">
      <div className="budget-setup-card">
        <div className="budget-setup-header">
          <h2>{t.setupMonthlyBudget}</h2>
          <p>{t.setBudgetFor} <strong>{currentMonth}</strong></p>
          <p className="budget-description">
            {t.budgetDescription}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="budget-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="budget-input-group">
            <label htmlFor="budget">{t.monthlyBudget}</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input
                type="text"
                id="budget"
                value={formatCurrency(budget)}
                onChange={handleBudgetChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="budget-examples">
            <p>{t.budgetExamples}</p>
            <div className="example-buttons">
              <button 
                type="button" 
                className="example-btn"
                onClick={() => setBudget('300000')}
              >
                $300.000
              </button>
              <button 
                type="button" 
                className="example-btn"
                onClick={() => setBudget('500000')}
              >
                $500.000
              </button>
              <button 
                type="button" 
                className="example-btn"
                onClick={() => setBudget('800000')}
              >
                $800.000
              </button>
            </div>
          </div>

          <div className="budget-actions">
            <button 
              type="submit" 
              className="save-budget-btn"
              disabled={loading}
            >
              {loading ? t.savingBudget : t.saveBudget}
            </button>
            {loading && (
              <p className="loading-message">
                ⏳ {t.connectingFirebase}
              </p>
            )}
          </div>
        </form>

        <div className="budget-info">
          <div className="info-item">
            <span className="info-icon">💰</span>
            <div>
              <strong>{t.flexibleBudget}</strong>
              <p>{t.flexibleBudgetDesc}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <div>
              <strong>{t.automaticTracking}</strong>
              <p>{t.automaticTrackingDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSetup;