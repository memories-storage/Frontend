import React from 'react';
import './Breadcrumb.css';

const Breadcrumb = ({ breadcrumbs, onNavigate }) => {
  const handleBreadcrumbClick = (index) => {
    if (onNavigate) {
      onNavigate(index);
    }
  };

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.id} className="breadcrumb-item">
            {index < breadcrumbs.length - 1 ? (
              <>
                <button
                  className="breadcrumb-link"
                  onClick={() => handleBreadcrumbClick(index)}
                  title={crumb.name}
                >
                  {crumb.name}
                </button>
                <span className="breadcrumb-separator">/</span>
              </>
            ) : (
              <span className="breadcrumb-current" title={crumb.name}>
                {crumb.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 