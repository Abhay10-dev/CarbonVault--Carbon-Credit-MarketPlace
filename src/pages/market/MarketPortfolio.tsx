import React from 'react';
import { TrendingUp, Award, Layers, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatINR,
  formatNumber,
  CREDIT_STATUS_LABELS,
  CREDIT_STATUS_COLORS,
} from '@/lib/utils';

export function MarketPortfolio() {
  const { user } = useAuth();
  const { credits } = useApp();

  const myCredits = credits.filter(c => c.currentOwnerId === user?.id);

  // Group by project type
  const typeBreakdown: Record<string, number> = {};
  myCredits.forEach(c => {
    typeBreakdown[c.projectType] = (typeBreakdown[c.projectType] || 0) + c.quantity;
  });

  const totalQuantity = myCredits.reduce((sum, c) => sum + c.quantity, 0);
  const totalValue = myCredits.reduce((sum, c) => sum + c.quantity * (c.pricePerCredit || 850), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfolio Allocation</h1>
        <p className="text-xs text-gray-500 mt-1">
          Sectoral distribution, methodology classification, and valuation of your carbon asset holdings.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Portfolio Aggregate
          </span>
          <span className="text-3xl font-bold text-gray-900 mt-1 block">
            {formatNumber(totalQuantity)} <span className="text-sm font-normal text-gray-400">tCO₂e</span>
          </span>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">
            Active in verified registry
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Estimated Portfolio Value
          </span>
          <span className="text-3xl font-bold text-forest-800 mt-1 block">
            {formatINR(totalValue)}
          </span>
          <span className="text-xs text-gray-400 mt-1 block">
            Based on current exchange asking bids
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Methodology Diversity
          </span>
          <span className="text-3xl font-bold text-purple-700 mt-1 block">
            {Object.keys(typeBreakdown).length} Sectors
          </span>
          <span className="text-xs text-gray-400 mt-1 block">
            Forestry, Renewable, Agro-practices
          </span>
        </div>
      </div>

      {/* Breakdown by Type Bar & List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-gray-900">Sectoral Distribution</h2>

        {/* Visual Stacked Bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden">
          {Object.entries(typeBreakdown).map(([type, qty], i) => {
            const colors = ['bg-emerald-600', 'bg-blue-600', 'bg-purple-600', 'bg-amber-600'];
            const pct = Math.round((qty / (totalQuantity || 1)) * 100);
            return (
              <div
                key={type}
                className={`${colors[i % colors.length]} h-full transition-all`}
                style={{ width: `${pct}%` }}
                title={`${type}: ${qty} t (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {Object.entries(typeBreakdown).map(([type, qty], i) => {
            const colors = ['text-emerald-700', 'text-blue-700', 'text-purple-700', 'text-amber-700'];
            return (
              <div key={type} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className={`text-xs font-bold block ${colors[i % colors.length]}`}>{type}</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {formatNumber(qty)} <span className="text-xs font-normal text-gray-400">tCO₂e</span>
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  {Math.round((qty / (totalQuantity || 1)) * 100)}% of portfolio
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Holdings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Holdings Inventory</h2>
          <span className="text-xs text-gray-400">{myCredits.length} Token Batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Asset / Project</th>
                <th className="px-4 py-3.5">Token ID</th>
                <th className="px-4 py-3.5">Project Type</th>
                <th className="px-4 py-3.5">Volume (tCO₂e)</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Estimated Value</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myCredits.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">{c.projectName}</td>
                  <td className="px-4 py-4 font-mono text-gray-500">{c.tokenId}</td>
                  <td className="px-4 py-4 text-gray-600">{c.projectType}</td>
                  <td className="px-4 py-4 font-bold text-gray-900">{formatNumber(c.quantity)}</td>
                  <td className="px-4 py-4 text-gray-700">{formatINR(c.pricePerCredit || 850)}</td>
                  <td className="px-4 py-4 font-bold text-forest-800">
                    {formatINR(c.quantity * (c.pricePerCredit || 850))}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      label={CREDIT_STATUS_LABELS[c.status]}
                      colorClass={CREDIT_STATUS_COLORS[c.status]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
