import React, { useState, useEffect } from 'react';
import { SynoxDB } from '../lib/synoxDB';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const ProfileSettingsPage = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [address, setAddress] = useState('100 Wall Street, New York, NY 10005');
  const [tfa, setTfa] = useState(true);
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
      setFullName(userData.full_name || '');
      setEmail(userData.email || '');
    };
    loadData();
  }, [navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('synox_user_id');
    const updated = await SynoxDB.updateUser(userId, { full_name: fullName, email });
    if (updated) {
      alert('Profile details updated successfully!');
      setUser({ ...user, full_name: fullName, email });
    }
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    alert('Security settings updated!');
  };

  const updateProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        const userId = sessionStorage.getItem('synox_user_id');
        SynoxDB.updateUser(userId, { profile_picture: upload.target.result });
        setUser({ ...user, profile_picture: upload.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div id="profile-section" className="content-section animate__animated animate__fadeIn">
        <div className="row g-4 mt-2">
          {/* Profile Details */}
          <div className="col-lg-7">
            <div className="glass-card bg-white p-4 p-md-5 rounded-xl shadow-sm border border-light h-100">
              <h5 className="font-weight-bold mb-4 pb-3 border-bottom text-primary" style={{ color: '#002D72 !important' }}>
                Profile Information
              </h5>
              
              <div className="d-flex flex-column flex-sm-row align-items-center mb-5 p-3 p-md-4 bg-light rounded-lg border border-light">
                <div className="position-relative profile-img-container mx-auto" style={{ width: '120px', height: '120px' }}>
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      className="rounded-circle shadow border border-4 border-white" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt="Profile"
                    />
                  ) : (
                    <div className="rounded-circle shadow border border-4 border-white d-flex align-items-center justify-content-center bg-light" style={{ width: '100%', height: '100%' }}>
                      <i className="fas fa-user text-muted fa-3x"></i>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile-upload"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={updateProfilePicture}
                  />
                  <button
                    type="button"
                    className="btn btn-primary rounded-circle position-absolute shadow-sm d-flex align-items-center justify-content-center hover-opacity-80 transition-all"
                    style={{
                      width: '32px',
                      height: '32px',
                      bottom: 0,
                      right: 0,
                      background: '#002D72',
                      borderColor: '#fff',
                      borderWidth: '2px',
                      padding: 0
                    }}
                    onClick={() => document.getElementById('profile-upload').click()}
                  >
                    <i className="fas fa-camera" style={{ fontSize: '12px' }}></i>
                  </button>
                </div>
                <div>
                  <h5 className="font-weight-bold mb-1">{user.full_name}</h5>
                  <p className="text-muted small mb-2">Member since 2023</p>
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill"><i className="fas fa-check-circle me-1"></i> Identity Verified</span>
                </div>
              </div>

              <form id="profile-form" onSubmit={handleProfileSubmit}>
                <div className="row">
                  <div className="col-md-6 form-group mb-3">
                    <label className="small font-weight-bold text-muted text-uppercase mb-1" style={{ letterSpacing: '1px' }}>Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light shadow-none text-muted"
                      value={fullName}
                      readOnly
                      style={{ fontWeight: 600, borderRadius: '10px', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="col-md-6 form-group mb-3">
                    <label className="small font-weight-bold text-muted text-uppercase mb-1" style={{ letterSpacing: '1px' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg border-0 bg-light shadow-none text-muted"
                      value={email}
                      readOnly
                      style={{ fontWeight: 600, borderRadius: '10px', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="col-md-12 form-group mb-3">
                    <label className="small font-weight-bold text-muted text-uppercase mb-1" style={{ letterSpacing: '1px' }}>Phone Number</label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light shadow-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ fontWeight: 600, color: '#333', borderRadius: '10px' }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill mt-3 py-3 w-100 fw-bold shadow-sm hover-opacity-80 transition-all"
                  style={{ background: '#002D72', border: 'none' }}
                >
                  Save <i className="fas fa-check ms-2"></i>
                </button>
              </form>
            </div>
          </div>

          {/* Security Box */}
          <div className="col-lg-5">
            <div className="glass-card bg-white p-4 p-md-5 rounded-xl shadow-sm border border-light h-100">
              <h5 className="font-weight-bold mb-4 pb-3 border-bottom text-primary" style={{ color: '#002D72 !important' }}>
                Password & Security
              </h5>
              
              <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-lg border border-success border-opacity-25">
                <i className="fas fa-shield-alt text-success fs-3 me-3 opacity-75"></i>
                <div>
                  <h6 className="font-weight-bold mb-1">Account Secure</h6>
                  <p className="text-muted small mb-0">Your security settings meet our highest standards.</p>
                </div>
              </div>

              <form id="security-form" onSubmit={handleSecuritySubmit}>
                <div className="form-group mb-3">
                  <label className="small font-weight-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Current Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg border-0 shadow-none"
                    placeholder="••••••••"
                    style={{ background: '#f8f9fa', borderRadius: '10px' }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="small font-weight-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>New Password</label>
                  <input type="password" className="form-control form-control-lg border-0 shadow-none" style={{ background: '#f8f9fa', borderRadius: '10px' }} placeholder="Enter new password" />
                </div>
                <div className="form-group mb-4">
                  <label className="small font-weight-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Confirm Password</label>
                  <input type="password" className="form-control form-control-lg border-0 shadow-none" style={{ background: '#f8f9fa', borderRadius: '10px' }} placeholder="Re-enter new password" />
                </div>
                
                <hr className="my-4 opacity-10" />
                
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-lg">
                  <div>
                    <span className="font-weight-bold d-block text-dark">Two-Factor Auth (2FA)</span>
                    <small className="text-muted">Requires verification code on login.</small>
                  </div>
                  <div className="form-check form-switch fs-4">
                    <input
                      className="form-check-input flex-shrink-0"
                      type="checkbox"
                      id="2fa-switch"
                      checked={tfa}
                      onChange={() => setTfa(!tfa)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-primary w-100 rounded-pill py-3 fw-bold"
                  style={{ color: '#002D72', borderColor: '#002D72' }}
                >
                  Update Credentials
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettingsPage;
