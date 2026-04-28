/**
 * SYNOX BANKING - LOCAL STORAGE DATA HANDLER
 * Enhanced with Admin Trading Functions
 */

const DEFAULTS = {
  users: [
    {
      id: "user-001",
      email: "demo@synox.com",
      password_hash: "password123",
      full_name: "David Smith",
      account_number: "7721883940",
      balance: 125450.75,
      currency: "USD",
      crypto_wallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      crypto_balances: {
        BTC: 0.1542,
        ETH: 2.5118,
        USDT: 5000.00
      },
      account_type: "Private Wealth Management",
      status: "Active",
      profile_picture: null,
      trading_balance_total: 13850000,
      trading_balance_profit: 1240500,
      crypto_enrolled: true,
      documents: {},
      created_at: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: "tx-001",
      user_id: "user-001",
      type: "credit",
      amount: 50000.00,
      description: "Dividend Payment - Global Tech Fund",
      transaction_date: "2024-03-01T10:00:00Z"
    },
    {
      id: "tx-002",
      user_id: "user-001",
      type: "debit",
      amount: 1250.00,
      description: "Executive Concierge Service - Monthly Fee",
      transaction_date: "2024-03-05T14:30:00Z"
    }
  ],
  notifications: [
    {
      id: "notif-001",
      user_id: "user-001",
      title: "Login Successful",
      description: "A successful login was detected from a new device in London, UK.",
      is_read: false,
      created_at: new Date().toISOString()
    }
  ],
  open_trades: [],
  closed_trades: [],
  pending_deposits: []
};

const getStoredData = (key) => {
  const data = localStorage.getItem('synox_' + key);
  return data ? JSON.parse(data) : (DEFAULTS[key] || []);
};

const setStoredData = (key, data) => {
  localStorage.setItem('synox_' + key, JSON.stringify(data));
  window.dispatchEvent(new Event('synox_updated'));
};

