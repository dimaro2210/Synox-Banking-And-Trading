import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SynoxDB } from '../lib/synoxDB';
import Logo from '../components/common/Logo';

const STEP_MESSAGES = {
  2: 'Saving account details...',
  3: 'Verifying personal information...',
  4: 'Processing documents...',
  submit: 'Creating your account...'
};

const DOC_TYPES = [
  { value: 'passport', label: 'International Passport', icon: 'fa-passport' },
  { value: 'drivers_license', label: "Driver's License", icon: 'fa-id-card' },
  { value: 'national_id', label: 'National ID Card', icon: 'fa-address-card' },
  { value: 'residence_permit', label: 'Residence Permit', icon: 'fa-house-user' }
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [stepTransitioning, setStepTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [verificationCountdown, setVerificationCountdown] = useState(10);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [showDocSelector, setShowDocSelector] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
    account_type: '',
    full_name: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    occupation: '',
    country: '',
    state: '',
    password: '',
    confirm_password: '',
    referral: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = 'show-login';
    return () => { document.body.className = ''; };
  }, []);

  // Countdown → redirect to login
  useEffect(() => {
    if (!registrationComplete) return;
    if (verificationCountdown <= 0) { navigate('/login'); return; }
    const t = setTimeout(() => setVerificationCountdown(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [registrationComplete, verificationCountdown, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert file to base64 for localStorage persistence
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
    }
  };

  const goToStep = (targetStep) => {
    if (targetStep > step) {
      if (step === 1) {
        if (!formData.account_type || !formData.full_name || !formData.email || !formData.mobile) {
          setError('Please fill in all fields in this step.'); return;
        }
      } else if (step === 2) {
        if (!formData.dob || !formData.gender || !formData.occupation || !formData.country || !formData.state) {
          setError('Please fill in all fields in this step.'); return;
        }
      } else if (step === 3) {
        if (!selectedDocType) {
          setError('Please select a document type.'); return;
        }
      }
    }
    setError('');
    setStepTransitioning(true);
    setTransitionMsg(STEP_MESSAGES[targetStep] || 'Processing...');
    setTimeout(() => { setStep(targetStep); setStepTransitioning(false); }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) { setError('Passwords do not match.'); return; }
    if (!formData.password || formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setError('');
    setStepTransitioning(true);
    setTransitionMsg(STEP_MESSAGES.submit);

    setTimeout(async () => {
      setStepTransitioning(false);
      setLoading(true);
      try {
        // Convert profile picture to base64 for localStorage persistence
        const userImageFile = document.getElementById('user_image')?.files[0];
        let profilePicData = null;
        if (userImageFile) {
          profilePicData = await fileToBase64(userImageFile);
        }

        const registrationData = {
          ...formData,
          document_type: selectedDocType,
          id_image_uploaded: !!document.getElementById('id_image')?.files[0],
          profile_picture: profilePicData,
          email_verified: false,
          verification_token: 'vt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10)
        };

        const result = await SynoxDB.registerUser(registrationData);
        if (result.success) {
          sessionStorage.setItem('synox_pending_user_id', result.user.id);
          sessionStorage.setItem('synox_pending_email', formData.email);
          setLoading(false);
          setRegistrationComplete(true);
        } else {
          setError(result.error || 'Registration failed. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        setError('Registration failed. Please try again.');
        setLoading(false);
      }
    }, 2000);
  };

  /* ════════════════════════════════════════════════════════════════
     REGISTRATION COMPLETE — CLEAN SUCCESS PAGE
     ════════════════════════════════════════════════════════════════ */
  if (registrationComplete) {
    return (
      <div id="login-page">
        <div className="split-screen">
          <div className="left-pane">
            <h1 className="brand-headline">Legacy.<br />Security.<br />Trust.</h1>
            <p className="brand-subtext">
              Join the new standard in international private banking.
              Secure, discreet, and tailored to your global lifestyle.
            </p>
          </div>
          <div className="right-pane">
            <div className="login-box" style={{ maxWidth: '460px', padding: '2.5rem 2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <Logo variant="dark" size="medium" className="mb-4" />

                {/* Success checkmark */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: '#002D72', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '28px auto 24px',
                  boxShadow: '0 8px 24px rgba(0, 45, 114, 0.25)'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '1.6rem', color: '#fff' }}></i>
                </div>

                <h3 style={{ fontWeight: 800, color: '#002d72', fontSize: '1.35rem', marginBottom: '10px' }}>
                  Account Created
                </h3>
                <p style={{ color: '#8094ae', fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '32px' }}>
                  A verification link has been sent to<br />
                  <strong style={{ color: '#1a1a2e' }}>{formData.email}</strong><br />
                  Please verify your email to activate your account.
                </p>

                {/* Go to Login Button */}
                <Link to="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', height: '50px', borderRadius: '12px',
                  background: '#002D72', color: '#fff', fontWeight: 700, fontSize: '0.92rem',
                  textDecoration: 'none', gap: '8px', transition: 'all 0.3s ease'
                }}>
                  Continue to Login
                </Link>

                <p style={{ fontSize: '0.76rem', color: '#8094ae', marginTop: '16px' }}>
                  Redirecting in <strong style={{ color: '#002D72' }}>{verificationCountdown}s</strong>
                </p>

                <p className="small text-muted mb-0" style={{ marginTop: '20px', fontSize: '0.72rem' }}>
                  <i className="fas fa-lock" style={{ marginRight: '4px' }}></i> 256-bit End-to-End Encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     REGISTRATION FORM
     ════════════════════════════════════════════════════════════════ */
  return (
    <div id="login-page">
      {loading && (
        <div id="step-loader" style={{ display: 'flex' }}>
          <div className="loader-spinner"></div>
          <h4 style={{ color: '#002d72', fontWeight: 600 }}>Processing...</h4>
        </div>
      )}

      <div className="split-screen">
        <div className="left-pane">
          <h1 className="brand-headline">Legacy.<br />Security.<br />Trust.</h1>
          <p className="brand-subtext">
            Join the new standard in international private banking.
            Secure, discreet, and tailored to your global lifestyle.
          </p>
        </div>

        <div className="right-pane">
          <div className="login-box" style={{ maxWidth: '600px', padding: '2.5rem 3rem' }}>
            <div className="logo-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Logo variant="dark" size="medium" className="mb-4" />
              <h3 className="font-weight-bold" style={{ color: '#002d72', fontSize: '1.5rem' }}>Create Your Account</h3>
              <p className="text-muted small text-uppercase" style={{ letterSpacing: '1px' }}>
                Secure Registration
              </p>
            </div>

            <form id="registrationForm" onSubmit={handleSubmit}>

              {/* Step Transition Spinner */}
              {stepTransitioning ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: '60px 20px', textAlign: 'center'
                }}>
                  <div style={{
                    width: '52px', height: '52px',
                    border: '3px solid #e8ecf3',
                    borderTop: '3px solid #002D72',
                    borderRight: '3px solid rgba(0, 45, 114, 0.35)',
                    borderRadius: '50%',
                    animation: 'regStepSpin 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                    marginBottom: '20px'
                  }}></div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#002D72', marginBottom: '6px' }}>
                    {transitionMsg}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#8094ae' }}>Please wait a moment</div>
                </div>
              ) : (
                <>
                  {error && step !== 4 && <div className="error-message show">{error}</div>}

                  {/* ── STEP 1: Account Information ── */}
                  {step === 1 && (
                    <div className="form-step" id="step-1">
                      <div className="form-section-title">1. Account Information</div>
                      <div className="form-group form-floating mb-3">
                        <select className="form-select form-control" id="account_type" name="account_type"
                          style={{ paddingTop: '1.625rem', paddingBottom: '0.625rem' }}
                          required value={formData.account_type} onChange={handleChange}>
                          <option value="" disabled></option>
                          <option value="Savings">Savings Account</option>
                          <option value="Current">Current Account</option>
                          <option value="Checking">Checking Account</option>
                          <option value="Joint">Joint Account</option>
                        </select>
                        <label className="floating-label" htmlFor="account_type">Account Type</label>
                      </div>
                      <div className="form-group form-floating mb-3">
                        <input type="text" className="form-control" id="full_name" name="full_name"
                          placeholder=" " required value={formData.full_name} onChange={handleChange} />
                        <label className="floating-label" htmlFor="full_name">Full Name</label>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <input type="email" className="form-control" id="email" name="email"
                              placeholder=" " required value={formData.email} onChange={handleChange} />
                            <label className="floating-label" htmlFor="email">Email Address</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <input type="tel" className="form-control" id="mobile" name="mobile"
                              placeholder=" " required value={formData.mobile} onChange={handleChange} />
                            <label className="floating-label" htmlFor="mobile">Mobile Number</label>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <div style={{ flex: 1 }} className="d-none d-sm-block"></div>
                        <button type="button" className="btn-premium next-step"
                          style={{ flex: 1, padding: '16px', borderRadius: '12px', fontWeight: 600, border: 'none', background: '#002D72', color: '#fff', margin: 0 }}
                          onClick={() => goToStep(2)} disabled={stepTransitioning}>
                          Next Step <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2: Personal Details ── */}
                  {step === 2 && (
                    <div className="form-step" id="step-2">
                      <div className="form-section-title">2. Personal Details</div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <input type="date" className="form-control" id="dob" name="dob"
                              placeholder=" " required value={formData.dob} onChange={handleChange} />
                            <label className="floating-label" htmlFor="dob">Date of Birth</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <select className="form-select form-control" id="gender" name="gender"
                              style={{ paddingTop: '1.625rem', paddingBottom: '0.625rem' }}
                              required value={formData.gender} onChange={handleChange}>
                              <option value="" disabled></option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            <label className="floating-label" htmlFor="gender">Gender</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group form-floating mb-3">
                        <input type="text" className="form-control" id="occupation" name="occupation"
                          placeholder=" " required value={formData.occupation} onChange={handleChange} />
                        <label className="floating-label" htmlFor="occupation">Occupation</label>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <input type="text" className="form-control" id="country" name="country"
                              placeholder=" " required value={formData.country} onChange={handleChange} />
                            <label className="floating-label" htmlFor="country">Country</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <input type="text" className="form-control" id="state" name="state"
                              placeholder=" " required value={formData.state} onChange={handleChange} />
                            <label className="floating-label" htmlFor="state">State / Province</label>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="button" className="btn-outline-premium prev-step"
                          style={{ flex: 1, padding: '16px', borderRadius: '12px', fontWeight: 600, border: '2px solid #002D72', color: '#002D72', background: 'transparent' }}
                          onClick={() => goToStep(1)} disabled={stepTransitioning}>
                          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Back
                        </button>
                        <button type="button" className="btn-premium next-step"
                          style={{ flex: 1, padding: '16px', borderRadius: '12px', fontWeight: 600, border: 'none', background: '#002D72', color: '#fff' }}
                          onClick={() => goToStep(3)} disabled={stepTransitioning}>
                          Next Step <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 3: Verification Documents (Enhanced) ── */}
                  {step === 3 && (
                    <div className="form-step" id="step-3">
                      <div className="form-section-title">3. Verification Documents</div>

                      {/* Document Type Selector (Slide Down) */}
                      <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8094ae', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'block' }}>
                          Document Type
                        </label>
                        <div
                          onClick={() => setShowDocSelector(!showDocSelector)}
                          style={{
                            padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #e8ecf3',
                            background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                        >
                          {selectedDocType ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <i className={`fas ${DOC_TYPES.find(d => d.value === selectedDocType).icon}`} style={{ color: '#002D72' }}></i>
                              <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.85rem' }}>{DOC_TYPES.find(d => d.value === selectedDocType).label}</span>
                            </div>
                          ) : (
                            <span style={{ color: '#8094ae', fontSize: '0.85rem', fontWeight: 500 }}>Select Document Type...</span>
                          )}
                          <i className={`fas fa-chevron-${showDocSelector ? 'up' : 'down'}`} style={{ color: '#8094ae', fontSize: '0.8rem' }}></i>
                        </div>
                        
                        {/* Dropdown Menu */}
                        {showDocSelector && (
                          <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                            background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf3',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.05)', zIndex: 10, overflow: 'hidden'
                          }}>
                            {DOC_TYPES.map((doc, idx) => (
                              <div key={doc.value}
                                onClick={() => { setSelectedDocType(doc.value); setShowDocSelector(false); }}
                                style={{
                                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                                  borderBottom: idx < DOC_TYPES.length - 1 ? '1px solid #f4f6fb' : 'none',
                                  background: selectedDocType === doc.value ? '#f8f9fb' : '#fff'
                                }}
                              >
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 45, 114, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <i className={`fas ${doc.icon}`} style={{ color: '#002D72', fontSize: '0.8rem' }}></i>
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a2e' }}>{doc.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Document Upload — Slide down upload box */}
                      {selectedDocType && (
                        <div style={{
                          background: '#f4f6fb', borderRadius: '14px', padding: '20px',
                          marginBottom: '18px', border: '1px dashed #c4cdd8', textAlign: 'center',
                          animation: 'slideDownFade 0.3s ease-out forwards'
                        }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8094ae', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'block' }}>
                            Upload {DOC_TYPES.find(d => d.value === selectedDocType)?.label}
                          </label>
                          <label htmlFor="id_image" style={{
                            display: 'block', padding: '16px', background: '#fff', border: '1px solid #e8ecf3',
                            borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', margin: '0 auto', maxWidth: '300px'
                          }}>
                            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '1.4rem', color: '#002D72', marginBottom: '8px' }}></i>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>Click to select file</div>
                            <small style={{ fontSize: '0.7rem', color: '#8094ae', display: 'block', marginTop: '4px' }}>
                              Accepted: JPEG, PNG, or PDF. Max 5MB.
                            </small>
                          </label>
                          <input type="file" id="id_image" name="id_image" accept="image/*,.pdf" required
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              const el = document.getElementById('id_image_filename');
                              if (el && e.target.files[0]) {
                                el.textContent = e.target.files[0].name;
                                el.style.display = 'block';
                              }
                            }}
                          />
                          <div id="id_image_filename" style={{ display: 'none', marginTop: '10px', fontSize: '0.75rem', color: '#002D72', fontWeight: 600, background: 'rgba(0, 45, 114, 0.05)', padding: '6px 10px', borderRadius: '6px', maxWidth: '300px', margin: '10px auto 0' }}></div>
                        </div>
                      )}

                      {/* Clean Profile Picture Upload */}
                      <div style={{
                        background: '#f4f6fb', borderRadius: '14px', padding: '20px',
                        marginBottom: '18px', border: '1px dashed #c4cdd8', textAlign: 'center'
                      }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8094ae', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'block' }}>
                          Profile Picture
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '74px', height: '74px', borderRadius: '50%',
                            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', border: profilePreview ? '3px solid #002D72' : '1px solid #e8ecf3',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                          }}>
                            {profilePreview ? (
                              <img src={profilePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <i className="fas fa-user" style={{ fontSize: '1.6rem', color: '#c4cdd8' }}></i>
                            )}
                          </div>
                          <label htmlFor="user_image" style={{
                            background: '#fff', border: '1.5px solid #002D72', color: '#002D72',
                            padding: '8px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px'
                          }}>
                            {profilePreview ? 'Change Photo' : 'Upload Photo'}
                          </label>
                          <input type="file" id="user_image" name="user_image" accept="image/*" required 
                            onChange={handleProfilePicChange} style={{ display: 'none' }} />
                          <small style={{ fontSize: '0.7rem', color: '#8094ae' }}>
                            Accepted: JPEG or PNG.
                          </small>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="button" className="btn-outline-premium prev-step"
                          style={{ flex: 1, padding: '16px', borderRadius: '12px', fontWeight: 600, border: '2px solid #002D72', color: '#002D72', background: 'transparent' }}
                          onClick={() => goToStep(2)} disabled={stepTransitioning}>
                          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Back
                        </button>
                        <button type="button" className="btn-premium next-step"
                          style={{ flex: 1, padding: '16px', borderRadius: '12px', fontWeight: 600, border: 'none', background: '#002D72', color: '#fff' }}
                          onClick={() => goToStep(4)} disabled={stepTransitioning || !selectedDocType}>
                          Next Step <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 4: Security ── */}
                  {step === 4 && (
                    <div className="form-step" id="step-4">
                      <div className="form-section-title">4. Security</div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <input type="password" className="form-control" id="password" name="password"
                              placeholder=" " required value={formData.password} onChange={handleChange} />
                            <label className="floating-label" htmlFor="password">Password</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-group form-floating">
                            <input type="password" className="form-control" id="confirm_password" name="confirm_password"
                              placeholder=" " required value={formData.confirm_password} onChange={handleChange} />
                            <label className="floating-label" htmlFor="confirm_password">Confirm Password</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group form-floating mb-4">
                        <input type="text" className="form-control" id="referral" name="referral"
                          placeholder=" " value={formData.referral} onChange={handleChange} />
                        <label className="floating-label" htmlFor="referral">Referral Code (Optional)</label>
                      </div>
                      {error && <div className="error-message show">{error}</div>}
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="button" className="btn-outline-premium prev-step"
                          style={{ flex: 1, padding: '16px', borderRadius: '12px', fontWeight: 600, border: '2px solid #002D72', color: '#002D72', background: 'transparent' }}
                          onClick={() => goToStep(3)} disabled={stepTransitioning}>
                          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Back
                        </button>
                        <button type="submit" className="btn-premium" id="register-btn" disabled={stepTransitioning}
                          style={{ flex: 1, padding: '16px', borderRadius: '12px', fontWeight: 600, border: 'none', background: '#002D72', color: '#fff' }}>
                          <span>Create Account <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i></span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="text-center mt-4">
                <p className="small text-dark font-weight-bold" style={{ color: '#002d72' }}>
                  Already Have An Account? <Link to="/login" style={{ color: '#9e7a2e', textDecoration: 'underline' }}>Login here</Link>
                </p>
                <p className="small text-muted mb-0 mt-3">
                  <i className="fas fa-lock" style={{ marginRight: '4px' }}></i> 256-bit End-to-End Encryption
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes regStepSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
