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
import UploadFile from './pages/UploadFile/UploadFile';
import Scanner from './pages/Scanner';

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
