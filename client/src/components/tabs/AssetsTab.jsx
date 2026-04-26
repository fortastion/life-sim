import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { formatMoney } from '../../engine/gameEngine';

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

export default function AssetsTab() {
  const { character, buyAsset, sellAsset } = useGameStore();
  const [activeShop, setActiveShop] = useState(null);
  const [confirmSell, setConfirmSell] = useState(null);
  if (!character) return null;

  const assets = character.assets || [];
  const totalAssetValue = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const annualPassive   = assets.reduce((sum, a) => sum + ((a.monthlyIncome || 0) * 12), 0);

  const owned = {
    property:   assets.filter(a => a.category === 'property'),
    vehicle:    assets.filter(a => a.category === 'vehicle'),
    investment: assets.filter(a => a.category === 'investment'),
  };

  const alreadyOwns = (id) => assets.some(a => a.assetId === id);
  const canAfford   = (price) => character.finances.cash >= price;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-3 pb-20">
      <h2 className="font-bold text-white text-base mb-3">Assets & Wealth</h2>

      {/* ── Summary ─────────────────────────────────────────────────────── */}
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
              {formatMoney(totalAssetValue, character.currency)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Net Worth</div>
            <div className={`text-sm font-bold ${(character.finances.netWorth + totalAssetValue) >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {formatMoney(character.finances.netWorth + totalAssetValue, character.currency)}
            </div>
          </div>
        </div>
        {annualPassive > 0 && (
          <div className="mt-3 pt-3 border-t border-bg-border text-center">
            <span className="text-xs text-slate-400">Passive Income: </span>
            <span className="text-sm font-bold text-green-400">
              +{formatMoney(annualPassive, character.currency)}/yr
            </span>
          </div>
        )}
      </div>

      {/* ── Shop Category Tabs ───────────────────────────────────────────── */}
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

      {/* ── Shop Panel ───────────────────────────────────────────────────── */}
      {activeShop && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card rounded-2xl border border-bg-border mb-4 overflow-hidden"
        >
          <div className="p-3 border-b border-bg-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {CATEGORY_META[activeShop].icon} Buy {CATEGORY_META[activeShop].label}
            </h3>
            <button onClick={() => setActiveShop(null)} className="text-slate-400 text-xl tap-effect">✕</button>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {ASSETS_FOR_SALE[activeShop].map(item => {
              const has       = alreadyOwns(item.id);
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
                        onClick={() => { if (affordable) buyAsset(item); }}
                        disabled={!affordable}
                        className={`mt-1 text-xs px-3 py-1 rounded-lg font-semibold transition-all tap-effect ${
                          affordable
                            ? 'bg-purple-700/60 text-purple-200 border border-purple-600/40'
                            : 'bg-bg-border text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {affordable ? 'Buy' : 'Can\'t Afford'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Owned Assets ─────────────────────────────────────────────────── */}
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
