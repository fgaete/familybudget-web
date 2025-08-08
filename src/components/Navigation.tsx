import React from 'react';
import './Navigation.css';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout: () => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onAdminAccess?: () => void;
  adminClickCount?: number;
  onQuickAction?: (action: string) => void;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  selectedMonth,
  onMonthChange,
  onAdminAccess,
  adminClickCount = 0,
  onQuickAction
}) => {
  const tabs = [
    {
      id: 'budget',
      label: 'Presupuesto',
      icon: '💰',
      description: 'Gestiona tus gastos fijos y variables'
    },
    {
      id: 'analysis',
      label: 'Análisis',
      icon: '📊',
      description: 'Visualiza patrones y tendencias de gastos'
    }
  ];

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', path: 'home', icon: '🏠' }
    ];

    if (activeTab === 'budget') {
      breadcrumbs.push({ label: 'Presupuesto Personal', icon: '💰' });
    } else if (activeTab === 'analysis') {
      breadcrumbs.push({ label: 'Análisis Financiero', icon: '📊' });
    }

    return breadcrumbs;
  };

  const getCurrentMonthName = () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <nav className="enhanced-navigation">
      {/* Header Principal */}
      <div className="nav-header">
        <div className="nav-brand">
          <div className="brand-logo">
            <span className="logo-icon">💰</span>
            <div className="brand-text">
              <h1 
              onClick={onAdminAccess}
              style={{ cursor: onAdminAccess ? 'pointer' : 'default' }}
              title={onAdminAccess ? `Clics: ${adminClickCount}/5 para admin` : undefined}
            >
              GastosInteligentes
            </h1>
            <p>Tu asistente financiero personal</p>
            </div>
          </div>
        </div>

        <div className="nav-controls">
          {/* Selector de Mes */}
          <div className="month-selector">
            <label htmlFor="month-select">
              <span className="month-icon">📅</span>
              <span className="month-label">Período:</span>
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="month-input"
            >
              {/* Generar opciones de los últimos 12 meses */}
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const label = date.toLocaleDateString('es-CL', { 
                  year: 'numeric', 
                  month: 'long' 
                });
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Información del Usuario */}
          <div className="user-section">
            <div className="user-info">
              {currentUser?.avatar && (
                <img 
                  src={currentUser.avatar} 
                  alt="Profile" 
                  className="user-avatar"
                />
              )}
              <div className="user-details">
                <span className="user-name">{currentUser?.name}</span>
                <span className="user-email">{currentUser?.email}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Cerrar Sesión">
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="breadcrumb-container">
        <nav className="breadcrumbs" aria-label="Navegación de ruta">
          {getBreadcrumbs().map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="breadcrumb-separator">›</span>}
              <span className={`breadcrumb-item ${index === getBreadcrumbs().length - 1 ? 'active' : ''}`}>
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                {item.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
        
        <div className="period-indicator">
          <span className="period-text">Visualizando: {getCurrentMonthName()}</span>
        </div>
      </div>

      {/* Navegación por Pestañas Mejorada */}
      <div className="tab-navigation-enhanced">
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <div className="tab-content">
                <span className="tab-icon">{tab.icon}</span>
                <div className="tab-text">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
              </div>
              {activeTab === tab.id && <div className="tab-indicator" />}
            </button>
          ))}
        </div>
        
        {/* Indicador de Progreso */}
        <div className="progress-indicator">
          <div 
            className="progress-bar"
            style={{
              transform: `translateX(${activeTab === 'budget' ? '0%' : '100%'})`,
              width: '50%'
            }}
          />
        </div>
      </div>

      {/* Acciones Rápidas */}
      {onQuickAction && (
        <div className="quick-actions">
          <div className="action-buttons">
            <button 
              className="quick-action-btn"
              onClick={() => onQuickAction('add-expense')}
            >
              <span className="action-icon">➕</span>
              <span className="action-text">Agregar Gasto</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => onQuickAction('setup-budget')}
            >
              <span className="action-icon">💰</span>
              <span className="action-text">Configurar Presupuesto</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => onQuickAction('setup-categories')}
            >
              <span className="action-icon">🏷️</span>
              <span className="action-text">Categorías</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => onQuickAction('export-data')}
            >
              <span className="action-icon">📊</span>
              <span className="action-text">Exportar</span>
            </button>
          </div>
          
          <div className="context-help">
            <button className="help-btn">
              <span className="help-icon">❓</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;