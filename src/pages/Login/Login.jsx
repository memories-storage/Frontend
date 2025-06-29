import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../utils/constants/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('email', email.trim());
            formData.append('password', password);

            const response = await apiService.postForm(ENDPOINTS.LOGIN, formData);

            // Handle successful login
            if (response.token) {
                console.log(response);
                
                // Use the login function from AuthContext
                login(response.token, response.user);

                setSuccess('Login successful! Redirecting...');
                
                // Redirect after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle different types of errors
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 400:
                        setError(data.message || 'Invalid email or password');
                        break;
                    case 401:
                        setError('Invalid email or password');
                        break;
                    case 422:
                        setError(data.message || 'Validation error');
                        break;
                    case 500:
                        setError('Server error. Please try again later.');
                        break;
                    default:
                        setError(data.message || 'Login failed. Please try again.');
                }
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        
            setLoading(false);
        }
    }

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        // Clear error when user starts typing
        if (error) setError('');
    }

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);
        // Clear error when user starts typing
        if (error) setError('');
    }

    // Eye icon SVG components
    const EyeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    );

    const EyeOffIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    );
 
  return (
    <div className='login'>
        <div className='login-container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input 
                    type='email' 
                    placeholder='Email' 
                    value={email} 
                    onChange={handleEmailChange}
                    disabled={loading}
                    required
                />
                <div className='password-field'>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder='Password' 
                        value={password} 
                        onChange={handlePasswordChange}
                        disabled={loading}
                        required
                    />
                    <button 
                        type='button' 
                        className='password-toggle'
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        disabled={loading}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
                <div className='forgot-password-link'>
                    <Link to='/forgot-password'>Forgot Password?</Link>
                </div>
                <button type='submit' disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className='error'>{error}</p>}
                {success && <p className='success'>{success}</p>}
            </form>
        </div>
        <div className='login-signup-redirect'>
            <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </div>
    </div>
  ); 
};

export default Login;