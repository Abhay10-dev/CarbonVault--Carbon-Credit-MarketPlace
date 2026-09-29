import React, { useState } from 'react';
import { Award, Search, ShieldAlert } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatNumber,
  formatINR,
  formatDate,
  truncateWallet,
  CREDIT_STATUS_LABELS,
  CREDIT_STATUS_COLORS,
} from '@/lib/utils';
import type { Credit } from '@/types';

export function AdminCredits() {
  const { credits } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Include simulated revoked credit for complete prototype specification (FR-11)
  const revokedCredit: Credit = {
    id: 'CRD-000198',
    projectId: 'PRJ-0008',
    projectName: 'Narmada Basin Agrocarbon Project',
    projectType: 'Agricultural Practices',
    producerId: 'u001',
    producerName: 'Rajesh Patil',
    quantity: 1200,
    tokenId: 'NFT-REVOKED-198',
    contractAddress: '0x8A7B3C4D5E6F7A8B',
    currentOwner: '0x0000000000000000000000000000000000000000',
    currentOwnerId: 'revoked',
    status: 'revoked',
    issuanceDate: '2026-08-10',
    issuanceTxHash: '0xREVOKED1234567890ABCDEF',
    location: 'Madhya Pradesh',
    methodology: 'Soil Carbon Sequestration',
    verifiedBy: 'IndoCarbon Auditing Services',
    verificationDate: '2026-08-10',
    lifecycle: [
      { stage: 'Issued', date: '2026-08-10', actor: 'System', status: 'completed' },
      { stage: 'Revoked by Authority', date: '2026-09-18', actor: 'Admin', status: 'completed' },
    ],
  };

  const allCredits = [revokedCredit, ...credits];

  const filtered = allCredits.filter(c => {
    const matchesSearch =
      c.projectName.toLowerCase().includes(search.toLowerCase()) ||
      c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      header: 'Credit ID',
      render: (c: Credit) => <span className="font-mono font-semibold text-gray-900">{c.id}</span>,
    },
    {
      key: 'tokenId',
      header: 'NFT Token ID',
      render: (c: Credit) => (
        <span className="font-mono text-forest-700 bg-forest-50 px-2 py-0.5 rounded text-[11px]">
          {c.tokenId}
        </span>
      ),
    },
    {
      key: 'projectName',
      header: 'Project / Asset',
      render: (c: Credit) => (
        <div>
          <span className="font-bold text-gray-900 block">{c.projectName}</span>
          <span className="text-[11px] text-gray-400">{c.location}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Volume',
      render: (c: Credit) => (
        <span className="font-bold text-gray-900">
          {formatNumber(c.quantity)} <span className="text-gray-400 text-xs font-normal">tCO₂e</span>
        </span>
      ),
    },
    {
      key: 'currentOwner',
      header: 'Owner Wallet',
      render: (c: Credit) => (
        <span className="font-mono text-xs text-gray-500">{truncateWallet(c.currentOwner)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Registry Status',
      render: (c: Credit) => (
        <StatusBadge
          label={CREDIT_STATUS_LABELS[c.status]}
          colorClass={CREDIT_STATUS_COLORS[c.status]}
        />
      ),
    },
    {
      key: 'issuanceDate',
      header: 'Issued Date',
      render: (c: Credit) => <span className="text-gray-400 text-xs">{formatDate(c.issuanceDate)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Central Carbon Credit Registry</h1>
        <p className="text-xs text-gray-500 mt-1">
          Cryptographic token registry monitoring all minted, active, transferred, retired, and revoked carbon batches.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by credit ID, token ID, or project..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'available', 'listed', 'transferred', 'retired', 'revoked'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'all' ? 'All Credits' : st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-forest-700" />
            <h2 className="text-base font-bold text-gray-900">Registered Carbon Assets</h2>
          </div>
          <span className="text-xs text-gray-400">{filtered.length} Batches</span>
        </div>

        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
