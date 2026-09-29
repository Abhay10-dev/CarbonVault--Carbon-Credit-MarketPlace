import React, { useState } from 'react';
import { BookOpen, ArrowRightLeft, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR, formatNumber } from '@/lib/utils';

export function MarketOrderBook() {
  const { orders, updateOrder, addNotification } = useApp();
  const [matchedEvent, setMatchedEvent] = useState<string | null>(null);

  const buyOrders = orders.filter(o => o.type === 'buy' && (o.status === 'pending' || o.status === 'matched'));
  const sellOrders = orders.filter(o => o.type === 'sell' && (o.status === 'listed' || o.status === 'pending' || o.status === 'matched'));

  // Simulate off-chain matching engine
  const handleSimulateMatch = () => {
    // Find matching price if any or pair top orders
    const buy = buyOrders[0];
    const sell = sellOrders[0];

    if (buy && sell) {
      updateOrder(buy.id, { status: 'matched' });
      updateOrder(sell.id, { status: 'matched' });

      const msg = `MATCH FOUND: Buyer (${buy.userName}) matched with Seller (${sell.userName}) for ${Math.min(buy.quantity, sell.quantity)} credits at ${formatINR(sell.price)}/credit!`;
      setMatchedEvent(msg);

      addNotification({
        id: `notif-${Date.now()}`,
        userId: buy.userId,
        title: 'Order Matched by Engine',
        message: msg,
        read: false,
        type: 'success',
        date: new Date().toISOString(),
      });

      setTimeout(() => setMatchedEvent(null), 6000);
    } else {
      setMatchedEvent('No overlapping bid/ask orders currently available to match.');
      setTimeout(() => setMatchedEvent(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Market Order Book & Matching</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time depth chart and automated matching engine simulator for bilateral carbon credit contracts.
          </p>
        </div>

        <button
          onClick={handleSimulateMatch}
          className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Zap className="w-4 h-4 text-emerald-300" /> Trigger Order Matching Engine
        </button>
      </div>

      {/* Matching Event Banner */}
      {matchedEvent && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-950 font-medium animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{matchedEvent}</span>
        </div>
      )}

      {/* Two-Column Order Book */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BUY ORDERS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Bids (Buy Orders)
              </h2>
            </div>
            <span className="text-xs text-gray-400">{buyOrders.length} Bids</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-400 font-semibold text-[11px] border-b border-gray-100">
                <tr>
                  <th className="pb-2">Bid Price</th>
                  <th className="pb-2">Quantity (tCO₂e)</th>
                  <th className="pb-2 text-right">Buyer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {buyOrders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      No active buy bids
                    </td>
                  </tr>
                ) : (
                  buyOrders.map(b => (
                    <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 font-bold text-blue-700">{formatINR(b.price)}</td>
                      <td className="py-2.5 font-medium text-gray-800">{formatNumber(b.quantity)}</td>
                      <td className="py-2.5 text-right text-gray-500">{b.userName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SELL ORDERS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Asks (Sell Orders)
              </h2>
            </div>
            <span className="text-xs text-gray-400">{sellOrders.length} Asks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-400 font-semibold text-[11px] border-b border-gray-100">
                <tr>
                  <th className="pb-2">Ask Price</th>
                  <th className="pb-2">Quantity (tCO₂e)</th>
                  <th className="pb-2 text-right">Seller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sellOrders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      No active sell asks
                    </td>
                  </tr>
                ) : (
                  sellOrders.map(s => (
                    <tr key={s.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-2.5 font-bold text-forest-700">{formatINR(s.price)}</td>
                      <td className="py-2.5 font-medium text-gray-800">{formatNumber(s.quantity)}</td>
                      <td className="py-2.5 text-right text-gray-500">{s.userName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
