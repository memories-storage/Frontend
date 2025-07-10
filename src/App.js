import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, AuthProvider } from './context';
import { initializeAuth } from './store/slices/authSlice';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './components/UserDashboard';
import Settings from './components/Settings';
import './styles/global.css';
import UploadFile from './pages/UploadFile';
import Scanner from './pages/Scanner';
import PlaceholderPage from './pages/PlaceholderPage';
import Files from './pages/Files';
import Folders from './pages/Folders';

// Component to initialize auth state
const AuthInitializer = () => {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="App">
              <Header />
              <main id="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/profile" element={<UserDashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/upload/:id" element={<UploadFile/>}/>
                  <Route path="/scanner" element={<Scanner/>}/>
                  
                  {/* New routes for enhanced navigation */}
                  <Route path="/dashboard" element={<PlaceholderPage />} />
                  <Route path="/files" element={<Files />} />
                  <Route path="/folders" element={<Folders />} />
                  <Route path="/features" element={<PlaceholderPage />} />
                  <Route path="/features/:feature" element={<PlaceholderPage />} />
                  <Route path="/pricing" element={<PlaceholderPage />} />
                  <Route path="/subscription" element={<PlaceholderPage />} />
                  <Route path="/about" element={<PlaceholderPage />} />
                  <Route path="/contact" element={<PlaceholderPage />} />
                  
                  {/* Add more routes here as you create more pages */}
                </Routes>
              </main>
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
