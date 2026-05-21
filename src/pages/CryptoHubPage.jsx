import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { SynoxDB } from '../lib/synoxDB';
import DashboardLayout from '../components/dashboard/DashboardLayout';

/* ── CoinGecko API Integration ────────────────────────────────── */
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true';
const ASSET_MAP = { bitcoin: 'BTC', ethereum: 'ETH', tether: 'USDT', binancecoin: 'BNB', solana: 'SOL' };
const INITIAL_MARKET_DATA = {
  BTC: { usd: 64210, usd_24h_change: 1.2, usd_market_cap: 0, usd_24h_vol: 0 },
  ETH: { usd: 3450, usd_24h_change: 0.5, usd_market_cap: 0, usd_24h_vol: 0 },
  USDT: { usd: 1.00, usd_24h_change: 0.0, usd_market_cap: 0, usd_24h_vol: 0 },
  BNB: { usd: 580, usd_24h_change: 0.2, usd_market_cap: 0, usd_24h_vol: 0 },
  SOL: { usd: 145, usd_24h_change: 4.8, usd_market_cap: 0, usd_24h_vol: 0 }
};

const CRYPTO_META = {
  BTC: { name: 'Bitcoin', icon: 'fa-bitcoin', color: '#F7931A', cssClass: 'btc' },
  ETH: { name: 'Ethereum', icon: 'fa-ethereum', color: '#627EEA', cssClass: 'eth' },
  USDT: { name: 'Tether USD', icon: 'fa-dollar-sign', color: '#26A17B', cssClass: 'usdt' },
  BNB: { name: 'BNB', icon: 'fa-coins', color: '#F3BA2F', cssClass: 'bnb' },
  SOL: { name: 'Solana', icon: 'fa-bolt', color: '#14F195', cssClass: 'sol' }
};

