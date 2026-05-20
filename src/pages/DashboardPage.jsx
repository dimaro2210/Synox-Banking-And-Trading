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
  const [showFrozenPopup, setShowFrozenPopup] = useState(false);
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
    <>
    <DashboardLayout>
      <div id="dashboard-section" className="content-section animate-fade-in-up">
        {/* Premium Greeting Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="page-header-subtitle">{formattedDate}</div>
            <div className="page-header-title">{greeting}, {user.full_name?.split(' ')[0]}</div>
          </div>
          <div className="bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center" style={{ width: '56px', height: '56px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <i className={`fas ${user.status === 'Frozen' ? 'fa-user-lock text-danger' : 'fa-sun text-warning'}`} style={{ fontSize: '1.5rem' }}></i>
          </div>
        </div>

        {/* Balances & Accounts Grid */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="premium-balance-card" onClick={() => setShowAccountModal(true)} style={{ cursor: 'pointer' }}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <small className="text-uppercase" style={{ letterSpacing: '1px', fontWeight: 600, fontSize: '0.75rem', opacity: 0.8 }}>Total Available Balance</small>
                  <div className="d-flex align-items-center mt-2">
                    <div className="balance-amount">
                      {user.status === 'Frozen' ? '••••••' : (showBalance ? `$${(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••')}
                    </div>
                  </div>
                  <p className="mt-3 mb-0 font-monospace" style={{ letterSpacing: '2px', fontSize: '1.1rem', opacity: 0.9 }}>
                    {user.account_number}
                  </p>
                </div>
                <div className="d-flex align-items-center" style={{ gap: '15px', position: 'relative', zIndex: 1 }}>
                  {user.status !== 'Frozen' && (
                    <span onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} title="Toggle Balance Visibility" style={{ cursor: 'pointer', opacity: 0.8 }} className="hover-opacity-100 transition-all">
                      <i className={`fas ${showBalance ? 'fa-eye-slash' : 'fa-eye'} text-white fs-4`}></i>
                    </span>
                  )}
                  <div className="bg-white bg-opacity-25 p-3 rounded-lg backdrop-blur d-none d-sm-flex align-items-center justify-content-center border border-light border-opacity-25">
                    <i className={`fas ${user.status === 'Frozen' ? 'fa-lock' : 'fa-shield-check'} fs-4 text-white`}></i>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3 border-top border-light border-opacity-25 d-flex justify-content-between align-items-center" style={{ position: 'relative', zIndex: 1 }}>
                <small className="d-block opacity-75 fw-bold">Synox Private Banking Network (Default)</small>
                <i className="fab fa-cc-visa fs-3 opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Left Column: Actions */}
          <div className="col-lg-5 mb-4 delay-100 animate-fade-in-up">
            <h5 className="font-weight-bold mb-3" style={{ color: '#001f54' }}>Quick Actions</h5>
            <div className="row g-3">
              {[
                { label: 'Transfer', icon: 'fa-paper-plane', color: '#0d6efd', bg: 'rgba(13, 110, 253, 0.1)', path: '/dashboard/transfers' },
                { label: 'Deposit', icon: 'fa-arrow-down', color: '#198754', bg: 'rgba(25, 135, 84, 0.1)', path: '/dashboard/deposit' },
                { label: 'Withdraw', icon: 'fa-arrow-up', color: '#dc3545', bg: 'rgba(220, 53, 69, 0.1)', path: '/dashboard/withdraw' },
                { label: 'Crypto', icon: 'fa-bitcoin', color: '#f7931a', bg: 'rgba(247, 147, 26, 0.1)', path: '/dashboard/crypto' }
              ].map(action => (
                <div key={action.label} className="col-6">
                  <div className="action-squircle" onClick={(e) => {
                    if (user.status === 'Frozen' && (action.label === 'Transfer' || action.label === 'Withdraw')) {
                      e.preventDefault();
                      setShowFrozenPopup(true);
                    } else {
                      navigate(action.path);
                    }
                  }}>
                    <div className="action-icon-wrapper" style={{ color: action.color, backgroundColor: action.bg }}>
                      <i className={`fas ${action.icon}`}></i>
                    </div>
                    <span className="font-weight-bold" style={{ color: '#343a40', fontSize: '0.95rem' }}>{action.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Transactions */}
          <div className="col-lg-7 mb-4 delay-200 animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-weight-bold mb-0" style={{ color: '#001f54' }}>Recent Transactions</h5>
              <button className="btn btn-link text-decoration-none p-0 fw-bold" onClick={() => navigate('/dashboard/statements')}>View All</button>
            </div>
            
            <div className="transactions-list">
              {transactions.length > 0 ? (
                transactions.map(tx => (
                  <div key={tx.id} className="tx-row d-flex align-items-center">
                    <div className="tx-icon flex-shrink-0 me-3" style={{ background: tx.type === 'credit' ? 'rgba(25, 135, 84, 0.1)' : 'rgba(220, 53, 69, 0.1)', color: tx.type === 'credit' ? '#198754' : '#dc3545' }}>
                      <i className={`fas ${tx.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <p className="mb-0 font-weight-bold text-dark text-truncate">{tx.description}</p>
                      <small className="text-muted text-truncate d-block">{new Date(tx.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
                    </div>
                    <div className={`text-right ${tx.type === 'credit' ? 'text-success' : 'text-danger'} font-weight-bold flex-shrink-0 ms-2`} style={{ fontSize: '1.1rem' }}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="neo-card p-5 text-center text-muted">
                  <i className="fas fa-history mb-3 opacity-25" style={{ fontSize: '3rem' }}></i>
                  <p className="mb-0 fw-bold">No transaction activity recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Account Details Modal */}
      {showAccountModal && (
        <div className="modal show d-block animate-fade-in-up" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered px-3" style={{ maxWidth: '480px' }}>
            <div className="neo-card modal-content border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 font-weight-bold" style={{ color: '#001f54' }}>Account Overview</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowAccountModal(false)}></button>
              </div>

              <div className="account-details-grid">
                <div className="p-3 bg-light rounded-3 border border-light shadow-sm mb-4">
                  <label className="text-muted small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Account Holder</label>
                  <p className="h6 font-weight-bold mb-0 text-dark">{user.full_name}</p>
                </div>

                <div className="row g-3">
                  {[
                    { label: 'Account Number', value: user.account_number, isMono: true, copy: true },
                    { label: 'Routing Number (ABA)', value: '021000021', isMono: true },
                    { label: 'SWIFT / BIC Code', value: 'SYNXUS33', isMono: true },
                    { label: 'Account Type', value: user.account_type || 'Private Wealth' },
                    { label: 'Bank Name', value: 'Synox International Bank' },
                    { label: 'Branch Location', value: 'Park Avenue, NY' }
                  ].map((detail, i) => (
                    <div className="col-12" key={i}>
                      <div className={`detail-row d-flex justify-content-between align-items-center py-2 ${i < 5 ? 'border-bottom' : ''}`}>
                        <span className="text-muted small">{detail.label}</span>
                        <div className="d-flex align-items-center">
                          <span className={`fw-bold text-dark ${detail.isMono ? 'font-monospace' : ''} ${detail.copy ? 'me-2' : ''}`}>{detail.value}</span>
                          {detail.copy && (
                            <button className="btn btn-sm btn-link p-0 text-decoration-none" onClick={() => navigator.clipboard.writeText(detail.value)} title="Copy">
                              <i className="far fa-copy text-muted" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-top">
                  <div className="alert bg-primary bg-opacity-10 border-0 mb-4" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-baseline">
                      <i className="fas fa-shield-check text-primary me-2" style={{ color: '#002D72' }}></i>
                      <small className="text-dark fw-bold" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                        This account is fully verified and insured by Federal Deposit Insurance protocols.
                      </small>
                    </div>
                  </div>
                  <button className="btn-premium-navy w-100" onClick={() => setShowAccountModal(false)}>
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
      
      {/* Account Frozen Bottom Popup */}
      {showFrozenPopup && (
        <>
          <div 
            className="position-fixed top-0 start-0 w-100 h-100" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, backdropFilter: 'blur(4px)' }}
            onClick={() => setShowFrozenPopup(false)}
          ></div>
          <div 
            className="position-fixed bottom-0 start-0 w-100 bg-white shadow-lg p-4 slide-up" 
            style={{ 
              zIndex: 3001, 
              borderTopLeftRadius: '30px', 
              borderTopRightRadius: '30px',
              animation: 'slideUp 0.4s ease-out forwards'
            }}
          >
            <style>
              {`
                @keyframes slideUp {
                  from { transform: translateY(100%); }
                  to { transform: translateY(0); }
                }
              `}
            </style>
            <div className="container" style={{ maxWidth: '600px' }}>
              <div className="text-center mb-3">
                <div className="mx-auto bg-light mb-3" style={{ width: '50px', height: '6px', borderRadius: '3px' }}></div>
                <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                  <i className="fas fa-user-shield text-danger fs-1"></i>
                </div>
                <h3 className="fw-bold mb-2">Account Restricted</h3>
                <p className="text-muted mb-4">
                  For your protection, this account has been <strong>frozen for security reasons</strong>. All outgoing transactions are temporarily suspended.
                </p>
                <div className="bg-light p-3 rounded-4 text-start mb-4 border border-danger border-opacity-10">
                  <p className="mb-0 small text-danger fw-bold"><i className="fas fa-info-circle me-2"></i>Further Assistance Required</p>
                  <p className="mb-0 small text-muted">Please contact our customer live service or your account manager for further assistance and to resolve this restriction.</p>
                </div>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary py-3 fw-bold rounded-pill" 
                    style={{ background: '#002D72', border: 'none' }}
                    onClick={() => { setShowFrozenPopup(false); if(window.Tawk_API){ window.Tawk_API.showWidget(); window.Tawk_API.maximize(); } }}
                  >
                    Contact Live Support
                  </button>
                  <button className="btn btn-link text-muted text-decoration-none fw-bold" onClick={() => setShowFrozenPopup(false)}>
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardPage;
