import React, { useState, useEffect } from 'react';
import { SynoxDB } from '../lib/synoxDB';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [paperless, setPaperless] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [domesticLimit, setDomesticLimit] = useState(5000);
  const [intlLimit, setIntlLimit] = useState(15000);
  const [limitLocked, setLimitLocked] = useState(false);
  const navigate = useNavigate();

  const handleLimitIncrease = (e) => {
    e.preventDefault();
    if (limitLocked) return;
    
    alert('Limit request sent, check back after 24 hours');
    setLimitLocked(true);
    
    // Save to local storage
    const userId = sessionStorage.getItem('synox_user_id');
    const data = {
      requestTime: Date.now(),
      pendingDomestic: domesticLimit,
      pendingIntl: intlLimit
    };
    localStorage.setItem(`synox_limits_${userId}`, JSON.stringify(data));
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('synox_user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    const limitsData = localStorage.getItem(`synox_limits_${userId}`);
    if (limitsData) {
      const data = JSON.parse(limitsData);
      const timeDiff = Date.now() - data.requestTime;
      if (timeDiff >= 24 * 60 * 60 * 1000) {
        setDomesticLimit(data.pendingDomestic);
        setIntlLimit(data.pendingIntl);
        localStorage.removeItem(`synox_limits_${userId}`);
        setLimitLocked(false);
      } else {
        setDomesticLimit(data.pendingDomestic);
        setIntlLimit(data.pendingIntl);
        setLimitLocked(true);
      }
    }

    const loadData = async () => {
      const userData = await SynoxDB.getUserById(userId);
      setUser(userData);
    };
    loadData();
  }, [navigate]);

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    alert('Banking preferences updated successfully!');
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div id="banking-settings-section" className="content-section animate__animated animate__fadeIn">
        <div className="row g-4 mt-2">
          {/* Limits & Alerts (Now First) */}
          <div className="col-lg-6">
            <div className="row g-4 h-100">
              {/* Daily Limits */}
              <div className="col-12">
                <div className="glass-card bg-white p-4 p-md-5 rounded-xl shadow-sm border border-light">
                  <h5 className="font-weight-bold mb-4 pb-3 border-bottom text-primary" style={{ color: '#002D72 !important' }}>
                    Transfer Limits
                  </h5>
                  <form onSubmit={handleLimitIncrease} className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="w-50 pe-2">
                        <span className="font-weight-bold d-block text-truncate">Domestic Daily</span>
                        <small className="text-muted d-block text-truncate">Max allowed per day.</small>
                      </div>
                      <div className="input-group input-group-sm w-50 shadow-sm rounded border overflow-hidden">
                        <span className="input-group-text bg-light border-0 fw-bold">$</span>
                        <input type="number" className="form-control border-0 fw-bold shadow-none text-end" value={domesticLimit} onChange={(e) => setDomesticLimit(e.target.value)} disabled={limitLocked} />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="w-50 pe-2">
                        <span className="font-weight-bold d-block text-truncate">International Transfer</span>
                        <small className="text-muted d-block text-truncate">Max per transfer.</small>
                      </div>
                      <div className="input-group input-group-sm w-50 shadow-sm rounded border overflow-hidden">
                        <span className="input-group-text bg-light border-0 fw-bold">$</span>
                        <input type="number" className="form-control border-0 fw-bold shadow-none text-end" value={intlLimit} onChange={(e) => setIntlLimit(e.target.value)} disabled={limitLocked} />
                      </div>
                    </div>
                    <button type="submit" disabled={limitLocked} className={`btn ${limitLocked ? 'btn-secondary' : 'btn-primary'} btn-sm rounded-pill mt-2 py-2 fw-bold w-100 shadow-sm transition-all`} style={{ background: limitLocked ? '#6c757d' : '#002D72', border: 'none' }}>
                      {limitLocked ? 'Pending 24h Approval' : 'Update Limits'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Notification Alerts */}
              <div className="col-12 flex-grow-1">
                <div className="glass-card bg-white p-4 p-md-5 rounded-xl shadow-sm border border-light h-100">
                  <h5 className="font-weight-bold mb-4 pb-3 border-bottom text-primary" style={{ color: '#002D72 !important' }}>
                    Transaction Alerts
                  </h5>
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="font-weight-bold d-block"><i className="fas fa-sms text-primary me-2"></i> SMS Notifications</span>
                        <small className="text-muted">For transactions over $500.</small>
                      </div>
                      <div className="form-check form-switch fs-4 border-0">
                        <input className="form-check-input" type="checkbox" checked={smsAlerts} onChange={() => setSmsAlerts(!smsAlerts)} style={{ cursor: 'pointer' }} />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="font-weight-bold d-block"><i className="fas fa-envelope text-primary me-2"></i> Email Alerts</span>
                        <small className="text-muted">For all wire transfers and deposits.</small>
                      </div>
                      <div className="form-check form-switch fs-4 border-0">
                        <input className="form-check-input" type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} style={{ cursor: 'pointer' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Account & Statement Preferences (Now Second) */}
          <div className="col-lg-6">
            <div className="glass-card bg-white p-4 p-md-5 rounded-xl shadow-sm border border-light h-100">
              <h5 className="font-weight-bold mb-4 pb-3 border-bottom text-primary" style={{ color: '#002D72 !important' }}>
                Account Settings
              </h5>

              <form onSubmit={handlePreferencesSubmit}>
                <div className="form-group mb-4">
                  <label className="small font-weight-bold text-muted text-uppercase mb-2">Primary Default Account</label>
                  <select className="form-select form-control-lg border-0 bg-light shadow-none fw-bold" style={{ borderRadius: '10px', height: '52px' }}>
                    <option value="checking">Main Savings (.... {user.account_number?.slice(-4)})</option>
                    <option value="us">US Operating (.... 5021)</option>
                    <option value="intl">International Euro (.... 1140)</option>
                  </select>
                  <small className="text-muted mt-2 d-block">This account will be selected by default for domestic transfers and bill payments.</small>
                </div>

                <div className="p-4 bg-light rounded-lg border border-light mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="font-weight-bold text-dark"><i className="fas fa-leaf text-success me-2"></i> Paperless Statements</span>
                    <div className="form-check form-switch fs-4">
                      <input className="form-check-input flex-shrink-0" type="checkbox" checked={paperless} onChange={() => setPaperless(!paperless)} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                  <small className="text-muted d-block pe-4">Receive monthly account statements exclusively digitally via the Statements portal.</small>
                </div>

                <div className="p-4 bg-light rounded-lg border border-light mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="font-weight-bold text-dark"><i className="fas fa-bullhorn text-warning me-2"></i> Promotional Offers</span>
                    <div className="form-check form-switch fs-4">
                      <input className="form-check-input flex-shrink-0" type="checkbox" checked={marketing} onChange={() => setMarketing(!marketing)} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                  <small className="text-muted d-block pe-4">Receive emails about new banking products, investment opportunities, and rate changes.</small>
                </div>

                <button type="submit" className="btn btn-primary rounded-pill py-3 px-5 fw-bold shadow-sm hover-opacity-80 transition-all w-100" style={{ background: '#002D72', border: 'none' }}>
                  Save Account Preferences
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
