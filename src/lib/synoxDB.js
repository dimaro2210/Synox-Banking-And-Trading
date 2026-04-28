import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkykcuirirhshahtyrih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWtjdWlyaXJoc2hhaHR5cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTE4MTAsImV4cCI6MjA4OTE2NzgxMH0.iyXcqygHMukiWFxLp155rqgaSmnangH97iz7bDhGk7Q';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to trigger UI re-renders
const triggerUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('synox_updated'));
  }
};

export const SynoxDB = {
  // ─────────────────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────────────────
  authenticateUser: async (email, password) => {
    try {
      // 1. Try to sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Fallback: check the public users table (in case auth is not fully configured)
        const { data: users } = await supabase
          .from('users')
          .select('*')
          .ilike('email', email)
          .eq('password_hash', password);
        
        if (users && users.length > 0) {
          return { success: true, user: users[0] };
        }
        throw error;
      }

      // 2. If Auth successful, get the public profile
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email)
        .single();

      return { success: true, user: user || data.user };
    } catch (error) {
      console.error('Auth error:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────
  // REGISTRATION
  // ─────────────────────────────────────────────────────────
  registerUser: async (userData) => {
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
          }
        }
      });

      if (authError) throw authError;

      const newUser = {
        id: authData.user.id, // Use the ID from Supabase Auth
        email: userData.email,
        password_hash: userData.password, // Keep for backward compatibility/reference
        full_name: userData.full_name,
        phone: userData.mobile, // Map mobile from form to phone column
        dob: userData.dob,
        gender: userData.gender,
        occupation: userData.occupation,
        country: userData.country,
        state: userData.state,
        referral: userData.referral,
        account_number: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        balance: 0.00,
        currency: 'USD',
        crypto_wallet: userData.crypto_wallet || null,
        crypto_balances: { BTC: 0, ETH: 0, USDT: 0 },
        account_type: userData.account_type || 'Standard',
        status: 'Active',
        profile_picture: null,
        trading_balance_total: 0,
        trading_balance_profit: 0,
        crypto_enrolled: false,
        documents: userData.documents || {},
        created_at: new Date().toISOString()
      };

      // 2. Create the public profile
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (insertError) {
        console.error('Registration profile error:', insertError);
      }

      // Initial notification
      await SynoxDB.addNotification(
        authData.user.id,
        'Account Activated',
        'Welcome to Synox Bank! Your account is now fully active.',
        'bank'
      );

      triggerUpdate();
      return { success: true, user: insertedUser || authData.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────
  // USER CRUD
  // ─────────────────────────────────────────────────────────
  getUserById: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('getUserById error:', error);
      return null;
    }
    return data;
  },

  updateUser: async (userId, updates) => {
    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) {
      console.error('updateUser error:', error);
      return false;
    }
    triggerUpdate();
    return true;
  },

  // ─────────────────────────────────────────────────────────
  // ADMIN — GET ALL USERS
  // ─────────────────────────────────────────────────────────
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getAllUsers error:', error);
      return [];
    }
    return data || [];
  },

  sendOTPEmail: async (email) => {
    try {
      // Use Supabase Auth to send the OTP (triggers the native email template)
      const { error } = await supabase.auth.signInWithOtp({
        email: email
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    }
  },

  verifyOTPCode: async (email, token) => {
    try {
      // Verify using Supabase Auth
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) throw error;
      
      // Get profile for session tracking
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email)
        .single();

      return { success: true, user, session: data.session };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────
  // COT — Generates a fresh code and updates Supabase to trigger email
  // ─────────────────────────────────────────────────────────
  sendCOTEmail: async (email) => {
    try {
      // Use Supabase Auth OTP as the COT delivery mechanism
      // This triggers the native Supabase "Login OTP" template
      const { error } = await supabase.auth.signInWithOtp({
        email: email
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error sending COT:', error);
      return { success: false, error: error.message };
    }
  },

  verifyCOTCode: async (email, token) => {
    try {
      // Verify the COT (OTP) using Supabase Auth
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error verifying COT:', error);
      return { success: false, error: error.message };
    }
  },

  // ─────────────────────────────────────────────────────────
  // TRANSACTIONS
  // ─────────────────────────────────────────────────────────
  getTransactions: async (userId, limit = 50) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('getTransactions error:', error);
      return [];
    }
    return data || [];
  },

  addTransaction: async (userId, type, amount, description, metadata = {}) => {
    const newTx = {
      // Let Supabase auto-generate UUID
      user_id: userId,
      type,
      amount: parseFloat(amount),
      description,
      transaction_date: new Date().toISOString(),
      ...(metadata.asset && { asset: metadata.asset }),
      ...(metadata.crypto_amount !== undefined && { crypto_amount: metadata.crypto_amount })
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(newTx)
      .select()
      .single();

    if (error) {
      console.error('addTransaction error:', error);
      return null;
    }

    // Update user balance
    const user = await SynoxDB.getUserById(userId);
    if (user) {
      const newBalance = type === 'credit'
        ? user.balance + parseFloat(amount)
        : user.balance - parseFloat(amount);
      await SynoxDB.updateUser(userId, { balance: newBalance });
    }

    triggerUpdate();
    return data;
  },

  // ─────────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ─────────────────────────────────────────────────────────
  getNotifications: async (userId, type = null, limit = 20) => {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);
    if (type) query = query.eq('type', type);
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('getNotifications error:', error);
      return [];
    }
    return data || [];
  },

  markNotificationsRead: async (userId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) {
      console.error('markNotificationsRead error:', error);
      return false;
    }
    triggerUpdate();
    return true;
  },

  addNotification: async (userId, title, description, type = 'bank') => {
    const { error } = await supabase.from('notifications').insert({
      // Let Supabase auto-generate UUID
      user_id: userId,
      title,
      description,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    });
    if (error) {
      console.error('addNotification error:', error);
    } else {
      triggerUpdate();
    }
  },

  // ─────────────────────────────────────────────────────────
  // CRYPTO BALANCES
  // ─────────────────────────────────────────────────────────
  getCryptoBalances: async (userId) => {
    const user = await SynoxDB.getUserById(userId);
    return user ? user.crypto_balances || { BTC: 0, ETH: 0, USDT: 0 } : null;
  },

  // ─────────────────────────────────────────────────────────
  // ADMIN — PLACE TRADE
  // ─────────────────────────────────────────────────────────
  placeTrade: async (userId, tradeData) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + tradeData.time_minutes * 60 * 1000);

    const newTrade = {
      // Let Supabase auto-generate UUID
      user_id: userId,
      status: 'open',
      direction: tradeData.direction,
      strategy: tradeData.strategy,
      asset_pair: tradeData.asset_pair,
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

    const { data, error } = await supabase
      .from('open_trades')
      .insert(newTrade)
      .select()
      .single();

    if (error) {
      console.error('placeTrade error:', error);
      return { success: false, error: error.message };
    }

    if (tradeData.notify_user === 'YES') {
      await SynoxDB.addNotification(
        userId,
        `New Trade Opened — ${tradeData.asset_pair}`,
        `A ${tradeData.direction} trade has been placed on ${tradeData.asset_pair} with ${tradeData.leverage}x leverage for $${parseFloat(tradeData.amount_usd).toLocaleString()} USD.`,
        'crypto'
      );
    }

    triggerUpdate();
    return { success: true, trade: data };
  },

  // ─────────────────────────────────────────────────────────
  // ADMIN — CLOSE TRADE
  // ─────────────────────────────────────────────────────────
  closeTrade: async (tradeId, finalProfit) => {
    const { data: openTrade, error: getError } = await supabase
      .from('open_trades')
      .select('*')
      .eq('id', tradeId)
      .single();

    if (getError || !openTrade) {
      console.error('closeTrade fetch error:', getError);
      return { success: false, error: 'Trade not found' };
    }

    const profit = finalProfit !== undefined ? parseFloat(finalProfit) : (openTrade.profit_override || 0);

    // Build closed trade row — exclude the original id so Supabase auto-generates a new UUID
    const { id: _removedId, ...tradeWithoutId } = openTrade;
    const closedTrade = {
      ...tradeWithoutId,
      status: 'closed',
      profit,
      closed_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('closed_trades')
      .insert(closedTrade);

    if (insertError) {
      console.error('closeTrade insert error:', insertError);
      return { success: false, error: insertError.message };
    }

    // Remove from open_trades
    await supabase.from('open_trades').delete().eq('id', tradeId);

    // Update user trading balance
    const user = await SynoxDB.getUserById(openTrade.user_id);
    if (user) {
      await SynoxDB.updateUser(openTrade.user_id, {
        trading_balance_total: (user.trading_balance_total || 0) + openTrade.amount_usd + profit,
        trading_balance_profit: (user.trading_balance_profit || 0) + profit
      });
    }

    // Notify user
    await SynoxDB.addNotification(
      openTrade.user_id,
      `Trade Closed — ${openTrade.asset_pair}`,
      `Your ${openTrade.direction} trade on ${openTrade.asset_pair} has been settled with a profit of $${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`,
      'crypto'
    );

    triggerUpdate();
    return { success: true, trade: closedTrade };
  },

  // ─────────────────────────────────────────────────────────
  // GET USER TRADES
  // ─────────────────────────────────────────────────────────
  getUserTrades: async (userId) => {
    const [openRes, closedRes] = await Promise.all([
      supabase.from('open_trades').select('*').eq('user_id', userId).order('placed_at', { ascending: false }),
      supabase.from('closed_trades').select('*').eq('user_id', userId).order('closed_at', { ascending: false })
    ]);
    return {
      open_trades: openRes.data || [],
      closed_trades: closedRes.data || []
    };
  },

  // ─────────────────────────────────────────────────────────
  // GET ALL TRADES (admin)
  // ─────────────────────────────────────────────────────────
  getAllTrades: async () => {
    const [openRes, closedRes] = await Promise.all([
      supabase.from('open_trades').select('*').order('placed_at', { ascending: false }),
      supabase.from('closed_trades').select('*').order('closed_at', { ascending: false })
    ]);
    return {
      open_trades: openRes.data || [],
      closed_trades: closedRes.data || []
    };
  },

  // ─────────────────────────────────────────────────────────
  // UPDATE TRADING BALANCE (admin utility)
  // ─────────────────────────────────────────────────────────
  updateTradingBalance: async (userId, totalDelta, profitDelta) => {
    const user = await SynoxDB.getUserById(userId);
    if (user) {
      return await SynoxDB.updateUser(userId, {
        trading_balance_total: (user.trading_balance_total || 0) + totalDelta,
        trading_balance_profit: (user.trading_balance_profit || 0) + profitDelta
      });
    }
    return false;
  },

  // ─────────────────────────────────────────────────────────
  // PENDING DEPOSITS
  // ─────────────────────────────────────────────────────────
  addPendingDeposit: async (userId, amount, asset, receiptData) => {
    const { data, error } = await supabase
      .from('pending_deposits')
      .insert({
        // Let Supabase auto-generate UUID
        user_id: userId,
        amount: parseFloat(amount),
        asset,
        receipt: receiptData,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('addPendingDeposit error:', error);
      return null;
    }
    triggerUpdate();
    return data;
  },

  getAllPendingDeposits: async () => {
    const { data, error } = await supabase
      .from('pending_deposits')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getAllPendingDeposits error:', error);
      return [];
    }
    return data || [];
  },

  acceptPendingDeposit: async (depositId, cryptoAmount) => {
    const { data: deposit, error: fetchError } = await supabase
      .from('pending_deposits')
      .select('*')
      .eq('id', depositId)
      .single();

    if (fetchError || !deposit) return { success: false, error: 'Deposit not found' };
    if (deposit.status !== 'pending') return { success: false, error: 'Already processed' };

    await supabase.from('pending_deposits').update({
      status: 'accepted',
      processed_at: new Date().toISOString()
    }).eq('id', depositId);

    const user = await SynoxDB.getUserById(deposit.user_id);
    if (user) {
      const updatedBalances = { ...((user.crypto_balances) || { BTC: 0, ETH: 0, USDT: 0 }) };
      updatedBalances[deposit.asset] = (updatedBalances[deposit.asset] || 0) + cryptoAmount;
      await SynoxDB.updateUser(user.id, { crypto_balances: updatedBalances });

      await SynoxDB.addTransaction(
        user.id, 'credit', deposit.amount,
        `Crypto Deposit Verified — ${deposit.asset}`,
        { asset: deposit.asset, crypto_amount: cryptoAmount }
      );

      await SynoxDB.addNotification(
        user.id,
        'Deposit Verified',
        `Your deposit of $${deposit.amount.toLocaleString()} has been verified and ${cryptoAmount.toFixed(6)} ${deposit.asset} credited to your Crypto Portfolio.`,
        'crypto'
      );
    }

    triggerUpdate();
    return { success: true };
  },

  rejectPendingDeposit: async (depositId, reason) => {
    const { data: deposit, error: fetchError } = await supabase
      .from('pending_deposits')
      .select('*')
      .eq('id', depositId)
      .single();

    if (fetchError || !deposit) return { success: false, error: 'Deposit not found' };

    const rejectReason = reason || 'Invalid receipt';
    await supabase.from('pending_deposits').update({
      status: 'rejected',
      reject_reason: rejectReason,
      processed_at: new Date().toISOString()
    }).eq('id', depositId);

    await SynoxDB.addNotification(
      deposit.user_id,
      'Deposit Rejected',
      `Your recent deposit of $${deposit.amount.toLocaleString()} was not approved. Reason: ${rejectReason}.`,
      'crypto'
    );

    triggerUpdate();
    return { success: true };
  }
};
