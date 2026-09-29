import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Search, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatDate,
  formatNumber,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/utils';
import type { Project } from '@/types';

export function CertifierQueue() {
  const { projects } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const queueProjects = projects.filter(
    p => p.status === 'submitted' || p.status === 'under_verification' || p.status === 'additional_info_required'
  );

  const filtered = queueProjects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.producerName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verification Request Queue</h1>
        <p className="text-xs text-gray-500 mt-1">
          Proposals submitted by project developers pending formal accreditation review and due diligence sign-off.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name, producer, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none"
          >
            <option value="all">All Methodologies / Types</option>
            <option value="Reforestation">Reforestation</option>
            <option value="Renewable Energy">Renewable Energy</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Agricultural Practices">Agricultural Practices</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Project ID & Name</th>
                <th className="px-4 py-3.5">Project Developer</th>
                <th className="px-4 py-3.5">Methodology</th>
                <th className="px-4 py-3.5">Area & Location</th>
                <th className="px-4 py-3.5">Est. CO₂ Removal</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No projects found matching current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-gray-400 text-[10px] block">{p.id}</span>
                      <span className="font-semibold text-gray-900 text-xs block">{p.name}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 font-medium">
                      {p.producerName}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {p.type}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div>{p.location}</div>
                      <div className="text-[10px] text-gray-400">{p.landInfo.projectArea} ha</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-forest-800">
                        {formatNumber(p.expectedCredits)} tCO₂e
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        label={PROJECT_STATUS_LABELS[p.status]}
                        colorClass={PROJECT_STATUS_COLORS[p.status]}
                      />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/certifier/review/${p.id}`}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold inline-flex items-center gap-1 shadow-xs transition-colors"
                      >
                        Review Audit <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
