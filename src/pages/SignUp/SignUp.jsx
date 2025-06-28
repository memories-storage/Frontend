import './SignUp.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';   
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../utils/constants/api';
import { cookieUtils } from '../../utils/cookies';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordStrengthColor, setPasswordStrengthColor] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Password validation
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        // Password confirmation validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('email', email.trim());
            formData.append('password', password);

            const response = await apiService.postForm(ENDPOINTS.REGISTER, formData);

            // Handle successful registration
            if (response.message) {
                setSuccess(response.message || 'Registration successful! Redirecting to login...');
                
                // Clear form
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setPasswordStrength('');
                
                // Redirect to login after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('Invalid response from server');
            }
        } catch (error) {
            console.error('Signup error:', error);
            
            // Handle different types of errors
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 400:
                        setError(data.message || 'Invalid registration data');
                        break;
                    case 409:
                        setError('Email already exists. Please use a different email or try logging in.');
                        break;
                    case 422:
                        setError(data.message || 'Validation error. Please check your input.');
                        break;
                    case 500:
                        setError('Server error. Please try again later.');
                        break;
                    default:
                        setError(data.message || 'Registration failed. Please try again.');
                }
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    const handlePasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength('Weak');
            setPasswordStrengthColor('red');
        } else if (password.length < 12) {
            setPasswordStrength('Medium');
            setPasswordStrengthColor('orange'); 
        } else {
            setPasswordStrength('Strong');
            setPasswordStrengthColor('green');
        }
    }

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        handlePasswordStrength(password);
        // Clear error when user starts typing
        if (error) setError('');
    }

    const handleNameChange = (e) => {
        const name = e.target.value;
        setName(name);
        // Clear error when user starts typing
        if (error) setError('');
    }

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);
        // Clear error when user starts typing
        if (error) setError('');
    }

    const handleConfirmPasswordChange = (e) => {
        const confirmPassword = e.target.value;
        setConfirmPassword(confirmPassword);
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
    <div className='signup'>
      <div className='signup-container'>
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <input 
            type='text' 
            placeholder='Name' 
            value={name} 
            onChange={handleNameChange}
            disabled={loading}
            required 
          />
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
          <div className='password-field'>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder='Confirm Password' 
              value={confirmPassword} 
              onChange={handleConfirmPasswordChange} 
              disabled={loading}
              required
            />
            <button 
              type='button' 
              className='password-toggle'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {passwordStrength && (
            <div className='password-strength-container'>
              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password Strength: {passwordStrength}
              </p>
            </div>
          )}
          <button type='submit' disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
          {error && <p className='error'>{error}</p>}
          {success && <p className='success'>{success}</p>}
        </form>
      </div>
      <div className='signup-login-redirect'>
        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  );
};

export default SignUp;