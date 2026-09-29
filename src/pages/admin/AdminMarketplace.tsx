import React from 'react';
import { ShoppingCart, TrendingUp, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatINR, formatNumber, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import type { Order } from '@/types';

export function AdminMarketplace() {
  const { orders } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Marketplace & Exchange Oversight</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor secondary market trading depth, bid/ask spreads, and order matching execution volume.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Active Listings"
          value={128}
          subtitle="Open sell offers"
          icon={<ShoppingCart className="w-5 h-5 text-emerald-700" />}
          colorClass="text-emerald-700"
        />
        <StatCard
          title="Buy Orders"
          value={342}
          subtitle="Cumulative bids"
          icon={<TrendingUp className="w-5 h-5 text-blue-700" />}
          colorClass="text-blue-700"
        />
        <StatCard
          title="Sell Orders"
          value={215}
          subtitle="Cumulative asks"
          icon={<ShoppingCart className="w-5 h-5 text-purple-700" />}
          colorClass="text-purple-700"
        />
        <StatCard
          title="Matched Orders"
          value={187}
          subtitle="Engine matched"
          icon={<ArrowRightLeft className="w-5 h-5 text-forest-700" />}
        />
        <StatCard
          title="Completed Trades"
          value={165}
          subtitle="Settled on-chain"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />}
          colorClass="text-emerald-700"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Recent Exchange Orders</h2>
          <span className="text-xs text-gray-400">Order Matching Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Asset / Project</th>
                <th className="px-4 py-3.5">Participant</th>
                <th className="px-4 py-3.5">Volume (tCO₂e)</th>
                <th className="px-4 py-3.5">Unit Price</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">{o.id}</td>
                  <td className="px-4 py-3.5 uppercase font-bold text-[11px]">
                    <span className={o.type === 'buy' ? 'text-blue-700' : 'text-emerald-700'}>
                      {o.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800">{o.creditName}</td>
                  <td className="px-4 py-3.5 text-gray-600">{o.userName}</td>
                  <td className="px-4 py-3.5 font-bold text-gray-900">{formatNumber(o.quantity)}</td>
                  <td className="px-4 py-3.5 font-medium text-gray-800">{formatINR(o.price)}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge
                      label={ORDER_STATUS_LABELS[o.status] || o.status}
                      colorClass={ORDER_STATUS_COLORS[o.status]}
                    />
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
