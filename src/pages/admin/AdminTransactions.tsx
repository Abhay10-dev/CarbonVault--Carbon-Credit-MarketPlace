import React from 'react';
import { History, Receipt } from 'lucide-react';
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

export function AdminTransactions() {
  const { transactions } = useApp();

  const columns = [
    {
      key: 'txHash',
      header: 'Blockchain Tx Hash',
      render: (t: Transaction) => (
        <span className="font-mono text-xs text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
          {truncateTxHash(t.txHash)}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Operation',
      render: (t: Transaction) => (
        <span className="font-semibold text-gray-900 capitalize text-xs">
          {t.type.replace('credit_', '')}
        </span>
      ),
    },
    {
      key: 'fromWallet',
      header: 'Origin (From)',
      render: (t: Transaction) => (
        <div>
          <span className="font-medium text-gray-800 text-xs block">{t.fromName}</span>
          <span className="font-mono text-[10px] text-gray-400">{truncateWallet(t.fromWallet)}</span>
        </div>
      ),
    },
    {
      key: 'toWallet',
      header: 'Destination (To)',
      render: (t: Transaction) => (
        <div>
          <span className="font-medium text-gray-800 text-xs block">{t.toName}</span>
          <span className="font-mono text-[10px] text-gray-400">{truncateWallet(t.toWallet)}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Volume',
      render: (t: Transaction) => (
        <span className="font-bold text-gray-900 text-xs">
          {formatNumber(t.quantity)} <span className="text-gray-400 font-normal">tCO₂e</span>
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Gross Value',
      render: (t: Transaction) => (
        <span className="text-xs font-semibold text-forest-800">
          {t.amount ? formatINR(t.amount) : '—'}
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
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Transaction Ledger</h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete cross-participant financial settlements, token issuances, and custody transfers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-gray-900">All Ledger Transactions</h2>
          </div>
          <span className="text-xs text-gray-400">{transactions.length} Recorded Operations</span>
        </div>

        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  );
}