/* ── Open Trade Card with Countdown ─────────────────────────── */
function OpenTradeCard({ trade }) {
  const [closing, setClosing] = useState(false);
  const [remaining, setRemaining] = useState('');
  const [displayProfit, setDisplayProfit] = useState(null);

  const urgent = trade.expires_at && new Date(trade.expires_at) - new Date() < 60000;
  const expired = trade.expires_at && new Date(trade.expires_at) <= new Date();

  useEffect(() => {
    let unmounted = false;
    const updateTime = () => {
      const diff = new Date(trade.expires_at) - new Date();
      if (diff <= 0) {
        if (!unmounted) setRemaining('00:00:00');
        return;
      }
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      const ss = s.toString().padStart(2, '0');

      if (!unmounted) setRemaining(hh + ':' + mm + ':' + ss);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => { unmounted = true; clearInterval(interval); };
  }, [trade.expires_at]);

  useEffect(() => {
    if (trade.direction === 'UP') setDisplayProfit('+$' + (trade.amount_usd * 0.12).toFixed(2));
    else setDisplayProfit('-$' + (trade.amount_usd * 0.05).toFixed(2));
  }, [trade.amount_usd, trade.direction]);

  const isUp = trade.direction === 'UP';

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, background: isUp ? '#10b981' : '#ef4444' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px' }}>{trade.asset_pair}</span>
            <span style={{ fontSize: '0.7rem', color: '#8094ae', background: '#f4f6fb', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{trade.id.slice(0, 8)}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Projected Return: <strong style={{ color: isUp ? '#10b981' : '#ef4444' }}>{isUp ? '+85%' : '-10%'}</strong> ROI</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ background: isUp ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: isUp ? '#10b981' : '#ef4444', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className={"fas fa-arrow-" + (isUp ? "up" : "down")} />{trade.direction}
          </span>
          <span style={{ background: '#f4f6fb', color: '#002D72', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600 }}>{trade.leverage}x Leverage</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
        {[['Amount', '$' + Number(trade.amount_usd).toLocaleString(undefined, { minimumFractionDigits: 2 })], ['Strategy', trade.strategy], ['Entry Price', '$' + Number(trade.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })]].map(([label, val]) => (
          <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#8094ae', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1a2e' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Profit Range */}
      {displayProfit && (
        <div style={{ background: 'rgba(0,45,114,0.04)', border: '1px solid rgba(0,45,114,0.1)', borderRadius: 10, padding: '8px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-chart-line" style={{ color: '#002D72', fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.82rem', color: '#002D72', fontWeight: 600 }}>Projected Profit: {displayProfit}</span>
        </div>
      )}

      {/* Countdown */}
      <div style={{ background: expired ? 'rgba(100,116,139,0.08)' : urgent ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)', border: "1px solid " + (expired ? 'rgba(100,116,139,0.2)' : urgent ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'), borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className={"fas fa-" + (expired ? "check-circle" : "hourglass-half")} style={{ color: expired ? '#64748b' : urgent ? '#ef4444' : '#f59e0b' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#8094ae' }}>Time Remaining</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'Courier New, monospace', letterSpacing: '1px', color: expired ? '#64748b' : urgent ? '#ef4444' : '#f59e0b', animation: urgent && !expired ? 'none' : undefined }}>{remaining}</div>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#8094ae', textAlign: 'right' }}>
          <div>Opened: {new Date(trade.placed_at).toLocaleTimeString()}</div>
          <div>Expires: {new Date(trade.expires_at).toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
}

const CryptoHubPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab') || 'portfolio';

  const [activeTab, setActiveTab] = useState(tabParam);
  const [user, setUser] = useState(null);
  const [showFrozenPopup, setShowFrozenPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  const [isActivated, setIsActivated] = useState(false);
  const [activationStage, setActivationStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepTransitioning, setStepTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Wagmi hooks for real Web3 connectivity
  const { connectors, connectAsync, isPending: isLinkingWallet } = useConnect();
  const { address: linkedExternalWallet, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const [isConnecting, setIsConnecting] = useState(false);

  // Admin-placed trades
  const [userTrades, setUserTrades] = useState({ open_trades: [], closed_trades: [] });
  const [notifications, setNotifications] = useState([]);

  // Modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showTransferToBankModal, setShowTransferToBankModal] = useState(false);

  // Modal form states
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [modalAmount, setModalAmount] = useState('');
  const [withdrawDest, setWithdrawDest] = useState('account');
  const [externalWallet, setExternalWallet] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalProcessing, setModalProcessing] = useState(false);
  const [modalStep, setModalStep] = useState('input'); // 'input' or 'review'

  // Live Market Data state
  const [marketData, setMarketData] = useState(INITIAL_MARKET_DATA);

  const loadUserData = useCallback(async () => {
    const userId = sessionStorage.getItem('synox_user_id');
    if (!userId) { navigate('/login'); return; }

    const loadData = async () => {
      const userData = await SynoxDB.getUserById(userId);
      setUser(userData);
      setIsActivated(!!userData.crypto_wallet);
      if (userData.crypto_wallet) setWalletAddress(userData.crypto_wallet);
    };
    loadData();
  }, [navigate]);

  const loadUserTrades = useCallback(async () => {
    const userId = sessionStorage.getItem('synox_user_id');
    if (!userId) return;
    const trades = await SynoxDB.getUserTrades(userId);
    setUserTrades(trades);

    const notifs = await SynoxDB.getNotifications(userId);
    setNotifications(notifs);
  }, []);

  useEffect(() => {
    loadUserData();
    loadUserTrades();
    document.body.className = 'crypto-body';
    // Poll for new trades every 8 seconds
    const pollInterval = setInterval(async () => {
      // Auto-settle expired trades
      const trades = await SynoxDB.getUserTrades(sessionStorage.getItem('synox_user_id'));
      if (trades && trades.open_trades) {
        for (const trade of trades.open_trades) {
          if (new Date(trade.expires_at) <= Date.now()) {
            // Auto close trade
            await SynoxDB.closeTrade(trade.id);
          }
        }
      }

      loadUserData();
      loadUserTrades();
    }, 8000);

    // Fetch live market data
    const fetchMarketData = async () => {
      try {
        const res = await fetch(COINGECKO_API);
        const data = await res.json();
        const formattedData = {};
        for (const [id, stats] of Object.entries(data)) {
          formattedData[ASSET_MAP[id]] = stats;
        }
        setMarketData(prev => ({ ...prev, ...formattedData }));
      } catch (err) {
        console.error("Failed to fetch live market data", err);
      }
    };
    fetchMarketData();
    const marketInterval = setInterval(fetchMarketData, 60000); // 1 minute

    const handleUpdate = () => {
      loadUserData();
      loadUserTrades();
    };
    window.addEventListener('synox_updated', handleUpdate);

    return () => {
      document.body.className = '';
      clearInterval(pollInterval);
      clearInterval(marketInterval);
      window.removeEventListener('synox_updated', handleUpdate);
    };
  }, [loadUserData, loadUserTrades]);

  const connectRealWallet = async (providerName) => {
    setIsConnecting(true);
    let connector;

    // Wagmi Connectors search
    if (providerName.includes('MetaMask')) {
      connector = connectors.find(c => c.name.toLowerCase().includes('meta'));
      if (!connector) connector = connectors.find(c => c.id === 'injected');
    } else if (providerName.includes('Trust')) {
      connector = connectors.find(c => c.name.toLowerCase().includes('trust'));
      if (!connector) connector = connectors.find(c => c.id === 'injected');
    } else if (providerName.includes('Coinbase')) {
      connector = connectors.find(c => c.id === 'coinbaseWallet');
    } else if (providerName.includes('WalletConnect')) {
      connector = connectors.find(c => c.id === 'walletConnect');
    }

    try {
      if (connector) {
        await connectAsync({ connector });
      } else if (providerName === 'WalletConnect') {
        // Fallback for WalletConnect if specific connector missing
        await open();
      } else {
        alert(`${providerName} extension not detected. Please install it or use WalletConnect.`);
      }
    } catch (err) {
      console.error('Connection failed:', err);
      // alert(`Connection failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  /* ── Helpers ─────────────────────────────────────────────────── */
  const cryptoBalances = user?.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
  const totalCryptoValue = Object.entries(cryptoBalances).reduce(
    (sum, [key, amt]) => sum + amt * (marketData[key]?.usd || INITIAL_MARKET_DATA[key].usd), 0
  ) + (user?.trading_balance_total || 0);

  const resetModal = () => {
    setModalAmount('');
    setSelectedAsset('BTC');
    setWithdrawDest('account');
    setExternalWallet('');
    setModalSuccess(false);
    setModalProcessing(false);
    setModalStep('input');
  };

  const openModal = (type) => {
    resetModal();
    if (type === 'deposit') setShowDepositModal(true);
    if (type === 'withdraw') setShowWithdrawModal(true);
    if (type === 'buy') setShowBuyModal(true);
    if (type === 'toBank') setShowTransferToBankModal(true);
  };

  const closeAllModals = () => {
    setShowDepositModal(false);
    setShowWithdrawModal(false);
    setShowBuyModal(false);
    setShowTransferToBankModal(false);
    resetModal();
  };

  /* ── Transfer to Bank Handler ─────────────────────────────── */
  const handleTransferToBank = async () => {
    if (user.status === 'Frozen') {
      setShowFrozenPopup(true);
      return;
    }
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0 || amount > totalCryptoValue) return;
    setModalProcessing(true);
    setTimeout(async () => {
      const freshUser = await SynoxDB.getUserById(user.id);
      const freshCryptoBalances = freshUser.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
      const cryptoAmount = amount / (marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd);
      const newBalances = { ...freshCryptoBalances, [selectedAsset]: Math.max(0, (freshCryptoBalances[selectedAsset] || 0) - cryptoAmount) };
      // Only update crypto_balances here; addTransaction will handle the bank balance credit
      await SynoxDB.updateUser(user.id, { crypto_balances: newBalances, balance: freshUser.balance + amount });
      await SynoxDB.addNotification(user.id, 'Crypto to Bank Transfer', `Successfully transferred $${amount.toLocaleString()} worth of ${selectedAsset} to your bank account.`, 'bank');
      await SynoxDB.addNotification(user.id, 'Crypto Withdrawal to Bank', `Withdrawn $${amount.toLocaleString()} worth of ${selectedAsset} to bank account.`, 'crypto');
      setModalProcessing(false);
      setModalSuccess(true);
    }, 1500);
  };

  /* ── Activation Handler ──────────────────────────────────────── */
  const stepMessages = {
    2: 'Verifying identity...',
    3: 'Preparing agreements...',
    activate: 'Securing Node Connection...'
  };

  const goToStep = (nextStep) => {
    setStepTransitioning(true);
    setTransitionMsg(stepMessages[nextStep] || 'Processing...');
    setTimeout(() => {
      setActivationStage(nextStep);
      setStepTransitioning(false);
    }, 2000);
  };

  const handleActivate = async () => {
    setLoading(true);
    setTimeout(async () => {
      const updatedFullName = (firstName + ' ' + lastName).trim() || user.full_name;
      await SynoxDB.updateUser(user.id, {
        crypto_wallet: walletAddress || '0x' + Math.random().toString(16).slice(2, 42),
        crypto_enrolled: true,
        full_name: updatedFullName
      });
      await loadUserData();
      setIsActivated(true);
      setLoading(false);
    }, 3000);
  };

  /* ── Deposit Handler (Bank → Crypto) ─────────────────────────── */
  const handleDeposit = async () => {
    if (user.status === 'Frozen') {
      setShowFrozenPopup(true);
      return;
    }
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0 || amount > user.balance) return;
    setModalProcessing(true);
    setTimeout(async () => {
      const freshUser = await SynoxDB.getUserById(user.id);
      if (amount > freshUser.balance) return setModalProcessing(false); // Sanity check
      const freshCryptoBalances = freshUser.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
      const cryptoAmount = amount / (marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd);
      const newBalances = { ...freshCryptoBalances, [selectedAsset]: (freshCryptoBalances[selectedAsset] || 0) + cryptoAmount };
      await SynoxDB.updateUser(user.id, { crypto_balances: newBalances, balance: freshUser.balance - amount });
      await SynoxDB.addNotification(user.id, 'Crypto Deposit Successful', `You have successfully deposited $${amount.toLocaleString()} into ${selectedAsset} (${cryptoAmount.toFixed(6)} ${selectedAsset}).`, 'crypto');
      setModalProcessing(false);
      setModalSuccess(true);
    }, 1500);
  };

  /* ── Withdraw Handler ────────────────────────────────────────── */
  const handleWithdraw = async () => {
    if (user.status === 'Frozen') {
      setShowFrozenPopup(true);
      return;
    }
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0 || amount > totalCryptoValue) return;
    setModalProcessing(true);
    setTimeout(async () => {
      const freshUser = await SynoxDB.getUserById(user.id);
      const freshCryptoBalances = freshUser.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
      const cryptoAmount = amount / (marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd);
      const newBalances = { ...freshCryptoBalances, [selectedAsset]: Math.max(0, (freshCryptoBalances[selectedAsset] || 0) - cryptoAmount) };
      if (withdrawDest === 'account') {
        await SynoxDB.updateUser(user.id, { crypto_balances: newBalances, balance: freshUser.balance + amount });
        await SynoxDB.addNotification(user.id, 'Crypto Withdrawal', `Successfully withdrawn $${amount.toLocaleString()} worth of ${selectedAsset} to your bank account.`, 'bank');
        await SynoxDB.addNotification(user.id, 'Crypto Withdrawal to Bank', `Withdrawn $${amount.toLocaleString()} worth of ${selectedAsset} from crypto portfolio.`, 'crypto');
      } else {
        await SynoxDB.updateUser(user.id, { crypto_balances: newBalances });
        await SynoxDB.addNotification(user.id, 'External Crypto Withdrawal', `Withdrawal of $${amount.toLocaleString()} worth of ${selectedAsset} to your external wallet has been initiated.`, 'crypto');
      }
      setModalProcessing(false);
      setModalSuccess(true);
    }, 1500);
  };

  /* ── Buy Handler ─────────────────────────────────────────────── */
  const handleBuy = async () => {
    if (user.status === 'Frozen') {
      setShowFrozenPopup(true);
      return;
    }
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0 || amount > user.balance) return;
    setModalProcessing(true);
    setTimeout(async () => {
      const freshUser = await SynoxDB.getUserById(user.id);
      if (amount > freshUser.balance) return setModalProcessing(false);
      const freshCryptoBalances = freshUser.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
      const cryptoAmount = amount / (marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd);
      const newBalances = { ...freshCryptoBalances, [selectedAsset]: (freshCryptoBalances[selectedAsset] || 0) + cryptoAmount };
      await SynoxDB.updateUser(user.id, { crypto_balances: newBalances, balance: freshUser.balance - amount });
      await SynoxDB.addNotification(user.id, 'Crypto Purchase', `You purchased ${cryptoAmount.toFixed(6)} ${selectedAsset} for $${amount.toLocaleString()}.`, 'crypto');
      setModalProcessing(false);
      setModalSuccess(true);
    }, 1500);
  };

  if (!user) return null;

  /* ════════════════════════════════════════════════════════════════
     ACTIVATION FLOW
     ════════════════════════════════════════════════════════════════ */
  if (!isActivated) {
    return (
      <DashboardLayout>
        <div className="crypto-activation-wrapper">
          <div className="crypto-activation-card text-center text-white">
            {loading ? (
              <div className="crypto-loading-view">
                <div className="crypto-spinner"></div>
                <div className="crypto-loading-title">Securing Node Connection...</div>
                <div className="crypto-loading-subtitle">Initializing military-grade encryption protocols</div>
              </div>
            ) : (
              <>
                <div className="crypto-activation-icon">
                  <i className="fab fa-bitcoin"></i>
                </div>
                <div className="crypto-activation-title">Activate Crypto Portfolio</div>
                <div className="crypto-activation-subtitle">Unlock institutional trading tools and deep liquidity pools.</div>

                <div className="crypto-activation-form-card text-left">
                  {/* Step Progress */}
                  {stepTransitioning ? (
                    <div className="crypto-step-transition">
                      <div className="crypto-step-transition-spinner"></div>
                      <div className="crypto-step-transition-text">{transitionMsg}</div>
                    </div>
                  ) : (
                    <>
                      <div className="crypto-step-progress">
                        <div className="crypto-step-progress-line">
                          <div className="crypto-step-progress-fill" style={{ width: `${(activationStage - 1) * 50}%` }}></div>
                        </div>
                        {[1, 2, 3].map(step => (
                          <div key={step} className={`crypto-step-dot ${activationStage > step ? 'completed' : activationStage === step ? 'active' : 'inactive'}`}>
                            {activationStage > step ? <i className="fas fa-check" style={{ fontSize: '0.7rem' }}></i> : step}
                          </div>
                        ))}
                      </div>

                      {/* Stage 1 */}
                      {activationStage === 1 && (
                        <div className="crypto-stage-enter">
                          <div className="crypto-stage-heading">Institutional Onboarding</div>
                          <div style={{ marginBottom: '14px' }}>
                            <label className="crypto-activation-label">Client First Name</label>
                            <input type="text" className="crypto-activation-input form-control" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Legal First Name" />
                          </div>
                          <div style={{ marginBottom: '20px' }}>
                            <label className="crypto-activation-label">Client Last Name</label>
                            <input type="text" className="crypto-activation-input form-control" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Legal Last Name" />
                          </div>
                          <button className="crypto-btn-primary" onClick={() => goToStep(2)} disabled={!firstName || !lastName || stepTransitioning}>
                            Confirm & Continue <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
                          </button>
                        </div>
                      )}

                      {/* Stage 2 */}
                      {activationStage === 2 && (
                        <div className="crypto-stage-enter">
                          <div className="crypto-stage-heading">Step 2: Add Wallet Address</div>
                          <div style={{ marginBottom: '20px' }}>
                            <label className="crypto-activation-label">Settle-In Wallet Address (BTC/ETH/USDT)</label>
                            <input type="text" className="crypto-activation-input form-control" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="0x... or BTC Public Key" style={{ fontFamily: 'monospace' }} />
                            <small style={{ fontSize: '0.7rem', color: '#8094ae', display: 'block', marginTop: '8px', paddingLeft: '2px' }}>Linked for automated weekly profit distributions.</small>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="crypto-btn-secondary" style={{ flex: 1 }} onClick={() => goToStep(1)} disabled={stepTransitioning}>Back</button>
                            <button className="crypto-btn-primary" style={{ flex: 1 }} onClick={() => goToStep(3)} disabled={stepTransitioning}>Continue</button>
                          </div>
                        </div>
                      )}

                      {/* Stage 3 */}
                      {activationStage === 3 && (
                        <div className="crypto-stage-enter">
                          <div className="crypto-stage-heading">Risk Acknowledgement</div>
                          <div className="crypto-terms-box">
                            <p style={{ marginBottom: '8px' }}>Institutional Trading Agreement: By activating, you authorize Synox's algorithmic desks to manage asset distribution. Capital at risk.</p>
                            <p style={{ marginBottom: 0 }}>Withdrawals are subject to T+1 settlement rules and network congestion. Secure vaulting is active.</p>
                          </div>
                          <label className="crypto-checkbox-label">
                            <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
                            Agree to Institutional Terms
                          </label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="crypto-btn-secondary" style={{ flex: '0 0 38%' }} onClick={() => goToStep(2)} disabled={stepTransitioning}>Back</button>
                            <button className="crypto-btn-primary" style={{ flex: 1 }} onClick={handleActivate} disabled={!agreedToTerms || stepTransitioning}>
                              Finalize Activation
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="crypto-security-badge">
                        <i className="fas fa-shield-alt"></i> AES-256 HSM Secured
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     MAIN DASHBOARD VIEW
     ════════════════════════════════════════════════════════════════ */
  const cryptoSidebarOverride = (
    <>
      <div className="px-4 py-3 mb-2">
        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8094ae', opacity: 0.8 }}>Crypto Ecosystem</div>
      </div>
      <button className={`list-group-item list-group-item-action py-3 px-4 fw-bold border-0 ${activeTab === 'portfolio' ? 'active shadow-sm' : ''}`} onClick={() => { setActiveTab('portfolio'); navigate('/dashboard/crypto?tab=portfolio', { replace: true }); }} style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: activeTab === 'portfolio' ? 'rgba(0,45,114,0.05)' : 'transparent', color: activeTab === 'portfolio' ? '#002D72' : '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-chart-pie me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Portfolio
      </button>
      <Link to="/dashboard/deposit" className="list-group-item list-group-item-action py-3 px-4 fw-bold border-0" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'transparent', color: '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-arrow-down me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Deposit
      </Link>
      <Link to="/dashboard/withdraw" className="list-group-item list-group-item-action py-3 px-4 fw-bold border-0" style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: 'transparent', color: '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-arrow-up me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Withdraw
      </Link>
      <button className={`list-group-item list-group-item-action py-3 px-4 fw-bold border-0 ${activeTab === 'history' ? 'active shadow-sm' : ''}`} onClick={() => { setActiveTab('history'); navigate('/dashboard/crypto?tab=history', { replace: true }); }} style={{ fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: activeTab === 'history' ? 'rgba(0,45,114,0.05)' : 'transparent', color: activeTab === 'history' ? '#002D72' : '#495057', borderRadius: '12px', margin: '0 10px 4px', width: 'auto' }}>
        <i className="fas fa-history me-3" style={{ width: '20px', fontSize: '1.1rem', textAlign: 'center' }}></i> Trading History
      </button>

      <div className="mt-auto px-2 mb-3">
        <button onClick={(e) => { e.preventDefault(); if (window.Tawk_API) { window.Tawk_API.showWidget(); window.Tawk_API.maximize(); } }} className="list-group-item list-group-item-action py-3 px-3 fw-bold border-0 w-100" style={{ fontSize: '0.95rem', backgroundColor: 'transparent', color: '#4361ee', borderRadius: '12px' }}>
          <i className="fas fa-headset me-2"></i> Contact Support
        </button>
        <Link to="/dashboard" className="list-group-item list-group-item-action py-3 px-3 fw-bold border-0 text-primary w-100 mt-2" style={{ fontSize: '0.95rem', backgroundColor: 'rgba(67, 97, 238, 0.05)', borderRadius: '12px', transition: 'all 0.2s ease' }}>
          <i className="fas fa-arrow-left me-2"></i> Return to Bank
        </Link>
        <button onClick={(e) => { e.preventDefault(); sessionStorage.clear(); navigate('/login'); }} className="list-group-item list-group-item-action py-3 px-3 fw-bold border-0 text-danger w-100 mt-2" style={{ fontSize: '0.95rem', backgroundColor: 'transparent', borderRadius: '12px' }}>
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <DashboardLayout sidebarOverride={cryptoSidebarOverride}>
        <div className="crypto-page pt-2 pt-lg-4">
          <div className="row justify-content-center">
            <div className="col-12">
              {activeTab === 'portfolio' && (
                <>
                  {(() => {
                    const openTradesProfit = (userTrades?.open_trades || []).reduce((sum, t) => sum + (parseFloat(t.profit_override) || 0), 0);
                    const totalTradingProfit = (user.trading_balance_profit || 0) + openTradesProfit;
                    return (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div className="crypto-balance-card" style={{ marginBottom: 0 }}>
                            <div className="position-absolute" style={{ top: '-20px', right: '-20px', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }}>
                              <i className="fab fa-bitcoin text-white" style={{ fontSize: '180px' }}></i>
                            </div>
                            <div className="crypto-balance-header">
                              <div>
                                <div className="crypto-balance-label">Deposit Balance</div>
                                <div className="crypto-balance-greeting">Funds deposited</div>
                              </div>
                              <div className="crypto-balance-eye" onClick={() => setShowBalance(!showBalance)}>
                                <i className={`fas ${showBalance ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                              </div>
                            </div>
                            <div className="crypto-balance-amount">
                              {showBalance ? `$${(user.deposit_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                            </div>
                            <div className="crypto-balance-change">
                              <i className="fas fa-wallet"></i> Total Deposited
                            </div>
                          </div>

                          <div className="crypto-balance-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.2)', marginBottom: 0 }}>
                            <div className="position-absolute" style={{ top: '-20px', right: '-20px', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }}>
                              <i className="fas fa-chart-line text-white" style={{ fontSize: '180px' }}></i>
                            </div>
                            <div className="crypto-balance-header">
                              <div>
                                <div className="crypto-balance-label">Profit Balance</div>
                                <div className="crypto-balance-greeting">Trading Returns</div>
                              </div>
                            </div>
                            <div className="crypto-balance-amount" style={{ color: '#10b981' }}>
                              {showBalance ? `$${totalTradingProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                            </div>
                            <div className="crypto-balance-change" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                              <i className="fas fa-arrow-up"></i> Generated from trades
                            </div>
                          </div>
                        </div>

                        {/* Signal Strength Widget */}
                        <div style={{ background: '#ffffff', borderRadius: 16, padding: '20px', marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Trading Signal Strength</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Current market confidence</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ position: 'relative', width: 50, height: 50 }}>
                              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={(user.signal_strength || 0) > 60 ? '#10b981' : (user.signal_strength || 0) > 30 ? '#f59e0b' : '#ef4444'} strokeWidth="4" strokeDasharray={`${user.signal_strength || 0}, 100`} style={{ transition: 'stroke-dasharray 1s ease' }} />
                              </svg>
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#1a1a2e' }}>
                                {user.signal_strength || 0}%
                              </div>
                            </div>
                            <div style={{ background: (user.signal_strength || 0) > 60 ? 'rgba(16,185,129,0.1)' : (user.signal_strength || 0) > 30 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: (user.signal_strength || 0) > 60 ? '#10b981' : (user.signal_strength || 0) > 30 ? '#f59e0b' : '#ef4444', padding: '6px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                              {(user.signal_strength || 0) > 60 ? 'Strong' : (user.signal_strength || 0) > 30 ? 'Moderate' : 'Weak'}
                            </div>
                          </div>
                        </div>
                        <div className="crypto-action-buttons d-lg-none">
                          <button className="crypto-action-btn" onClick={() => navigate('/dashboard/deposit')}>
                            <div className="crypto-action-btn-icon deposit"><i className="fas fa-arrow-down"></i></div>
                            <span className="crypto-action-btn-label">Deposit</span>
                          </button>
                          <button className="crypto-action-btn" onClick={() => navigate('/dashboard/withdraw')}>
                            <div className="crypto-action-btn-icon withdraw"><i className="fas fa-arrow-up"></i></div>
                            <span className="crypto-action-btn-label">Withdraw</span>
                          </button>
                          <button className="crypto-action-btn" onClick={() => openModal('toBank')}>
                            <div className="crypto-action-btn-icon" style={{ background: 'rgba(0,45,114,0.1)', color: '#002D72' }}><i className="fas fa-university"></i></div>
                            <span className="crypto-action-btn-label">To Bank</span>
                          </button>
                        </div>
                        <div className="crypto-stats-grid mt-4 mt-lg-0">
                          {[
                            { label: 'Total Profit', value: `$${totalTradingProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'fa-chart-line' },
                            { label: 'Open Trades', value: userTrades.open_trades?.length || 0, icon: 'fa-clock', onClick: () => setActiveTab('trades') },
                            { label: 'Closed Trades', value: userTrades.closed_trades?.length || 0, icon: 'fa-check-circle', onClick: () => setActiveTab('history') },
                            { label: 'Institutional Tier', value: 'Level 4 Plus', icon: 'fa-shield-alt' }
                          ].map((stat, i) => (
                            <div key={i} className="crypto-stat-card" onClick={stat.onClick} style={stat.onClick ? { cursor: 'pointer' } : {}}>
                              <div className="crypto-stat-icon-row">
                                <div className="crypto-stat-icon"><i className={`fas ${stat.icon}`}></i></div>
                                <span className="crypto-stat-label">{stat.label}</span>
                              </div>
                              <div className="crypto-stat-value">{stat.value}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </>
              )}

              {activeTab === 'trades' && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-dark">Active Trades</h5>
                    <span className="badge bg-primary rounded-pill px-3 py-2">{userTrades.open_trades?.length || 0} Open</span>
                  </div>

                  {(!userTrades.open_trades || userTrades.open_trades.length === 0) ? (
                    <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
                      <div className="mb-3">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: '60px', height: '60px' }}>
                          <i className="fas fa-chart-line text-muted fs-3"></i>
                        </div>
                      </div>
                      <h6 className="fw-bold text-dark">No Active Trades</h6>
                      <p className="text-muted small">Your open market positions will appear here.</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {userTrades.open_trades.map(trade => (
                        <div key={trade.id} className="col-12 col-md-6 col-lg-4">
                          <div className="bg-white rounded-4 p-4 border shadow-sm position-relative overflow-hidden h-100">
                            <div className="position-absolute top-0 end-0 p-3">
                              <span className={`badge ${trade.direction === 'BUY' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${trade.direction === 'BUY' ? 'text-success' : 'text-danger'} rounded-pill fw-bold`}>
                                {trade.direction}
                              </span>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                <i className={`fab fa-${trade.asset_pair?.split('/')[0]?.toLowerCase() === 'btc' ? 'bitcoin' : trade.asset_pair?.split('/')[0]?.toLowerCase() === 'eth' ? 'ethereum' : 'ethereum'} fs-5 text-primary`}></i>
                              </div>
                              <div>
                                <h6 className="fw-bold mb-0 text-dark">{trade.asset_pair}</h6>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{trade.strategy || 'Standard'} • {trade.leverage}x</div>
                              </div>
                            </div>

                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <div className="p-2 bg-light rounded-3">
                                  <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Amount</div>
                                  <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>${trade.amount_usd.toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="p-2 bg-light rounded-3">
                                  <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Unrealized</div>
                                  <div className={`fw-bold ${trade.profit_override >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.85rem' }}>
                                    {trade.profit_override >= 0 ? '+' : ''}${(trade.profit_override || 0).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                              <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                <i className="far fa-clock me-1"></i> Expires: {new Date(trade.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="spinner-grow text-success spinner-grow-sm me-2" role="status" style={{ width: '0.5rem', height: '0.5rem' }}></div>
                                <span className="fw-bold text-success" style={{ fontSize: '0.75rem' }}>LIVE</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-dark">Trading History</h5>
                    <span className="badge bg-secondary rounded-pill px-3 py-2">{userTrades.closed_trades?.length || 0} Records</span>
                  </div>

                  {(!userTrades.closed_trades || userTrades.closed_trades.length === 0) ? (
                    <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
                      <div className="mb-3">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" style={{ width: '60px', height: '60px' }}>
                          <i className="fas fa-history text-muted fs-3"></i>
                        </div>
                      </div>
                      <h6 className="fw-bold text-dark">No Trading History</h6>
                      <p className="text-muted small">Your settled trades will appear here.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th className="text-muted text-uppercase fw-bold border-0 py-3 ps-4" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Asset/Strategy</th>
                              <th className="text-muted text-uppercase fw-bold border-0 py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Type</th>
                              <th className="text-muted text-uppercase fw-bold border-0 py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Amount</th>
                              <th className="text-muted text-uppercase fw-bold border-0 py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>P/L</th>
                              <th className="text-muted text-uppercase fw-bold border-0 py-3 text-end pe-4" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Date Settled</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userTrades.closed_trades.map(trade => (
                              <tr key={trade.id}>
                                <td className="py-3 ps-4">
                                  <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                                      <i className={`fab fa-${trade.asset_pair?.split('/')[0]?.toLowerCase() === 'btc' ? 'bitcoin' : 'ethereum'} text-dark`}></i>
                                    </div>
                                    <div>
                                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{trade.asset_pair}</div>
                                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{trade.strategy}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <span className={`badge ${trade.direction === 'BUY' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${trade.direction === 'BUY' ? 'text-success' : 'text-danger'} fw-bold`}>
                                    {trade.direction}
                                  </span>
                                </td>
                                <td className="py-3">
                                  <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>${trade.amount_usd.toLocaleString()}</div>
                                </td>
                                <td className="py-3">
                                  <div className={`fw-bold ${trade.profit >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.9rem' }}>
                                    {trade.profit >= 0 ? '+' : ''}${(trade.profit || 0).toLocaleString()}
                                  </div>
                                </td>
                                <td className="py-3 text-end pe-4">
                                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                    {new Date(trade.closed_at).toLocaleDateString()}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Account Frozen Bottom Popup */}
      {showFrozenPopup && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, backdropFilter: 'blur(4px)' }}
            onClick={() => { setShowFrozenPopup(false); navigate('/dashboard'); }}
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
                <h3 className="fw-bold mb-2">Trading Restricted</h3>
                <p className="text-muted mb-4">
                  For your protection, this account has been <strong>frozen for security reasons</strong>. All crypto transactions and trading are temporarily suspended.
                </p>
                <div className="bg-light p-3 rounded-4 text-start mb-4 border border-danger border-opacity-10">
                  <p className="mb-0 small text-danger fw-bold"><i className="fas fa-info-circle me-2"></i>Further Assistance Required</p>
                  <p className="mb-0 small text-muted">Please contact our customer live service or your account manager for further assistance and to resolve this restriction.</p>
                </div>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary py-3 fw-bold rounded-pill"
                    style={{ background: '#002D72', border: 'none' }}
                    onClick={() => { setShowFrozenPopup(false); if (window.Tawk_API) { window.Tawk_API.showWidget(); window.Tawk_API.maximize(); } }}
                  >
                    Contact Live Support
                  </button>
                  <button className="btn btn-link text-muted text-decoration-none fw-bold" onClick={() => { setShowFrozenPopup(false); navigate('/dashboard'); }}>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transfer to Bank Modal */}
      {showTransferToBankModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, backdropFilter: 'blur(4px)' }}
            onClick={closeAllModals}
          ></div>
          <div
            className="position-fixed bottom-0 start-0 w-100 bg-white shadow-lg p-4"
            style={{
              zIndex: 3001,
              borderTopLeftRadius: '30px',
              borderTopRightRadius: '30px',
              animation: 'slideUp 0.4s ease-out forwards',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div className="container" style={{ maxWidth: '500px' }}>
              <div className="text-center mb-3">
                <div className="mx-auto bg-light mb-3" style={{ width: '50px', height: '6px', borderRadius: '3px' }}></div>
              </div>

              {modalSuccess ? (
                <div className="text-center py-4 animate__animated animate__zoomIn">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg" style={{ width: '70px', height: '70px' }}>
                    <i className="fas fa-check fs-3"></i>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#002d72' }}>Transfer Complete</h5>
                  <p className="text-muted small mb-4">Funds have been moved to your bank account instantly.</p>
                  <button className="btn-premium-navy w-100 py-3" onClick={closeAllModals}>
                    Done <i className="fas fa-check-circle ms-2"></i>
                  </button>
                </div>
              ) : modalProcessing ? (
                <div className="text-center py-5">
                  <div className="spinner-border mb-4" style={{ width: '3rem', height: '3rem', color: '#002d72', borderWidth: '3px' }} role="status"></div>
                  <h5 className="fw-bold mb-2" style={{ color: '#002d72' }}>Processing Transfer</h5>
                  <p className="text-muted small">Moving funds to your bank account...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', background: 'rgba(0,45,114,0.1)' }}>
                      <i className="fas fa-university fs-4" style={{ color: '#002d72' }}></i>
                    </div>
                    <h5 className="fw-bold mb-1">Transfer to Bank</h5>
                    <p className="text-muted small">Move funds from your crypto portfolio to your bank account</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Select Asset</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {Object.entries(cryptoBalances).filter(([, amt]) => amt > 0).map(([asset]) => (
                        <button
                          key={asset}
                          className={`btn btn-sm px-3 py-2 fw-bold rounded-pill ${selectedAsset === asset ? 'btn-primary' : 'btn-outline-secondary'}`}
                          style={selectedAsset === asset ? { background: '#002d72', border: 'none' } : {}}
                          onClick={() => setSelectedAsset(asset)}
                        >
                          {asset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Amount (USD)</label>
                    <div className="bg-light rounded-3 p-1">
                      <div className="input-group">
                        <span className="input-group-text bg-transparent border-0 fw-bold text-muted">$</span>
                        <input
                          type="number"
                          className="form-control bg-transparent border-0 py-3 fs-4 fw-bold"
                          placeholder="0.00"
                          value={modalAmount}
                          onChange={(e) => setModalAmount(e.target.value)}
                          style={{ color: '#002d72' }}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Available: ${totalCryptoValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <button className="btn btn-link btn-sm p-0 text-decoration-none fw-bold" style={{ color: '#002d72', fontSize: '0.75rem' }} onClick={() => setModalAmount(String(totalCryptoValue.toFixed(2)))}>Max</button>
                    </div>
                    {modalAmount && parseFloat(modalAmount) > totalCryptoValue && (
                      <div className="text-danger small mt-1 fw-bold">
                        <i className="fas fa-exclamation-circle me-1"></i> Exceeds available balance
                      </div>
                    )}
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <button
                      className="btn-premium-navy w-100 py-3 d-flex justify-content-center align-items-center"
                      disabled={!modalAmount || parseFloat(modalAmount) <= 0 || parseFloat(modalAmount) > totalCryptoValue}
                      onClick={handleTransferToBank}
                    >
                      Transfer to Bank <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                    <button className="btn btn-link text-muted fw-bold text-decoration-none" onClick={closeAllModals}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CryptoHubPage;
