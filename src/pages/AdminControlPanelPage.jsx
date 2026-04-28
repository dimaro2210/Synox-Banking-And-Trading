import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SynoxDB } from '../lib/synoxDB';

/* ── CoinGecko API Integration ────────────────────────────────── */
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple,cardano,dogecoin,matic-network,polkadot&vs_currencies=usd';
const ASSET_MAP = { bitcoin: 'BTC', ethereum: 'ETH', tether: 'USDT', binancecoin: 'BNB', solana: 'SOL', ripple: 'XRP', cardano: 'ADA', dogecoin: 'DOGE', 'matic-network': 'MATIC', polkadot: 'DOT' };
const INITIAL_MARKET_DATA = {
  BTC: { usd: 64210 }, ETH: { usd: 3450 }, USDT: { usd: 1.00 }, BNB: { usd: 580 }, SOL: { usd: 145 },
  XRP: { usd: 0.52 }, ADA: { usd: 0.45 }, DOGE: { usd: 0.12 }, MATIC: { usd: 0.72 }, DOT: { usd: 7.2 }
};

const PAIR_OPTIONS = [
  'BTCUSD','ETHUSD','XRPUSD','BNBUSD','SOLUSD','ADAUSD','DOGEUSD','MATICUSD','DOTUSD','USDTEUR'
];

const STRATEGY_OPTIONS = [
  'Simon Ree', 'Scalping', 'Swing Trading', 'Day Trading',
  'Position Trading', 'Momentum', 'Mean Reversion', 'Arbitrage'
];

const ADMIN_PASSWORD = 'SynoxAdmin2025';

