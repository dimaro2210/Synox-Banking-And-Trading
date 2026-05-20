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
      <div id="profile-section" className="content-section animate-fade-in-up">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="page-header-subtitle">Settings</div>
            <div className="page-header-title">Profile Information</div>
          </div>
        </div>

        <div className="row g-4">
          {/* Profile Details */}
          <div className="col-lg-7 delay-100 animate-fade-in-up">
            <div className="neo-card p-4 p-md-5 h-100">
              <h5 className="font-weight-bold mb-4 pb-3 border-bottom" style={{ color: '#001f54' }}>
                Personal Details
              </h5>
              
              <div className="d-flex flex-column flex-sm-row align-items-center mb-5 p-4 bg-light rounded-4" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="position-relative profile-img-container mx-auto" style={{ width: '120px', height: '120px' }}>
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      className="rounded-circle shadow-sm border border-4 border-white" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt="Profile"
                    />
                  ) : (
                    <div className="rounded-circle shadow-sm border border-4 border-white d-flex align-items-center justify-content-center bg-white" style={{ width: '100%', height: '100%' }}>
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
                    className="btn rounded-circle position-absolute shadow-sm d-flex align-items-center justify-content-center hover-opacity-80 transition-all"
                    style={{
                      width: '36px',
                      height: '36px',
                      bottom: 0,
                      right: 0,
                      background: '#001f54',
                      color: '#D4AF37',
                      border: '3px solid #fff',
                      padding: 0
                    }}
                    onClick={() => document.getElementById('profile-upload').click()}
                  >
                    <i className="fas fa-camera" style={{ fontSize: '14px' }}></i>
                  </button>
                </div>
                <div className="ms-sm-4 mt-3 mt-sm-0 text-center text-sm-start">
                  <h5 className="font-weight-bold mb-1 text-dark">{user.full_name}</h5>
                  <p className="text-muted small mb-2">Private Wealth Client</p>
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold"><i className="fas fa-shield-check me-1"></i> Fully Verified</span>
                </div>
              </div>

              <form id="profile-form" onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-md-6 form-group">
                    <label className="small fw-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Full Name</label>
                    <input
                      type="text"
                      className="form-control premium-input text-muted"
                      value={fullName}
                      readOnly
                      style={{ cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="small fw-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control premium-input text-muted"
                      value={email}
                      readOnly
                      style={{ cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="col-md-12 form-group mt-3">
                    <label className="small fw-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Phone Number</label>
                    <input
                      type="text"
                      className="form-control premium-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-premium-navy w-100 mt-4 py-3 d-flex justify-content-center align-items-center"
                >
                  Save Changes <i className="fas fa-check ms-2"></i>
                </button>
              </form>
            </div>
          </div>

          {/* Security Box */}
          <div className="col-lg-5 delay-200 animate-fade-in-up">
            <div className="neo-card p-4 p-md-5 h-100">
              <h5 className="font-weight-bold mb-4 pb-3 border-bottom" style={{ color: '#001f54' }}>
                Security Settings
              </h5>
              
              <div className="d-flex align-items-center mb-4 p-4 rounded-4" style={{ background: 'rgba(25, 135, 84, 0.05)', border: '1px solid rgba(25, 135, 84, 0.1)' }}>
                <i className="fas fa-shield-alt text-success fs-2 me-3"></i>
                <div>
                  <h6 className="font-weight-bold mb-1 text-dark">Account Secure</h6>
                  <p className="text-muted small mb-0">Your settings meet our high standards.</p>
                </div>
              </div>

              <form id="security-form" onSubmit={handleSecuritySubmit}>
                <div className="form-group mb-3">
                  <label className="small fw-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Current Password</label>
                  <input
                    type="password"
                    className="form-control premium-input"
                    placeholder="••••••••"
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="small fw-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>New Password</label>
                  <input type="password" className="form-control premium-input" placeholder="Enter new password" />
                </div>
                <div className="form-group mb-4">
                  <label className="small fw-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Confirm Password</label>
                  <input type="password" className="form-control premium-input" placeholder="Re-enter new password" />
                </div>
                
                <hr className="my-4 opacity-10" />
                
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div>
                    <span className="font-weight-bold d-block text-dark">Two-Factor Auth</span>
                    <small className="text-muted">Verification code required.</small>
                  </div>
                  <div className="form-check form-switch fs-4 mb-0">
                    <input
                      className="form-check-input"
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
                  className="btn btn-outline-primary w-100 py-3 fw-bold rounded-4"
                  style={{ color: '#001f54', borderColor: '#001f54', borderWidth: '2px' }}
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
