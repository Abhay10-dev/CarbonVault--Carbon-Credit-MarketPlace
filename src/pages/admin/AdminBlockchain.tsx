import React, { useState } from 'react';
import { Activity, ShieldCheck, ArrowRightLeft, Flame, Layers, Link2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { truncateTxHash, truncateWallet, formatDateTime } from '@/lib/utils';

export function AdminBlockchain() {
  const { transactions } = useApp();
  const [filterType, setFilterType] = useState('all');

  const filtered = transactions.filter(t =>
    filterType === 'all' || t.type === filterType
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Blockchain Activity Stream</h1>
          <p className="text-xs text-gray-500 mt-1">
            Simulated Ethereum testnet ledger monitoring smart contract state transitions and token provenance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>NETWORK: ETHEREUM GOERLI TESTNET (BLOCK #18,492,021)</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'credit_mint', 'credit_purchase', 'credit_transfer', 'credit_retirement'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {type === 'all' ? 'All On-chain Events' : type.replace('credit_', '').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Blockchain Activity Feed */}
      <div className="space-y-4">
        {filtered.map(tx => (
          <div
            key={tx.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                  tx.type === 'credit_mint'
                    ? 'bg-emerald-50 text-emerald-700'
                    : tx.type === 'credit_retirement'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {tx.type === 'credit_mint' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : tx.type === 'credit_retirement' ? (
                  <Flame className="w-5 h-5" />
                ) : (
                  <ArrowRightLeft className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm capitalize">
                    {tx.type.replace('_', ' ')}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Confirmed ✓
                  </span>
                </div>
                <p className="text-gray-600">
                  Transferred <strong>{tx.quantity} tCO₂e</strong> for project: <strong>{tx.creditName}</strong>
                </p>
                <div className="text-[11px] text-gray-400 font-mono mt-1">
                  From: {truncateWallet(tx.fromWallet)} → To: {truncateWallet(tx.toWallet)}
                </div>
              </div>
            </div>

            <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
              <div className="font-mono text-gray-700 font-medium mb-1">
                {truncateTxHash(tx.txHash)}
              </div>
              <span className="text-[11px] text-gray-400 block">{formatDateTime(tx.date)}</span>
              <button className="text-[11px] text-forest-700 hover:underline font-semibold mt-1 inline-flex items-center gap-1">
                <Link2 className="w-3 h-3" /> View Block Explorer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