/* ── Helpers ─────────────────────────────────────────────────── */
const fmt = (n, dec = 2) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const initials = (name) => (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const getAssetFromPair = (pair) => pair?.replace('USD','').replace('EUR','') || 'BTC';

function CountdownTimer({ expiresAt }) {
  const [remaining, setRemaining] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt) - Date.now();
      if (diff <= 0) { setRemaining('EXPIRED'); setExpired(true); setUrgent(false); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUrgent(diff < 60000);
      setRemaining(`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <span className={`admin-countdown-value ${expired ? 'expired' : urgent ? 'urgent' : 'normal'}`}>
      {remaining}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN GATE
═══════════════════════════════════════════════════════════════ */
function AdminGate({ onAuth }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const handle = () => {
    if (pw === ADMIN_PASSWORD) { onAuth(); }
    else { setError('Invalid admin password. Please try again.'); setPw(''); }
  };

  return (
    <div className="admin-gate-overlay">
      <div className="admin-gate-card">
        <div className="admin-gate-logo"><i className="fas fa-shield-alt" /></div>
        <div className="admin-gate-title">Admin Access</div>
        <div className="admin-gate-subtitle">Synox International Banking &amp; Trade — Control Panel</div>
        {error && <div className="admin-gate-error"><i className="fas fa-exclamation-triangle me-2" />{error}</div>}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            type={show ? 'text' : 'password'}
            className="admin-gate-input"
            placeholder="Enter admin password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handle()}
            autoFocus
            style={{ paddingRight: 44 }}
          />
          <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <i className={`fas fa-eye${show ? '-slash' : ''}`} />
          </button>
        </div>
        <button className="admin-gate-btn" onClick={handle}>
          <i className="fas fa-lock-open me-2" />Enter Control Panel
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLACE TRADE MODAL
═══════════════════════════════════════════════════════════════ */
function PlaceTradeModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    direction: 'UP',
    strategy: 'Simon Ree',
    asset_pair: 'BTCUSD',
    leverage: '10',
    amount_usd: '',
    time_minutes: '30',
    min_disp_profit: '',
    max_disp_profit: '',
    notify_user: 'YES',
    profit_override: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const asset = getAssetFromPair(form.asset_pair);
  const price = user.marketPrices[asset]?.usd || INITIAL_MARKET_DATA[asset]?.usd || 1;
  const amtCrypto = form.amount_usd ? (parseFloat(form.amount_usd) / price).toFixed(6) : '0.000000';

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.amount_usd || !form.time_minutes) return;
    setLoading(true);
    const entry_price = price * (1 + (Math.random() * 0.002 - 0.001));
    await SynoxDB.placeTrade(user.id, {
      ...form,
      amount_crypto: amtCrypto,
      entry_price: parseFloat(entry_price.toFixed(2))
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { onSuccess(); onClose(); }, 1500);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <div className="admin-modal-title"><i className="fas fa-chart-line me-2" style={{ color: 'var(--admin-gold)' }} />Place Trade</div>
            <div className="admin-modal-sub">For: <strong style={{ color: 'var(--admin-text)' }}>{user.full_name}</strong></div>
          </div>
          <button className="admin-drawer-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        {success ? (
          <div className="admin-modal-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--admin-green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid var(--admin-green)' }}>
              <i className="fas fa-check" style={{ color: 'var(--admin-green)', fontSize: '2rem' }} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-text)', marginBottom: 6 }}>Trade Placed Successfully!</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>The trade is now live in {user.full_name}'s account.</div>
          </div>
        ) : (
          <>
            <div className="admin-modal-body">
              {/* Direction */}
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label className="admin-form-label">Direction</label>
                <div className="admin-direction-group">
                  {['UP','DOWN'].map(d => (
                    <button key={d} className={`admin-direction-btn ${d.toLowerCase()} ${form.direction === d ? 'selected' : ''}`} onClick={() => set('direction', d)}>
                      <i className={`fas fa-arrow-${d === 'UP' ? 'up' : 'down'}`} />{d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-form-grid">
                {/* Strategy */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Strategy</label>
                  <select className="admin-form-select" value={form.strategy} onChange={e => set('strategy', e.target.value)}>
                    {STRATEGY_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Asset Pair */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Asset Pair</label>
                  <select className="admin-form-select" value={form.asset_pair} onChange={e => set('asset_pair', e.target.value)}>
                    {PAIR_OPTIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>

                {/* Leverage */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Leverage <span style={{ color: 'var(--admin-text-muted)', fontWeight: 400 }}>max 250</span></label>
                  <input className="admin-form-input" type="number" min="1" max="250" value={form.leverage} onChange={e => set('leverage', e.target.value)} placeholder="e.g. 10" />
                </div>

                {/* Time */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Time (Minutes)</label>
                  <input className="admin-form-input" type="number" min="1" value={form.time_minutes} onChange={e => set('time_minutes', e.target.value)} placeholder="e.g. 30" />
                </div>

                {/* Amount USD */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Amount (USD)</label>
                  <input className="admin-form-input" type="number" min="0" value={form.amount_usd} onChange={e => set('amount_usd', e.target.value)} placeholder="e.g. 5000" />
                </div>

                {/* Amount Crypto — calculated */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Amount ({asset})</label>
                  <input className="admin-form-input" type="text" readOnly value={amtCrypto} style={{ opacity: 0.6, cursor: 'default' }} />
                  <span className="admin-form-hint">@ ${fmt(price, 2)} per {asset}</span>
                </div>

                {/* Min Display Profit */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Min Disp. Profit <span className="admin-optional-tag">optional</span></label>
                  <input className="admin-form-input" type="number" min="0" value={form.min_disp_profit} onChange={e => set('min_disp_profit', e.target.value)} placeholder="e.g. 200" />
                </div>

                {/* Max Display Profit */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Max Disp. Profit <span className="admin-optional-tag">optional</span></label>
                  <input className="admin-form-input" type="number" min="0" value={form.max_disp_profit} onChange={e => set('max_disp_profit', e.target.value)} placeholder="e.g. 800" />
                </div>

                {/* Notify User */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Notify User</label>
                  <select className="admin-form-select" value={form.notify_user} onChange={e => set('notify_user', e.target.value)}>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>

                {/* Profit Override */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Profit Override <span className="admin-optional-tag">optional</span></label>
                  <input className="admin-form-input" type="number" value={form.profit_override} onChange={e => set('profit_override', e.target.value)} placeholder="e.g. 450" />
                  <span className="admin-form-hint">Fixed profit at trade close</span>
                </div>
              </div>

              {/* Trade Summary */}
              {form.amount_usd && (
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 16px', marginTop: 14 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--admin-gold)', marginBottom: 8 }}>Trade Summary</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--admin-text-dim)' }}>Pair: <strong style={{ color: 'var(--admin-text)' }}>{form.asset_pair}</strong></span>
                    <span style={{ color: 'var(--admin-text-dim)' }}>Direction: <strong style={{ color: form.direction === 'UP' ? 'var(--admin-green)' : 'var(--admin-red)' }}>{form.direction}</strong></span>
                    <span style={{ color: 'var(--admin-text-dim)' }}>Leverage: <strong style={{ color: 'var(--admin-text)' }}>{form.leverage}x</strong></span>
                    <span style={{ color: 'var(--admin-text-dim)' }}>Amount: <strong style={{ color: 'var(--admin-text)' }}>${fmt(form.amount_usd)}</strong></span>
                    <span style={{ color: 'var(--admin-text-dim)' }}>Duration: <strong style={{ color: 'var(--admin-text)' }}>{form.time_minutes} min</strong></span>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
              <button
                className="admin-btn admin-btn-gold"
                disabled={!form.amount_usd || !form.time_minutes || loading}
                onClick={handleSubmit}
              >
                {loading ? <><i className="fas fa-circle-notch fa-spin" /> Placing...</> : <><i className="fas fa-bolt me-1" />Place Trade</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CLOSE TRADE MODAL
═══════════════════════════════════════════════════════════════ */
function CloseTradeModal({ trade, onClose, onSuccess }) {
  const [profit, setProfit] = useState(trade.profit_override !== null ? String(trade.profit_override) : '');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await SynoxDB.closeTrade(trade.id, parseFloat(profit) || 0);
    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <div className="admin-modal-title"><i className="fas fa-flag-checkered me-2" style={{ color: 'var(--admin-gold)' }} />Close Trade</div>
            <div className="admin-modal-sub">{trade.asset_pair} — {trade.direction}</div>
          </div>
          <button className="admin-drawer-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>
        <div className="admin-modal-body">
          <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>Asset: <strong style={{ color: 'var(--admin-text)' }}>{trade.asset_pair}</strong></span>
              <span style={{ color: 'var(--admin-text-muted)' }}>Amount: <strong style={{ color: 'var(--admin-text)' }}>${fmt(trade.amount_usd)}</strong></span>
              <span style={{ color: 'var(--admin-text-muted)' }}>Leverage: <strong style={{ color: 'var(--admin-text)' }}>{trade.leverage}x</strong></span>
              <span style={{ color: 'var(--admin-text-muted)' }}>Strategy: <strong style={{ color: 'var(--admin-text)' }}>{trade.strategy}</strong></span>
            </div>
          </div>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label className="admin-form-label">Final Profit (USD)</label>
            <input
              className="admin-form-input"
              type="number"
              value={profit}
              onChange={e => setProfit(e.target.value)}
              placeholder="e.g. 450.00"
              autoFocus
            />
            <span className="admin-form-hint">This will be credited to the user's trading balance</span>
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn-gold" onClick={handle} disabled={loading}>
            {loading ? <><i className="fas fa-circle-notch fa-spin" /> Closing...</> : <><i className="fas fa-check me-1" />Settle Trade</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BANKING SECTION
═══════════════════════════════════════════════════════════════ */
function BankingSection({ users }) {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.account_number || '').includes(search)
  );

  return (
    <>
      {/* Stats */}
      <div className="admin-stats-grid">
        {[
          { label: 'Total Users', value: users.length, icon: 'fa-users', cls: 'blue' },
          { label: 'Active Accounts', value: users.filter(u => u.status === 'Active').length, icon: 'fa-check-circle', cls: 'green' },
          { label: 'Total Deposits', value: `$${fmt(users.reduce((s,u) => s + (u.balance||0), 0))}`, icon: 'fa-dollar-sign', cls: 'gold' },
          { label: 'Crypto Enrolled', value: users.filter(u => u.crypto_enrolled || u.crypto_wallet).length, icon: 'fa-bitcoin', cls: 'purple' }
        ].map(st => (
          <div className="admin-stat-card" key={st.label}>
            <div className={`admin-stat-icon ${st.cls}`}><i className={`fas ${st.icon}`} /></div>
            <div className="admin-stat-label">{st.label}</div>
            <div className={`admin-stat-value ${st.cls}`}>{st.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <div>
            <div className="admin-table-title">Registered Users</div>
            <div className="admin-table-sub">{filtered.length} of {users.length} users</div>
          </div>
          <div className="admin-search-bar">
            <i className="fas fa-search" />
            <input placeholder="Search name, email, account…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Account No.</th>
                <th>Account Type</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="admin-empty"><i className="fas fa-users" /><p>No users found</p></div></td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} onClick={() => setSelectedUser(u)}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar" style={{ overflow: 'hidden' }}>
                        {u.profile_picture ? (
                          <img src={u.profile_picture} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          initials(u.full_name)
                        )}
                      </div>
                      <div>
                        <div className="admin-user-cell-name">{u.full_name}</div>
                        <div className="admin-user-cell-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><code style={{ fontSize: '0.8rem', color: 'var(--admin-blue)' }}>{u.account_number}</code></td>
                  <td>{u.account_type || 'Standard'}</td>
                  <td><strong>${fmt(u.balance)}</strong></td>
                  <td><span className={`admin-status ${(u.status||'active').toLowerCase()}`}><i className="fas fa-circle" style={{ fontSize: '0.45rem' }} />{u.status || 'Active'}</span></td>
                  <td style={{ fontSize: '0.8rem' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Drawer */}
      {selectedUser && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-drawer" onClick={e => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div>
                <div className="admin-drawer-title">{selectedUser.full_name}</div>
                <div className="admin-drawer-sub">User Profile &amp; Documents</div>
              </div>
              <button className="admin-drawer-close" onClick={() => setSelectedUser(null)}><i className="fas fa-times" /></button>
            </div>
            <div className="admin-drawer-body">
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div className="admin-profile-avatar" style={{ overflow: 'hidden' }}>
                  {selectedUser.profile_picture ? (
                    <img src={selectedUser.profile_picture} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    initials(selectedUser.full_name)
                  )}
                </div>
                <div>
                  <div className="admin-profile-name">{selectedUser.full_name}</div>
                  <div className="admin-profile-email">{selectedUser.email}</div>
                  <span className={`admin-status ${(selectedUser.status||'active').toLowerCase()}`} style={{ marginTop: 6 }}>
                    <i className="fas fa-circle" style={{ fontSize: '0.45rem' }} />{selectedUser.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Account Info */}
              <div className="admin-detail-section">
                <div className="admin-detail-section-title"><i className="fas fa-university" />Account Information</div>
                <div className="admin-detail-grid">
                  {[
                    ['Account Number', selectedUser.account_number],
                    ['Account Type', selectedUser.account_type || 'Standard'],
                    ['Currency', selectedUser.currency || 'USD'],
                    ['Balance', `$${fmt(selectedUser.balance)}`],
                    ['Email', selectedUser.email],
                    ['Password (hash)', selectedUser.password_hash],
                    ['Status', selectedUser.status || 'Active'],
                    ['Joined', selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '—']
                  ].map(([label, val]) => (
                    <div className="admin-detail-item" key={label}>
                      <label>{label}</label>
                      <p>{val || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crypto Info */}
              <div className="admin-detail-section">
                <div className="admin-detail-section-title"><i className="fab fa-bitcoin" />Crypto Portfolio</div>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <label>Wallet Address</label>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{selectedUser.crypto_wallet || 'Not enrolled'}</p>
                  </div>
                  <div className="admin-detail-item">
                    <label>Enrolled</label>
                    <p>{selectedUser.crypto_enrolled || selectedUser.crypto_wallet ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="admin-detail-item">
                    <label>Trading Balance Total</label>
                    <p>${fmt(selectedUser.trading_balance_total || 0)}</p>
                  </div>
                  <div className="admin-detail-item">
                    <label>Trading Profit</label>
                    <p>${fmt(selectedUser.trading_balance_profit || 0)}</p>
                  </div>
                </div>
                {selectedUser.crypto_balances && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--admin-text-muted)', marginBottom: 8 }}>Holdings</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {Object.entries(selectedUser.crypto_balances).filter(([,v]) => v > 0).map(([asset, amt]) => (
                        <div key={asset} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: '0.82rem', color: 'var(--admin-blue)' }}>
                          {asset}: {Number(amt).toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="admin-detail-section">
                <div className="admin-detail-section-title"><i className="fas fa-file-alt" />Uploaded Documents</div>
                {selectedUser.documents && Object.keys(selectedUser.documents).length > 0 ? (
                  <div className="admin-detail-grid">
                    {Object.entries(selectedUser.documents).map(([docType, docData]) => (
                      <div className="admin-detail-item" key={docType}>
                        <label>{docType}</label>
                        {typeof docData === 'string' && docData.startsWith('data:image') ? (
                          <img src={docData} alt={docType} style={{ width: '100%', borderRadius: 8, marginTop: 4 }} />
                        ) : (
                          <p style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{typeof docData === 'string' ? docData : JSON.stringify(docData)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>
                    <i className="fas fa-folder-open" style={{ display: 'block', marginBottom: 6, fontSize: '1.5rem', opacity: 0.3 }} />
                    No documents uploaded
                  </div>
                )}
              </div>

              {/* Additional fields from registration */}
              {(selectedUser.phone || selectedUser.address || selectedUser.city || selectedUser.country) && (
                <div className="admin-detail-section">
                  <div className="admin-detail-section-title"><i className="fas fa-id-card" />Personal Details</div>
                  <div className="admin-detail-grid">
                    {[
                      ['Phone', selectedUser.phone],
                      ['Date of Birth', selectedUser.dob],
                      ['Address', selectedUser.address],
                      ['City', selectedUser.city],
                      ['State', selectedUser.state],
                      ['Country', selectedUser.country],
                      ['Postal Code', selectedUser.postal_code],
                      ['Occupation', selectedUser.occupation]
                    ].filter(([,v]) => v).map(([label, val]) => (
                      <div className="admin-detail-item" key={label}>
                        <label>{label}</label>
                        <p>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRADING SECTION
═══════════════════════════════════════════════════════════════ */
function TradingSection({ users }) {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('open');
  const [trades, setTrades] = useState({ open_trades: [], closed_trades: [] });
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }, []);

  const loadTrades = useCallback(async () => {
    if (!selectedUser) return;
    const data = await SynoxDB.getUserTrades(selectedUser.id);
    setTrades(data);
  }, [selectedUser]);

  const refreshUser = useCallback(async () => {
    if (!selectedUser) return;
    const updated = await SynoxDB.getUserById(selectedUser.id);
    setSelectedUser(updated);
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      loadTrades();
      const interval = setInterval(loadTrades, 5000); // poll every 5s
      return () => clearInterval(interval);
    }
  }, [selectedUser, loadTrades]);

  const handleTradeSuccess = () => {
    loadTrades(); refreshUser();
    showToast('Trade placed successfully!');
  };

  const handleCloseSuccess = () => {
    loadTrades(); refreshUser();
    showToast('Trade closed and profit credited!');
  };

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (selectedUser) {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="admin-breadcrumb">
          <button onClick={() => setSelectedUser(null)}><i className="fas fa-users me-1" />All Users</button>
          <i className="fas fa-chevron-right" />
          <span>{selectedUser.full_name}</span>
          <i className="fas fa-chevron-right" />
          <span>{activeTab === 'open' ? 'Open Trades' : 'Closed Trades'}</span>
        </div>

        {/* Profile Header */}
        <div className="admin-profile-header">
          <div className="admin-profile-avatar" style={{ overflow: 'hidden' }}>
            {selectedUser.profile_picture ? (
              <img src={selectedUser.profile_picture} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials(selectedUser.full_name)
            )}
          </div>
          <div className="admin-profile-info">
            <div className="admin-profile-name">{selectedUser.full_name}</div>
            <div className="admin-profile-email">{selectedUser.email}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              <span className="admin-status active"><i className="fas fa-circle" style={{ fontSize: '0.45rem' }} />Active</span>
              {(selectedUser.crypto_enrolled || selectedUser.crypto_wallet) && (
                <span className="admin-status" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
                  <i className="fas fa-circle" style={{ fontSize: '0.45rem' }} />Crypto Enrolled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Trading Balance Card */}
        <div className="admin-trading-balance-card">
          <div className="admin-tbc-grid">
            <div>
              <div className="admin-tbc-label"><i className="fas fa-wallet me-2" />Trading Balance Total</div>
              <div className="admin-tbc-value">${fmt(selectedUser.trading_balance_total || 0)}</div>
            </div>
            <div>
              <div className="admin-tbc-label"><i className="fas fa-chart-line me-2" />Trading Balance Profit</div>
              <div className="admin-tbc-value" style={{ color: 'var(--admin-green)' }}>${fmt(selectedUser.trading_balance_profit || 0)}</div>
            </div>
          </div>
          <div className="admin-tbc-profit" style={{ marginTop: 16 }}>
            <i className="fas fa-info-circle" />
            <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
              {trades.open_trades.length} open trade{trades.open_trades.length !== 1 ? 's' : ''} · {trades.closed_trades.length} closed trade{trades.closed_trades.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Holdings */}
        {selectedUser.crypto_balances && Object.values(selectedUser.crypto_balances).some(v => v > 0) && (
          <div className="admin-detail-section" style={{ marginBottom: 20 }}>
            <div className="admin-detail-section-title"><i className="fab fa-bitcoin" />Crypto Holdings</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {Object.entries(selectedUser.crypto_balances).filter(([,v]) => v > 0).map(([asset, amt]) => (
                <div key={asset} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--admin-card-border)', borderRadius: 10, padding: '10px 16px', minWidth: 130 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 4 }}>{asset}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>${fmt(amt * (selectedUser?.marketPrices?.[asset]?.usd || INITIAL_MARKET_DATA[asset]?.usd || 0))}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'open' ? 'active' : ''}`} onClick={() => setActiveTab('open')}>
            <i className="fas fa-clock" />Open Trades
            {trades.open_trades.length > 0 && <span className="admin-tab-count">{trades.open_trades.length}</span>}
          </button>
          <button className={`admin-tab ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')}>
            <i className="fas fa-check-circle" />Closed Trades
            {trades.closed_trades.length > 0 && <span className="admin-tab-count">{trades.closed_trades.length}</span>}
          </button>
        </div>

        {/* Open Trades */}
        {activeTab === 'open' && (
          trades.open_trades.length === 0 ? (
            <div className="admin-empty">
              <i className="fas fa-chart-line" />
              <p>No open trades for this user.<br />Click the <strong style={{ color: 'var(--admin-red)' }}>+</strong> button to place one.</p>
            </div>
          ) : trades.open_trades.map(trade => (
            <div key={trade.id} className={`admin-trade-card ${trade.direction.toLowerCase()}`}>
              <div className="admin-trade-header">
                <div>
                  <div className="admin-trade-pair">{trade.asset_pair}</div>
                  <div className="admin-trade-id">#{trade.id.slice(-8)}</div>
                </div>
                <div className={`admin-trade-direction ${trade.direction.toLowerCase()}`}>
                  <i className={`fas fa-arrow-${trade.direction === 'UP' ? 'up' : 'down'}`} />{trade.direction}
                </div>
              </div>

              <div className="admin-trade-stats">
                <div className="admin-trade-stat"><label>Amount (USD)</label><span>${fmt(trade.amount_usd)}</span></div>
                <div className="admin-trade-stat"><label>Leverage</label><span>{trade.leverage}x</span></div>
                <div className="admin-trade-stat"><label>Strategy</label><span>{trade.strategy}</span></div>
                <div className="admin-trade-stat"><label>Entry Price</label><span>${fmt(trade.entry_price, 2)}</span></div>
                <div className="admin-trade-stat"><label>Duration</label><span>{trade.time_minutes} min</span></div>
                <div className="admin-trade-stat">
                  <label>Placed At</label>
                  <span style={{ fontSize: '0.75rem' }}>{fmtDate(trade.placed_at)}</span>
                </div>
              </div>

              {(trade.min_disp_profit || trade.max_disp_profit || trade.profit_override) && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {trade.min_disp_profit && <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--admin-green)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)' }}>Min: ${fmt(trade.min_disp_profit)}</span>}
                  {trade.max_disp_profit && <span style={{ fontSize: '0.75rem', background: 'rgba(245,158,11,0.1)', color: 'var(--admin-gold)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.2)' }}>Max: ${fmt(trade.max_disp_profit)}</span>}
                  {trade.profit_override && <span style={{ fontSize: '0.75rem', background: 'rgba(139,92,246,0.1)', color: 'var(--admin-purple)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(139,92,246,0.2)' }}>Override: ${fmt(trade.profit_override)}</span>}
                </div>
              )}

              <div className="admin-countdown">
                <i className="fas fa-hourglass-half" />
                <div style={{ flex: 1 }}>
                  <div className="admin-countdown-label">Time Remaining</div>
                  <CountdownTimer expiresAt={trade.expires_at} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', textAlign: 'right' }}>
                  Expires: {new Date(trade.expires_at).toLocaleTimeString()}
                </div>
              </div>

              <div className="admin-trade-actions">
                <button className="admin-btn admin-btn-green" onClick={() => setShowCloseModal(trade)}>
                  <i className="fas fa-flag-checkered" />Close &amp; Settle
                </button>
              </div>
            </div>
          ))
        )}

        {/* Closed Trades */}
        {activeTab === 'closed' && (
          trades.closed_trades.length === 0 ? (
            <div className="admin-empty"><i className="fas fa-history" /><p>No closed trades yet.</p></div>
          ) : trades.closed_trades.map(trade => (
            <div key={trade.id} className="admin-trade-card" style={{ borderLeft: '3px solid var(--admin-text-muted)', opacity: 0.85 }}>
              <div className="admin-trade-header">
                <div>
                  <div className="admin-trade-pair">{trade.asset_pair}</div>
                  <div className="admin-trade-id">#{trade.id.slice(-8)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="admin-status closed"><i className="fas fa-circle" style={{ fontSize: '0.45rem' }} />Settled</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: (trade.profit || 0) >= 0 ? 'var(--admin-green)' : 'var(--admin-red)', marginTop: 4 }}>
                    {(trade.profit || 0) >= 0 ? '+' : ''}${fmt(trade.profit || 0)}
                  </div>
                </div>
              </div>
              <div className="admin-trade-stats">
                <div className="admin-trade-stat"><label>Amount</label><span>${fmt(trade.amount_usd)}</span></div>
                <div className="admin-trade-stat"><label>Leverage</label><span>{trade.leverage}x</span></div>
                <div className="admin-trade-stat"><label>Direction</label>
                  <span style={{ color: trade.direction === 'UP' ? 'var(--admin-green)' : 'var(--admin-red)', fontWeight: 700 }}>{trade.direction}</span>
                </div>
                <div className="admin-trade-stat"><label>Strategy</label><span>{trade.strategy}</span></div>
                <div className="admin-trade-stat"><label>Placed</label><span style={{ fontSize: '0.75rem' }}>{fmtDate(trade.placed_at)}</span></div>
                <div className="admin-trade-stat"><label>Closed</label><span style={{ fontSize: '0.75rem' }}>{fmtDate(trade.closed_at)}</span></div>
              </div>
            </div>
          ))
        )}

        {/* FAB */}
        <button className="admin-fab" onClick={() => setShowTradeModal(true)} title="Place New Trade">
          <i className="fas fa-plus" />
        </button>

        {/* Modals */}
        {showTradeModal && <PlaceTradeModal user={selectedUser} onClose={() => setShowTradeModal(false)} onSuccess={handleTradeSuccess} />}
        {showCloseModal && <CloseTradeModal trade={showCloseModal} onClose={() => setShowCloseModal(null)} onSuccess={handleCloseSuccess} />}

        {/* Toast */}
        {toast && <div className="admin-toast"><i className="fas fa-check-circle" />{toast}</div>}
      </div>
    );
  }

  // ── User List ──
  return (
    <>
      <div className="admin-stats-grid">
        {[
          { label: 'Total Traders', value: filtered.length, icon: 'fa-users', cls: 'blue' },
          { label: 'Open Trades (all)', value: '—', icon: 'fa-clock', cls: 'gold' },
          { label: 'Total Profit Out', value: '—', icon: 'fa-chart-line', cls: 'green' },
          { label: 'Enrolled', value: users.filter(u => u.crypto_enrolled || u.crypto_wallet).length, icon: 'fa-bitcoin', cls: 'purple' }
        ].map(st => (
          <div className="admin-stat-card" key={st.label}>
            <div className={`admin-stat-icon ${st.cls}`}><i className={`fas ${st.icon}`} /></div>
            <div className="admin-stat-label">{st.label}</div>
            <div className={`admin-stat-value ${st.cls}`}>{st.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <div>
            <div className="admin-table-title">Crypto Trading Users</div>
            <div className="admin-table-sub">Click a user to manage their trades</div>
          </div>
          <div className="admin-search-bar">
            <i className="fas fa-search" />
            <input placeholder="Search user…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Trading Balance</th>
                <th>Trading Profit</th>
                <th>Holdings Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="admin-empty"><i className="fas fa-users" /><p>No users found</p></div></td></tr>
              ) : filtered.map(u => {
                const holdingsVal = Object.entries(u.crypto_balances || {}).reduce((s, [k, v]) => s + v * (u.marketPrices?.[k]?.usd || INITIAL_MARKET_DATA[k]?.usd || 0), 0);
                return (
                  <tr key={u.id} onClick={() => { setSelectedUser(u); setActiveTab('open'); }}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar" style={{ overflow: 'hidden' }}>
                          {u.profile_picture ? (
                            <img src={u.profile_picture} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            initials(u.full_name)
                          )}
                        </div>
                        <div>
                          <div className="admin-user-cell-name">{u.full_name}</div>
                          <div className="admin-user-cell-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><strong style={{ color: 'var(--admin-gold)' }}>${fmt(u.trading_balance_total || 0)}</strong></td>
                    <td><strong style={{ color: 'var(--admin-green)' }}>${fmt(u.trading_balance_profit || 0)}</strong></td>
                    <td>${fmt(holdingsVal)}</td>
                    <td>
                      <span className={`admin-status ${u.crypto_enrolled || u.crypto_wallet ? 'active' : 'inactive'}`}>
                        <i className="fas fa-circle" style={{ fontSize: '0.45rem' }} />
                        {u.crypto_enrolled || u.crypto_wallet ? 'Enrolled' : 'Not Enrolled'}
                      </span>
                    </td>
                    <td>
                      <span className="admin-btn admin-btn-ghost" style={{ fontSize: '0.75rem', padding: '5px 12px', cursor: 'pointer' }}>
                        <i className="fas fa-external-link-alt me-1" />Manage
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEPOSITS SECTION
═══════════════════════════════════════════════════════════════ */
function DepositsSection({ users, marketPrices }) {
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [toast, setToast] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadDeposits = async () => {
    const data = await SynoxDB.getAllPendingDeposits();
    setDeposits(data);
  };

  useEffect(() => { loadDeposits(); }, []);

  const handleAccept = async (deposit) => {
    const cryptoAmount = deposit.amount / (marketPrices[deposit.asset]?.usd || INITIAL_MARKET_DATA[deposit.asset]?.usd || 1);
    await SynoxDB.acceptPendingDeposit(deposit.id, cryptoAmount);
    showToast(`Deposit approved. User credited ${cryptoAmount.toFixed(6)} ${deposit.asset}.`);
    setSelectedDeposit(null);
    loadDeposits();
  };

  const handleReject = async (deposit) => {
    if (!rejectReason) {
      alert("Please provide a rejection reason.");
      return;
    }
    await SynoxDB.rejectPendingDeposit(deposit.id, rejectReason);
    showToast('Deposit rejected.');
    setIsRejecting(false);
    setRejectReason('');
    setSelectedDeposit(null);
    loadDeposits();
  };

  const getUser = (id) => users.find(u => u.id === id) || {};

  return (
    <>
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <div>
            <div className="admin-table-title">Pending Crypto Deposits</div>
            <div className="admin-table-sub">Review receipts and approve user deposits</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount (USD)</th>
                <th>Asset</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deposits.length === 0 ? (
                <tr><td colSpan={5}><div className="admin-empty"><i className="fas fa-check-circle" /><p>No pending deposits</p></div></td></tr>
              ) : deposits.map(d => {
                const u = getUser(d.user_id);
                return (
                  <tr key={d.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar" style={{ overflow: 'hidden' }}>
                          {u.profile_picture ? <img src={u.profile_picture} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(u.full_name)}
                        </div>
                        <div>
                          <div className="admin-user-cell-name">{u.full_name || 'Unknown User'}</div>
                          <div className="admin-user-cell-email">{u.email || d.user_id}</div>
                        </div>
                      </div>
                    </td>
                    <td><strong>${fmt(d.amount)}</strong></td>
                    <td><span className="admin-status active">{d.asset}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(d.created_at).toLocaleString()}</td>
                    <td>
                      <button className="admin-btn admin-btn-gold" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => setSelectedDeposit(d)}>
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedDeposit && (
        <div className="admin-modal-overlay" onClick={() => { setSelectedDeposit(null); setIsRejecting(false); }}>
          <div className="admin-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <div className="admin-modal-title">Review Deposit</div>
                <div className="admin-modal-sub">Amount: ${fmt(selectedDeposit.amount)} for {selectedDeposit.asset}</div>
              </div>
              <button className="admin-drawer-close" onClick={() => { setSelectedDeposit(null); setIsRejecting(false); }}><i className="fas fa-times" /></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Payment Receipt:</div>
                <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, padding: 8, textAlign: 'center' }}>
                  {selectedDeposit.receipt ? (
                    selectedDeposit.receipt.startsWith('data:image') ? (
                      <img src={selectedDeposit.receipt} alt="Receipt" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                    ) : (
                      <div style={{ padding: '20px', fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.7rem' }}>
                        Document attached.
                      </div>
                    )
                  ) : (
                    <div style={{ padding: '40px 20px', color: 'var(--admin-text-muted)' }}>No receipt provided</div>
                  )}
                </div>
              </div>

              {isRejecting ? (
                <div style={{ background: 'var(--admin-red-dim)', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-red)', marginBottom: 8 }}>Rejection Reason (sent to user):</label>
                  <input type="text" className="admin-form-input" style={{ borderColor: 'rgba(239,68,68,0.3)', marginBottom: 12 }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Receipt image is unclear" autoFocus />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-btn" style={{ background: 'var(--admin-red)', color: '#fff', flex: 1 }} onClick={() => handleReject(selectedDeposit)}>Confirm Reject</button>
                    <button className="admin-btn admin-btn-ghost" onClick={() => setIsRejecting(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="admin-btn admin-btn-ghost" style={{ flex: 1, color: 'var(--admin-red)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => setIsRejecting(true)}>
                    <i className="fas fa-times me-1" /> Reject
                  </button>
                  <button className="admin-btn admin-btn-gold" style={{ flex: 2 }} onClick={() => handleAccept(selectedDeposit)}>
                    <i className="fas fa-check me-1" /> Approve & Credit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast"><i className="fas fa-info-circle" />{toast}</div>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN CONTROL PANEL
═══════════════════════════════════════════════════════════════ */
export default function AdminControlPanelPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === '1');
  const [activeSection, setActiveSection] = useState('banking');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [marketPrices, setMarketPrices] = useState(INITIAL_MARKET_DATA);

  // Fetch live market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch(COINGECKO_API);
        const data = await res.json();
        const formattedData = {};
        for (const [id, stats] of Object.entries(data)) {
          formattedData[ASSET_MAP[id]] = stats;
        }
        setMarketPrices(prev => ({ ...prev, ...formattedData }));
      } catch (err) {
        console.error("Failed to fetch live market data", err);
      }
    };
    if (authed) {
      fetchMarketData();
      const interval = setInterval(fetchMarketData, 60000);
      return () => clearInterval(interval);
    }
  }, [authed]);

  const loadUsers = useCallback(async () => {
    const all = await SynoxDB.getAllUsers();
    // Attach market prices map to the user objects so child components can read it
    setUsers(all.map(u => ({ ...u, marketPrices })));
    setLoading(false);
  }, [marketPrices]);

  useEffect(() => {
    if (authed) loadUsers();
  }, [authed, loadUsers]);

  const handleAuth = () => {
    sessionStorage.setItem('admin_authed', '1');
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed');
    setAuthed(false);
  };

  if (!authed) return <AdminGate onAuth={handleAuth} />;

  const navItems = [
    { id: 'banking',   icon: 'fa-university',     label: 'Banking',        sub: 'User Accounts' },
    { id: 'trading',   icon: 'fa-chart-line', label: 'Trading',     sub: 'Crypto Investment' },
    { id: 'deposits',  icon: 'fa-arrow-down',     label: 'Deposits',       sub: 'Review Pending' }
  ];

  return (
    <div className="admin-root">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-inner">
            <div className="admin-sidebar-logo-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
              <img src="/LOGO-removebg-preview (1).png" alt="Synox Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>
            <div className="admin-sidebar-logo-text">
              SYNOX ADMIN
              <span>Control Panel v1.0</span>
            </div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-label">Sections</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); loadUsers(); }}
            >
              <i className={`fas ${item.icon}`} />
              <div>
                <div>{item.label}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.7 }}>{item.sub}</div>
              </div>
            </button>
          ))}

          <div className="admin-nav-section-label" style={{ marginTop: 16 }}>Quick Links</div>
          <button className="admin-nav-item" onClick={() => window.open('/dashboard', '_blank')}>
            <i className="fas fa-external-link-alt" /><span>Open Banking Dashboard</span>
          </button>
          <button className="admin-nav-item" onClick={() => window.open('/dashboard/crypto', '_blank')}>
            <i className="fas fa-bitcoin" /><span>Open Crypto Hub</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginBottom: 4 }}>
            Logged in as <strong style={{ color: 'var(--admin-text)' }}>Administrator</strong>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" />Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {/* Topbar */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="admin-mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <i className="fas fa-bars" />
            </button>
            <div>
              <div className="admin-topbar-title">
                {activeSection === 'banking' ? 'Banking Control Center' : 'Trading Control Center'}
              </div>
              <div className="admin-topbar-sub">
                {activeSection === 'banking'
                  ? `${users.length} registered user${users.length !== 1 ? 's' : ''}`
                  : `Manage crypto investments & trades`}
              </div>
            </div>
          </div>
          <div className="admin-topbar-right">
            {/* Live indicator and refresh button removed as per request */}
          </div>
        </div>

        <div className="admin-page-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--admin-text-muted)' }}>
              <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: 12, display: 'block', color: 'var(--admin-gold)' }} />
              Loading data…
            </div>
          ) : activeSection === 'banking' ? (
            <BankingSection users={users} />
          ) : activeSection === 'trading' ? (
            <TradingSection users={users} key={activeSection} />
          ) : (
            <DepositsSection users={users} marketPrices={marketPrices} key={activeSection} />
          )}
        </div>
      </main>
    </div>
  );
}
