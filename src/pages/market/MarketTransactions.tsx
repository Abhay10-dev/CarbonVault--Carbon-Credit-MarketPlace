import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Flame, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatINR,
  formatNumber,
  formatDateTime,
  truncateTxHash,
  truncateWallet,
  TX_STATUS_COLORS,
} from '@/lib/utils';
import type { Transaction } from '@/types';

export function MarketTransactions() {
  const { user } = useAuth();
  const { transactions } = useApp();

  const myTxs = transactions.filter(t => t.fromId === user?.id || t.toId === user?.id);

  const columns = [
    {
      key: 'txHash',
      header: 'Tx Hash',
      render: (t: Transaction) => (
        <span className="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
          {truncateTxHash(t.txHash)}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Action',
      render: (t: Transaction) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 capitalize">
          {t.type === 'credit_retirement' ? (
            <Flame className="w-3.5 h-3.5 text-rose-600" />
          ) : t.type === 'credit_transfer' ? (
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
          ) : t.toId === user?.id ? (
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>{t.type.replace('credit_', '')}</span>
        </div>
      ),
    },
    {
      key: 'creditName',
      header: 'Carbon Asset',
      render: (t: Transaction) => <span className="font-medium text-gray-900 text-xs">{t.creditName}</span>,
    },
    {
      key: 'quantity',
      header: 'Units',
      render: (t: Transaction) => (
        <span className="font-bold text-gray-900 text-xs">
          {formatNumber(t.quantity)} <span className="text-gray-400 font-normal">tCO₂e</span>
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Settlement',
      render: (t: Transaction) => (
        <span className="text-xs font-medium text-gray-800">
          {t.amount ? formatINR(t.amount) : '0 (Retirement)'}
        </span>
      ),
    },
    {
      key: 'wallets',
      header: 'Counterparty',
      render: (t: Transaction) => (
        <span className="text-[11px] font-mono text-gray-400">
          {truncateWallet(t.fromWallet)} → {truncateWallet(t.toWallet)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: Transaction) => (
        <StatusBadge
          label={t.status.toUpperCase()}
          colorClass={TX_STATUS_COLORS[t.status]}
        />
      ),
    },
    {
      key: 'date',
      header: 'Timestamp',
      render: (t: Transaction) => (
        <span className="text-[11px] text-gray-400">{formatDateTime(t.date)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trading Ledger & Settlement Records</h1>
        <p className="text-xs text-gray-500 mt-1">
          Cryptographically recorded carbon asset purchases, wallet transfers, and permanent retirement transactions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-700" />
            <h2 className="text-base font-bold text-gray-900">Transaction History</h2>
          </div>
          <span className="text-xs text-gray-400">{myTxs.length} Records</span>
        </div>

        <DataTable
          columns={columns}
          data={myTxs}
          emptyMessage="No ledger transactions found."
        />
      </div>
    </div>
  );
}
