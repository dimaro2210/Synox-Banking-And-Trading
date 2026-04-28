import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { SynoxDB } from '../../lib/synoxDB';
import Logo from '../common/Logo';

const DashboardLayout = ({ children, sidebarOverride, onNotificationClick, customNotificationCount, disableProfileLink, notificationType = null }) => {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
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
      const notifs = await SynoxDB.getNotifications(userId, notificationType);
      setNotifications(notifs);
    };

    loadData();
    
    // Listen to global synoxDB updates
    window.addEventListener('synox_updated', loadData);

    // Add dashboard body class
    document.body.className = 'dashboard-body';
    
    return () => {
      window.removeEventListener('synox_updated', loadData);
      document.body.className = '';
    };
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarToggled(!isSidebarToggled);
  };

  if (!user) return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  const menuItems = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', path: '/dashboard' },
    { icon: 'fas fa-exchange-alt', label: 'Transfers', path: '/dashboard/transfers' },
    { icon: 'fas fa-file-invoice', label: 'Statements', path: '/dashboard/statements' },
    { icon: 'fab fa-bitcoin', label: 'Crypto Investment', path: '/dashboard/crypto' },
    { icon: 'fas fa-cog', label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div id="wrapper" className={isSidebarToggled ? 'toggled' : ''}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarToggled && (
        <div 
          className="d-lg-none" 
          onClick={toggleSidebar} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999, cursor: 'pointer' }}
        ></div>
      )}
      {/* Sidebar */}
      <div id="sidebar-wrapper">
        <div className="sidebar-heading position-relative">
          <Logo variant="dark" size="small" />
          <button className="close-menu-btn" id="close-menu" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div 
          className="list-group list-group-flush mt-2" 
          style={{ flexGrow: 1 }}
          onClick={(e) => {
            if (e.target.closest('a, button')) {
              setIsSidebarToggled(false);
            }
          }}
        >
          {sidebarOverride ? (
            sidebarOverride
          ) : (
            <>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarToggled(false)}
                  className={`list-group-item list-group-item-action py-3 px-4 fw-bold ${location.pathname === item.path ? 'active' : ''}`}
                  style={{ fontSize: '1.05rem', border: 'none', transition: 'all 0.25s ease', backgroundColor: 'transparent' }}
                >
                  <i className={item.icon} style={{ width: '32px', fontSize: '1.25rem', textAlign: 'center' }}></i> {item.label}
                </Link>
              ))}
              
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarToggled(false); if(window.Tawk_API){ window.Tawk_API.showWidget(); window.Tawk_API.maximize(); } }} className="list-group-item list-group-item-action py-3 px-4 fw-bold" style={{ color: '#4361ee', marginTop: 'auto', fontSize: '1.05rem', backgroundColor: 'transparent', border: 'none', transition: 'all 0.25s ease' }}>
                <i className="fas fa-headset" style={{ width: '32px', fontSize: '1.25rem', textAlign: 'center' }}></i> Contact Support
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="list-group-item list-group-item-action py-3 px-4 fw-bold text-danger" style={{ fontSize: '1.05rem', backgroundColor: 'transparent', border: 'none', transition: 'all 0.25s ease' }}>
                <i className="fas fa-sign-out-alt" style={{ width: '32px', fontSize: '1.25rem', textAlign: 'center' }}></i> Logout
              </a>
            </>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div id="page-content-wrapper">
        <nav className="navbar navbar-expand-lg" id="main-navbar">
          <button 
            className="btn btn-link text-dark p-0 border-0" 
            id="menu-toggle" 
            onClick={toggleSidebar}
            style={{ fontSize: '1.5rem', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="ms-auto d-flex align-items-center">
            {/* Notification Bell */}
            {onNotificationClick ? (
              <button onClick={onNotificationClick} className="btn notification-btn">
                <i className="far fa-bell" style={{ fontSize: '1.2rem' }}></i>
                {customNotificationCount > 0 && (
                  <span className="notification-badge" id="notif-badge"></span>
                )}
              </button>
            ) : (
              <Link to="/dashboard/notifications" className="btn notification-btn">
                <i className="far fa-bell" style={{ fontSize: '1.2rem' }}></i>
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="notification-badge d-flex align-items-center justify-content-center fw-bold" id="notif-badge" style={{ backgroundColor: '#ff4b5c', color: 'white', fontSize: '0.65rem', width: '18px', height: '18px', position: 'absolute', top: '5px', right: '5px', borderRadius: '50%' }}>
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile */}
            <div className="ms-3">
              {disableProfileLink ? (
                <div className="d-flex align-items-center border-0 p-0" title="Personal Profile">
                  <img 
                    src={user.profile_picture || "https://randomuser.me/api/portraits/men/32.jpg"} 
                    className="rounded-circle shadow-sm profile-img-display border border-light" 
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                    alt="Avatar"
                  />
                </div>
              ) : (
                <Link to="/dashboard/profile" className="d-flex align-items-center bg-transparent border-0 p-0 text-decoration-none" title="Personal Profile">
                  <img 
                    src={user.profile_picture || "https://randomuser.me/api/portraits/men/32.jpg"} 
                    className="rounded-circle shadow-sm profile-img-display hover-opacity-80 transition-all border border-light" 
                    style={{ width: '42px', height: '42px', objectFit: 'cover', cursor: 'pointer' }}
                    alt="Avatar"
                  />
                </Link>
              )}
            </div>
          </div>
        </nav>

        <div className="container-fluid pe-3 p-md-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
