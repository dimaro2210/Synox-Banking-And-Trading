import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CryptoHubPage from './pages/CryptoHubPage';
import TransfersPage from './pages/TransfersPage';
import StatementsPage from './pages/StatementsPage';
import SettingsPage from './pages/SettingsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminControlPanelPage from './pages/AdminControlPanelPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/crypto" element={<CryptoHubPage />} />
        <Route path="/dashboard/transfers" element={<TransfersPage />} />
        <Route path="/dashboard/deposit" element={<DepositPage />} />
        <Route path="/dashboard/withdraw" element={<WithdrawPage />} />
        <Route path="/dashboard/statements" element={<StatementsPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/profile" element={<ProfileSettingsPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard/crypto/notifications" element={<NotificationsPage />} />
        <Route path="/admin" element={<AdminControlPanelPage />} />
      </Routes>
    </Router>
  );
}

export default App;
