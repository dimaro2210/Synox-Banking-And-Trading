import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNavigate, Link } from 'react-router-dom';
import { SynoxDB } from '../lib/synoxDB';

const WithdrawPage = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(''); // 'Bitcoin' or 'USDT'
  const [walletAddress, setWalletAddress] = useState('');
  const [user, setUser] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [marketData, setMarketData] = useState({});

  const navigate = useNavigate();
  const processingFee = 0.00;

  const BRAND_BLUE = "#002d72";
  const LIGHT_BLUE = "#e6f0ff";
  const INITIAL_MARKET_DATA = { BTC: { usd: 65000 }, ETH: { usd: 3500 }, USDT: { usd: 1.0 }, BNB: { usd: 600 }, SOL: { usd: 150 } };
  const ASSET_MAP = { bitcoin: 'BTC', ethereum: 'ETH', tether: 'USDT', binancecoin: 'BNB', solana: 'SOL' };

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

    // Fetch market data to compute total crypto balance
    const fetchMarketData = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana&vs_currencies=usd');
        const data = await res.json();
        const formattedData = {};
        for (const [id, stats] of Object.entries(data)) {
          formattedData[ASSET_MAP[id]] = stats;
        }
        setMarketData(formattedData);
      } catch (err) {}
    };
    fetchMarketData();

    // Listen to global synoxDB updates
    window.addEventListener('synox_updated', loadUser);
    
    return () => {
      window.removeEventListener('synox_updated', loadUser);
    };
  }, [navigate]);

  const handleRequestWithdrawal = async () => {
    if (isAmountValid && method && walletAddress.length > 10) {
      setStep(3); // Processing
      
      const parsedAmount = parseFloat(amount);
      const totalDeduction = parsedAmount + processingFee;
      
      setTimeout(async () => {
        const freshUser = await SynoxDB.getUserById(user.id);
        const freshCryptoBalances = freshUser.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
        
        // Deduct proportionately from crypto assets using market value
        // Note: For simplicity in external single-amount withdrawal, we'll deduct primarily from USDT, then BTC
        // Or if the user selects a specific "method" (Bitcoin, USDT, Ethereum) we deduct from that specific balance
        let assetToDeduct = 'USDT';
        if (method === 'Bitcoin') assetToDeduct = 'BTC';
        if (method === 'Ethereum') assetToDeduct = 'ETH';
        
        const assetDeduction = totalDeduction / (marketData[assetToDeduct]?.usd || INITIAL_MARKET_DATA[assetToDeduct]?.usd || 1);
        const newBalances = { ...freshCryptoBalances, [assetToDeduct]: Math.max(0, (freshCryptoBalances[assetToDeduct] || 0) - assetDeduction) };
        
        await SynoxDB.updateUser(user.id, { crypto_balances: newBalances });
        await SynoxDB.addNotification(
          user.id,
          'Withdrawal Initiated',
          `A withdrawal of $${parsedAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} worth of ${method} has been initiated and is pending settlement.`,
          'crypto'
        );
        
        setTransactionId('WTH-' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'));
        setPaymentDate(new Date().toLocaleString());
        setStep(5); // Success
      }, 2000);
    }
  };

  if (!user) return null;

  const cryptoBalances = user?.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
  const totalCryptoValue = Object.entries(cryptoBalances).reduce(
    (sum, [key, amt]) => sum + amt * (marketData[key]?.usd || INITIAL_MARKET_DATA[key]?.usd || 0), 0
  ) + (user?.trading_balance_total || 0);

  const totalDeduction = parseFloat(amount) ? parseFloat(amount) + processingFee : 0;
  const isAmountValid = amount && parseFloat(amount) > 0 && totalDeduction <= totalCryptoValue;

  const cryptoSidebarOverride = (
    <>
      <div className="px-4 py-3 mb-2">
        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8094ae', opacity: 0.8 }}>Crypto Ecosystem</div>
      </div>
      <Link to="/dashboard/crypto" className="list-group-item list-group-item-action py-3 px-4 fw-bold border-0" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'transparent', color: '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-chart-pie me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Portfolio
      </Link>
      <Link to="/dashboard/deposit" className="list-group-item list-group-item-action py-3 px-4 fw-bold border-0" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'transparent', color: '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-arrow-down me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Deposit
      </Link>
      <div className="list-group-item py-3 px-4 fw-bold border-0 active shadow-sm" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'rgba(0,45,114,0.05)', color: '#002D72', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-arrow-up me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Withdraw
      </div>
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
    <DashboardLayout notificationType="crypto" sidebarOverride={cryptoSidebarOverride}>
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            
            {/* Header Section */}
            <div className="text-center mb-5 animate__animated animate__fadeIn">
              <h1 className="fw-bold mb-2" style={{ color: BRAND_BLUE, letterSpacing: '-1px' }}>Quick Withdrawal</h1>
              <p className="text-muted">Safely withdraw your assets to your external wallet</p>
            </div>

            {/* Stepper */}
            {step < 5 && (
              <div className="d-flex align-items-center justify-content-center mb-5 px-3 animate__animated animate__fadeIn">
                {[1, 2, 4].map((s, idx) => (
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
                        {step > s ? <i className="fas fa-check"></i> : (s === 4 ? 3 : s)}
                      </div>
                    </div>
                    {idx < 2 && (
                      <div className="flex-grow-1 mx-2" style={{ height: '2px', background: step > s ? BRAND_BLUE : '#dee2e6', marginTop: '0px' }}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInUp" style={{ background: '#fff' }}>
              <div className="card-body p-4 p-md-5">
                
                {/* STEP 1: AMOUNT */}
                {step === 1 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="text-center mb-4">
                      <div className="small fw-bold text-uppercase mb-2" style={{ color: '#8094ae', letterSpacing: '1px' }}>Available Crypto Balance</div>
                      <div className="h2 fw-bold mb-4" style={{ color: BRAND_BLUE }}>$ {totalCryptoValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted text-uppercase">Withdrawal Amount (USD)</label>
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
                      {amount && totalDeduction > totalCryptoValue && (
                        <div className="text-danger small mt-2 fw-bold">
                          <i className="fas fa-exclamation-circle me-1"></i> Insufficient crypto balance
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm transition-all"
                      style={{ background: BRAND_BLUE, color: '#fff' }}
                      disabled={!isAmountValid}
                      onClick={() => setStep(2)}
                    >
                      Continue <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </div>
                )}

                {/* STEP 2: METHOD & ADDRESS */}
                {step === 2 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="text-center mb-4">
                      <h5 className="fw-bold mb-1">Select Transfer Method</h5>
                      <p className="text-muted small">Choose your preferred network</p>
                    </div>

                    <div className="row g-3 mb-4">
                      {[
                        { id: 'Bitcoin', name: 'Bitcoin', network: 'BTC', icon: 'fab fa-bitcoin', color: '#f7931a' },
                        { id: 'Ethereum', name: 'Ethereum', network: 'ERC20', icon: 'fab fa-ethereum', color: '#627eea' }
                      ].map(m => (
                        <div className="col-6" key={m.id}>
                          <div 
                            className={`p-3 rounded-4 border-2 transition-all cursor-pointer text-center ${method === m.id ? 'border-primary bg-primary bg-opacity-5' : 'bg-light border-light'}`}
                            onClick={() => setMethod(m.id)}
                            style={{ 
                              borderColor: method === m.id ? BRAND_BLUE : 'transparent',
                              transform: method === m.id ? 'scale(1.02)' : 'scale(1)'
                            }}
                          >
                            <div className="mb-2 rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm" style={{ width: '48px', height: '48px', background: method === m.id ? '#fff' : m.color, color: method === m.id ? m.color : '#fff' }}>
                              <i className={`${m.icon} fs-4`}></i>
                            </div>
                            <div className="fw-bold small mb-1">{m.name}</div>
                            <div className="text-muted extra-small fw-bold">{m.network}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {method && (
                      <div className="animate__animated animate__fadeInUp">
                        <div className="mb-4">
                          <label className="form-label fw-bold small text-muted text-uppercase">Your {method} Wallet Address</label>
                          <div className="bg-light rounded-3 p-1">
                            <input 
                              type="text" 
                              className="form-control form-control-lg bg-transparent border-0 py-3 px-3 fw-bold font-monospace"
                              placeholder="Paste address here"
                              value={walletAddress}
                              onChange={(e) => setWalletAddress(e.target.value)}
                              style={{ fontSize: '0.85rem' }}
                            />
                          </div>
                          <div className="extra-small text-muted mt-2">
                             <i className="fas fa-info-circle me-1"></i> Ensure this address is correct. Crypto transfers are irreversible.
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-3">
                          <button 
                            className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm"
                            style={{ background: BRAND_BLUE, color: '#fff' }}
                            disabled={!walletAddress || walletAddress.length < 10}
                            onClick={handleRequestWithdrawal}
                          >
                            Review Withdrawal <i className="fas fa-chevron-right ms-2"></i>
                          </button>
                          <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={() => setStep(1)}>
                            <i className="fas fa-chevron-left me-2"></i> Change Amount
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: PROCESSING */}
                {step === 3 && (
                  <div className="text-center py-5 animate__animated animate__fadeIn">
                    <div className="spinner-border mb-4" style={{ width: '3.5rem', height: '3.5rem', color: BRAND_BLUE, borderWidth: '3px' }} role="status"></div>
                    <h4 className="fw-bold mb-2" style={{ color: BRAND_BLUE }}>Processing Request</h4>
                    <p className="text-muted">Synchronizing with node network...</p>
                  </div>
                )}

                {/* STEP 4: CONFIRMATION SUMMARY */}
                {step === 4 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="text-center mb-4">
                      <h5 className="fw-bold">Confirm Transaction</h5>
                      <p className="text-muted small">Please verify all details before proceeding</p>
                    </div>
                    
                    <div className="bg-light rounded-4 p-4 mb-4 border shadow-inner">
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted small fw-bold text-uppercase">Withdrawal Amount</span>
                        <span className="fw-bold text-dark">${parseFloat(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted small fw-bold text-uppercase">Asset / Method</span>
                        <span className="fw-bold text-dark">{method}</span>
                      </div>
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted small fw-bold text-uppercase">Network Fee</span>
                        <span className="fw-bold text-success">FREE</span>
                      </div>
                      <div className="d-flex justify-content-between py-3">
                        <span className="fw-bold text-dark h6 mb-0">Total Settlement</span>
                        <span className="h4 fw-bold mb-0" style={{ color: BRAND_BLUE }}>${parseFloat(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                      </div>
                    </div>

                    <div className="p-3 mb-4 rounded-3 d-flex gap-3" style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7' }}>
                      <i className="fas fa-shield-alt text-warning fs-4"></i>
                      <div className="extra-small text-muted fw-bold">
                        Funds will be sent to the blockchain once verified by our security protocol.
                      </div>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      <button 
                        className="btn btn-lg w-100 py-3 rounded-4 fw-bold shadow-sm"
                        style={{ background: BRAND_BLUE, color: '#fff' }}
                        onClick={handleConfirm}
                      >
                        Confirm Withdrawal <i className="fas fa-check-circle ms-2"></i>
                      </button>
                      <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={() => setStep(2)}>
                        <i className="fas fa-chevron-left me-2"></i> Edit Details
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: SUCCESS */}
                {step === 5 && (
                  <div className="text-center animate__animated animate__zoomIn">
                    <div className="mb-4">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-lg" style={{ width: '80px', height: '80px' }}>
                        <i className="fas fa-paper-plane fs-3"></i>
                      </div>
                    </div>
                    
                    <h2 className="fw-bold mb-2" style={{ color: BRAND_BLUE }}>Transfer Initiated</h2>
                    <p className="text-muted mb-5">Your withdrawal is being processed. It usually takes 10-60 minutes to clear the blockchain network.</p>

                    <div className="bg-light rounded-4 p-4 text-start mb-5 shadow-inner">
                      <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                        <span className="text-muted small fw-bold text-uppercase">Status</span>
                        <span className="badge rounded-pill bg-info text-dark px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>Pending Settlement</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                        <span className="text-muted small fw-bold text-uppercase">Transaction ID</span>
                        <span className="font-monospace fw-bold text-dark text-break" style={{ fontSize: '0.75rem' }}>{transactionId}</span>
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
                      Return to Hub <i className="fas fa-home ms-2"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-5">
              <div className="d-flex align-items-center justify-content-center gap-4 text-muted small">
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-lock text-success"></i> END-TO-END ENCRYPTED
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
        .extra-small { font-size: 0.75rem; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </DashboardLayout>
  );
};

export default WithdrawPage;
