import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // For demo purposes, accept any valid email
            setEmailSent(true);
            setSuccess('Password reset link has been sent to your email address');
        } catch (err) {
            setError('Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleResendEmail = async () => {
        setLoading(true);
        setError('');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Reset link has been resent to your email');
        } catch (err) {
            setError('Failed to resend email. Please try again.');
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
                                }}
                                className='back-button'
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