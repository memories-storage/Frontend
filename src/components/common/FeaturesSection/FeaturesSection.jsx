import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = ({ 
  title, 
  features, 
  id = null 
}) => {
  return (
    <section id={id} className="features-section">
      <div className="container">
        <h2>{title}</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div 
                className="feature-icon"
                style={{ backgroundColor: feature.color }}
              >
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 