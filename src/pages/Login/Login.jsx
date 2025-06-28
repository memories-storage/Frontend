import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        if (email !== '' && password !== '') {
            navigate('/');
        } else {
            setError('Invalid email or password');
            setLoading(false);
        }
    }

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);
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
            <form>
                <input type='email' placeholder='Email' value={email} onChange={handleEmailChange} />
                <div className='password-field'>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder='Password' 
                        value={password} 
                        onChange={handlePasswordChange} 
                    />
                    <button 
                        type='button' 
                        className='password-toggle'
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
                <div className='forgot-password-link'>
                    <Link to='/forgot-password'>Forgot Password?</Link>
                </div>
                <button type='submit' onClick={handleLogin} disabled={loading}>
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