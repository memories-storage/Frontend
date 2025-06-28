import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../common/Button';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);
  const navigate = useNavigate();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Handle click outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuBtnRef.current &&
        !mobileMenuBtnRef.current.contains(event.target)
      ) {
        closeMobileMenu();
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
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header-container">
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
            
            {/* Desktop Login/Signup Buttons */}
            <div className="header-actions-buttons">
              <Button variant="outline" size="small" onClick={() =>
              { 
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
            
            {/* Mobile Menu Button */}
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
          
          {/* Mobile Login/Signup Buttons */}
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
        </ul>
      </nav>
    </>
  );
};

export default Header; 