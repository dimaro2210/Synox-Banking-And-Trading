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
            <span style={{ fontSize: '0.7rem', color: '#8094ae', background: '#f4f6fb', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{trade.id.slice(0,8)}</span>
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

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  const [user, setUser] = useState(null);
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

  const navigate = useNavigate();

  const loadUserData = useCallback(async () => {
    const userId = sessionStorage.getItem('synox_user_id');
    if (!userId) { navigate('/login'); return; }
    const userData = await SynoxDB.getUserById(userId);
    setUser(userData);
    setIsActivated(!!userData.crypto_wallet);
    if (userData.crypto_wallet) setWalletAddress(userData.crypto_wallet);
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
    const amount = parseFloat(modalAmount);
    if (!amount || amount <= 0 || amount > totalCryptoValue) return;
    setModalProcessing(true);
    setTimeout(async () => {
      const freshUser = await SynoxDB.getUserById(user.id);
      const freshCryptoBalances = freshUser.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 };
      const cryptoAmount = amount / (marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd);
      const newBalances = { ...freshCryptoBalances, [selectedAsset]: Math.max(0, (freshCryptoBalances[selectedAsset] || 0) - cryptoAmount) };
      await SynoxDB.updateUser(user.id, { crypto_balances: newBalances, balance: freshUser.balance + amount });
      await SynoxDB.addTransaction(user.id, 'credit', amount, `Crypto to Bank Transfer — ${selectedAsset}`);
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
      await SynoxDB.updateUser(user.id, {
        crypto_wallet: walletAddress || '0x' + Math.random().toString(16).slice(2, 42),
        first_name: firstName,
        last_name: lastName
      });
      await loadUserData();
      setIsActivated(true);
      setLoading(false);
    }, 3000);
  };

  /* ── Deposit Handler (Bank → Crypto) ─────────────────────────── */
  const handleDeposit = async () => {
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
     MOCK DATABASES
     ════════════════════════════════════════════════════════════════ */
  const mockCryptoTxs = [
    { id: 1, type: 'credit', asset: 'BTC', amount: '0.025', value: '+$1,605.25', date: 'Today, 10:45 AM', desc: 'Yield Distribution', status: 'completed' },
    { id: 2, type: 'credit', asset: 'ETH', amount: '1.200', value: '+$4,140.00', date: 'Yesterday', desc: 'Secure Vault Deposit', status: 'completed' },
    { id: 3, type: 'debit', asset: 'USDT', amount: '500.00', value: '-$500.00', date: 'Mar 15, 2024', desc: 'Algorithmic Rebalancing', status: 'completed' },
    { id: 4, type: 'credit', asset: 'SOL', amount: '15.000', value: '+$2,175.00', date: 'Mar 12, 2024', desc: 'Purchased Solana', status: 'completed' },
    { id: 5, type: 'debit', asset: 'BTC', amount: '0.010', value: '-$642.10', date: 'Mar 10, 2024', desc: 'Withdrawal to External', status: 'pending' }
  ];

  const mockCryptoNotifications = [
    { id: 1, title: 'Price Alert: BTC', desc: 'Bitcoin is up 5.2% in the last 24 hours.', date: 'Just now', icon: 'fa-chart-line', isRead: false },
    { id: 2, title: 'Yield Distribution', desc: 'Your weekly staking yield of 0.025 BTC has been credited.', date: 'Today, 10:45 AM', icon: 'fa-hand-holding-usd', isRead: false },
    { id: 3, title: 'Security Notice', desc: 'New login detected on your Crypto Hub from IP 192.168.1.1.', date: 'Yesterday', icon: 'fa-shield-alt', isRead: true },
    { id: 4, title: 'Algorithm Update', desc: 'Our trading algorithm has automatically rebalanced your USDT allocation.', date: 'Mar 15, 2024', icon: 'fa-robot', isRead: true }
  ];

  /* ════════════════════════════════════════════════════════════════
     MODAL COMPONENT
     ════════════════════════════════════════════════════════════════ */
  const renderModal = (type) => {
    const isDeposit = type === 'deposit';
    const isWithdraw = type === 'withdraw';
    const isBuy = type === 'buy';
    const isToBank = type === 'toBank';
    const title = isDeposit ? 'Deposit to Crypto' : isWithdraw ? 'Withdraw Crypto' : isToBank ? 'Transfer to Bank' : 'Buy Crypto';
    const assets = isBuy ? ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'] : ['BTC', 'ETH', 'USDT'];
    const amount = parseFloat(modalAmount) || 0;

    let maxAmount = 0;
    if (isDeposit || isBuy) maxAmount = user.balance;
    if (isWithdraw || isToBank) maxAmount = totalCryptoValue;

    const estCrypto = amount > 0 ? (amount / (marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd)).toFixed(6) : '0.000000';
    const isValid = amount > 0 && amount <= maxAmount && (!isWithdraw || withdrawDest !== 'external' || externalWallet.length > 10);
    const onConfirm = isDeposit ? handleDeposit : isWithdraw ? handleWithdraw : isToBank ? handleTransferToBank : handleBuy;

    return (
      <div className="crypto-modal-overlay" onClick={closeAllModals}>
        <div className="crypto-modal-sheet" onClick={e => e.stopPropagation()}>
          <div className="crypto-modal-handle"></div>
          <div className="crypto-modal-header">
            <div className="crypto-modal-title">{title}</div>
            <button className="crypto-modal-close" onClick={closeAllModals}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="crypto-modal-body">
            {modalSuccess ? (
              <div className="crypto-modal-success">
                <div className="crypto-modal-success-icon">
                  <i className="fas fa-check"></i>
                </div>
                <div className="crypto-modal-success-title">Transaction Successful</div>
                <div className="crypto-modal-success-msg">
                  {isDeposit && (
                    <div className="text-center">
                      <div className="mb-2">Your deposit of <strong className="text-dark">${amount.toFixed(2)}</strong> has been processed.</div>
                      <div className="badge bg-success-subtle text-success py-2 px-3 rounded-pill">+{estCrypto} {selectedAsset} credited</div>
                    </div>
                  )}
                  {isWithdraw && (
                    <div className="text-center">
                      <div className="mb-2">Withdrawal of <strong className="text-dark">${amount.toFixed(2)}</strong> worth of {selectedAsset} initiated.</div>
                      <div className="badge bg-info-subtle text-info py-2 px-3 rounded-pill">Status: PENDING SETTLEMENT</div>
                    </div>
                  )}
                  {isBuy && (
                    <div className="text-center">
                      <div className="mb-2">Purchase of <strong className="text-dark">{estCrypto} {selectedAsset}</strong> for <strong className="text-dark">${amount.toFixed(2)}</strong> completed.</div>
                      <div className="badge bg-success-subtle text-success py-2 px-3 rounded-pill">Order Filled @ ${(marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd).toLocaleString()}</div>
                    </div>
                  )}
                  {isToBank && (
                    <div className="text-center">
                      <div className="mb-2"><strong className="text-dark">${amount.toFixed(2)}</strong> has been transferred to your bank account.</div>
                      <div className="badge bg-success-subtle text-success py-2 px-3 rounded-pill">Bank Balance Updated</div>
                    </div>
                  )}
                </div>
                <button className="crypto-modal-confirm-btn success py-3" onClick={closeAllModals}>
                  Back to Dashboard <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            ) : modalStep === 'review' ? (
              <div className="crypto-modal-review-step animate__animated animate__fadeIn">
                <div className="text-center mb-4">
                  <div className="crypto-modal-review-icon">
                    <i className={isDeposit ? 'fas fa-arrow-down text-success' : isWithdraw ? 'fas fa-arrow-up text-danger' : 'fas fa-cart-plus text-primary'}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>Review {title}</h6>
                  <p className="text-muted small">Verify the details before finalizing.</p>
                </div>

                <div className="crypto-review-table mb-4 shadow-sm">
                  <div className="crypto-review-row">
                    <span className="label">Asset to {isBuy ? 'Purchase' : isDeposit ? 'Deposit' : isToBank ? 'Transfer' : 'Withdraw'}</span>
                    <span className="value fw-bold"><i className={CRYPTO_META[selectedAsset]?.icon || 'fas fa-coins'} style={{ color: '#002D72' }}></i> {selectedAsset}</span>
                  </div>
                  <div className="crypto-review-row">
                    <span className="label">USD Value</span>
                    <span className="value fw-bold">${amount.toFixed(2)}</span>
                  </div>
                  <div className="crypto-review-row">
                    <span className="label">Est. Quantity</span>
                    <span className="value text-primary fw-bold">≈ {estCrypto} {selectedAsset}</span>
                  </div>
                  {isWithdraw && (
                    <div className="crypto-review-row">
                      <span className="label">Destination</span>
                      <span className="value text-truncate" style={{ maxWidth: '140px' }}>{withdrawDest === 'account' ? 'Bank Account' : externalWallet}</span>
                    </div>
                  )}
                  {isToBank && (
                    <div className="crypto-review-row">
                      <span className="label">Destination</span>
                      <span className="value"><i className="fas fa-university me-1"></i>Synox Bank Account</span>
                    </div>
                  )}
                  <div className="crypto-review-row">
                    <span className="label">Fee</span>
                    <span className="value text-success">0.00 USD</span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="crypto-modal-confirm-btn secondary py-3" style={{ flex: '0 0 35%' }} onClick={() => setModalStep('input')}>
                    Edit
                  </button>
                  <button className={`crypto-modal-confirm-btn ${isWithdraw ? 'danger' : ''} py-3`} onClick={onConfirm} disabled={modalProcessing}>
                    {modalProcessing ? (
                      <><div className="crypto-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0 }}></div> Processing...</>
                    ) : (
                      <>Confirm {isDeposit ? 'Deposit' : isWithdraw ? 'Withdraw' : isToBank ? 'Transfer' : 'Purchase'}</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Asset Selector */}
                <div className="crypto-amount-input-label" style={{ marginBottom: '8px' }}>Select Asset</div>
                <div className="crypto-asset-selector">
                  {assets.map(asset => (
                    <button key={asset} className={`crypto-asset-chip ${selectedAsset === asset ? 'selected' : ''}`} onClick={() => setSelectedAsset(asset)}>
                      <i className={CRYPTO_META[asset]?.icon || 'fas fa-coins'} style={{ fontSize: '0.85rem' }}></i>
                      {asset}
                    </button>
                  ))}
                </div>

                {/* Withdraw Destination */}
                {isWithdraw && (
                  <>
                    <div className="crypto-amount-input-label" style={{ marginBottom: '8px' }}>Withdraw To</div>
                    <div className="crypto-destination-options">
                      <div className={`crypto-destination-option ${withdrawDest === 'account' ? 'selected' : ''}`} onClick={() => setWithdrawDest('account')}>
                        <div className="crypto-destination-option-icon account">
                          <i className="fas fa-university"></i>
                        </div>
                        <div>
                          <div className="crypto-destination-option-name">Account Balance</div>
                          <div className="crypto-destination-option-desc">Credit to your Synox bank account</div>
                        </div>
                      </div>
                      <div className={`crypto-destination-option ${withdrawDest === 'external' ? 'selected' : ''}`} onClick={() => setWithdrawDest('external')}>
                        <div className="crypto-destination-option-icon external">
                          <i className="fas fa-wallet"></i>
                        </div>
                        <div>
                          <div className="crypto-destination-option-name">External Wallet</div>
                          <div className="crypto-destination-option-desc">Send to an external crypto wallet</div>
                        </div>
                      </div>
                    </div>
                    {withdrawDest === 'external' && (
                      <div className="crypto-amount-input-group" style={{ marginBottom: '16px' }}>
                        <label className="crypto-amount-input-label">Wallet Address</label>
                        <input type="text" className="crypto-amount-input" value={externalWallet} onChange={e => setExternalWallet(e.target.value)} placeholder="0x... or BTC address" style={{ fontSize: '0.85rem', fontFamily: 'monospace', height: '42px', borderRadius: '10px' }} />
                      </div>
                    )}
                  </>
                )}

                {/* Transfer to Bank info */}
                {isToBank && (
                  <div className="p-3 mb-3 rounded-3 d-flex gap-3" style={{ backgroundColor: 'rgba(0,45,114,0.04)', border: '1px solid rgba(0,45,114,0.1)' }}>
                    <i className="fas fa-university mt-1" style={{ color: '#002D72', fontSize: '0.85rem' }}></i>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Funds will be converted to USD at the current market rate and credited to your Synox bank account instantly.</div>
                  </div>
                )}

                {/* Amount Input */}
                <div className="crypto-amount-input-group">
                  <label className="crypto-amount-input-label">{isWithdraw ? 'Amount (USD value)' : 'Amount (USD)'}</label>
                  <div className="crypto-amount-input-row">
                    <span className="crypto-amount-currency">$</span>
                    <input type="number" className="crypto-amount-input" value={modalAmount} onChange={e => setModalAmount(e.target.value)} placeholder="0.00" min="0" />
                  </div>
                  <div className="crypto-amount-available">
                    Available: <strong>${maxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                </div>

                {/* Preview */}
                {amount > 0 && (
                  <div className="crypto-preview-section">
                    <div className="crypto-preview-row">
                      <span className="crypto-preview-label">Amount</span>
                      <span className="crypto-preview-value">${amount.toFixed(2)}</span>
                    </div>
                    <div className="crypto-preview-row">
                      <span className="crypto-preview-label">≈ {selectedAsset}</span>
                      <span className="crypto-preview-value">{estCrypto} {selectedAsset}</span>
                    </div>
                    <div className="crypto-preview-row">
                      <span className="crypto-preview-label">Rate</span>
                      <span className="crypto-preview-value">1 {selectedAsset} = ${(marketData[selectedAsset]?.usd || INITIAL_MARKET_DATA[selectedAsset].usd).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Confirm */}
                <button className={`crypto-modal-confirm-btn ${(isWithdraw || isToBank) ? 'danger' : ''} py-3`} onClick={() => setModalStep('review')} disabled={!isValid || modalProcessing}>
                  Continue to Review <i className="fas fa-chevron-right ms-1" style={{ fontSize: '0.7rem' }}></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

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
        <button onClick={(e) => { e.preventDefault(); if(window.Tawk_API){ window.Tawk_API.showWidget(); window.Tawk_API.maximize(); } }} className="list-group-item list-group-item-action py-3 px-3 fw-bold border-0 w-100" style={{ fontSize: '0.95rem', backgroundColor: 'transparent', color: '#4361ee', borderRadius: '12px' }}>
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
    <DashboardLayout
      sidebarOverride={cryptoSidebarOverride}
    >
      <div className="crypto-page pt-2 pt-lg-4">
        <div className="row justify-content-center">

          {/* Main Content Area */}
          <div className="col-12">

            {activeTab === 'portfolio' && (
              <>
                {/* Balance Card */}
                <div className="crypto-balance-card">
                  <div className="position-absolute" style={{ top: '-20px', right: '-20px', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }}>
                    <i className="fab fa-bitcoin text-white" style={{ fontSize: '240px' }}></i>
                  </div>
                  <div className="crypto-balance-header">
                    <div>
                      <div className="crypto-balance-label">Crypto Portfolio</div>
                      <div className="crypto-balance-greeting">Hello, {user.full_name?.split(' ')[0]}!</div>
                    </div>
                    <div className="crypto-balance-eye" onClick={() => setShowBalance(!showBalance)}>
                      <i className={`fas ${showBalance ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </div>
                  </div>
                  <div className="crypto-balance-amount">
                    {showBalance ? `$${totalCryptoValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                  </div>
                  <div className="crypto-balance-change">
                    <i className="fas fa-arrow-up"></i> +2.4% today
                  </div>
                </div>

                {/* Quick Action Buttons */}
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
                  <button className="crypto-action-btn" onClick={() => openModal('buy')}>
                    <div className="crypto-action-btn-icon buy"><i className="fas fa-cart-plus"></i></div>
                    <span className="crypto-action-btn-label">Buy</span>
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="crypto-stats-grid mt-4 mt-lg-0">
                  {[
                    { label: 'Total Profit', value: `$${(user.trading_balance_profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'fa-chart-line' },
                    { label: 'Open Trades', value: userTrades.open_trades.length, icon: 'fa-clock', onClick: () => setActiveTab('trades') },
                    { label: 'Closed Trades', value: userTrades.closed_trades.length, icon: 'fa-check-circle', onClick: () => setActiveTab('history') },
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

                {/* Portfolio Holdings */}
                <div className="crypto-section-title mt-4">Portfolio Holdings</div>
                <div className="crypto-holdings-list">
                  {Object.entries(cryptoBalances).filter(([, amt]) => amt > 0).map(([asset, amount]) => (
                    <div key={asset} className="crypto-holding-card">
                      <div className="crypto-holding-left">
                        <div className={`crypto-holding-icon ${CRYPTO_META[asset]?.cssClass || ''}`}>
                          <i className={CRYPTO_META[asset]?.icon || 'fas fa-coins'}></i>
                        </div>
                        <div>
                          <div className="crypto-holding-name">{CRYPTO_META[asset]?.name || asset}</div>
                          <div className="d-flex align-items-center gap-2">
                            <div className="crypto-holding-ticker">{asset}</div>
                            <div className={asset === 'BTC' || asset === 'SOL' ? 'price-pulse-up' : 'price-pulse-down'}>
                              <i className={`fas fa-caret-${asset === 'BTC' || asset === 'SOL' ? 'up' : 'down'} me-1`}></i>
                              {asset === 'BTC' ? '+1.2%' : asset === 'ETH' ? '-0.5%' : '+0.2%'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="crypto-holding-right">
                        <div className="crypto-holding-amount">{amount.toFixed(4)}</div>
                        <div className="crypto-holding-usd">${(amount * (marketData[asset]?.usd || INITIAL_MARKET_DATA[asset].usd)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  ))}
                  {Object.values(cryptoBalances).every(v => v === 0) && (
                    <div className="crypto-holding-card" style={{ justifyContent: 'center', padding: '32px', color: '#8094ae', textAlign: 'center', flexDirection: 'column', gap: '8px' }}>
                      <i className="fas fa-wallet" style={{ fontSize: '1.5rem', opacity: 0.3 }}></i>
                      <span style={{ fontSize: '0.85rem' }}>No holdings yet. Buy crypto to get started.</span>
                    </div>
                  )}
                </div>

                {/* Market Overview */}
                <div className="crypto-section-title mt-5">Market Overview</div>
                <div className="crypto-ticker-container" style={{ overflow: 'hidden', margin: '0 -20px 0 -8px', padding: '0 20px 24px 8px', position: 'relative' }}>
                  <div
                    className="crypto-ticker-track"
                    style={{
                      display: 'flex',
                      gap: '16px',
                      width: 'max-content',
                      animation: 'tickerMove 30s linear infinite'
                    }}
                  >
                    {[...['BTC', 'ETH', 'SOL', 'BNB'], ...['BTC', 'ETH', 'SOL', 'BNB'], ...['BTC', 'ETH', 'SOL', 'BNB']].map((asset, idx) => {
                      const data = marketData[asset] || INITIAL_MARKET_DATA[asset];
                      const change = data.usd_24h_change || 0;
                      const isUp = change >= 0;

                      return (
                        <div key={`${asset}-${idx}`} className="crypto-stat-card" style={{ flex: '0 0 auto', width: '280px', padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(0,45,114,0.08)' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(0,45,114,0.3)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(0,45,114,0.08)'} onClick={() => { setSelectedAsset(asset); openModal('buy'); }}>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className={`crypto-holding-icon ${CRYPTO_META[asset]?.cssClass || ''}`} style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                                <i className={CRYPTO_META[asset]?.icon || 'fas fa-coins'}></i>
                              </div>
                              <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{asset}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: isUp ? '#10b981' : '#ef4444', background: isUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                              <i className={`fas fa-arrow-${isUp ? 'up' : 'down'} me-1`}></i>
                              {Math.abs(change).toFixed(2)}%
                            </div>
                          </div>
                          <div className="fs-4 fw-bold" style={{ color: '#002D72', marginBottom: '12px' }}>
                            ${data.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid rgba(0,45,114,0.05)', paddingTop: '12px' }}>
                            <div>
                              <div style={{ fontSize: '0.7rem', color: '#8094ae', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Market Cap</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>
                                ${data.usd_market_cap ? (data.usd_market_cap / 1e9).toFixed(2) + 'B' : '--'}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.7rem', color: '#8094ae', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Volume (24h)</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>
                                ${data.usd_24h_vol ? (data.usd_24h_vol / 1e9).toFixed(2) + 'B' : '--'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <style>{`
                  @keyframes tickerMove {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-1184px); }
                  }
                  .crypto-ticker-track:hover {
                    animation-play-state: paused;
                  }
                `}</style>
              </>
            )}


            {/* Open Trades Tab */}
            {activeTab === 'trades' && (
              <>
                <div className="crypto-section-title">Open Trades</div>
                {userTrades.open_trades.length === 0 ? (
                  <div className="p-4 text-center" style={{ color: '#8094ae' }}>
                    <i className="fas fa-chart-line" style={{ fontSize: '2rem', opacity: 0.3, display: 'block', marginBottom: 10 }} />
                    No active trades at the moment.
                  </div>
                ) : userTrades.open_trades.map(trade => (
                  <OpenTradeCard key={trade.id} trade={trade} />
                ))}
              </>
            )}

            {/* Trading History Tab */}
            {activeTab === 'history' && (
              <>
                <div className="crypto-section-title">Trading History</div>
                <div className="crypto-activity-list">
                  {userTrades.closed_trades.length === 0 ? (
                    <div className="p-4 text-center" style={{ color: '#8094ae' }}>
                      <i className="fas fa-history" style={{ fontSize: '2rem', opacity: 0.3, display: 'block', marginBottom: 10 }} />
                      No completed trades yet.
                    </div>
                  ) : userTrades.closed_trades.map(trade => (
                    <div key={trade.id} className="crypto-activity-item">
                      <div className="crypto-activity-left">
                        <div className={`crypto-activity-icon ${(trade.profit || 0) >= 0 ? 'credit' : 'debit'}`}>
                          <i className={`fas fa-${trade.direction === 'UP' ? 'arrow-up' : 'arrow-down'}`}></i>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="crypto-activity-desc">{trade.asset_pair} — {trade.direction} ({trade.strategy})</div>
                          <div className="crypto-activity-meta">
                            {new Date(trade.closed_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {trade.leverage}x Leverage
                          </div>
                        </div>
                      </div>
                      <div className="crypto-activity-right text-end">
                        <div className={`crypto-activity-value ${(trade.profit || 0) >= 0 ? 'credit' : 'debit'}`}>
                          {(trade.profit || 0) >= 0 ? '+' : ''}${(trade.profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <span className="badge rounded-pill bg-success-subtle text-success" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '4px 8px' }}>SETTLED</span>
                          <div className="crypto-activity-sub">${(trade.amount_usd || 0).toLocaleString()} invested</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modals */}
        {showDepositModal && renderModal('deposit')}
        {showWithdrawModal && renderModal('withdraw')}
        {showBuyModal && renderModal('buy')}
        {showTransferToBankModal && renderModal('toBank')}
      </div>
    </DashboardLayout>
  );
};

export default CryptoHubPage;
