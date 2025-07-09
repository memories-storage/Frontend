import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { authUtils } from '../../../utils/auth';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [filesDropdownOpen, setFilesDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);
  const userMenuRef = useRef(null);
  const featuresDropdownRef = useRef(null);
  const filesDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const toggleFeaturesDropdown = () => {
    setFeaturesDropdownOpen(!featuresDropdownOpen);
    setFilesDropdownOpen(false); // Close other dropdowns
  };

  const closeFeaturesDropdown = () => {
    setFeaturesDropdownOpen(false);
  };

  const toggleFilesDropdown = () => {
    setFilesDropdownOpen(!filesDropdownOpen);
    setFeaturesDropdownOpen(false); // Close other dropdowns
  };

  const closeFilesDropdown = () => {
    setFilesDropdownOpen(false);
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

      // Close features dropdown if clicked outside
      if (
        featuresDropdownOpen &&
        featuresDropdownRef.current &&
        !featuresDropdownRef.current.contains(event.target)
      ) {
        closeFeaturesDropdown();
      }

      // Close files dropdown if clicked outside
      if (
        filesDropdownOpen &&
        filesDropdownRef.current &&
        !filesDropdownRef.current.contains(event.target)
      ) {
        closeFilesDropdown();
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
  }, [mobileMenuOpen, userMenuOpen, featuresDropdownOpen, filesDropdownOpen]);

  // Close dropdowns when route changes
  useEffect(() => {
    closeMobileMenu();
    closeUserMenu();
    closeFeaturesDropdown();
    closeFilesDropdown();
  }, [location.pathname]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Navigation items for non-logged-in users
  const publicNavItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/features', label: 'Features', icon: '✨', hasDropdown: true },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  // Navigation items for logged-in users
  const privateNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/files', label: 'Files', icon: '📁', hasDropdown: true },
    { path: `/upload/id=${authUtils.getCurrentUserId()}`, label: 'Upload', icon: '📤' },
    { path: '/pricing', label: 'Pricing', icon: '💰' },
  ];

  // Features dropdown items
  const featuresItems = [
    { path: '/features/storage', label: 'Secure Storage', icon: '🔒' },
    { path: '/features/sharing', label: 'Easy Sharing', icon: '🔗' },
    { path: '/features/access', label: 'Cross-Platform', icon: '📱' },
    { path: '/features/privacy', label: 'Privacy Protection', icon: '🛡️' },
  ];

  // Files dropdown items
  const filesItems = [
    { path: '/files', label: 'All Files', icon: '📄' },
    { path: '/files?tab=favorites', label: 'Favorites', icon: '⭐' },
    { path: '/files?tab=photos', label: 'Photos', icon: '📸' },
    { path: '/files?tab=videos', label: 'Videos', icon: '🎥' },
    { path: '/files?tab=folders', label: 'Folders', icon: '📁' },
  ];

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
              <h1>📁 Let's Code</h1>
            </Link>
          </div>
          
          <nav className="header-nav">
            <ul className="nav-list">
              {isAuthenticated ? (
                // Logged-in user navigation
                privateNavItems.map((item) => (
                  <li key={item.path} className={item.hasDropdown ? 'dropdown-container' : ''}>
                    {item.hasDropdown ? (
                      <div className="dropdown-wrapper" ref={item.path === '/files' ? filesDropdownRef : featuresDropdownRef}>
                        <button 
                          className={`dropdown-trigger ${isActiveRoute(item.path) ? 'active' : ''}`}
                          onClick={item.path === '/files' ? toggleFilesDropdown : toggleFeaturesDropdown}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          {item.label}
                          <span className="dropdown-arrow">▼</span>
                        </button>
                        {(item.path === '/files' ? filesDropdownOpen : featuresDropdownOpen) && (
                          <div className="dropdown-menu">
                            {(item.path === '/files' ? filesItems : featuresItems).map((dropdownItem) => (
                              <Link 
                                key={dropdownItem.path} 
                                to={dropdownItem.path}
                                className="dropdown-item"
                                onClick={item.path === '/files' ? closeFilesDropdown : closeFeaturesDropdown}
                              >
                                <span className="dropdown-icon">{dropdownItem.icon}</span>
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link 
                        to={item.path} 
                        className={isActiveRoute(item.path) ? 'active' : ''}
                        onClick={closeMobileMenu}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))
              ) : (
                // Public navigation
                publicNavItems.map((item) => (
                  <li key={item.path} className={item.hasDropdown ? 'dropdown-container' : ''}>
                    {item.hasDropdown ? (
                      <div className="dropdown-wrapper" ref={featuresDropdownRef}>
                        <button 
                          className={`dropdown-trigger ${isActiveRoute(item.path) ? 'active' : ''}`}
                          onClick={toggleFeaturesDropdown}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          {item.label}
                          <span className="dropdown-arrow">▼</span>
                        </button>
                        {featuresDropdownOpen && (
                          <div className="dropdown-menu">
                            {featuresItems.map((feature) => (
                              <Link 
                                key={feature.path} 
                                to={feature.path}
                                className="dropdown-item"
                                onClick={closeFeaturesDropdown}
                              >
                                <span className="dropdown-icon">{feature.icon}</span>
                                {feature.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link 
                        to={item.path} 
                        className={isActiveRoute(item.path) ? 'active' : ''}
                        onClick={closeMobileMenu}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))
              )}
            </ul>
          </nav>
          
          <div className="header-actions">
            <Button 
              variant="outline"
              size="small"
              className="scanner-toggle"
              onClick={() => navigate('/scanner')}
              title="QR Scanner"
            >
              <QrCodeScannerIcon />
            </Button> 
            <Button 
              variant="outline" 
              size="small"
              onClick={toggleTheme}
              className="theme-toggle"
              title="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'} 
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
                          <PersonIcon className="menu-icon" />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard" onClick={closeUserMenu}>
                          <DashboardIcon className="menu-icon" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/files" onClick={closeUserMenu}>
                          <FolderIcon className="menu-icon" />
                          Files
                        </Link>
                      </li>
                      <li>
                        <Link to="/upload" onClick={closeUserMenu}>
                          <CloudUploadIcon className="menu-icon" />
                          Upload
                        </Link>
                      </li>
                      <li>
                        <Link to="/pricing" onClick={closeUserMenu}>
                          <span className="menu-icon">💰</span>
                          Pricing
                        </Link>
                      </li>
                      <li className="user-menu-divider"></li>
                      <li>
                        <Link to="/settings" onClick={closeUserMenu}>
                          <SettingsIcon className="menu-icon" />
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
          {isAuthenticated ? (
            // Mobile navigation for logged-in users
            <>
              {privateNavItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    onClick={closeMobileMenu}
                    className={isActiveRoute(item.path) ? 'active' : ''}
                  >
                    <span className="mobile-nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mobile-nav-divider"></li>
              <li>
                <Link to="/settings" onClick={closeMobileMenu}>
                  <span className="mobile-nav-icon">⚙️</span>
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={closeMobileMenu}>
                  <span className="mobile-nav-icon">👤</span>
                  Profile
                </Link>
              </li>
              <li className="mobile-auth-buttons">
                <Button variant="outline" size="medium" fullWidth onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            // Mobile navigation for public users
            <>
              {publicNavItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    onClick={closeMobileMenu}
                    className={isActiveRoute(item.path) ? 'active' : ''}
                  >
                    <span className="mobile-nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* Mobile features submenu */}
              <li className="mobile-features-submenu">
                <div className="mobile-submenu-header">Features</div>
                {featuresItems.map((feature) => (
                  <Link 
                    key={feature.path} 
                    to={feature.path}
                    className="mobile-submenu-item"
                    onClick={closeMobileMenu}
                  >
                    <span className="mobile-nav-icon">{feature.icon}</span>
                    {feature.label}
                  </Link>
                ))}
              </li>
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
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header; 