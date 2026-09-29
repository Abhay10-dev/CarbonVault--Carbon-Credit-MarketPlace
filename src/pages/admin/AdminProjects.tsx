import React, { useState } from 'react';
import { Folders, Search, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatDate,
  formatNumber,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/utils';
import type { Project } from '@/types';

export function AdminProjects() {
  const { projects } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.producerName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      header: 'Project ID',
      render: (p: Project) => <span className="font-mono text-gray-500 font-semibold">{p.id}</span>,
    },
    {
      key: 'name',
      header: 'Project Name',
      render: (p: Project) => (
        <div>
          <span className="font-bold text-gray-900 block">{p.name}</span>
          <span className="text-[11px] text-gray-400">{p.location} · {p.landInfo.projectArea} ha</span>
        </div>
      ),
    },
    {
      key: 'producerName',
      header: 'Developer',
      render: (p: Project) => <span className="font-medium text-gray-800">{p.producerName}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (p: Project) => <span className="text-gray-600">{p.type}</span>,
    },
    {
      key: 'expectedCredits',
      header: 'Expected / Issued',
      render: (p: Project) => (
        <div>
          <span className="font-bold text-forest-800 block">{formatNumber(p.expectedCredits)} t</span>
          <span className="text-[10px] text-gray-400">
            Issued: {p.issuedCredits ? `${formatNumber(p.issuedCredits)} t` : '0 t'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Verification Status',
      render: (p: Project) => (
        <StatusBadge
          label={PROJECT_STATUS_LABELS[p.status]}
          colorClass={PROJECT_STATUS_COLORS[p.status]}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      render: (p: Project) => <span className="text-gray-400 text-xs">{formatDate(p.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Central Project Registry</h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete master registry of all environmental carbon reduction initiatives across the platform.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name, ID, or developer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'approved', 'under_verification', 'additional_info_required', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'all' ? 'All' : PROJECT_STATUS_LABELS[st as import('@/types').ProjectStatus] || st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folders className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-gray-900">Registered Projects</h2>
          </div>
          <span className="text-xs text-gray-400">{filtered.length} Projects</span>
        </div>

        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
