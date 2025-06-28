import './SignUp.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';   
import { useNavigate } from 'react-router-dom';

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
    const [passwordStrengthColor, setPasswordStrengthColor]  = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        if (name === 'admin' && email === 'admin@gmail.com' && password === 'admin') {
            navigate('/');
        } else {
            setError('Invalid name, email or password');
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
        <form>
          <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} autoComplete='off' required />
          <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='off' />
          <div className='password-field'>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder='Password' 
              value={password} 
              onChange={handlePasswordChange} 
              autoComplete='off'
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
          <div className='password-field'>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder='Confirm Password' 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              autoComplete='off'
            />
            <button 
              type='button' 
              className='password-toggle'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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
          <button type='submit' onClick={handleSignup} disabled={loading}>
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