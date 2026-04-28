import React, { useState, useEffect } from 'react';
import { SynoxDB } from '../lib/synoxDB';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const StatementsPage = () => {
  const [user, setUser] = useState(null);
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('01');
  const [email, setEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
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
    };
    loadData();
  }, [navigate]);

  const downloadStatementPDF = () => {
    alert('Generating PDF statement for ' + month + '/' + year + '...');
    // Real implementation would trigger a download
  };

  const sendStatementEmail = (e) => {
    e.preventDefault();
    if (!email) return;
    setEmailSuccess(true);
    setTimeout(() => setEmailSuccess(false), 5000);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div id="statements-section" className="content-section animate__animated animate__fadeIn pb-5 mt-2">
        {/* Statement Generator Form */}
        <div className="card border-0 shadow-sm rounded-lg mb-4 bg-white">
          <div className="card-body p-4 p-md-5">
            <h5 className="font-weight-bold mb-4" style={{ color: '#002D72' }}><i className="fas fa-file-invoice me-2"></i>Generate New Statement</h5>
            
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                 <label className="form-label font-weight-bold text-muted small text-uppercase">Account</label>
                 <select className="form-select border-light bg-light fw-bold" style={{ height: '50px', borderRadius: '8px' }}>
                    <option>Main Savings (.... {user.account_number?.slice(-4) || '0000'})</option>
                 </select>
              </div>
              <div className="col-md-3">
                 <label className="form-label font-weight-bold text-muted small text-uppercase">Year</label>
                 <select className="form-select border-light bg-light fw-bold" value={year} onChange={(e) => setYear(e.target.value)} style={{ height: '50px', borderRadius: '8px' }}>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                 </select>
              </div>
              <div className="col-md-3">
                 <label className="form-label font-weight-bold text-muted small text-uppercase">Month</label>
                 <select className="form-select border-light bg-light fw-bold" value={month} onChange={(e) => setMonth(e.target.value)} style={{ height: '50px', borderRadius: '8px' }}>
                    <option value="01">January</option><option value="02">February</option><option value="03">March</option>
                    <option value="04">April</option><option value="05">May</option><option value="06">June</option>
                    <option value="07">July</option><option value="08">August</option><option value="09">September</option>
                    <option value="10">October</option><option value="11">November</option><option value="12">December</option>
                 </select>
              </div>
              <div className="col-md-3">
                 <button className="btn btn-primary w-100 fw-bold shadow-sm transition-all hover-opacity-80" onClick={downloadStatementPDF} style={{ background: '#002D72', border: 'none', height: '50px', borderRadius: '8px' }}>
                   <i className="fas fa-download me-2"></i> Download PDF
                 </button>
              </div>
            </div>
            
            <hr className="my-4 opacity-10" />
            
            <h6 className="font-weight-bold mb-3 d-flex align-items-center"><i className="fas fa-envelope text-primary me-2"></i>Email Delivery Setup</h6>
            <form onSubmit={sendStatementEmail} className="d-flex flex-column flex-sm-row gap-2">
               <input type="email" className="form-control border-light bg-light flex-grow-1 px-3" placeholder="Enter recipient email address..." value={email} onChange={(e) => setEmail(e.target.value)} required style={{ height: '48px', borderRadius: '8px', maxWidth: '400px' }} />
               <button type="submit" className="btn btn-outline-primary px-4 fw-bold flex-shrink-0" style={{ height: '48px', borderRadius: '8px', color: '#002D72', borderColor: '#002D72' }}>Dispatch Email</button>
            </form>
            {emailSuccess && <small className="text-success mt-2 d-block fw-bold animate__animated animate__fadeIn"><i className="fas fa-check-circle me-1"></i>Statement successfully dispatched to inbox.</small>}
          </div>
        </div>

        {/* Recent Statements Table */}
        <div className="card border-0 shadow-sm rounded-lg bg-white overflow-hidden">
          <div className="card-header bg-white border-bottom border-light pt-4 pb-3 px-4">
             <h5 className="font-weight-bold mb-0" style={{ color: '#002D72' }}>Recent Periodic Statements</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-nowrap">
                <thead className="bg-light text-muted small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                   <tr>
                     <th className="ps-4 py-3 border-0 fw-bold">Statement Period</th>
                     <th className="py-3 border-0 fw-bold">Account</th>
                     <th className="py-3 border-0 fw-bold d-none d-md-table-cell">Generated Date</th>
                     <th className="text-end pe-4 py-3 border-0 fw-bold">Action</th>
                   </tr>
                </thead>
                <tbody>
                  {[
                     { p: 'March 2026', d: 'Apr 01, 2026', icon: 'fa-file-pdf text-danger' },
                     { p: 'February 2026', d: 'Mar 01, 2026', icon: 'fa-file-pdf text-danger' },
                     { p: 'January 2026', d: 'Feb 01, 2026', icon: 'fa-file-pdf text-danger' },
                     { p: 'December 2025', d: 'Jan 01, 2026', icon: 'fa-file-archive text-warning' },
                     { p: 'November 2025', d: 'Dec 01, 2025', icon: 'fa-file-archive text-warning' }
                  ].map((item, i) => (
                     <tr key={i} className="border-bottom border-light">
                       <td className="ps-4 py-3 font-weight-bold text-dark"><i className={`fas ${item.icon} me-2 fs-5 align-middle`}></i> {item.p}</td>
                       <td className="py-3 text-muted">
                         <span className="badge bg-light text-dark border me-1">Savings</span> 
                         <small>.... {user.account_number?.slice(-4) || '0000'}</small>
                       </td>
                       <td className="py-3 text-muted d-none d-md-table-cell"><small>{item.d}</small></td>
                       <td className="text-end pe-4 py-3">
                          <button className="btn btn-sm btn-light text-primary fw-bold shadow-sm transition-all hover-bg-primary hover-text-white" onClick={downloadStatementPDF} style={{ borderRadius: '6px' }}>
                            <i className="fas fa-download me-1"></i> Download
                          </button>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Empty table footer padding */}
            <div className="py-2 bg-light w-100 border-top border-light"></div>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default StatementsPage;
