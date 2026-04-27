import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { formatMoney, STOCKS, CASINO_GAMES } from '../../engine/gameEngine';

const ASSETS_FOR_SALE = {
  property: [
    { id: 'studio_apt',      name: 'Studio Apartment', icon: '🏢', price: 150000,    category: 'property',    monthlyIncome: 0,    description: 'A cozy city apartment' },
    { id: 'house',           name: 'House',             icon: '🏠', price: 350000,    category: 'property',    monthlyIncome: 0,    description: 'A suburban family home' },
    { id: 'rental_property', name: 'Rental Property',   icon: '🏘️', price: 300000,    category: 'property',    monthlyIncome: 2000, description: 'Generates passive rent income' },
    { id: 'luxury_condo',    name: 'Luxury Condo',      icon: '🏙️', price: 750000,    category: 'property',    monthlyIncome: 0,    description: 'High-rise penthouse views' },
    { id: 'vacation_home',   name: 'Vacation Home',     icon: '🏡', price: 500000,    category: 'property',    monthlyIncome: 0,    description: 'Beach or mountain getaway' },
    { id: 'mansion',         name: 'Mansion',           icon: '🏰', price: 2500000,   category: 'property',    monthlyIncome: 0,    description: 'A palatial estate' },
  ],
  vehicle: [
    { id: 'used_car',        name: 'Used Car',          icon: '🚗', price: 5000,      category: 'vehicle',     monthlyIncome: 0,    description: 'Gets you from A to B' },
    { id: 'new_car',         name: 'New Car',           icon: '🚙', price: 28000,     category: 'vehicle',     monthlyIncome: 0,    description: 'Fresh off the lot' },
    { id: 'luxury_car',      name: 'Luxury Car',        icon: '🏎️', price: 80000,     category: 'vehicle',     monthlyIncome: 0,    description: 'German engineering' },
    { id: 'sports_car',      name: 'Sports Car',        icon: '🏎️', price: 150000,    category: 'vehicle',     monthlyIncome: 0,    description: '0 to 60 in 3 seconds' },
    { id: 'yacht',           name: 'Yacht',             icon: '🛥️', price: 1000000,   category: 'vehicle',     monthlyIncome: 0,    description: 'Set sail in style' },
    { id: 'private_jet',     name: 'Private Jet',       icon: '✈️', price: 10000000,  category: 'vehicle',     monthlyIncome: 0,    description: 'Skip the airport lines' },
  ],
  investment: [
    { id: 'index_fund',      name: 'Index Fund',        icon: '📊', price: 10000,     category: 'investment',  monthlyIncome: 0,    description: 'Steady long-term growth',    volatility: 0.08 },
    { id: 'tech_stock',      name: 'Tech Stocks',       icon: '💻', price: 5000,      category: 'investment',  monthlyIncome: 0,    description: 'High risk, high reward',     volatility: 0.25 },
    { id: 'crypto',          name: 'Cryptocurrency',    icon: '₿',  price: 1000,      category: 'investment',  monthlyIncome: 0,    description: 'To the moon or to zero',     volatility: 0.6 },
    { id: 'bonds',           name: 'Gov\'t Bonds',      icon: '🏦', price: 10000,     category: 'investment',  monthlyIncome: 300,  description: 'Safe, boring, reliable',     volatility: 0.02 },
    { id: 're_trust',        name: 'Real Estate Trust', icon: '🏛️', price: 50000,     category: 'investment',  monthlyIncome: 500,  description: 'Passive real estate income', volatility: 0.05 },
  ],
};

const CATEGORY_META = {
  property:   { icon: '🏠', label: 'Real Estate' },
  vehicle:    { icon: '🚗', label: 'Vehicles' },
  investment: { icon: '📈', label: 'Investments' },
};

const FINANCE_TABS = [
  { id: 'assets',  icon: '🏦', label: 'Assets'  },
  { id: 'stocks',  icon: '📈', label: 'Stocks'  },
  { id: 'loans',   icon: '💳', label: 'Finance' },
  { id: 'casino',  icon: '🎰', label: 'Casino'  },
];

