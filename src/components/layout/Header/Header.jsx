import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../common/Button';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
            <Button variant="outline" size="small">Login</Button>
            <Button variant="primary" size="small">Sign Up</Button>
            
            {/* Mobile Menu Button */}
            <button 
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
      <nav className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-list">
          <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="/projects" onClick={closeMobileMenu}>Projects</Link></li>
          <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
          <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default Header; 