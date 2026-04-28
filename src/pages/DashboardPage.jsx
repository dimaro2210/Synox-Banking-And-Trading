import React, { useState, useEffect } from 'react';
import { SynoxDB } from '../lib/synoxDB';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [greeting, setGreeting] = useState("Good Morning");
  const [formattedDate, setFormattedDate] = useState("Today");
  const [showBalance, setShowBalance] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('synox_user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      const userData = await SynoxDB.getUserById(userId);
      setUser(userData);
      const txs = await SynoxDB.getTransactions(userId, 5);
      setTransactions(txs);
    };

    loadData();

    // Set greeting date
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    setFormattedDate(now.toLocaleDateString('en-US', options));

    const hour = now.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Subscribe to global DB updates
    window.addEventListener('synox_updated', loadData);
    
    return () => {
      window.removeEventListener('synox_updated', loadData);
    };
  }, [navigate]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div id="dashboard-section" className="content-section">
        {/* Premium Greeting Section */}
        <div className="greeting-section mb-4 p-3 p-md-4 rounded-xl shadow-sm bg-white border border-light d-flex flex-row flex-nowrap justify-content-between align-items-center">
          <div className="greeting-content pe-2 d-flex flex-column align-items-start text-start w-100" style={{ overflow: 'hidden' }}>
            <p className="text-muted mb-1 font-weight-bold d-block w-100" id="greeting-date" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', margin: 0 }}>{formattedDate}</p>
            <h1 className="mb-0 fw-bolder font-weight-bolder text-truncate text-start mt-1 w-100" id="greeting-text" style={{ color: '#002D72', fontSize: 'clamp(1.5rem, 5.5vw, 2.2rem)', fontWeight: '900', lineHeight: 1.1 }}>{greeting},</h1>
            <h2 className="mb-0 mt-1 user-full-name-greeting text-muted font-weight-light text-truncate text-start opacity-75 w-100" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.25rem)' }}>{user.full_name}</h2>
          </div>
          <div className="greeting-icon-wrapper p-2 p-md-3 bg-light rounded-circle shadow-inner flex-shrink-0 d-flex justify-content-center align-items-center" style={{ width: 'clamp(55px, 14vw, 75px)', height: 'clamp(55px, 14vw, 75px)' }}>
            <i id="weather-icon" className="fas fa-sun" style={{ fontSize: 'clamp(1.75rem, 6.5vw, 2.5rem)', color: '#FFD700' }}></i>
          </div>
        </div>

        {/* Balances & Accounts Grid */}
        <div className="row mb-4">
          <div className="col-12 mb-4 mb-lg-0">
            <div className="balance-card p-4 p-md-5 h-100 text-white shadow-lg position-relative overflow-hidden" 
                 onClick={() => setShowAccountModal(true)}
                 style={{ 
                   background: 'linear-gradient(135deg, #002D72 0%, #0056b3 100%)', 
                   borderRadius: '24px',
                   cursor: 'pointer',
                   minHeight: '260px'
                 }}>
              <div className="position-absolute" style={{ top: '-20px', right: '-20px', opacity: 0.1 }}>
                <i className="fas fa-university" style={{ fontSize: '200px' }}></i>
              </div>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <small className="text-uppercase opacity-75" style={{ letterSpacing: '1px', fontWeight: 600, fontSize: '0.75rem' }}>Total Available Balance</small>
                  <div className="d-flex align-items-center mt-2">
                    <h2 className="mb-0" style={{ fontWeight: 800, fontSize: '2.2rem', letterSpacing: '-0.5px' }}>
                      {showBalance ? `$${(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
                    </h2>
                  </div>
                  <p className="mt-3 mb-0 opacity-75 font-monospace" style={{ letterSpacing: '2px', fontSize: '1.2rem' }}>
                    {user.account_number}
                  </p>
                </div>
                <div className="d-flex align-items-center" style={{ gap: '20px' }}>
                  <span onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} title="Toggle Balance Visibility" style={{ cursor: 'pointer' }}>
                    <i className={`fas ${showBalance ? 'fa-eye-slash' : 'fa-eye'} text-white fs-3 opacity-75 hover-opacity-100 transition-all`}></i>
                  </span>
                  <div className="bg-white bg-opacity-25 p-3 rounded-lg backdrop-blur d-none d-sm-block">
                    <i className="fas fa-shield-check fs-4 text-white"></i>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3 border-top border-light border-opacity-25 d-flex justify-content-between align-items-center">
                <small className="d-block">Synox Private Banking Network (Default)</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Left Column: Actions & Transfer */}
          <div className="col-lg-4 mb-4">
            {/* Quick Actions */}
            <div className="glass-card bg-white p-4 rounded-xl shadow-sm border border-light d-flex flex-column mb-4">
              <h5 className="font-weight-bold mb-4">Quick Actions</h5>
              <div className="row g-3">
                {[
                  { label: 'Send Money', icon: 'fa-paper-plane', color: '#002D72', path: '/dashboard/transfers' },
                  { label: 'Pay Bills', icon: 'fa-file-invoice', color: '#dc3545', path: '/dashboard/transfers' },
                  { label: 'Statements', icon: 'fa-file-invoice-dollar', color: '#28a745', path: '/dashboard/statements' },
                  { label: 'Security', icon: 'fa-user-shield', color: '#fd7e14', path: '/dashboard/profile' }
                ].map(action => (
                  <div key={action.label} className="col-6 d-flex">
                    <Link to={action.path} className="text-decoration-none w-100">
                      <div className="action-item text-center p-3 h-100 rounded-xl hover-bg-light transition-all border border-transparent hover-border-primary shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ background: '#f8fafc', borderRadius: '16px', minHeight: '110px' }}>
                        <div className="action-icon mx-auto mb-2 d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" 
                             style={{ color: action.color, fontSize: '1.2rem', width: '45px', height: '45px' }}>
                          <i className={`fas ${action.icon}`}></i>
                        </div>
                        <span className="small font-weight-bold text-dark d-block" style={{ lineHeight: '1.2' }}>{action.label}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Transfer Form */}
            <div className="glass-card bg-white p-4 rounded-xl shadow-sm border border-light d-flex flex-column">
              <h5 className="font-weight-bold mb-4">Quick Transfer</h5>
              <div className="d-flex mb-4 overflow-auto pb-2 custom-scrollbar" style={{ gap: '15px' }}>
                <div className="text-center flex-shrink-0" style={{ minWidth: '70px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/transfers')}>
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-2 border border-primary border-2 hover-bg-light transition-all" style={{ width: '55px', height: '55px' }}>
                    <i className="fas fa-plus text-primary"></i>
                  </div>
                  <small className="font-weight-bold text-dark d-block text-truncate">New</small>
                </div>
              </div>
              
              <div className="quick-transfer-input mt-auto bg-light rounded-xl p-2 d-flex align-items-center">
                <div className="d-flex align-items-center flex-grow-1 bg-white rounded-lg p-2 shadow-sm border border-light me-3">
                  <span className="font-weight-bold text-muted ms-2 me-1 fs-5">$</span>
                  <input type="number" className="form-control border-0 bg-transparent shadow-none font-weight-bold fs-5 mb-0 p-1 custom-number-input w-100" placeholder="0.00" style={{ outline: 'none' }} />
                </div>
                <button className="btn btn-primary rounded-xl px-0 py-2 shadow-sm d-flex align-items-center justify-content-center transition-all hover-opacity-80 flex-shrink-0" style={{ width: '60px', height: '60px', background: '#002D72', border: 'none' }} onClick={() => navigate('/dashboard/transfers')}>
                  <i className="fas fa-paper-plane" style={{ fontSize: '1.4rem' }}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-lg-8 mb-4">
            <div className="glass-card bg-white p-3 p-md-4 h-100 rounded-xl shadow-sm border border-light d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="font-weight-bold mb-0">Recent Transactions</h5>
              </div>
              <div className="transactions-list rounded-xl overflow-hidden flex-grow-1">
                {transactions.length > 0 ? (
                  transactions.map(tx => (
                    <div key={tx.id} className="transaction-item p-2 p-md-3 border-bottom d-flex align-items-center hover-bg-light transition-all w-100">
                      <div className={`icon-box me-2 me-md-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                           style={{ width: 'clamp(38px, 10vw, 48px)', height: 'clamp(38px, 10vw, 48px)', background: tx.type === 'credit' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)', color: tx.type === 'credit' ? '#28a745' : '#dc3545', fontSize: 'clamp(0.9rem, 4vw, 1.2rem)' }}>
                        <i className={`fas ${tx.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                      </div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <p className="mb-0 font-weight-bold text-dark text-truncate" style={{ fontSize: 'clamp(0.85rem, 3.5vw, 1rem)' }}>{tx.description}</p>
                        <small className="text-muted text-truncate d-block" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)' }}>{new Date(tx.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
                      </div>
                      <div className={`text-right ${tx.type === 'credit' ? 'text-success' : 'text-danger'} font-weight-bold flex-shrink-0 ms-2`} style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}>
                        {tx.type === 'credit' ? '+' : '-'}${tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted w-100">
                    <i className="fas fa-history mb-2 opacity-25" style={{ fontSize: '2.5rem' }}></i>
                    <p className="small mb-0">No transaction activity recorded yet.</p>
                  </div>
                )}
                {transactions.length > 0 && (
                  <button className="btn btn-link btn-block text-muted small font-weight-bold py-3 text-decoration-none w-100" onClick={() => navigate('/dashboard/statements')}>
                    See more <i className="fas fa-chevron-down ms-1"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Account Details Modal */}
      {showAccountModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered px-3" style={{ maxWidth: '480px' }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 font-weight-bold" style={{ color: '#002D72' }}>Account Overview</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowAccountModal(false)}></button>
                </div>

                <div className="account-details-grid">
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="p-3 bg-light rounded-lg border border-light shadow-inner">
                        <label className="text-muted small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Account Holder</label>
                        <p className="h6 font-weight-bold mb-0 text-dark">{user.full_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <div className="detail-row d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="text-muted small">Account Number</span>
                        <div className="d-flex align-items-center">
                          <span className="font-monospace fw-bold text-dark me-2">{user.account_number}</span>
                          <button className="btn btn-sm btn-link p-0 text-decoration-none" onClick={() => navigator.clipboard.writeText(user.account_number)} title="Copy">
                            <i className="far fa-copy text-muted" style={{ fontSize: '0.8rem' }}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="detail-row d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="text-muted small">Routing Number (ABA)</span>
                        <span className="font-monospace fw-bold text-dark">021000021</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="detail-row d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="text-muted small">SWIFT / BIC Code</span>
                        <span className="font-monospace fw-bold text-dark">SYNXUS33</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="detail-row d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="text-muted small">Account Type</span>
                        <span className="fw-bold text-dark">{user.account_type || 'Private Wealth'}</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="detail-row d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="text-muted small">Bank Name</span>
                        <span className="fw-bold text-dark">Synox International Bank</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="detail-row d-flex justify-content-between align-items-center py-2">
                        <span className="text-muted small">Branch Location</span>
                        <span className="fw-bold text-dark text-end" style={{ fontSize: '0.85rem' }}>Park Avenue, NY</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-top">
                    <div className="alert bg-primary bg-opacity-10 border-0 mb-3" style={{ borderRadius: '12px' }}>
                      <div className="d-flex align-items-baseline">
                        <i className="fas fa-shield-check text-primary me-2" style={{ color: '#002D72' }}></i>
                        <small className="text-dark" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                          This account is fully verified and insured by Federal Deposit Insurance protocols.
                        </small>
                      </div>
                    </div>
                    <button className="btn btn-primary w-100 py-2 font-weight-bold shadow-sm" 
                            style={{ background: '#002D72', border: 'none', borderRadius: '12px' }} 
                            onClick={() => setShowAccountModal(false)}>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default DashboardPage;
