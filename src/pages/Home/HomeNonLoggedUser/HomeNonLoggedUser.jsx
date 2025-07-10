import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import './HomeNonLoggedUser.css';

const HomeNonLoggedUser = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📁',
      title: 'Secure File Storage',
      description: 'Store your photos and videos securely in the cloud with advanced encryption and backup systems.',
      color: '#667eea'
    },
    {
      icon: '🔗',
      title: 'Easy Sharing',
      description: 'Share your files with friends and family through secure links with customizable permissions.',
      color: '#764ba2'
    },
    {
      icon: '📱',
      title: 'Cross-Platform Access',
      description: 'Access your files from any device - desktop, tablet, or mobile - with our responsive design.',
      color: '#f093fb'
    },
    {
      icon: '⚡',
      title: 'Fast Upload & Download',
      description: 'High-speed file transfer with optimized compression and CDN distribution worldwide.',
      color: '#4facfe'
    },
    {
      icon: '🛡️',
      title: 'Privacy Protection',
      description: 'Your files are private by default. You control who can access your content.',
      color: '#43e97b'
    },
    {
      icon: '📊',
      title: 'File Management',
      description: 'Organize your files with folders, tags, and search functionality for easy navigation.',
      color: '#fa709a'
    }
  ];

  const benefits = [
    {
      title: 'Free Storage',
      value: '5GB',
      description: 'Free storage space for your files'
    },
    {
      title: 'File Types',
      value: 'All',
      description: 'Support for images, videos, and documents'
    },
    {
      title: 'Security',
      value: '256-bit',
      description: 'Military-grade encryption'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      description: 'Reliable service availability'
    }
  ];

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="home-non-logged-user">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Store, Share, and Access Your Files Anywhere</h1>
            <p className="hero-subtitle">
              A secure and reliable platform for storing your photos, videos, and documents. 
              Access your files from any device, share them easily, and keep them safe.
            </p>
            <div className="hero-actions">
              <Button 
                variant="primary" 
                size="large"
                onClick={handleGetStarted}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">📸</div>
              <span>Photos</span>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🎥</div>
              <span>Videos</span>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📄</div>
              <span>Documents</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-value">{benefit.value}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="features">
        <div className="container">
          <h2>Powerful Features for Everyone</h2>
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

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your free account in seconds with just your email address.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Upload Files</h3>
              <p>Drag and drop your files or use our simple upload interface.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Access Anywhere</h3>
              <p>View, download, and share your files from any device, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who trust our platform for their file storage needs.</p>
            <div className="cta-actions">
              <Button 
                variant="primary" 
                size="large"
                onClick={handleGetStarted}
              >
                Create Free Account
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Let's Code</h3>
              <p>Secure file storage and sharing platform</p>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>File Storage</li>
                <li>Secure Sharing</li>
                <li>Cross-Platform</li>
                <li>Privacy Protection</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Let's Code. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeNonLoggedUser; 