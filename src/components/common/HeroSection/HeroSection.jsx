import React from 'react';
import Button from '../Button';
import './HeroSection.css';

const HeroSection = ({ 
  title, 
  subtitle, 
  primaryAction, 
  secondaryAction,
  visualElements = []
}) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          <div className="hero-actions">
            {primaryAction && (
              <Button 
                variant="primary" 
                size="large"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button 
                variant="outline" 
                size="large"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
        {visualElements.length > 0 && (
          <div className="hero-visual">
            {visualElements.map((element, index) => (
              <div 
                key={index} 
                className={`floating-card card-${index + 1}`}
              >
                <div className="card-icon">{element.icon}</div>
                <span>{element.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection; 