import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../utils/constants/api';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email);
        // Clear any previous errors when user starts typing
        if (error) setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('email', email.trim());

            const response = await apiService.postForm(ENDPOINTS.FORGOT_PASSWORD, formData);

            // Handle successful response
            setEmailSent(true);
            setSuccess(response.message || 'Password reset link has been sent to your email address');
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 400:
                        setError(data.message || 'Invalid email address');
                        break;
                    case 404:
                        setError('Email address not found in our system');
                        break;
                    case 422:
                        setError(data.message || 'Invalid email format');
                        break;
                    case 429:
                        setError('Too many requests. Please wait a moment before trying again.');
                        break;
                    case 500:
                        setError('Server error. Please try again later.');
                        break;
                    default:
                        setError(data.message || 'Failed to send reset email. Please try again.');
                }
            } else if (error.request) {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleResendEmail = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('email', email.trim());

            const response = await apiService.postForm(ENDPOINTS.RESEND_RESET_EMAIL, formData);

            setSuccess(response.message || 'Reset link has been resent to your email');
        } catch (error) {
      
            
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 429:
                        setError('Too many resend attempts. Please wait before trying again.');
                        break;
                    case 400:
                        setError(data.message || 'Failed to resend email');
                        break;
                    default:
                        setError(data.message || 'Failed to resend email. Please try again.');
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

    return (
        <div className='forgot-password'>
            <div className='forgot-password-container'>
                <h1>Forgot Password</h1>
                {!emailSent ? (
                    <>
                        <p className='forgot-password-description'>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type='email' 
                                placeholder='Enter your email' 
                                value={email} 
                                onChange={handleEmailChange}
                                disabled={loading}
                                required
                            />
                            <button type='submit' disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            {error && <p className='error'>{error}</p>}
                            {success && <p className='success'>{success}</p>}
                        </form>
                    </>
                ) : (
                    <div className='email-sent-container'>
                        <div className='email-sent-icon'>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22,4 12,14.01 9,11.01"/>
                            </svg>
                        </div>
                        <h2>Check Your Email</h2>
                        <p className='email-sent-description'>
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className='email-sent-instructions'>
                            Click the link in the email to reset your password. The link will expire in 1 hour.
                        </p>
                        <div className='email-sent-actions'>
                            <button 
                                type='button' 
                                onClick={handleResendEmail}
                                disabled={loading}
                                className='resend-button'
                            >
                                {loading ? 'Sending...' : 'Resend Email'}
                            </button>
                            <button 
                                type='button' 
                                onClick={() => {
                                    setEmailSent(false);
                                    setEmail('');
                                    setSuccess('');
                                    setError('');
                                }}
                                className='back-button'
                                disabled={loading}
                            >
                                Back to Login
                            </button>
                        </div>
                        {error && <p className='error'>{error}</p>}
                        {success && <p className='success'>{success}</p>}
                    </div>
                )}
                <div className='forgot-password-footer'>
                    <Link to='/login'>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 