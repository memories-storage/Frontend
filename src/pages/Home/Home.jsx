import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import UserDashboard from '../../components/UserDashboard';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const [counter, setCounter] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Update time every second to show dynamic updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Show profile instead of navigating
      setShowProfile(true);
    } else {
      // Navigate to login
      navigate('/login');
    }
  };

  // If user is authenticated and wants to see profile, show it
  if (isAuthenticated && showProfile) {
    return <UserDashboard />;
  }

  return (
    <div className="home">
      {/* Header with user info */}
      {isAuthenticated && (
        <div className="user-header">
          <div className="user-info">
            <span>Welcome, {user?.firstName || user?.email || 'User'}!</span>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Let's Code</h1>
          <p>Your platform for collaborative coding and project development</p>
          
          {/* Authentication status */}
          {isAuthenticated ? (
            <div className="auth-status">
              <p className="auth-message">✅ You are logged in</p>
              <p className="user-email">Email: {user?.email}</p>
              <div className="auth-actions">
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={() => setShowProfile(true)}
                >
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="medium"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  size="medium"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="auth-status">
              <p className="auth-message">🔒 Please log in to access all features</p>
              <div className="auth-actions">
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  size="medium"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
          
          {/* Dynamic counter section */}
          <div className="dynamic-demo">
            <h3>Dynamic Demo</h3>
            <p>Current time: {currentTime.toLocaleTimeString()}</p>
            <p>Counter: {counter}</p>
            <div className="counter-buttons">
              <Button 
                variant="outline" 
                size="small"
                onClick={() => setCounter(counter - 1)}
              >
                Decrease
              </Button>
              <Button 
                variant="primary" 
                size="small"
                onClick={() => setCounter(counter + 1)}
              >
                Increase
              </Button>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            size="large"
            onClick={handleGetStarted}
          >
            {isAuthenticated ? 'Go to Profile' : 'Get Started'}
          </Button>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2>Why Choose Let's Code?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Collaborative Development</h3>
              <p>Work together with team members in real-time</p>
            </div>
            <div className="feature-card">
              <h3>Project Management</h3>
              <p>Organize and track your coding projects efficiently</p>
            </div>
            <div className="feature-card">
              <h3>Code Review</h3>
              <p>Get feedback and improve your code quality</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 