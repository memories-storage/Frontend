import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import './PlaceholderPage.css';

const PlaceholderPage = () => {
  const { feature } = useParams();
  const navigate = useNavigate();

  const getPageInfo = () => {
    const path = window.location.pathname;
    
    if (path === '/dashboard') {
      return {
        title: 'Dashboard',
        description: 'Your personal dashboard with file overview and statistics.',
        icon: '📊',
        comingSoon: false
      };
    }
    
    if (path === '/files') {
      return {
        title: 'Files',
        description: 'Manage and organize your uploaded files.',
        icon: '📁',
        comingSoon: false
      };
    }
    
    if (path === '/upload') {
      return {
        title: 'Upload Files',
        description: 'Upload your photos, videos, and documents.',
        icon: '📤',
        comingSoon: false
      };
    }
    
    if (path === '/features') {
      return {
        title: 'Features',
        description: 'Explore all the powerful features of our platform.',
        icon: '✨',
        comingSoon: true
      };
    }
    
    if (path.startsWith('/features/')) {
      const featureMap = {
        storage: { title: 'Secure Storage', description: 'Military-grade encryption for your files.' },
        sharing: { title: 'Easy Sharing', description: 'Share files with secure links and permissions.' },
        access: { title: 'Cross-Platform Access', description: 'Access your files from any device.' },
        privacy: { title: 'Privacy Protection', description: 'Your files are private by default.' }
      };
      
      const featureInfo = featureMap[feature] || { title: 'Feature', description: 'Feature details coming soon.' };
      return {
        title: featureInfo.title,
        description: featureInfo.description,
        icon: '🔒',
        comingSoon: true
      };
    }
    
    if (path === '/pricing') {
      return {
        title: 'Pricing & Subscription',
        description: 'Choose the perfect plan for your storage needs. Upgrade your storage and unlock premium features.',
        icon: '💰',
        comingSoon: false
      };
    }
    
    if (path === '/about') {
      return {
        title: 'About Us',
        description: 'Learn more about our team and mission.',
        icon: 'ℹ️',
        comingSoon: true
      };
    }
    
    if (path === '/contact') {
      return {
        title: 'Contact Us',
        description: 'Get in touch with our support team.',
        icon: '📞',
        comingSoon: true
      };
    }
    
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      icon: '❓',
      comingSoon: false
    };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <div className="placeholder-icon">{pageInfo.icon}</div>
        <h1>{pageInfo.title}</h1>
        <p>{pageInfo.description}</p>
        
        {pageInfo.comingSoon && (
          <div className="coming-soon-badge">
            <span>🚧 Coming Soon</span>
          </div>
        )}
        
        <div className="placeholder-actions">
          <Button 
            variant="primary" 
            size="medium"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
          <Button 
            variant="outline" 
            size="medium"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage; 