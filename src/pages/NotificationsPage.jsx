import React, { useState, useEffect } from 'react';
import { SynoxDB } from '../lib/synoxDB';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('synox_user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      // Fetch ALL notifications (both bank and crypto)
      const allNotifs = await SynoxDB.getNotifications(userId); // Assuming getNotifications can fetch all types if no type is specified
      setNotifications(allNotifs);
      
      // Mark all as read when viewing the page
      await SynoxDB.markNotificationsRead(userId); // Mark all notifications for the user as read
    };
    loadData();
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="container-fluid py-4 animate-fade-in-up">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="page-header-subtitle">Account</div>
            <div className="page-header-title">Notifications</div>
          </div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.8rem' }}>{notifications.length} Total Alerts</span>
        </div>

        {notifications.length > 0 ? (
          <div className="neo-card overflow-hidden p-0">
            {notifications.map((notif, index) => (
              <div key={notif.id} className="p-4 border-bottom hover-bg-light transition-all" style={{ opacity: notif.is_read ? 0.7 : 1 }}>
                <div className="d-flex align-items-start">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ width: '48px', height: '48px', background: '#f8f9fa', color: '#001f54' }}>
                    <i className={`fas ${notif.title.toLowerCase().includes('withdraw') ? 'fa-arrow-up' : notif.title.toLowerCase().includes('deposit') || notif.title.toLowerCase().includes('purchase') ? 'fa-arrow-down' : 'fa-bell'}`}></i>
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                      <div className="fw-bold text-dark d-flex align-items-center flex-wrap gap-2">
                        {notif.title}
                        {!notif.is_read && <span className="badge bg-danger" style={{ fontSize: '0.65rem' }}>NEW</span>}
                        <span className={`badge ${notif.type === 'crypto' ? 'bg-warning-subtle text-warning' : 'bg-info-subtle text-info'}`} style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {notif.type === 'crypto' ? 'Crypto' : 'Bank'}
                        </span>
                      </div>
                      <div className="text-muted small fw-medium" style={{ fontSize: '0.8rem' }}>{new Date(notif.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-muted text-break" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {notif.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 my-3">
            <div className="mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: '100px', height: '100px', background: '#f8f9fa' }}>
                <i className="far fa-bell-slash text-muted" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              </div>
            </div>
            <h5 className="fw-bold text-dark">All clear!</h5>
            <p className="text-muted mx-auto" style={{ maxWidth: '300px' }}>You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
