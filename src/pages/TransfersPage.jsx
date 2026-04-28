import React, { useState, useEffect } from 'react';
import { SynoxDB } from '../lib/synoxDB';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const TransfersPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('internal');
  const [step, setStep] = useState(1); // 1=Form, 2=Review, 3=COT, 4=Processing, 5=Success
  const [cotCode, setCotCode] = useState('');
  const [cotError, setCotError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const navigate = useNavigate();

  const BRAND_BLUE = "#002d72";
  const LIGHT_BLUE = "#e6f0ff";

  // Internal Form State
  const [internalForm, setInternalForm] = useState({
    recipientName: '',
    recipientAccount: '',
    recipientBank: '',
    amount: ''
  });

  // International Form State
  const [intlForm, setIntlForm] = useState({
    recipientName: '',
    recipientCountry: '',
    swift: '',
    iban: '',
    bankName: '',
    bankAddress: '',
    amount: '',
    purpose: ''
  });

  useEffect(() => {
    const userId = sessionStorage.getItem('synox_user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      const userData = await SynoxDB.getUserById(userId);
      setUser(userData);
    };
    loadData();

    // Listen to global synoxDB updates
    window.addEventListener('synox_updated', loadData);
    
    return () => {
      window.removeEventListener('synox_updated', loadData);
    };
  }, [navigate]);

  const currentForm = activeTab === 'internal' ? internalForm : intlForm;
  const recipientName = currentForm.recipientName;
  const amount = parseFloat(currentForm.amount) || 0;
  const intlFee = activeTab === 'international' ? 25.00 : 0;
  const totalDebit = amount + intlFee;

  const isFormValid = () => {
    if (activeTab === 'internal') {
      return internalForm.recipientName && internalForm.recipientAccount && internalForm.recipientBank && internalForm.amount && parseFloat(internalForm.amount) > 0;
    } else {
      return intlForm.recipientName && intlForm.recipientCountry && intlForm.swift && intlForm.iban && intlForm.bankName && intlForm.bankAddress && intlForm.amount && intlForm.purpose && parseFloat(intlForm.amount) >= 100;
    }
  };

  const handleContinueToReview = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setStep(2);
    }
  };

  const handleCOTSubmit = async () => {
    if (!cotCode || cotCode.length < 4) {
      setCotError('Please enter a valid COT code.');
      return;
    }

    const userId = sessionStorage.getItem('synox_user_id');

    // Validate COT code against Supabase
    const cotResult = await SynoxDB.verifyCOTCode(userId, cotCode);
    if (!cotResult.success) {
      setCotError(cotResult.error || 'Invalid COT code. Please try again.');
      return;
    }

    setCotError('');
    setStep(4);
    
    // Processing step — execute transfer
    setTimeout(async () => {
      const desc = activeTab === 'internal'
        ? `Internal Transfer to ${internalForm.recipientName}`
        : `International Wire to ${intlForm.recipientName}`;
      
      const tx = await SynoxDB.addTransaction(userId, 'debit', totalDebit, desc);
      
      // Add BANK notification
      await SynoxDB.addNotification(
        userId,
        activeTab === 'internal' ? 'Internal Transfer Sent' : 'International Wire Sent',
        `You sent $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} to ${recipientName}.${intlFee > 0 ? ` A wire fee of $${intlFee.toFixed(2)} was applied.` : ''}`,
        'bank'
      );

      setTransactionId(tx?.id || 'TRF-' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'));
      
      // Reload user data
      const userData = await SynoxDB.getUserById(userId);
      setUser(userData);
      
      setStep(5);
    }, 3000);
  };


  const handleProceedToVerify = async () => {
    const userId = sessionStorage.getItem('synox_user_id');
    const result = await SynoxDB.sendCOTEmail(userId);
    if (result.success) {
      setStep(3);
    } else {
      alert(result.error || 'Failed to send COT code. Please try again.');
    }
  };

  const resetFlow = () => {
    setStep(1);
    setCotCode('');
    setCotError('');
    setTransactionId('');
    setInternalForm({ recipientName: '', recipientAccount: '', recipientBank: '', amount: '' });
    setIntlForm({ recipientName: '', recipientCountry: '', swift: '', iban: '', bankName: '', bankAddress: '', amount: '', purpose: '' });
  };

  if (!user) return null;

  const stepLabels = ['Details', 'Review', 'Verify', 'Success'];

  return (
    <DashboardLayout notificationType="bank">
      <div className="container-fluid py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7 col-xl-6">

            {/* Header */}
            <div className="text-center mb-4 mb-md-5 animate__animated animate__fadeIn">
              <h1 className="fw-bold mb-2" style={{ color: BRAND_BLUE, letterSpacing: '-1px', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
                {step <= 3 ? 'Send Money' : step === 4 ? 'Processing...' : 'Transfer Complete'}
              </h1>
              <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}>
                {step === 1 && 'Enter recipient details and amount'}
                {step === 2 && 'Review your transfer details'}
                {step === 3 && 'Enter your Course of Transfer (COT) code'}
                {step === 4 && 'Please wait while we process your transfer'}
                {step === 5 && 'Your transfer has been successfully processed'}
              </p>
            </div>

            {/* Stepper */}
            {step < 5 && step !== 4 && (
              <div className="d-flex align-items-center justify-content-center mb-4 mb-md-5 px-2 animate__animated animate__fadeIn">
                {stepLabels.map((label, idx) => {
                  const s = idx + 1;
                  const adjustedStep = step >= 4 ? 4 : step;
                  return (
                    <React.Fragment key={s}>
                      <div className="d-flex flex-column align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: '38px', height: '38px',
                            background: adjustedStep >= s ? BRAND_BLUE : '#fff',
                            color: adjustedStep >= s ? '#fff' : '#dee2e6',
                            border: `2px solid ${adjustedStep >= s ? BRAND_BLUE : '#dee2e6'}`,
                            boxShadow: adjustedStep === s ? `0 0 0 4px ${LIGHT_BLUE}` : 'none',
                            zIndex: 2, fontSize: '0.85rem',
                            transition: 'all 0.3s ease'
                          }}>
                          {adjustedStep > s ? <i className="fas fa-check"></i> : s}
                        </div>
                        <span className="mt-2 small fw-bold text-uppercase d-none d-sm-block" style={{ fontSize: '0.6rem', color: adjustedStep >= s ? BRAND_BLUE : '#ced4da', letterSpacing: '1px' }}>
                          {label}
                        </span>
                      </div>
                      {idx < 3 && (
                        <div className="flex-grow-1 mx-1 mx-sm-2" style={{ height: '2px', background: adjustedStep > s ? BRAND_BLUE : '#dee2e6', marginTop: '-20px', transition: 'all 0.3s ease' }}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInUp" style={{ background: '#fff' }}>
              <div className="card-body p-3 p-sm-4 p-md-5">

                {/* ═══════════ STEP 1: FORM ═══════════ */}
                {step === 1 && (
                  <div className="animate__animated animate__fadeIn">
                    {/* Tab Switcher */}
                    <div className="d-flex bg-light p-1 rounded-3 mb-4" style={{ borderRadius: '12px' }}>
                      <button
                        className={`btn flex-fill fw-bold py-2 ${activeTab === 'internal' ? 'shadow-sm' : 'text-muted border-0'}`}
                        onClick={() => setActiveTab('internal')}
                        style={activeTab === 'internal' ? { color: BRAND_BLUE, background: '#fff', borderRadius: '10px' } : { background: 'transparent', borderRadius: '10px' }}
                      >
                        <i className="fas fa-building me-2 d-none d-sm-inline"></i>Internal
                      </button>
                      <button
                        className={`btn flex-fill fw-bold py-2 ms-1 ${activeTab === 'international' ? 'shadow-sm' : 'text-muted border-0'}`}
                        onClick={() => setActiveTab('international')}
                        style={activeTab === 'international' ? { color: BRAND_BLUE, background: '#fff', borderRadius: '10px' } : { background: 'transparent', borderRadius: '10px' }}
                      >
                        <i className="fas fa-globe me-2 d-none d-sm-inline"></i>International
                      </button>
                    </div>

                    {/* From Account */}
                    <div className="bg-light p-3 rounded-3 mb-4 border d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div>
                        <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.7rem' }}>From Account</small>
                        <span className="fw-bold text-dark" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.95rem)' }}>Synox Checking (**** {user.account_number?.slice(-4) || '----'})</span>
                      </div>
                      <div className="text-end">
                        <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.7rem' }}>Available</small>
                        <span className="fw-bold text-success" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.15rem)' }}>${user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Internal Form */}
                    {activeTab === 'internal' && (
                      <form onSubmit={handleContinueToReview}>
                        <div className="row g-3">
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Recipient Name</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="e.g. John Doe" required value={internalForm.recipientName} onChange={(e) => setInternalForm({ ...internalForm, recipientName: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Account Number</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="10-digit account number" required value={internalForm.recipientAccount} onChange={(e) => setInternalForm({ ...internalForm, recipientAccount: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Recipient Bank</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="e.g. Chase Bank" required value={internalForm.recipientBank} onChange={(e) => setInternalForm({ ...internalForm, recipientBank: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Amount</label>
                            <div className="input-group input-group-lg" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                              <span className="input-group-text border-0 bg-light text-muted fw-bold px-3">$</span>
                              <input type="number" className="form-control border-0 bg-light fw-bold py-3 custom-number-input" placeholder="0.00" min="1" step="0.01" required value={internalForm.amount} onChange={(e) => setInternalForm({ ...internalForm, amount: e.target.value })} style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }} />
                            </div>
                          </div>
                        </div>

                        <button type="submit" className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm mt-4" style={{ background: BRAND_BLUE, color: '#fff', fontSize: 'clamp(0.9rem, 3.5vw, 1.05rem)' }}>
                          Continue to Review <i className="fas fa-arrow-right ms-2"></i>
                        </button>
                      </form>
                    )}

                    {/* International Form */}
                    {activeTab === 'international' && (
                      <form onSubmit={handleContinueToReview}>
                        <div className="row g-3">
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Recipient Name</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="Full legal name" required value={intlForm.recipientName} onChange={(e) => setIntlForm({ ...intlForm, recipientName: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Recipient Country</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="e.g. United Kingdom" required value={intlForm.recipientCountry} onChange={(e) => setIntlForm({ ...intlForm, recipientCountry: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>SWIFT / BIC Code</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="e.g. BARCGB22" required value={intlForm.swift} onChange={(e) => setIntlForm({ ...intlForm, swift: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>IBAN</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="e.g. GB29 NWBK..." required value={intlForm.iban} onChange={(e) => setIntlForm({ ...intlForm, iban: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Bank Name</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="e.g. Barclays Bank" required value={intlForm.bankName} onChange={(e) => setIntlForm({ ...intlForm, bankName: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Bank Address</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="Full Bank Address" required value={intlForm.bankAddress} onChange={(e) => setIntlForm({ ...intlForm, bankAddress: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Purpose</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 px-3" placeholder="e.g. Payment for services" required value={intlForm.purpose} onChange={(e) => setIntlForm({ ...intlForm, purpose: e.target.value })} style={{ borderRadius: '10px' }} />
                          </div>
                          <div className="col-12 col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Amount</label>
                            <div className="input-group input-group-lg" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                              <span className="input-group-text border-0 bg-light text-muted fw-bold px-3">$</span>
                              <input type="number" className="form-control border-0 bg-light fw-bold py-3 custom-number-input" placeholder="0.00" min="100" step="0.01" required value={intlForm.amount} onChange={(e) => setIntlForm({ ...intlForm, amount: e.target.value })} style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }} />
                            </div>
                            <div className="d-flex justify-content-between mt-2 px-1 flex-wrap gap-1">
                              <small className="text-muted"><i className="fas fa-info-circle me-1"></i>$25 wire fee applies</small>
                              {intlForm.amount && (
                                <small className="text-danger fw-bold">Total: ${(parseFloat(intlForm.amount) + 25).toLocaleString(undefined, { minimumFractionDigits: 2 })}</small>
                              )}
                            </div>
                          </div>
                        </div>

                        <button type="submit" className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm mt-4" style={{ background: BRAND_BLUE, color: '#fff', fontSize: 'clamp(0.9rem, 3.5vw, 1.05rem)' }}>
                          Continue to Review <i className="fas fa-arrow-right ms-2"></i>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ═══════════ STEP 2: REVIEW ═══════════ */}
                {step === 2 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="text-center mb-4">
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '56px', height: '56px', background: LIGHT_BLUE }}>
                        <i className="fas fa-file-invoice" style={{ color: BRAND_BLUE, fontSize: '1.3rem' }}></i>
                      </div>
                      <h5 className="fw-bold mb-1">Review Transfer</h5>
                      <p className="text-muted small">Please verify all details before proceeding</p>
                    </div>

                    <div className="bg-light rounded-4 p-3 p-sm-4 mb-4 border">
                      <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                        <span className="text-muted small fw-bold text-uppercase">Type</span>
                        <span className="fw-bold text-dark">{activeTab === 'internal' ? 'Internal Transfer' : 'International Wire'}</span>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                        <span className="text-muted small fw-bold text-uppercase">Recipient</span>
                        <span className="fw-bold text-dark">{recipientName}</span>
                      </div>
                      {activeTab === 'internal' && (
                        <>
                          <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                            <span className="text-muted small fw-bold text-uppercase">Account</span>
                            <span className="fw-bold text-dark font-monospace">{internalForm.recipientAccount}</span>
                          </div>
                          <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                            <span className="text-muted small fw-bold text-uppercase">Bank</span>
                            <span className="fw-bold text-dark">{internalForm.recipientBank}</span>
                          </div>
                        </>
                      )}
                      {activeTab === 'international' && (
                        <>
                          <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                            <span className="text-muted small fw-bold text-uppercase">Country</span>
                            <span className="fw-bold text-dark">{intlForm.recipientCountry}</span>
                          </div>
                          <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                            <span className="text-muted small fw-bold text-uppercase">SWIFT / BIC</span>
                            <span className="fw-bold text-dark font-monospace">{intlForm.swift}</span>
                          </div>
                          <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                            <span className="text-muted small fw-bold text-uppercase">IBAN</span>
                            <span className="fw-bold text-dark font-monospace text-break" style={{ fontSize: '0.85rem' }}>{intlForm.iban}</span>
                          </div>
                          <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                            <span className="text-muted small fw-bold text-uppercase">Purpose</span>
                            <span className="fw-bold text-dark">{intlForm.purpose}</span>
                          </div>
                        </>
                      )}
                      <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                        <span className="text-muted small fw-bold text-uppercase">Amount</span>
                        <span className="fw-bold text-dark">${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      {intlFee > 0 && (
                        <div className="d-flex justify-content-between py-2 border-bottom flex-wrap gap-1">
                          <span className="text-muted small fw-bold text-uppercase">Wire Fee</span>
                          <span className="fw-bold text-danger">${intlFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between py-3 flex-wrap gap-1">
                        <span className="fw-bold text-dark h6 mb-0">Total Debit</span>
                        <span className="h5 fw-bold mb-0" style={{ color: BRAND_BLUE }}>${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="p-3 mb-4 rounded-3 d-flex gap-3" style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7' }}>
                      <i className="fas fa-shield-alt text-warning fs-5 mt-1"></i>
                      <div className="small text-muted fw-bold" style={{ fontSize: '0.75rem' }}>
                        A Course of Transfer (COT) verification code will be sent to your registered email. You must enter it in the next step to authorize this transaction.
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <button className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm" style={{ background: BRAND_BLUE, color: '#fff' }} onClick={handleProceedToVerify}>
                        Proceed to Verification <i className="fas fa-lock ms-2"></i>
                      </button>
                      <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={() => setStep(1)}>
                        <i className="fas fa-chevron-left me-2"></i> Edit Details
                      </button>
                    </div>
                  </div>
                )}


                {/* ═══════════ STEP 3: COT CODE ═══════════ */}
                {step === 3 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="text-center mb-4">
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '64px', height: '64px', background: LIGHT_BLUE }}>
                        <i className="fas fa-envelope-open-text" style={{ color: BRAND_BLUE, fontSize: '1.5rem' }}></i>
                      </div>
                      <h5 className="fw-bold mb-2">COT Verification</h5>
                      <p className="text-muted small mb-0">
                        A <strong>Course of Transfer (COT)</strong> code has been sent to your registered email address. Enter it below to authorize the transfer.
                      </p>
                    </div>

                    <div className="p-3 mb-4 rounded-3 text-center" style={{ backgroundColor: LIGHT_BLUE, border: `1px dashed ${BRAND_BLUE}` }}>
                      <span className="small fw-bold" style={{ color: BRAND_BLUE }}>
                        <i className="fas fa-paper-plane me-2"></i>
                        Sending ${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })} to {recipientName}
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Enter COT Code</label>
                      <input
                        type="text"
                        className="form-control form-control-lg text-center fw-bold font-monospace bg-light border-0 py-4"
                        placeholder="• • • • • •"
                        value={cotCode}
                        onChange={(e) => { setCotCode(e.target.value); setCotError(''); }}
                        maxLength={8}
                        style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', letterSpacing: '8px', borderRadius: '14px', color: BRAND_BLUE }}
                        autoFocus
                      />
                      {cotError && (
                        <div className="text-danger small mt-2 fw-bold text-center">
                          <i className="fas fa-exclamation-circle me-1"></i> {cotError}
                        </div>
                      )}
                    </div>

                    <div className="p-3 mb-4 rounded-3 d-flex gap-3" style={{ backgroundColor: 'rgba(0,45,114,0.04)', border: '1px solid rgba(0,45,114,0.1)' }}>
                      <i className="fas fa-info-circle mt-1" style={{ color: BRAND_BLUE, fontSize: '0.85rem' }}></i>
                      <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                        Check your email inbox and spam folder for the COT code. If you haven't received it, please <a href="#" onClick={(e) => { e.preventDefault(); if(window.Tawk_API){ window.Tawk_API.showWidget(); window.Tawk_API.maximize(); } }} style={{ color: BRAND_BLUE, textDecoration: 'underline' }}>contact support</a>. The code is valid for 15 minutes.
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <button className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm" style={{ background: BRAND_BLUE, color: '#fff' }} onClick={handleCOTSubmit} disabled={!cotCode || cotCode.length < 4}>
                        Authorize Transfer <i className="fas fa-check-circle ms-2"></i>
                      </button>
                      <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={() => setStep(2)}>
                        <i className="fas fa-chevron-left me-2"></i> Back to Review
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══════════ STEP 4: PROCESSING ═══════════ */}
                {step === 4 && (
                  <div className="text-center py-5 animate__animated animate__fadeIn">
                    <div className="spinner-border mb-4" style={{ width: '3.5rem', height: '3.5rem', color: BRAND_BLUE, borderWidth: '3px' }} role="status"></div>
                    <h4 className="fw-bold mb-2" style={{ color: BRAND_BLUE }}>Processing Transfer</h4>
                    <p className="text-muted">Verifying COT code and initiating secure transfer...</p>
                  </div>
                )}

                {/* ═══════════ STEP 5: SUCCESS ═══════════ */}
                {step === 5 && (
                  <div className="text-center animate__animated animate__zoomIn">
                    <div className="mb-4">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-lg" style={{ width: '80px', height: '80px' }}>
                        <i className="fas fa-check fs-1"></i>
                      </div>
                    </div>

                    <h2 className="fw-bold mb-2" style={{ color: BRAND_BLUE, fontSize: 'clamp(1.3rem, 5vw, 1.75rem)' }}>Transfer Successful</h2>
                    <p className="text-muted mb-4">Your funds have been securely sent and the transaction has been recorded.</p>

                    <div className="bg-light rounded-4 p-3 p-sm-4 text-start mb-4 shadow-inner">
                      <div className="d-flex justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-1">
                        <span className="text-muted small fw-bold text-uppercase">Status</span>
                        <span className="badge rounded-pill bg-success px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>Completed</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-1">
                        <span className="text-muted small fw-bold text-uppercase">Transaction ID</span>
                        <span className="font-monospace fw-bold text-dark text-break" style={{ fontSize: '0.75rem' }}>{transactionId}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-1">
                        <span className="text-muted small fw-bold text-uppercase">Recipient</span>
                        <span className="fw-bold text-dark">{recipientName}</span>
                      </div>
                      <div className="d-flex justify-content-between flex-wrap gap-1">
                        <span className="text-muted small fw-bold text-uppercase">Amount Sent</span>
                        <span className="h5 fw-bold mb-0 text-dark">${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <button className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm" style={{ background: BRAND_BLUE, color: '#fff' }} onClick={() => navigate('/dashboard')}>
                        Back to Dashboard <i className="fas fa-home ms-2"></i>
                      </button>
                      <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={resetFlow}>
                        <i className="fas fa-redo me-2"></i> Make Another Transfer
                      </button>
                    </div>
                  </div>
                )}


            {/* Security Badge */}
            <div className="text-center mt-4 mt-md-5">
              <div className="d-flex align-items-center justify-content-center gap-4 text-muted small flex-wrap">
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-success"></i> SSL SECURED
                </span>
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-lock text-success"></i> AES-256
                </span>
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-university text-success"></i> FDIC INSURED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <style>{`
        .custom-number-input::-webkit-outer-spin-button,
        .custom-number-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .custom-number-input {
          -moz-appearance: textfield;
        }
        .rounded-4 { border-radius: 1.25rem !important; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </DashboardLayout>
  );
};

export default TransfersPage;