export default function AssetsTab() {
  const {
    character, buyAsset, sellAsset,
    buyStock, sellStock, gambleAtCasino, buyLotteryTicket,
    takePersonalLoan, payOffLoan, applyForCreditCard, payCreditCard,
  } = useGameStore();

  const [activeShop, setActiveShop]           = useState(null);
  const [confirmSell, setConfirmSell]         = useState(null);
  const [financeTab, setFinanceTab]           = useState('assets');
  const [stockShares, setStockShares]         = useState({});
  const [sellStockShares, setSellStockShares] = useState({});
  const [loanAmount, setLoanAmount]           = useState('');
  const [loanYears, setLoanYears]             = useState('5');
  const [casinoBets, setCasinoBets]           = useState({});
  const [ccPayAmount, setCcPayAmount]         = useState('');
  const [feedback, setFeedback]               = useState(null);

  if (!character) return null;

  function act(fn, ...args) {
    const result = fn(...args);
    if (result && result.message) {
      const isGood = ['success', 'win', 'jackpot', 'small_win'].includes(result.result);
      setFeedback({ msg: result.message, good: isGood });
      setTimeout(() => setFeedback(null), 3000);
    }
    return result;
  }

  const assets         = character.assets || [];
  const totalAssetValue = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const annualPassive  = assets.reduce((sum, a) => sum + ((a.monthlyIncome || 0) * 12), 0);
  const stocks         = character.finances.stocks || [];
  const loans          = character.finances.loans  || [];
  const totalStockValue = stocks.reduce((s, x) => s + (x.shares * x.currentPrice), 0);
  const creditDebt     = character.finances.creditCardDebt   || 0;
  const creditLimit    = character.finances.creditCardLimit  || 0;
  const totalDebt      = loans.reduce((s, l) => s + l.remaining, 0) + creditDebt;

  const owned = {
    property:   assets.filter(a => a.category === 'property'),
    vehicle:    assets.filter(a => a.category === 'vehicle'),
    investment: assets.filter(a => a.category === 'investment'),
  };

  const alreadyOwns = (id) => assets.some(a => a.assetId === id);
  const canAfford   = (price) => character.finances.cash >= price;

  const netWorth = character.finances.cash + totalAssetValue + totalStockValue - totalDebt;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Feedback Toast ───────────────────────────────────────────────── */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 left-4 right-4 z-50 p-3 rounded-xl text-center font-semibold text-sm shadow-lg ${
            feedback.good ? 'bg-green-700/90 text-green-100' : 'bg-red-700/90 text-red-100'
          }`}
        >
          {feedback.msg}
        </motion.div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">

      <h2 className="font-bold text-white text-base mb-3">Assets & Wealth</h2>

      {/* ── Summary Card ────────────────────────────────────────────────── */}
      <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-slate-500 mb-1">Cash</div>
            <div className={`text-sm font-bold ${character.finances.cash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatMoney(character.finances.cash, character.currency)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Assets</div>
            <div className="text-sm font-bold text-purple-400">
              {formatMoney(totalAssetValue + totalStockValue, character.currency)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Net Worth</div>
            <div className={`text-sm font-bold ${netWorth >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {formatMoney(netWorth, character.currency)}
            </div>
          </div>
        </div>
        {(annualPassive > 0 || totalDebt > 0) && (
          <div className="mt-3 pt-3 border-t border-bg-border flex justify-around text-center">
            {annualPassive > 0 && (
              <div>
                <span className="text-xs text-slate-400">Passive Income </span>
                <span className="text-xs font-bold text-green-400">+{formatMoney(annualPassive, character.currency)}/yr</span>
              </div>
            )}
            {totalDebt > 0 && (
              <div>
                <span className="text-xs text-slate-400">Total Debt </span>
                <span className="text-xs font-bold text-red-400">{formatMoney(totalDebt, character.currency)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Finance Tab Bar ──────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {FINANCE_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setFinanceTab(t.id)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border text-xs font-semibold transition-all tap-effect ${
              financeTab === t.id
                ? 'bg-purple-700/40 border-purple-500/60 text-purple-300'
                : 'bg-bg-card border-bg-border text-slate-400'
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TAB: ASSETS
      ════════════════════════════════════════════════════════════════════ */}
      {financeTab === 'assets' && (
        <>
          {/* Shop category buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(CATEGORY_META).map(([cat, { icon, label }]) => (
              <button
                key={cat}
                onClick={() => setActiveShop(prev => prev === cat ? null : cat)}
                className={`py-3 rounded-xl border text-center tap-effect transition-all ${
                  activeShop === cat
                    ? 'bg-purple-700/40 border-purple-500/60 text-purple-300'
                    : 'bg-bg-card border-bg-border text-slate-300'
                }`}
              >
                <div className="text-xl mb-0.5">{icon}</div>
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[10px] text-slate-500">{owned[cat].length} owned</div>
              </button>
            ))}
          </div>

          {/* Shop panel — fixed overlay so it doesn't squish layout above */}
          {activeShop && (
            <>
              {/* dark backdrop */}
              <div
                className="fixed inset-0 z-20 bg-black/40"
                onClick={() => setActiveShop(null)}
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed inset-x-4 top-28 z-30 bg-bg-card rounded-2xl border border-bg-border overflow-hidden shadow-2xl"
                style={{ maxHeight: 'calc(100vh - 140px)' }}
              >
                <div className="p-3 border-b border-bg-border flex items-center justify-between flex-shrink-0">
                  <h3 className="text-sm font-semibold text-white">
                    {CATEGORY_META[activeShop].icon} Buy {CATEGORY_META[activeShop].label}
                  </h3>
                  <button onClick={() => setActiveShop(null)} className="text-slate-400 text-xl tap-effect">✕</button>
                </div>
                <div className="overflow-y-auto p-3 flex flex-col gap-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  {ASSETS_FOR_SALE[activeShop].map(item => {
                    const has        = alreadyOwns(item.id);
                    const affordable = canAfford(item.price);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                          has ? 'border-green-800/40 bg-green-950/20' : 'border-bg-border bg-bg-secondary'
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">{item.name}</div>
                          <div className="text-xs text-slate-400">{item.description}</div>
                          {item.monthlyIncome > 0 && (
                            <div className="text-xs text-green-400">
                              +{formatMoney(item.monthlyIncome * 12, character.currency)}/yr passive
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-yellow-400">
                            {formatMoney(item.price, character.currency)}
                          </div>
                          {has ? (
                            <span className="text-xs text-green-400">✓ Owned</span>
                          ) : (
                            <button
                              onClick={() => { if (affordable) { buyAsset(item); setActiveShop(null); } }}
                              disabled={!affordable}
                              className={`mt-1 text-xs px-3 py-1 rounded-lg font-semibold transition-all tap-effect ${
                                affordable
                                  ? 'bg-purple-700/60 text-purple-200 border border-purple-600/40'
                                  : 'bg-bg-border text-slate-600 cursor-not-allowed'
                              }`}
                            >
                              {affordable ? 'Buy' : "Can't Afford"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}

          {/* Owned assets list */}
          {assets.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              <div className="text-5xl mb-3">🏦</div>
              <p className="text-sm font-medium">No assets yet</p>
              <p className="text-xs mt-1">Buy property, vehicles, or investments above!</p>
            </div>
          ) : (
            Object.entries(owned).map(([cat, items]) =>
              items.length === 0 ? null : (
                <div key={cat} className="mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
                  </h3>
                  {items.map((asset, i) => {
                    const gain    = asset.currentValue - asset.purchasePrice;
                    const gainPct = asset.purchasePrice > 0
                      ? Math.round((gain / asset.purchasePrice) * 100)
                      : 0;
                    return (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-bg-border mb-2"
                      >
                        <span className="text-2xl flex-shrink-0">{asset.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">{asset.name}</div>
                          <div className="text-xs text-slate-400">
                            Bought {character.birthYear + (asset.yearPurchased || 0)} · {formatMoney(asset.purchasePrice, character.currency)}
                          </div>
                          {asset.monthlyIncome > 0 && (
                            <div className="text-xs text-green-400">
                              +{formatMoney(asset.monthlyIncome * 12, character.currency)}/yr
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-white">
                            {formatMoney(asset.currentValue, character.currency)}
                          </div>
                          <div className={`text-xs font-medium ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {gain >= 0 ? '+' : ''}{gainPct}%
                          </div>
                          <button
                            onClick={() => setConfirmSell(asset)}
                            className="mt-1 text-xs px-2 py-0.5 rounded-lg bg-red-900/40 border border-red-800/40 text-red-300 tap-effect"
                          >
                            Sell
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            )
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: STOCKS
      ════════════════════════════════════════════════════════════════════ */}
      {financeTab === 'stocks' && (
        <>
          {/* Portfolio summary */}
          {stocks.length > 0 && (
            <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
              <div className="text-xs text-slate-500 mb-1">Portfolio Value</div>
              <div className="text-xl font-bold text-purple-400">{formatMoney(totalStockValue, character.currency)}</div>
              <div className="mt-3 flex flex-col gap-2">
                {stocks.map(s => {
                  const val   = s.shares * s.currentPrice;
                  const cost  = s.shares * s.avgCost;
                  const gain  = val - cost;
                  const gainP = cost > 0 ? Math.round((gain / cost) * 100) : 0;
                  const sellQ = sellStockShares[s.ticker] || '';
                  return (
                    <div key={s.ticker} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-bg-border">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{s.ticker}</span>
                          <span className={`text-xs font-semibold ${gainP >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {gainP >= 0 ? '+' : ''}{gainP}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{s.shares} shares @ {formatMoney(s.currentPrice, character.currency)}</div>
                        <div className="text-xs text-slate-400">Value: {formatMoney(val, character.currency)}</div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <input
                          type="number"
                          min="1"
                          max={s.shares}
                          placeholder="Qty"
                          value={sellQ}
                          onChange={e => setSellStockShares(prev => ({ ...prev, [s.ticker]: e.target.value }))}
                          className="w-16 text-xs text-center bg-bg-card border border-bg-border rounded-lg p-1 text-white"
                        />
                        <button
                          onClick={() => {
                            const q = parseInt(sellQ) || 1;
                            act(sellStock, s.ticker, q);
                            setSellStockShares(prev => ({ ...prev, [s.ticker]: '' }));
                          }}
                          className="text-xs px-3 py-1 rounded-lg bg-red-800/50 border border-red-700/40 text-red-300 tap-effect"
                        >
                          Sell
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buy stocks */}
          <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">📊 Market</h3>
          <div className="flex flex-col gap-2">
            {STOCKS.map(s => {
              const qty = stockShares[s.ticker] || '';
              const cost = s.currentPrice * (parseInt(qty) || 0);
              const affordable = canAfford(cost) && cost > 0;
              return (
                <div key={s.ticker} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-bg-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{s.ticker}</span>
                      <span className="text-xs text-slate-400">{s.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatMoney(s.currentPrice, character.currency)}/share
                      {' · '}
                      <span className={s.volatility > 0.3 ? 'text-red-400' : s.volatility > 0.1 ? 'text-yellow-400' : 'text-green-400'}>
                        {s.volatility > 0.3 ? 'High Risk' : s.volatility > 0.1 ? 'Med Risk' : 'Low Risk'}
                      </span>
                    </div>
                    {cost > 0 && (
                      <div className={`text-xs font-semibold ${affordable ? 'text-purple-400' : 'text-red-400'}`}>
                        Total: {formatMoney(cost, character.currency)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={qty}
                      onChange={e => setStockShares(prev => ({ ...prev, [s.ticker]: e.target.value }))}
                      className="w-16 text-xs text-center bg-bg-secondary border border-bg-border rounded-lg p-1 text-white"
                    />
                    <button
                      onClick={() => {
                        const q = parseInt(qty) || 1;
                        act(buyStock, s.ticker, q);
                        setStockShares(prev => ({ ...prev, [s.ticker]: '' }));
                      }}
                      disabled={!affordable}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold tap-effect ${
                        affordable
                          ? 'bg-purple-700/60 border border-purple-600/40 text-purple-200'
                          : 'bg-bg-border text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: LOANS / FINANCE
      ════════════════════════════════════════════════════════════════════ */}
      {financeTab === 'loans' && (
        <>
          {/* Active loans */}
          {loans.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Active Loans</h3>
              {loans.map(loan => (
                <div key={loan.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-red-900/40 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">Personal Loan</div>
                    <div className="text-xs text-slate-400">
                      {loan.monthsLeft} months left · {(loan.rate * 100).toFixed(1)}% APR
                    </div>
                    <div className="text-xs text-red-400">
                      Monthly: {formatMoney(loan.monthlyPayment, character.currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-400">
                      {formatMoney(loan.remaining, character.currency)}
                    </div>
                    <button
                      onClick={() => act(payOffLoan, loan.id)}
                      disabled={!canAfford(loan.remaining)}
                      className={`mt-1 text-xs px-2 py-0.5 rounded-lg tap-effect ${
                        canAfford(loan.remaining)
                          ? 'bg-green-800/50 border border-green-700/40 text-green-300'
                          : 'bg-bg-border text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      Pay Off
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Take a loan */}
          <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
            <h3 className="text-sm font-semibold text-white mb-3">🏦 Personal Loan</h3>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">Amount</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={loanAmount}
                  onChange={e => setLoanAmount(e.target.value)}
                  className="w-full text-sm bg-bg-secondary border border-bg-border rounded-xl p-2 text-white"
                />
              </div>
              <div className="w-24">
                <label className="text-xs text-slate-400 mb-1 block">Years</label>
                <select
                  value={loanYears}
                  onChange={e => setLoanYears(e.target.value)}
                  className="w-full text-sm bg-bg-secondary border border-bg-border rounded-xl p-2 text-white"
                >
                  {[1, 2, 3, 5, 7, 10, 15, 20, 30].map(y => (
                    <option key={y} value={y}>{y}yr</option>
                  ))}
                </select>
              </div>
            </div>
            {loanAmount && (
              <div className="text-xs text-slate-400 mb-2">
                Est. monthly: {formatMoney(
                  Math.ceil((parseInt(loanAmount) || 0) * 0.08 / 12 + (parseInt(loanAmount) || 0) / (parseInt(loanYears) * 12)),
                  character.currency
                )}
              </div>
            )}
            <button
              onClick={() => {
                act(takePersonalLoan, parseInt(loanAmount) || 0, parseInt(loanYears) || 5);
                setLoanAmount('');
              }}
              disabled={!loanAmount || parseInt(loanAmount) <= 0}
              className={`w-full py-2 rounded-xl font-semibold text-sm tap-effect ${
                loanAmount && parseInt(loanAmount) > 0
                  ? 'bg-blue-700/60 border border-blue-600/40 text-white'
                  : 'bg-bg-border text-slate-600 cursor-not-allowed'
              }`}
            >
              Apply for Loan
            </button>
          </div>

          {/* Credit Card */}
          <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
            <h3 className="text-sm font-semibold text-white mb-1">💳 Credit Card</h3>
            {creditLimit > 0 ? (
              <>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Balance: <span className="text-red-400 font-semibold">{formatMoney(creditDebt, character.currency)}</span></span>
                  <span>Limit: <span className="text-white font-semibold">{formatMoney(creditLimit, character.currency)}</span></span>
                </div>
                {/* Usage bar */}
                <div className="w-full h-2 bg-bg-secondary rounded-full mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${creditDebt / creditLimit > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (creditDebt / creditLimit) * 100)}%` }}
                  />
                </div>
                {creditDebt > 0 && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Pay amount"
                      value={ccPayAmount}
                      onChange={e => setCcPayAmount(e.target.value)}
                      className="flex-1 text-sm bg-bg-secondary border border-bg-border rounded-xl p-2 text-white"
                    />
                    <button
                      onClick={() => {
                        act(payCreditCard, parseInt(ccPayAmount) || 0);
                        setCcPayAmount('');
                      }}
                      disabled={!ccPayAmount || !canAfford(parseInt(ccPayAmount))}
                      className={`px-4 rounded-xl font-semibold text-sm tap-effect ${
                        ccPayAmount && canAfford(parseInt(ccPayAmount))
                          ? 'bg-green-700/60 border border-green-600/40 text-white'
                          : 'bg-bg-border text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      Pay
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400 mb-3">No credit card yet. Apply to get a line of credit.</p>
                <button
                  onClick={() => act(applyForCreditCard)}
                  className="w-full py-2 rounded-xl font-semibold text-sm bg-blue-700/60 border border-blue-600/40 text-white tap-effect"
                >
                  Apply for Credit Card
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: CASINO
      ════════════════════════════════════════════════════════════════════ */}
      {financeTab === 'casino' && (
        <>
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🎰</div>
            <p className="text-sm text-slate-400">Try your luck — house always wins... eventually</p>
          </div>

          {/* Casino games */}
          <div className="flex flex-col gap-3 mb-6">
            {CASINO_GAMES.map(game => {
              const bet = casinoBets[game.id] || '';
              const affordable = canAfford(parseInt(bet) || 0) && parseInt(bet) > 0;
              return (
                <div key={game.id} className="bg-bg-card rounded-2xl p-4 border border-bg-border">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{game.icon}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{game.name}</div>
                      <div className="text-xs text-slate-400">{game.description}</div>
                      <div className="text-xs text-yellow-400">
                        Win chance: {Math.round(game.winChance * 100)}% · Up to {game.maxMultiplier}x
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={`Min $${game.minBet}`}
                      min={game.minBet}
                      value={bet}
                      onChange={e => setCasinoBets(prev => ({ ...prev, [game.id]: e.target.value }))}
                      className="flex-1 text-sm bg-bg-secondary border border-bg-border rounded-xl p-2 text-white"
                    />
                    <button
                      onClick={() => {
                        act(gambleAtCasino, game.id, parseInt(bet));
                        setCasinoBets(prev => ({ ...prev, [game.id]: '' }));
                      }}
                      disabled={!affordable || parseInt(bet) < game.minBet}
                      className={`px-4 rounded-xl font-semibold text-sm tap-effect ${
                        affordable && parseInt(bet) >= game.minBet
                          ? 'bg-yellow-700/60 border border-yellow-600/40 text-yellow-200'
                          : 'bg-bg-border text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      Bet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lottery */}
          <div className="bg-bg-card rounded-2xl p-4 border border-yellow-800/40 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎟️</span>
              <div>
                <div className="font-semibold text-white text-sm">Lottery Ticket</div>
                <div className="text-xs text-slate-400">$10 per ticket · Jackpot changes your life</div>
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 5, 10].map(n => (
                <button
                  key={n}
                  onClick={() => act(buyLotteryTicket, n)}
                  disabled={!canAfford(n * 10)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold tap-effect ${
                    canAfford(n * 10)
                      ? 'bg-yellow-700/40 border border-yellow-600/40 text-yellow-300'
                      : 'bg-bg-border text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {n}x {formatMoney(n * 10, character.currency)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* end scrollable area */}
      </div>

      {/* ── Sell Confirm Modal ───────────────────────────────────────────── */}
      {confirmSell && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border p-5"
          >
            <div className="text-center mb-4">
              <span className="text-4xl">{confirmSell.icon}</span>
              <h3 className="font-bold text-white mt-2">Sell {confirmSell.name}?</h3>
              <p className="text-sm text-slate-400 mt-1">
                You'll receive{' '}
                <span className="text-green-400 font-bold">
                  {formatMoney(confirmSell.currentValue, character.currency)}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmSell(null)}
                className="flex-1 py-3 rounded-xl bg-bg-border text-slate-300 font-semibold tap-effect"
              >
                Cancel
              </button>
              <button
                onClick={() => { sellAsset(confirmSell.id); setConfirmSell(null); }}
                className="flex-1 py-3 rounded-xl bg-red-700/60 border border-red-600/40 text-white font-semibold tap-effect"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
