import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import './BudgetSetup.css';

interface BudgetSetupProps {
  onComplete: () => void;
  currentBudget?: number;
}

const BudgetSetup: React.FC<BudgetSetupProps> = ({ onComplete, currentBudget = 0 }) => {
  const { currentUser } = useAuth();
  const [budget, setBudget] = useState(currentBudget.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Usuario no autenticado');
      return;
    }
    
    const budgetAmount = parseFloat(budget.replace(/[^\d]/g, ''));
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError('Por favor ingresa un presupuesto válido mayor a 0');
      return;
    }

    if (budgetAmount > 100000000) {
      setError('El presupuesto no puede ser mayor a $100.000.000');
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
        console.error('❌ Monto inválido:', budgetAmount);
        setError('Por favor ingresa un monto válido');
        return;
      }
      
      if (budgetAmount > 100000000) {
        console.error('❌ Monto demasiado alto:', budgetAmount);
        setError('El monto no puede ser mayor a $100.000.000');
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
         setError('La operación está tardando más de lo esperado. Verifica tu conexión a internet e intenta nuevamente.');
       } else if (error.code === 'permission-denied') {
         setError('No tienes permisos para actualizar el presupuesto. Verifica tu autenticación.');
       } else if (error.code === 'unavailable') {
         setError('Servicio de Firebase no disponible. Verifica tu conexión a internet.');
       } else if (error.code === 'network-request-failed') {
         setError('Error de conexión. Verifica tu internet e intenta nuevamente.');
       } else {
         setError(`Error al guardar el presupuesto: ${error.message || 'Error desconocido'}. Intenta nuevamente.`);
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
          <h2>Configura tu Presupuesto Mensual</h2>
          <p>Establece tu presupuesto para <strong>{currentMonth}</strong></p>
          <p className="budget-description">
            Este será tu presupuesto total disponible para compras y menús. 
            Los gastos fijos como créditos y servicios se manejan por separado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="budget-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="budget-input-group">
            <label htmlFor="budget">Presupuesto Mensual</label>
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
            <p>Ejemplos de presupuesto:</p>
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
              {loading ? 'Guardando presupuesto...' : 'Guardar Presupuesto'}
            </button>
            {loading && (
              <p className="loading-message">
                ⏳ Conectando con Firebase... Esto puede tardar unos segundos.
              </p>
            )}
          </div>
        </form>

        <div className="budget-info">
          <div className="info-item">
            <span className="info-icon">💰</span>
            <div>
              <strong>Presupuesto Flexible</strong>
              <p>Puedes cambiar tu presupuesto mensual en cualquier momento</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <div>
              <strong>Seguimiento Automático</strong>
              <p>Tus compras y menús se descontarán automáticamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSetup;