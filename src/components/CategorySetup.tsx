import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import './CategorySetup.css';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategorySetupProps {
  onComplete: () => void;
}

const CategorySetup: React.FC<CategorySetupProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  
  // Categorías predefinidas sugeridas
  const [predefinedCategories] = useState<Category[]>([
    { id: '1', name: 'Salida con amigos', icon: '🍻', color: '#FF6B6B' },
    { id: '2', name: 'Almuerzo', icon: '🍽️', color: '#4ECDC4' },
    { id: '3', name: 'Supermercado', icon: '🛒', color: '#45B7D1' },
    { id: '4', name: 'Locomoción', icon: '🚌', color: '#96CEB4' },
    { id: '5', name: 'Compra por internet', icon: '💻', color: '#FFEAA7' },
    { id: '6', name: 'Pago de cuentas', icon: '💳', color: '#DDA0DD' },
    { id: '7', name: 'Pensión', icon: '🏠', color: '#98D8C8' },
    { id: '8', name: 'Crédito', icon: '🏦', color: '#FFB6C1' },
    { id: '9', name: 'Entretenimiento', icon: '🎬', color: '#87CEEB' },
    { id: '10', name: 'Salud', icon: '⚕️', color: '#90EE90' },
    { id: '11', name: 'Educación', icon: '📚', color: '#F0E68C' },
    { id: '12', name: 'Ropa', icon: '👕', color: '#DEB887' }
  ]);
  
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => {
      const isSelected = prev.some(c => c.id === category.id);
      if (isSelected) {
        return prev.filter(c => c.id !== category.id);
      } else {
        return [...prev, category];
      }
    });
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !customCategories.some(c => c.name.toLowerCase() === customCategory.toLowerCase())) {
      const newCategory: Category = {
        id: `custom-${Date.now()}`,
        name: customCategory.trim(),
        icon: '📝',
        color: '#A8A8A8'
      };
      setCustomCategories(prev => [...prev, newCategory]);
      setSelectedCategories(prev => [...prev, newCategory]);
      setCustomCategory('');
    }
  };

  const removeCustomCategory = (categoryId: string) => {
    setCustomCategories(prev => prev.filter(c => c.id !== categoryId));
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setError('Usuario no autenticado');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Debes seleccionar al menos una categoría');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Guardar las categorías seleccionadas en el perfil del usuario
      await userService.updateUserCategories(currentUser.uid, selectedCategories);
      
      onComplete();
    } catch (error) {
      console.error('Error saving categories:', error);
      setError('Error al guardar las categorías. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Si el usuario decide omitir, usar categorías por defecto
    const defaultCategories = predefinedCategories.slice(0, 5); // Primeras 5 categorías
    setSelectedCategories(defaultCategories);
    onComplete();
  };

  return (
    <div className="category-setup-container">
      <div className="category-setup-card">
        <div className="category-setup-header">
          <h1>Configura tus Categorías de Gastos</h1>
          <p>Selecciona las categorías que mejor representen tus gastos habituales. Esto te ayudará a organizar mejor tu presupuesto.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="categories-section">
          <h3>Categorías Sugeridas</h3>
          <div className="categories-grid">
            {predefinedCategories.map(category => (
              <div
                key={category.id}
                className={`category-item ${
                  selectedCategories.some(c => c.id === category.id) ? 'selected' : ''
                }`}
                onClick={() => toggleCategory(category)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="custom-category-section">
          <h3>Agregar Categoría Personalizada</h3>
          <div className="custom-category-input">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Nombre de la categoría personalizada"
              onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
            />
            <button 
              type="button" 
              onClick={addCustomCategory}
              disabled={!customCategory.trim()}
            >
              Agregar
            </button>
          </div>
          
          {customCategories.length > 0 && (
            <div className="custom-categories-list">
              {customCategories.map(category => (
                <div key={category.id} className="custom-category-item">
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <button 
                    type="button" 
                    className="remove-category"
                    onClick={() => removeCustomCategory(category.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="selected-summary">
          <h3>Categorías Seleccionadas ({selectedCategories.length})</h3>
          <div className="selected-categories">
            {selectedCategories.map(category => (
              <span key={category.id} className="selected-category-tag">
                {category.icon} {category.name}
              </span>
            ))}
          </div>
        </div>

        <div className="category-setup-actions">
          <button 
            type="button" 
            className="skip-button"
            onClick={handleSkip}
            disabled={loading}
          >
            Omitir (usar por defecto)
          </button>
          <button 
            type="button" 
            className="continue-button"
            onClick={handleSubmit}
            disabled={loading || selectedCategories.length === 0}
          >
            {loading ? 'Guardando...' : `Continuar con ${selectedCategories.length} categorías`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySetup;