import React, { useState } from 'react';
import { FileCheck2, Search, Check, X, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, DOC_STATUS_LABELS, DOC_STATUS_COLORS } from '@/lib/utils';
import type { DocumentStatus } from '@/types';

export function CertifierDocuments() {
  const { projects } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Flatten all documents across all projects
  const allDocs = projects.flatMap(p =>
    p.documents.map(d => ({
      ...d,
      projectId: p.id,
      projectName: p.name,
      producerName: p.producerName,
    }))
  );

  const filteredDocs = allDocs.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.projectName.toLowerCase().includes(search.toLowerCase()) ||
      d.producerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Document Verification Center</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review 7/12 land titles, project proposals, environmental due diligence records, and legal proof.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document name, project, producer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'uploaded', 'under_review', 'verified', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Docs' : DOC_STATUS_LABELS[status as DocumentStatus] || status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Document Title</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Associated Project</th>
                <th className="px-4 py-3.5">Developer</th>
                <th className="px-4 py-3.5">Upload Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.map((doc, idx) => (
                <tr key={`${doc.id}-${idx}`} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    {doc.name}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {doc.category}
                  </td>
                  <td className="px-4 py-3.5 text-gray-800 font-medium">
                    {doc.projectName}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {doc.producerName}
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">
                    {formatDate(doc.uploadedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge
                      label={DOC_STATUS_LABELS[doc.status]}
                      colorClass={DOC_STATUS_COLORS[doc.status]}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600" title="View Document">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600" title="Approve">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-700 text-gray-600" title="Reject">
                      <X className="w-3.5 h-3.5" />
                    </button>
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
