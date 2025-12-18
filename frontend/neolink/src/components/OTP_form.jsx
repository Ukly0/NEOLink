import React, { useState } from 'react';

const OTPForm = ({ onAuthenticate }) => {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = otp.trim();
        
        if (trimmed.length === 0) {
            setError('Please enter the OTP code');
            return;
        }
        
        setError('');
        onAuthenticate(trimmed);
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    margin: '0 auto 1rem',
                    backgroundColor: '#e8e5f7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="30" height="30" fill="#7c6fd6" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                </div>
                <h3 className="h5 fw-bold mb-2">Check your email</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    We've sent a one-time password to your email address. Please enter it below.
                </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#495057'
                }}>
                    One-Time Password
                </label>
                <input 
                    type="text" 
                    value={otp} 
                    placeholder='Enter OTP code' 
                    onChange={(e) => {
                        setOTP(e.target.value);
                        setError('');
                    }}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: `2px solid ${error ? '#dc3545' : '#dee2e6'}`,
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        letterSpacing: '0.5em',
                        fontWeight: '600',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => {
                        if (!error) e.target.style.borderColor = '#7c6fd6';
                    }}
                    onBlur={(e) => {
                        if (!error) e.target.style.borderColor = '#dee2e6';
                    }}
                />
                {error && (
                    <div style={{ 
                        color: '#dc3545',
                        fontSize: '0.85rem',
                        marginTop: '0.5rem'
                    }}>
                        {error}
                    </div>
                )}
            </div>

            <button 
                type="submit"
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, #7c6fd6 0%, #8b7ad6 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(124, 111, 214, 0.2)'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(124, 111, 214, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(124, 111, 214, 0.2)';
                }}
            >
                Verify & Login
            </button>

            <div style={{ 
                marginTop: '1.5rem',
                textAlign: 'center',
                fontSize: '0.85rem',
                color: '#6c757d'
            }}>
                Didn't receive the code? 
                <button 
                    type="button"
                    onClick={() => window.location.reload()}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#7c6fd6',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginLeft: '0.25rem',
                        textDecoration: 'underline'
                    }}
                >
                    Resend
                </button>
            </div>
        </form>
    );
};

export default OTPForm;