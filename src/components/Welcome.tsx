import React, { useState, useEffect } from 'react';
import './Welcome.css';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "¡Bienvenido a GastosInteligentes!",
      subtitle: "Tu asistente personal para el control de gastos",
      description: "Transforma la manera en que manejas tu dinero con inteligencia artificial"
    },
    {
      title: "Categorización Automática",
      subtitle: "Escribe en lenguaje natural",
      description: "Solo escribe 'Almuerzo con amigos' y nosotros lo categorizamos automáticamente"
    },
    {
      title: "Aprendizaje Inteligente",
      subtitle: "Mejora con cada uso",
      description: "El sistema aprende de tus patrones y se vuelve más preciso con el tiempo"
    },
    {
      title: "Análisis Detallado",
      subtitle: "Insights que importan",
      description: "Obtén análisis profundos de tus hábitos de gasto y proyecciones futuras"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length]);
  
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {/* Progress indicator */}
        <div className="progress-indicator">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>
        
        {/* Header con logo y título dinámico */}
        <div className="welcome-header">
          <div className="app-logo">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="35" fill="#4F46E5" stroke="#6366F1" strokeWidth="2"/>
              <path d="M25 35h30v20H25z" fill="white" opacity="0.9"/>
              <path d="M30 25h20v15H30z" fill="white" opacity="0.7"/>
              <circle cx="40" cy="40" r="8" fill="#10B981"/>
              <path d="M36 40l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="app-title">{steps[currentStep].title}</h1>
          <p className="app-subtitle">{steps[currentStep].subtitle}</p>
          <p className="step-description">{steps[currentStep].description}</p>
        </div>

        {/* Demostración interactiva */}
        <div className="demo-section">
          {currentStep === 0 && (
            <div className="demo-card welcome-demo">
              <div className="demo-content">
                <div className="stats-preview">
                  <div className="stat-item">
                    <span className="stat-number">85%</span>
                    <span className="stat-label">Precisión en categorización</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">3min</span>
                    <span className="stat-label">Configuración inicial</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Análisis automático</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="demo-card categorization-demo">
              <div className="demo-content">
                <div className="input-example">
                  <div className="typing-animation">
                    <span className="cursor">|</span>
                    <span className="typed-text">Almuerzo con María en el centro</span>
                  </div>
                  <div className="arrow-down">↓</div>
                  <div className="category-result">
                    <span className="category-tag">🍽️ Almuerzo</span>
                    <span className="confidence">95% confianza</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="demo-card learning-demo">
              <div className="demo-content">
                <div className="learning-progress">
                  <div className="week-item">
                    <span className="week-label">Semana 1</span>
                    <div className="accuracy-bar">
                      <div className="accuracy-fill" style={{width: '70%'}}></div>
                      <span className="accuracy-text">70%</span>
                    </div>
                  </div>
                  <div className="week-item">
                    <span className="week-label">Semana 2</span>
                    <div className="accuracy-bar">
                      <div className="accuracy-fill" style={{width: '85%'}}></div>
                      <span className="accuracy-text">85%</span>
                    </div>
                  </div>
                  <div className="week-item">
                    <span className="week-label">Semana 3</span>
                    <div className="accuracy-bar">
                      <div className="accuracy-fill" style={{width: '95%'}}></div>
                      <span className="accuracy-text">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="demo-card analysis-demo">
              <div className="demo-content">
                <div className="chart-preview">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}>
                      <span className="bar-label">Ene</span>
                    </div>
                    <div className="bar" style={{height: '75%'}}>
                      <span className="bar-label">Feb</span>
                    </div>
                    <div className="bar" style={{height: '45%'}}>
                      <span className="bar-label">Mar</span>
                    </div>
                    <div className="bar" style={{height: '80%'}}>
                      <span className="bar-label">Abr</span>
                    </div>
                  </div>
                  <div className="insight-bubble">
                    <span>💡 Gastas 23% más los fines de semana</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation and CTA */}
        <div className="cta-section">
          <div className="navigation-controls">
            <button 
              className="nav-btn prev-btn" 
              onClick={() => setCurrentStep((prev) => prev > 0 ? prev - 1 : steps.length - 1)}
              disabled={currentStep === 0}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Anterior
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button 
                className="nav-btn next-btn" 
                onClick={() => setCurrentStep((prev) => prev + 1)}
              >
                Siguiente
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <button className="get-started-btn" onClick={onStart}>
                <span>¡Comenzar Ahora!</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          
          <div className="quick-start">
            <button className="skip-btn" onClick={onStart}>
              Saltar introducción
            </button>
          </div>
          
          <p className="cta-description">
            {currentStep === steps.length - 1 
              ? "¡Listo para transformar tu gestión financiera!"
              : "Descubre cómo GastosInteligentes puede ayudarte"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;