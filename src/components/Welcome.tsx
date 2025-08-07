import React from 'react';
import { useTranslations } from '../utils/i18n';
import './Welcome.css';

interface WelcomeProps {
  onGetStarted: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted }) => {
  const t = useTranslations();
  
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {/* Header con logo y título */}
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
          <h1 className="app-title">{t.appTitle}</h1>
          <p className="app-subtitle">{t.appSubtitle}</p>
        </div>

        {/* Características principales */}
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="20" fill="#EEF2FF"/>
                <path d="M24 8v32M8 24h32" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="24" cy="16" r="3" fill="#10B981"/>
                <circle cx="16" cy="24" r="3" fill="#F59E0B"/>
                <circle cx="32" cy="24" r="3" fill="#EF4444"/>
                <circle cx="24" cy="32" r="3" fill="#8B5CF6"/>
              </svg>
            </div>
            <h3>{t.visualBudget}</h3>
            <p>{t.visualBudgetDesc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="32" height="24" rx="4" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2"/>
                <path d="M16 20h16M16 24h12M16 28h8" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="36" cy="36" r="8" fill="#10B981"/>
                <path d="M32 36l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>{t.smartTracking}</h3>
            <p>{t.smartTrackingDesc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="10" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2"/>
                <circle cx="30" cy="30" r="10" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2"/>
                <path d="M26 22l-4 4" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="18" cy="18" r="3" fill="#10B981"/>
                <circle cx="30" cy="30" r="3" fill="#F59E0B"/>
              </svg>
            </div>
            <h3>{t.personalPlanning}</h3>
                <p>{t.personalPlanningDesc}</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="cta-section">
          <button className="get-started-btn" onClick={onGetStarted}>
            <span>{t.getStarted}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="cta-description">
            {t.ctaDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;