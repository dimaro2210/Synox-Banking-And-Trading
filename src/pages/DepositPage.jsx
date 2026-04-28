import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNavigate, Link } from 'react-router-dom';
import { SynoxDB } from '../lib/synoxDB';

const DepositPage = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(''); // 'BTC' or 'USDT'
  const [receiptFile, setReceiptFile] = useState(null);
  const [user, setUser] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const WALLETS = {
    BTC: "1KgkFDmv4RWWfWBbKXhtHnTPqEitPYBEsY",
    ETH: "0x3f967986D663A952bdf6Ac0aCEe6739a52785E46"
  };

  const BRAND_BLUE = "#002d72";
  const LIGHT_BLUE = "#e6f0ff";

  useEffect(() => {
    const loadUser = async () => {
      const userId = sessionStorage.getItem('synox_user_id');
      if (userId) {
        const userData = await SynoxDB.getUserById(userId);
        setUser(userData);
      } else {
        navigate('/login');
      }
    };
    loadUser();

    // Listen to global synoxDB updates
    window.addEventListener('synox_updated', loadUser);
    
    return () => {
      window.removeEventListener('synox_updated', loadUser);
    };
  }, [navigate]);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleFinalSubmit = () => {
    setIsProcessing(true);
    
    setTimeout(async () => {
      if (user) {
        let base64Receipt = null;
        if (receiptFile) {
          const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
          base64Receipt = await toBase64(receiptFile);
        }

        const depositAmount = parseFloat(amount);
        
        await SynoxDB.addPendingDeposit(user.id, depositAmount, selectedCoin, base64Receipt);

        await SynoxDB.addNotification(
          user.id, 
          'Deposit Received', 
          `Your deposit of $${depositAmount.toLocaleString()} worth of ${selectedCoin} has been received and is waiting for admin verification.`,
          'crypto'
        );
        
        const updatedUser = await SynoxDB.getUserById(user.id);
        setUser(updatedUser);
      }

      setTransactionId('DEP-' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'));
      setPaymentDate(new Date().toLocaleString());
      setIsProcessing(false);
      setStep(4);
    }, 1500);
  };

  if (!user) return null;

  const isAmountValid = amount && parseFloat(amount) > 0;

  /* ════════════════════════════════════════════════════════════════
     MAIN DASHBOARD VIEW
     ════════════════════════════════════════════════════════════════ */
  const cryptoSidebarOverride = (
    <>
      <div className="px-4 py-3 mb-2">
        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8094ae', opacity: 0.8 }}>Crypto Ecosystem</div>
      </div>
      <Link to="/dashboard/crypto" className="list-group-item list-group-item-action py-3 px-4 fw-bold border-0" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'transparent', color: '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-chart-pie me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Portfolio
      </Link>
      <div className="list-group-item py-3 px-4 fw-bold border-0 active shadow-sm" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'rgba(0,45,114,0.05)', color: '#002D72', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-arrow-down me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Deposit
      </div>
      <Link to="/dashboard/withdraw" className="list-group-item list-group-item-action py-3 px-4 fw-bold border-0" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'transparent', color: '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-arrow-up me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Withdraw
      </Link>
      <Link to="/dashboard/crypto?tab=history" className="list-group-item list-group-item-action py-3 px-4 fw-bold border-0" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'transparent', color: '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-history me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Trading History
      </Link>

      <div className="mt-auto px-2 mb-3">
        <Link to="/dashboard" className="list-group-item list-group-item-action py-3 px-3 fw-bold border-0 text-primary w-100" style={{ fontSize: '0.95rem', backgroundColor: 'rgba(67, 97, 238, 0.05)', borderRadius: '12px', transition: 'all 0.2s ease' }}>
          <i className="fas fa-arrow-left me-2"></i> Return to Bank
        </Link>
        <button onClick={(e) => { e.preventDefault(); sessionStorage.clear(); navigate('/login'); }} className="list-group-item list-group-item-action py-3 px-3 fw-bold border-0 text-danger w-100 mt-2" style={{ fontSize: '0.95rem', backgroundColor: 'transparent', borderRadius: '12px' }}>
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </div>
    </>
  );

  return (
    <DashboardLayout sidebarOverride={cryptoSidebarOverride} notificationType="crypto">
      <div className="container-fluid py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            
            {/* Header Section */}
            <div className="text-center mb-4 mb-md-5 animate__animated animate__fadeIn">
              <h1 className="fw-bold mb-2" style={{ color: BRAND_BLUE, letterSpacing: '-1px', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Deposit Funds</h1>
              <p className="text-muted">Securely add funds to your trading account</p>
            </div>

            {/* Stepper */}
            {step < 4 && (
              <div className="d-flex align-items-center justify-content-center mb-4 mb-md-5 px-3 animate__animated animate__fadeIn">
                {[1, 2, 3].map((s, idx) => (
                  <React.Fragment key={s}>
                    <div className="d-flex flex-column align-items-center">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all`}
                           style={{ 
                             width: '40px', height: '40px', 
                             background: step >= s ? BRAND_BLUE : '#fff', 
                             color: step >= s ? '#fff' : '#dee2e6',
                             border: `2px solid ${step >= s ? BRAND_BLUE : '#dee2e6'}`,
                             boxShadow: step === s ? `0 0 0 4px ${LIGHT_BLUE}` : 'none',
                             zIndex: 2
                           }}>
                        {step > s ? <i className="fas fa-check"></i> : s}
                      </div>
                      <span className="mt-2 small fw-bold text-uppercase d-none d-md-block" style={{ fontSize: '0.6rem', color: step >= s ? BRAND_BLUE : '#ced4da', letterSpacing: '1px' }}>
                        {s === 1 ? 'Amount' : s === 2 ? 'Asset' : 'Payment'}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div className="flex-grow-1 mx-2" style={{ height: '2px', background: step > s ? BRAND_BLUE : '#dee2e6', marginTop: '-20px' }}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInUp" style={{ background: '#fff' }}>
              <div className="card-body p-4 p-md-5">
                
                {isProcessing ? (
                  <div className="text-center py-5">
                    <div className="spinner-border mb-4" style={{ width: '3.5rem', height: '3.5rem', color: BRAND_BLUE, borderWidth: '3px' }} role="status"></div>
                    <h3 className="fw-bold mb-2" style={{ color: BRAND_BLUE }}>Securing Assets</h3>
                    <p className="text-muted">Initiating blockchain handshake and verifying keys...</p>
                  </div>
                ) : (
                  <>
                    {/* STEP 1: AMOUNT */}
                    {step === 1 && (
                      <div className="animate__animated animate__fadeIn">
                        <div className="text-center mb-4">
                          <div className="h5 fw-bold mb-1">How much would you like to deposit?</div>
                          <p className="text-muted small">Enter the amount in USD</p>
                        </div>
                        
                        <div className="mb-4 position-relative">
                          <div className="input-group input-group-lg bg-light rounded-4 overflow-hidden border-0 shadow-sm">
                            <span className="input-group-text bg-transparent border-0 ps-4 fs-3 fw-bold text-muted">$</span>
                            <input 
                              type="number" 
                              className="form-control bg-transparent border-0 py-4 fs-2 fw-bold custom-number-input"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              style={{ color: BRAND_BLUE }}
                            />
                          </div>
                        </div>

                        <div className="p-3 mb-4 rounded-3 text-center" style={{ backgroundColor: LIGHT_BLUE, border: `1px dashed ${BRAND_BLUE}` }}>
                          <span className="small fw-bold" style={{ color: BRAND_BLUE }}>
                            <i className="fas fa-info-circle me-2"></i>
                            Deposits are processed instantly upon verification.
                          </span>
                        </div>

                        <button 
                          className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm transition-all"
                          style={{ background: BRAND_BLUE, color: '#fff' }}
                          disabled={!isAmountValid}
                          onClick={() => setStep(2)}
                        >
                          Select Asset <i className="fas fa-arrow-right ms-2"></i>
                        </button>
                      </div>
                    )}

                    {/* STEP 2: ASSET SELECTION */}
                    {step === 2 && (
                      <div className="animate__animated animate__fadeIn">
                        <div className="text-center mb-4">
                          <div className="h5 fw-bold mb-1">Choose your deposit asset</div>
                          <p className="text-muted small">Select the cryptocurrency you want to send</p>
                        </div>

                        <div className="row g-3 mb-5">
                          {[
                            { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', icon: 'fab fa-bitcoin', color: '#f7931a' },
                            { id: 'ETH', name: 'Ethereum', symbol: 'ETH', icon: 'fab fa-ethereum', color: '#627eea' }
                          ].map(asset => (
                            <div className="col-12 col-md-6" key={asset.id}>
                              <div 
                                className={`p-4 rounded-4 border-2 transition-all cursor-pointer text-center h-100 ${selectedCoin === asset.id ? 'shadow-md shadow-lg border-primary bg-primary bg-opacity-5' : 'bg-light border-light'}`}
                                onClick={() => setSelectedCoin(asset.id)}
                                style={{ 
                                  borderColor: selectedCoin === asset.id ? BRAND_BLUE : 'transparent',
                                  transform: selectedCoin === asset.id ? 'scale(1.02)' : 'scale(1)'
                                }}
                              >
                                <div className="mb-3 rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm" style={{ width: '60px', height: '60px', background: selectedCoin === asset.id ? '#fff' : asset.color, color: selectedCoin === asset.id ? asset.color : '#fff' }}>
                                  <i className={`${asset.icon} fs-2`}></i>
                                </div>
                                <div className="fw-bold h6 mb-1">{asset.name}</div>
                                <div className="text-muted small fw-bold">{asset.symbol}</div>
                                {selectedCoin === asset.id && (
                                  <div className="position-absolute top-0 end-0 p-2">
                                    <i className="fas fa-check-circle fs-5" style={{ color: BRAND_BLUE }}></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="d-flex flex-column gap-3">
                          <button 
                            className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm"
                            style={{ background: BRAND_BLUE, color: '#fff' }}
                            disabled={!selectedCoin}
                            onClick={() => setStep(3)}
                          >
                            Generate Address <i className="fas fa-qrcode ms-2"></i>
                          </button>
                          <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={() => setStep(1)}>
                            <i className="fas fa-chevron-left me-2"></i> Change Amount
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: PAYMENT DETAILS */}
                    {step === 3 && (
                      <div className="animate__animated animate__fadeIn">
                        <div className="text-center mb-4">
                          <h5 className="fw-bold mb-1">Make your Payment</h5>
                          <p className="text-muted small">Send exactly <strong>${parseFloat(amount).toLocaleString()}</strong> worth of <strong>{selectedCoin}</strong></p>
                        </div>

                        <div className="text-center mb-5 p-3 rounded-4 bg-light border border-dashed border-2">
                          <div className="bg-white p-3 rounded-4 d-inline-block shadow-sm mb-3">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${WALLETS[selectedCoin]}`} 
                              alt="QR Code" 
                              style={{ width: '160px', height: '160px' }}
                            />
                          </div>
                          
                          <div className="mt-2">
                            <label className="small text-muted fw-bold text-uppercase mb-2 d-block" style={{ letterSpacing: '1px' }}>Network: {selectedCoin === 'BTC' ? 'Bitcoin (BTC)' : 'Ethereum (ERC20)'}</label>
                            <div className="input-group shadow-sm rounded-3 overflow-hidden">
                              <input 
                                type="text" 
                                className="form-control border-0 font-monospace text-center small fw-bold bg-white" 
                                value={WALLETS[selectedCoin]} 
                                readOnly 
                                style={{ fontSize: '0.75rem', color: BRAND_BLUE }}
                              />
                              <button 
                                className="btn btn-dark px-4" 
                                onClick={() => {
                                  navigator.clipboard.writeText(WALLETS[selectedCoin]);
                                  alert('Address copied to clipboard!');
                                }}
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mb-5">
                          <h6 className="fw-bold mb-3 d-flex align-items-center">
                            <i className="fas fa-file-invoice me-2 text-muted"></i>
                            Upload Payment Receipt
                          </h6>
                          <div 
                            className="p-4 rounded-4 border-2 border-dashed text-center transition-all bg-light"
                            style={{ 
                              borderColor: receiptFile ? '#10b981' : '#dee2e6',
                              cursor: 'pointer',
                              backgroundColor: receiptFile ? '#f0fdf4' : '#f8f9fa'
                            }}
                            onClick={() => document.getElementById('receiptInput').click()}
                          >
                            <input type="file" id="receiptInput" hidden onChange={handleFileUpload} accept="image/*,.pdf" />
                            <div className={`mb-2 rounded-circle d-flex align-items-center justify-content-center mx-auto ${receiptFile ? 'bg-success text-white' : 'bg-white text-muted shadow-sm'}`} style={{ width: '48px', height: '48px' }}>
                              <i className={`fas ${receiptFile ? 'fa-check' : 'fa-cloud-upload-alt'} fs-4`}></i>
                            </div>
                            <div className="fw-bold small">{receiptFile ? receiptFile.name : 'Click to upload proof of payment'}</div>
                            <div className="text-muted extra-small mt-1" style={{ fontSize: '0.7rem' }}>Supports JPG, PNG, or PDF</div>
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-3">
                          {receiptFile && (
                            <button 
                              className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm animate__animated animate__fadeInUp"
                              style={{ background: BRAND_BLUE, color: '#fff' }}
                              onClick={handleFinalSubmit}
                            >
                              Verify Transfer <i className="fas fa-shield-check ms-2"></i>
                            </button>
                          )}
                          <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={() => setStep(2)}>
                            <i className="fas fa-chevron-left me-2"></i> Select Asset
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                      <div className="text-center animate__animated animate__zoomIn">
                        <div className="mb-4">
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-lg" style={{ width: '80px', height: '80px' }}>
                            <i className="fas fa-check fs-1"></i>
                          </div>
                        </div>
                        
                        <h2 className="fw-bold mb-2" style={{ color: BRAND_BLUE }}>Deposit Received</h2>
                        <p className="text-muted mb-5">Your credentials have been encrypted and sent to nodes for verification.</p>

                        <div className="bg-light rounded-4 p-4 text-start mb-5 shadow-inner">
                          <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                            <span className="text-muted small fw-bold text-uppercase">Status</span>
                            <span className="badge rounded-pill bg-warning text-dark px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>Pending Verification</span>
                          </div>
                          <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                            <span className="text-muted small fw-bold text-uppercase">Reference ID</span>
                            <span className="font-monospace fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{transactionId}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted small fw-bold text-uppercase">Amount</span>
                            <span className="h5 fw-bold mb-0 text-dark">${parseFloat(amount).toLocaleString()}</span>
                          </div>
                        </div>

                        <button 
                          className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm"
                          style={{ background: BRAND_BLUE, color: '#fff' }}
                          onClick={() => navigate('/dashboard/crypto')}
                        >
                          Back to Portfolio <i className="fas fa-home ms-2"></i>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="text-center mt-5 animate__animated animate__fadeIn">
              <div className="d-flex align-items-center justify-content-center gap-4">
                <div className="text-muted small d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-success"></i>
                  <span>SSL SECURED</span>
                </div>
                <div className="text-muted small d-flex align-items-center gap-2">
                  <i className="fas fa-lock text-success"></i>
                  <span>AES-256</span>
                </div>
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
        .extra-small { font-size: 0.75rem; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </DashboardLayout>
  );
};

export default DepositPage;