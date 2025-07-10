import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  showCounts = true 
}) => {
  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <button 
          key={tab.key}
          className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
          {showCounts && tab.count !== undefined && (
            <span className="tab-count">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 