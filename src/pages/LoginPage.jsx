import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SynoxDB } from '../lib/synoxDB';
import Logo from '../components/common/Logo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = 'show-login';
    return () => {
      document.body.className = '';
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await SynoxDB.authenticateUser(email, password);
      if (result.success) {
        setUserData(result.user);
        const otpSent = await SynoxDB.sendOTPEmail(result.user.email);
        if (otpSent && otpSent.success !== false) {
          setStep(2);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      } else {
        setError(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await SynoxDB.verifyOTPCode(userData.email, otp);
      if (result.success) {
        sessionStorage.setItem('synox_user_id', userData.id);
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setError('');
    setLoading(true);
    const otpSent = await SynoxDB.sendOTPEmail(userData.email);
    setLoading(false);
    if (otpSent && otpSent.success !== false) {
      alert('A new OTP has been sent to your email.');
    } else {
      setError('Failed to resend OTP.');
    }
  };

  return (
    <div id="login-page">
      <div className="split-screen">
        {/* Visual Side */}
        <div className="left-pane">
          <h1 className="brand-headline">Legacy.<br />Security.<br />Trust.</h1>
          <p className="brand-subtext">
            Experience the new standard in international private banking.
            Secure, discreet, and tailored to your global lifestyle.
          </p>
        </div>

        {/* Login Form Side */}
        <div className="right-pane">
          <div className="login-box">
            <div className="logo-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Logo variant="dark" size="medium" className="mb-4" />
              
              {/* Conditionally show profile picture on step 2 */}
              {step === 2 && userData && (
                <div id="profile-welcome-section" className="text-center mb-2">
                  <div className="mb-3">
                    <img
                      src={userData.profile_picture || "https://randomuser.me/api/portraits/men/32.jpg"}
                      className="rounded-circle shadow"
                      id="welcome-profile-img"
                      style={{
                        width: '85px',
                        height: '85px',
                        objectFit: 'cover',
                        border: '3px solid #002D72',
                      }}
                      alt="Profile"
                    />
                  </div>
                  <h5 className="font-weight-bold mb-1" style={{ color: '#002d72' }} id="welcome-name">
                    Welcome back, {userData.full_name.split(' ')[0]}
                  </h5>
                </div>
              )}

              <p className="text-muted small text-uppercase" style={{ letterSpacing: '1px', marginTop: step === 2 ? '10px' : '0' }}>
                Secure Access
              </p>
            </div>

            {step === 1 ? (
              <div id="login-form-container">
                <form id="loginForm" onSubmit={handleLogin}>
                  <div className="form-group form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="userInput"
                      placeholder=" "
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="floating-label" htmlFor="userInput">Client ID / Email</label>
                  </div>

                  <div className="form-group form-floating">
                    <input
                      type="password"
                      className="form-control"
                      id="passInput"
                      placeholder=" "
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="floating-label" htmlFor="passInput">Password</label>
                  </div>

                  {error && <div className="error-message show">{error}</div>}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <a href="#" className="small text-dark font-weight-bold" style={{ color: '#9e7a2e' }}>
                      Forgot credentials?
                    </a>
                  </div>

                  <button type="submit" className={`btn-premium ${loading ? 'loading' : ''}`} disabled={loading}>
                    <span>Secure Sign In</span>
                    <div className="loading-spinner"></div>
                  </button>
                </form>
              </div>
            ) : (
              <div id="otp-form-container">
                <form id="otpForm" onSubmit={handleVerifyOTP}>
                  <div className="alert alert-info small" style={{
                    backgroundColor: 'rgba(0, 45, 114, 0.1)',
                    border: '1px solid rgba(0, 45, 114, 0.2)',
                    color: '#002d72'
                  }}>
                    <i className="fas fa-envelope me-"></i>A One-Time Password (OTP) has been sent to:<br />
                    <strong id="otp-email-display">{userData?.email}</strong>
                  </div>
                  <div className="form-group form-floating mt-4">
                    <input
                      type="text"
                      className="form-control text-center"
                      id="otpInput"
                      placeholder=" "
                      maxLength="6"
                      style={{ letterSpacing: '5px', fontWeight: 700, fontSize: '1.2rem' }}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <label className="floating-label" htmlFor="otpInput" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                      Enter 6-Digit Code
                    </label>
                  </div>

                  {error && <div className="error-message show">{error}</div>}

                  <button type="submit" className={`btn-premium mt-4 ${loading ? 'loading' : ''}`} disabled={loading}>
                    <span>Verify Identity</span>
                    <div className="loading-spinner"></div>
                  </button>

                  <div className="text-center mt-3">
                    <a href="#" className="small text-primary" onClick={(e) => { e.preventDefault(); resendOTP(); }} style={{ color: '#9e7a2e', fontWeight: 600 }}>
                      Resend OTP
                    </a>
                    <span className="mx-2 text-muted">|</span>
                    <a href="#" className="small text-muted" onClick={() => window.location.reload()}>Cancel</a>
                  </div>
                </form>
              </div>
            )}

            <div className="text-center mt-4">
              <p className="small text-muted mb-0">
                <i className="fas fa-lock me-"></i> 256-bit End-to-End Encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
