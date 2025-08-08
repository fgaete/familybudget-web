import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SmartInput.css';

interface SmartInputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'currency' | 'category';
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  icon?: string;
  suggestions?: string[];
  categories?: Array<{ id: string; name: string; icon: string; color: string }>;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: boolean;
  validateOnType?: boolean;
  formatCurrency?: boolean;
  className?: string;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const SmartInput: React.FC<SmartInputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  required = false,
  disabled = false,
  error,
  success,
  hint,
  icon,
  suggestions = [],
  categories = [],
  maxLength,
  min,
  max,
  step,
  autoComplete = true,
  validateOnType = true,
  formatCurrency = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [internalError, setInternalError] = useState<string>('');
  const [isValid, setIsValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validación en tiempo real
  const validateInput = useCallback((inputValue: string | number): ValidationResult => {
    const stringValue = String(inputValue);
    
    if (required && !stringValue.trim()) {
      return { isValid: false, message: 'Este campo es obligatorio' };
    }
    
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (stringValue && !emailRegex.test(stringValue)) {
          return { isValid: false, message: 'Ingresa un email válido' };
        }
        break;
        
      case 'number':
      case 'currency':
        const numValue = Number(stringValue);
        if (stringValue && isNaN(numValue)) {
          return { isValid: false, message: 'Ingresa un número válido' };
        }
        if (min !== undefined && numValue < min) {
          return { isValid: false, message: `El valor mínimo es ${min}` };
        }
        if (max !== undefined && numValue > max) {
          return { isValid: false, message: `El valor máximo es ${max}` };
        }
        break;
        
      case 'password':
        if (stringValue && stringValue.length < 6) {
          return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }
        break;
    }
    
    if (maxLength && stringValue.length > maxLength) {
      return { isValid: false, message: `Máximo ${maxLength} caracteres` };
    }
    
    return { isValid: true };
  }, [type, required, min, max, maxLength]);

  // Formatear valor de moneda
  const formatCurrencyValue = (value: string): string => {
    if (!formatCurrency || type !== 'currency') return value;
    
    const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(numValue);
  };

  // Filtrar sugerencias
  useEffect(() => {
    if (!autoComplete || !suggestions.length) return;
    
    const stringValue = String(value).toLowerCase();
    if (stringValue.length === 0) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(stringValue)
    ).slice(0, 5);
    
    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0 && isFocused);
  }, [value, suggestions, autoComplete, isFocused]);

  // Validación en tiempo real
  useEffect(() => {
    if (!validateOnType) return;
    
    const validation = validateInput(value);
    setIsValid(validation.isValid);
    setInternalError(validation.message || '');
  }, [value, validateInput, validateOnType]);

  // Manejo de eventos
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      onBlur?.();
    }, 150);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Indicador de escritura
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    if (type === 'number' || type === 'currency') {
      const numValue = parseFloat(newValue.replace(/[^\d.-]/g, '')) || 0;
      onChange(numValue);
    } else {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determinar el estado visual
  const hasError = error || internalError;
  const hasSuccess = success && !hasError && isValid;
  const displayValue = formatCurrency ? formatCurrencyValue(String(value)) : String(value);

  return (
    <div className={`smart-input-container ${className}`}>
      <div className={`input-wrapper ${
        isFocused ? 'focused' : ''
      } ${
        hasError ? 'error' : ''
      } ${
        hasSuccess ? 'success' : ''
      } ${
        disabled ? 'disabled' : ''
      }`}>
        
        {/* Label flotante */}
        <label 
          className={`floating-label ${
            isFocused || value ? 'active' : ''
          }`}
          htmlFor={`input-${label}`}
        >
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        
        {/* Contenedor del input */}
        <div className="input-field-container">
          {/* Icono izquierdo */}
          {icon && (
            <div className="input-icon left">
              <span className="icon">{icon}</span>
            </div>
          )}
          
          {/* Campo de entrada */}
          <input
            ref={inputRef}
            id={`input-${label}`}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : 
                  type === 'currency' ? 'text' : type}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            min={min}
            max={max}
            step={step}
            className="input-field"
            autoComplete="off"
          />
          
          {/* Indicadores de estado */}
          <div className="input-indicators">
            {/* Indicador de escritura */}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            {/* Botón mostrar/ocultar contraseña */}
            {type === 'password' && (
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                <span className="icon">
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </button>
            )}
            
            {/* Icono de estado */}
            {!isTyping && (
              <div className="status-icon">
                {hasError && <span className="error-icon">⚠️</span>}
                {hasSuccess && <span className="success-icon">✅</span>}
              </div>
            )}
          </div>
        </div>
        
        {/* Contador de caracteres */}
        {maxLength && (
          <div className="character-counter">
            <span className={String(value).length > maxLength * 0.8 ? 'warning' : ''}>
              {String(value).length}/{maxLength}
            </span>
          </div>
        )}
      </div>
      
      {/* Sugerencias de autocompletado */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div ref={suggestionsRef} className="suggestions-dropdown">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`suggestion-item ${
                index === selectedSuggestionIndex ? 'selected' : ''
              }`}
              onClick={() => selectSuggestion(suggestion)}
            >
              <span className="suggestion-text">{suggestion}</span>
              <span className="suggestion-icon">↵</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Categorías (para tipo category) */}
      {type === 'category' && categories.length > 0 && isFocused && (
        <div className="categories-grid">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${
                String(value) === category.name ? 'selected' : ''
              }`}
              onClick={() => onChange(category.name)}
              style={{ borderColor: category.color }}
            >
              <span className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </span>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Mensajes de estado */}
      <div className="input-messages">
        {hasError && (
          <div className="error-message">
            <span className="message-icon">⚠️</span>
            <span className="message-text">{error || internalError}</span>
          </div>
        )}
        
        {hasSuccess && (
          <div className="success-message">
            <span className="message-icon">✅</span>
            <span className="message-text">{success}</span>
          </div>
        )}
        
        {hint && !hasError && !hasSuccess && (
          <div className="hint-message">
            <span className="message-icon">💡</span>
            <span className="message-text">{hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartInput;