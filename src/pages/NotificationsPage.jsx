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
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.5px' }}>Notifications</h2>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.8rem' }}>{notifications.length} Total Alerts</span>
        </div>

        {notifications.length > 0 ? (
          <div className="crypto-activity-list">
            {notifications.map((notif) => (
              <div key={notif.id} className="crypto-activity-item" style={{ opacity: notif.is_read ? 0.7 : 1 }}>
                <div className="crypto-activity-left">
                  <div className="crypto-activity-icon" style={{ background: '#f4f6fb', color: '#002D72' }}>
                    <i className={`fas ${notif.title.toLowerCase().includes('withdraw') ? 'fa-arrow-up' : notif.title.toLowerCase().includes('deposit') || notif.title.toLowerCase().includes('purchase') ? 'fa-arrow-down' : 'fa-bell'}`}></i>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="crypto-activity-desc">
                      {notif.title}
                      {!notif.is_read && <span className="badge bg-danger ms-2" style={{ fontSize: '0.6rem' }}>NEW</span>}
                      <span className={`badge ms-2 ${notif.type === 'crypto' ? 'bg-warning-subtle text-warning' : 'bg-info-subtle text-info'}`} style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {notif.type === 'crypto' ? 'Crypto' : 'Bank'}
                      </span>
                    </div>
                    <div className="crypto-activity-sub" style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '4px', whiteSpace: 'normal', minHeight: '18px', lineHeight: '1.4' }}>
                      {notif.description}
                    </div>
                    <div className="crypto-activity-meta" style={{ marginTop: '6px' }}>{new Date(notif.created_at).toLocaleString()}</div>
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
