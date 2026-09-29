import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Award,
  TrendingUp,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import {
  formatINR,
  formatNumber,
  formatDate,
} from '@/lib/utils';

export function MarketDashboard() {
  const { user } = useAuth();
  const { credits, transactions } = useApp();
  const navigate = useNavigate();

  const myCredits = credits.filter(c => c.currentOwnerId === user?.id);
  const totalOwned = myCredits.reduce((sum, c) => sum + c.quantity, 0);

  const retiredCredits = myCredits.filter(c => c.status === 'retired');
  const totalRetired = retiredCredits.reduce((sum, c) => sum + c.quantity, 0);
  const totalAvailable = totalOwned - totalRetired;

  const portfolioValue = myCredits.reduce((sum, c) => sum + c.quantity * (c.pricePerCredit || 850), 0);

  const myTxs = transactions
    .filter(t => t.fromId === user?.id || t.toId === user?.id)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-forest-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-1">
            Exchange & Trading Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
            Acquire verified compliance-grade carbon credits, monitor your portfolio holdings, and permanently retire units to claim net-zero emissions offsets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/market/marketplace"
            className="px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Browse Marketplace
          </Link>
          <Link
            to="/market/retire"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Flame className="w-4 h-4" /> Retire Credits
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Credits Owned"
          value={`${formatNumber(totalOwned)} t`}
          subtitle="Portfolio inventory"
          icon={<Award className="w-5 h-5 text-purple-700" />}
          colorClass="text-purple-700"
        />
        <StatCard
          title="Active Holdings"
          value={`${formatNumber(totalAvailable)} t`}
          subtitle="Tradable tokens"
          icon={<ShieldCheck className="w-5 h-5 text-forest-700" />}
        />
        <StatCard
          title="CO₂ Offset Retired"
          value={`${formatNumber(totalRetired)} t`}
          subtitle="Permanent claims"
          icon={<Flame className="w-5 h-5 text-rose-700" />}
          colorClass="text-rose-700"
        />
        <StatCard
          title="Portfolio Value"
          value={formatINR(portfolioValue)}
          subtitle="Estimated market value"
          icon={<TrendingUp className="w-5 h-5 text-emerald-700" />}
          colorClass="text-emerald-700"
        />
        <StatCard
          title="Retirement Impact"
          value={`${formatNumber(totalRetired)} tCO₂e`}
          subtitle="Gross neutralized"
          icon={<Award className="w-5 h-5 text-forest-700" />}
        />
        <StatCard
          title="Linked Wallet"
          value="Connected"
          subtitle="Ethereum Testnet"
          icon={<Wallet className="w-5 h-5 text-blue-700" />}
          colorClass="text-blue-700"
        />
      </div>

      {/* Main Grid: Portfolio Distribution & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Portfolio Assets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Carbon Credit Portfolio</h2>
              <p className="text-xs text-gray-500">Your tokenized holdings and custody balances</p>
            </div>
            <Link
              to="/market/credits"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
            >
              Manage Credits <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {myCredits.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                You do not own any carbon credits yet. Browse the marketplace to acquire tokens.
              </div>
            ) : (
              myCredits.map(c => (
                <div key={c.id} className="py-4 flex items-center justify-between hover:bg-gray-50/50 rounded-xl px-2 transition-colors">
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm truncate">{c.projectName}</span>
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {c.tokenId}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span>{c.location}</span>
                      <span>·</span>
                      <span className="font-semibold text-forest-800">{formatNumber(c.quantity)} tCO₂e</span>
                      <span>·</span>
                      <span>{formatINR(c.pricePerCredit || 850)} / unit</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/market/retire')}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Retire
                    </button>
                    <button
                      onClick={() => navigate('/market/transfer')}
                      className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-medium rounded-lg transition-colors"
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Recent Transactions & Impact Highlights */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Recent Trades</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {myTxs.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-6">No recent trade activity</div>
              ) : (
                myTxs.map(t => (
                  <div key={t.id} className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span className="capitalize">{t.type.replace('credit_', '')}</span>
                      <span className="text-forest-800 font-bold">
                        {t.toId === user?.id ? '+' : '-'}{formatNumber(t.quantity)} t
                      </span>
                    </div>
                    <div className="text-gray-500 truncate">{t.creditName}</div>
                    <div className="flex justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-200/50">
                      <span>{formatDate(t.date)}</span>
                      <span className="text-emerald-700 font-medium">Confirmed ✓</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/market/transactions"
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              All Trading Records <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