export const SynoxDB = {
  // ─────────────────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────────────────
  authenticateUser: async (email, password) => {
    const users = getStoredData('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === password);
    if (user) {
      return { success: true, user: { ...user } };
    }
    return { success: false, error: "Invalid credentials" };
  },

  // ─────────────────────────────────────────────────────────
  // REGISTRATION
  // ─────────────────────────────────────────────────────────
  registerUser: async (userData) => {
    const users = getStoredData('users');
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: "User with this email already exists" };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      email: userData.email,
      password_hash: userData.password,
      full_name: userData.full_name,
      account_number: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      balance: 50000.00,
      currency: "USD",
      crypto_wallet: userData.crypto_wallet || null,
      crypto_balances: { BTC: 0, ETH: 0, USDT: 0 },
      account_type: userData.account_type || "Standard",
      status: "Active",
      profile_picture: null,
      trading_balance_total: 0,
      trading_balance_profit: 0,
      crypto_enrolled: false,
      documents: userData.documents || {},
      created_at: new Date().toISOString(),
      ...userData
    };

    delete newUser.password;
    delete newUser.confirm_password;

    users.push(newUser);
    setStoredData('users', users);

    // Initial transaction
    const txs = getStoredData('transactions');
    txs.unshift({
      id: 'tx-' + Date.now(),
      user_id: newUser.id,
      type: 'credit',
      amount: 50000.00,
      description: 'Synox Welcome Bonus - Account Promotion',
      transaction_date: new Date().toISOString()
    });
    setStoredData('transactions', txs);

    // Initial notification
    const notes = getStoredData('notifications');
    notes.unshift({
      id: 'notif-' + Date.now(),
      user_id: newUser.id,
      title: 'Account Activated',
      description: 'Welcome to Synox Bank! Your account is now fully active.',
      is_read: false,
      created_at: new Date().toISOString()
    });
    setStoredData('notifications', notes);

    return { success: true, user: { ...newUser } };
  },

  // ─────────────────────────────────────────────────────────
  // USER CRUD
  // ─────────────────────────────────────────────────────────
  getUserById: async (userId) => {
    const users = getStoredData('users');
    return users.find(u => u.id === userId) || null;
  },

  updateUser: async (userId, updates) => {
    const users = getStoredData('users');
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
      setStoredData('users', users);
      return true;
    }
    return false;
  },

  // ─────────────────────────────────────────────────────────
  // ADMIN — GET ALL USERS
  // ─────────────────────────────────────────────────────────
  getAllUsers: async () => {
    return getStoredData('users');
  },

  // ─────────────────────────────────────────────────────────
  // OTP
  // ─────────────────────────────────────────────────────────
  sendOTPEmail: async (email) => {
    sessionStorage.setItem('current_otp', '123456');
    return { success: true };
  },

  verifyOTPCode: async (email, code) => {
    const storedOtp = sessionStorage.getItem('current_otp');
    if (code === "123456" || code === storedOtp) {
      return { success: true, session: { user: { email } } };
    }
    return { success: false, error: "Invalid OTP code. Try 123456" };
  },

  // ─────────────────────────────────────────────────────────
  // TRANSACTIONS
  // ─────────────────────────────────────────────────────────
  getTransactions: async (userId, limit = 50) => {
    const txs = getStoredData('transactions');
    return txs.filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
      .slice(0, limit);
  },

  addTransaction: async (userId, type, amount, description, metadata = {}) => {
    const txs = getStoredData('transactions');
    const newTx = {
      id: 'tx-' + Date.now(),
      user_id: userId,
      type,
      amount: parseFloat(amount),
      description,
      transaction_date: new Date().toISOString(),
      ...metadata
    };
    txs.unshift(newTx);
    setStoredData('transactions', txs);

    const users = getStoredData('users');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (type === 'credit') {
        users[userIndex].balance += parseFloat(amount);
      } else {
        users[userIndex].balance -= parseFloat(amount);
      }
      setStoredData('users', users);
    }
    return newTx;
  },

  // ─────────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ─────────────────────────────────────────────────────────
  getNotifications: async (userId, type = null, limit = 20) => {
    const notes = getStoredData('notifications');
    return notes.filter(n => n.user_id === userId && (!type || n.type === type))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },

  markNotificationsRead: async (userId) => {
    const notes = getStoredData('notifications');
    let modified = false;
    notes.forEach(n => {
      if (n.user_id === userId && !n.is_read) {
        n.is_read = true;
        modified = true;
      }
    });
    if (modified) {
      setStoredData('notifications', notes);
    }
    return true;
  },

  addNotification: async (userId, title, description, type = 'bank') => {
    const notes = getStoredData('notifications');
    notes.unshift({
      id: 'notif-' + Date.now(),
      user_id: userId,
      title,
      description,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    });
    setStoredData('notifications', notes);
  },

  // ─────────────────────────────────────────────────────────
  // CRYPTO BALANCES
  // ─────────────────────────────────────────────────────────
  getCryptoBalances: async (userId) => {
    const users = getStoredData('users');
    const user = users.find(u => u.id === userId);
    return user ? user.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 } : null;
  },

  // ─────────────────────────────────────────────────────────
  // ADMIN — PLACE TRADE
  // ─────────────────────────────────────────────────────────
  placeTrade: async (userId, tradeData) => {
    const openTrades = getStoredData('open_trades');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + tradeData.time_minutes * 60 * 1000);

    const newTrade = {
      id: 'trade-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      user_id: userId,
      status: 'open',
      direction: tradeData.direction,          // 'UP' | 'DOWN'
      strategy: tradeData.strategy,
      asset_pair: tradeData.asset_pair,        // e.g. 'BTCUSD'
      leverage: parseFloat(tradeData.leverage),
      amount_usd: parseFloat(tradeData.amount_usd),
      amount_crypto: parseFloat(tradeData.amount_crypto || 0),
      time_minutes: parseInt(tradeData.time_minutes),
      min_disp_profit: tradeData.min_disp_profit ? parseFloat(tradeData.min_disp_profit) : null,
      max_disp_profit: tradeData.max_disp_profit ? parseFloat(tradeData.max_disp_profit) : null,
      notify_user: tradeData.notify_user || 'NO',
      profit_override: tradeData.profit_override ? parseFloat(tradeData.profit_override) : null,
      entry_price: tradeData.entry_price || 0,
      placed_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      current_profit: 0
    };

    openTrades.unshift(newTrade);
    setStoredData('open_trades', openTrades);

    // Send notification to user if requested
    if (tradeData.notify_user === 'YES') {
      await SynoxDB.addNotification(
        userId,
        `New Trade Opened — ${tradeData.asset_pair}`,
        `A ${tradeData.direction} trade has been placed on ${tradeData.asset_pair} with ${tradeData.leverage}x leverage for $${parseFloat(tradeData.amount_usd).toLocaleString()} USD.`,
        'crypto'
      );
    }

    return { success: true, trade: newTrade };
  },

  // ─────────────────────────────────────────────────────────
  // ADMIN — CLOSE TRADE
  // ─────────────────────────────────────────────────────────
  closeTrade: async (tradeId, finalProfit) => {
    const openTrades = getStoredData('open_trades');
    const closedTrades = getStoredData('closed_trades');

    const tradeIndex = openTrades.findIndex(t => t.id === tradeId);
    if (tradeIndex === -1) return { success: false, error: 'Trade not found' };

    const trade = openTrades[tradeIndex];
    const profit = finalProfit !== undefined ? parseFloat(finalProfit) : trade.profit_override || 0;

    const closedTrade = {
      ...trade,
      status: 'closed',
      profit,
      closed_at: new Date().toISOString()
    };

    // Move to closed
    closedTrades.unshift(closedTrade);
    openTrades.splice(tradeIndex, 1);
    setStoredData('open_trades', openTrades);
    setStoredData('closed_trades', closedTrades);

    // Update user trading balance
    const users = getStoredData('users');
    const userIndex = users.findIndex(u => u.id === trade.user_id);
    if (userIndex !== -1) {
      users[userIndex].trading_balance_total = (users[userIndex].trading_balance_total || 0) + trade.amount_usd + profit;
      users[userIndex].trading_balance_profit = (users[userIndex].trading_balance_profit || 0) + profit;
      setStoredData('users', users);
    }

    // Notify user
    await SynoxDB.addNotification(
      trade.user_id,
      `Trade Closed — ${trade.asset_pair}`,
      `Your ${trade.direction} trade on ${trade.asset_pair} has been settled with a profit of $${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`,
      'crypto'
    );

    return { success: true, trade: closedTrade };
  },

  // ─────────────────────────────────────────────────────────
  // GET USER TRADES
  // ─────────────────────────────────────────────────────────
  getUserTrades: async (userId) => {
    const openTrades = getStoredData('open_trades');
    const closedTrades = getStoredData('closed_trades');
    return {
      open_trades: openTrades.filter(t => t.user_id === userId),
      closed_trades: closedTrades.filter(t => t.user_id === userId)
    };
  },

  // ─────────────────────────────────────────────────────────
  // GET ALL TRADES (admin)
  // ─────────────────────────────────────────────────────────
  getAllTrades: async () => {
    return {
      open_trades: getStoredData('open_trades'),
      closed_trades: getStoredData('closed_trades')
    };
  },

  // ─────────────────────────────────────────────────────────
  // UPDATE TRADING BALANCE (admin utility)
  // ─────────────────────────────────────────────────────────
  updateTradingBalance: async (userId, totalDelta, profitDelta) => {
    const users = getStoredData('users');
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].trading_balance_total = (users[idx].trading_balance_total || 0) + totalDelta;
      users[idx].trading_balance_profit = (users[idx].trading_balance_profit || 0) + profitDelta;
      setStoredData('users', users);
      return true;
    }
    return false;
  },

  // ─────────────────────────────────────────────────────────
  // PENDING DEPOSITS
  // ─────────────────────────────────────────────────────────
  addPendingDeposit: async (userId, amount, asset, receiptData) => {
    const deposits = getStoredData('pending_deposits');
    const newDeposit = {
      id: 'dep-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      user_id: userId,
      amount: parseFloat(amount),
      asset: asset, // e.g. 'BTC', 'ETH'
      receipt: receiptData, // base64 string
      status: 'pending',
      created_at: new Date().toISOString()
    };
    deposits.unshift(newDeposit);
    setStoredData('pending_deposits', deposits);
    return newDeposit;
  },

  getAllPendingDeposits: async () => {
    return getStoredData('pending_deposits').filter(d => d.status === 'pending');
  },

  acceptPendingDeposit: async (depositId, cryptoAmount) => {
    const deposits = getStoredData('pending_deposits');
    const index = deposits.findIndex(d => d.id === depositId);
    if (index === -1) return { success: false, error: 'Deposit not found' };

    const deposit = deposits[index];
    if (deposit.status !== 'pending') return { success: false, error: 'Already processed' };

    deposit.status = 'accepted';
    deposit.processed_at = new Date().toISOString();
    setStoredData('pending_deposits', deposits);

    const users = getStoredData('users');
    const userIndex = users.findIndex(u => u.id === deposit.user_id);
    
    if (userIndex !== -1) {
      if (!users[userIndex].crypto_balances) users[userIndex].crypto_balances = { BTC: 0, ETH: 0, USDT: 0 };
      users[userIndex].crypto_balances[deposit.asset] = (users[userIndex].crypto_balances[deposit.asset] || 0) + cryptoAmount;
      setStoredData('users', users);

      await SynoxDB.addTransaction(
        deposit.user_id,
        'credit',
        deposit.amount,
        `Crypto Deposit Verified — ${deposit.asset}`,
        { asset: deposit.asset, crypto_amount: cryptoAmount }
      );

      await SynoxDB.addNotification(
        deposit.user_id,
        'Deposit Verified',
        `Your deposit of $${deposit.amount.toLocaleString()} has been verified and ${cryptoAmount.toFixed(6)} ${deposit.asset} credited to your Crypto Portfolio.`,
        'crypto'
      );
    }
    return { success: true };
  },

  rejectPendingDeposit: async (depositId, reason) => {
    const deposits = getStoredData('pending_deposits');
    const index = deposits.findIndex(d => d.id === depositId);
    if (index === -1) return { success: false, error: 'Deposit not found' };

    const deposit = deposits[index];
    deposit.status = 'rejected';
    deposit.reject_reason = reason || 'Invalid receipt';
    deposit.processed_at = new Date().toISOString();
    setStoredData('pending_deposits', deposits);

    await SynoxDB.addNotification(
      deposit.user_id,
      'Deposit Rejected',
      `Your recent deposit of $${deposit.amount.toLocaleString()} was not approved. Reason: ${deposit.reject_reason}.`,
      'crypto'
    );
    return { success: true };
  }
};
