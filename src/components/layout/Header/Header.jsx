import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeUserMenu();
    closeMobileMenu();
    navigate('/');
  };

  // Handle click outside mobile menu and user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu if clicked outside
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuBtnRef.current &&
        !mobileMenuBtnRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }

      // Close user menu if clicked outside
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        closeUserMenu();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen, userMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Mobile Menu Button - Positioned on the left */}
          <button 
            ref={mobileMenuBtnRef}
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className="header-logo">
            <Link to="/" onClick={closeMobileMenu}>
              <h1>Let's Code</h1>
            </Link>
          </div>
          
          <nav className="header-nav">
            <ul className="nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <Button 
              variant="outline" 
              size="small"
              onClick={toggleTheme}
              className="theme-toggle"
            >
              {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'}
            </Button>
            
            {/* Desktop Authentication */}
            {isAuthenticated ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button 
                  className="user-menu-trigger"
                  onClick={toggleUserMenu}
                  aria-label="User menu"
                >
                  <div className="user-avatar">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">
                    {user?.firstName || user?.email || 'User'}
                  </span>
                  <span className="user-menu-arrow">▼</span>
                </button>
                
                {userMenuOpen && (
                  <div className="user-menu">
                    <div className="user-menu-header">
                      <div className="user-info">
                        <div className="user-avatar-large">
                          {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="user-details">
                          <span className="user-full-name">
                            {user?.firstName && user?.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user?.firstName || 'User'
                            }
                          </span>
                          <span className="user-email">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                    <ul className="user-menu-list">
                      <li>
                        <Link to="/profile" onClick={closeUserMenu}>
                          <span className="menu-icon">👤</span>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard" onClick={closeUserMenu}>
                          <span className="menu-icon">📊</span>
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings" onClick={closeUserMenu}>
                          <span className="menu-icon">⚙️</span>
                          Settings
                        </Link>
                      </li>
                      <li className="user-menu-divider"></li>
                      <li>
                        <button onClick={handleLogout} className="logout-button">
                          <span className="menu-icon">🚪</span>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="header-actions-buttons">
                <Button variant="outline" size="small" onClick={() => {
                  navigate('/login');
                  closeMobileMenu();
                }}>
                  Login
                </Button>
                <Button variant="primary" size="small" onClick={() => {
                  navigate('/signup');
                  closeMobileMenu();
                }}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav 
        ref={mobileMenuRef}
        className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}
      >
        <ul className="mobile-nav-list">
          <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="/projects" onClick={closeMobileMenu}>Projects</Link></li>
          <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
          <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
          
          {/* Mobile Authentication */}
          {isAuthenticated ? (
            <>
              {/* <li className="mobile-user-info">
                <div className="mobile-user-header">
                  <div className="mobile-user-avatar">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="mobile-user-details">
                    <span className="mobile-user-name">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.firstName || 'User'
                      }
                    </span>
                    <span className="mobile-user-email">{user?.email}</span>
                  </div>
                </div>
              </li> */}
              {/* <li><Link to="/profile" onClick={closeMobileMenu}>Profile</Link></li>
              <li><Link to="/dashboard" onClick={closeMobileMenu}>Dashboard</Link></li>
              <li><Link to="/settings" onClick={closeMobileMenu}>Settings</Link></li> */}
              <li className="mobile-auth-buttons">
                <Button variant="outline" size="medium" fullWidth onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <li className="mobile-auth-buttons">
              <div className="mobile-auth-container">
                <Button variant="outline" size="medium" fullWidth onClick={() => {
                  navigate('/login');
                  closeMobileMenu();
                }}>
                  Login
                </Button>
                <Button variant="primary" size="medium" fullWidth onClick={() => {
                  navigate('/signup');
                  closeMobileMenu();
                }}>
                  Sign Up
                </Button>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header; 